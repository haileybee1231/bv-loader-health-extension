import rison from 'rison';
import _ from 'lodash';

// global regular expressions
const ifFirstPartyExist = /BVBRANDID|BVBRANDSID/;
const isFirstPartyNull = /BVBRANDID=null|BVBRANDSID=null/;
const magpieGif = /\/a.gif\?|\/t.gif\?|\/st.gif\?/;
const magpieValidationJSON = /\/a.json\?|\/t.json\?|\/st.json\?/;
const magpieJsReference = /\/magpiejs\/([^/]+)/;
const analyticsJsReference = /([^/]+)\/bv-analytics\.js/;
const magpieJsVersion = /magpieJsVersion=([\d.]+)/;

const dict = {
  'bv.js': 'bvjs',
  rating_summary: 'rating_summary',
  'reviews-config': 'reviews',
  'questions-config': 'questions',
  inline_ratings: 'inline_ratings',
  'spotlights/scout': 'spotlights',
  'bv-analytics': 'bv_analytics',
};

const resourceArr = [
  'bv.js',
  'bv-primary',
  'rating_summary',
  'inline_ratings',
  'reviews-config',
  'questions-config',
  'spotlights/scout',
  'analytics-js',
  'bv-analytics',
];

const bv_analytics_arr = [
  magpieGif,
  magpieValidationJSON,
  magpieJsReference,
  magpieJsVersion,
  analyticsJsReference,
];

let foundBVApi = false;

export const isMagpieGif = url => url.match(magpieGif);

export const isMagpieValidationJSON = url => url.match(magpieValidationJSON);

export const hasFirstParty = url =>
  url.match(ifFirstPartyExist) && !url.match(isFirstPartyNull);

export const hasThirdParty = url => url.match(/\/sid.gif|\/sid.json/);

export const isAnonymous = (url, hasFirstParty, hasThirdParty) =>
  url.match(/\/a.gif|\/a.json/) && !hasFirstParty && !hasThirdParty;

export const checkRequest = url => {
  if (
    url ===
    'https://analytics-static.ugc.bazaarvoice.com/prod/static/3/bv-analytics.js'
  ) {
    // The URL for analytics.js shows up as an analytics event, so just have a no-op and let it be
    // handled lower in this function
    () => {};
  } else {
    // Otherwise, check to see if the URL passes any of the criteria for being an analytics event
    // by comparing it against the possible regexes in the bv_analytics_arr
    for (let i = 0; i < bv_analytics_arr.length; i++) {
      if (url.match(bv_analytics_arr[i])) {
        const isFirstParty = hasFirstParty(url);
        const isThirdParty = hasThirdParty(url);
        // Then, return analytic info in digestible format
        return {
          analytics_event: url,
          firstParty: isFirstParty,
          thirdParty: isThirdParty,
          isAnonymous: isAnonymous(url, isFirstParty, isThirdParty),
        };
      }
    }
  }

  if (
    url.includes('ugc.bazaarvoice.com/static/') &&
    url.includes('/bvapi.js') &&
    !foundBVApi
  ) {
    // From what I can tell, this resource is ambiguous and can be either PRR or Firebird, so we
    // return both those possibilities and make the decision based on other info we get from the global
    // namespaces
    foundBVApi = true;
    return {
      resource: ['firebird', 'prr'],
    };
  }

  // Other domain's use the words render and components a fair amount, so make sure it's ours before
  // loggin git
  if (url.includes('bazaarvoice')) {
    if (url.includes('render')) {
      return {
        resource: 'render',
      };
    } else if (url.includes('components')) {
      return {
        resource: 'components',
      };
    }
  }

  for (let i = 0; i < resourceArr.length; i++) {
    if (url.includes(resourceArr[i])) {
      // Not really sure about these resources, but it seems we sometimes have a separate call for `bv.js`
      // that also has firebird in the name, and that's not the one we want. Maybe it's to get the submission
      // form?
      if (
        (resourceArr[i] === 'bv.js' && url.includes('firebird')) ||
        url.includes('.gif')
      ) {
        return { resource: undefined };
      }

      return { resource: dict[resourceArr[i]] };
    }
  }

  return false;
};

const isRisonData = prop => prop.indexOf('r_') === 0 || prop === 't';

/** Unroll any event object that may have a rison encoded batch object.*/
const unrollBatch = event => {
  let events = [];
  let batch;

  //TODO DRY this if else logic.
  if ('r_batch' in event) {
    // This is rison encoded, so decode and parse.
    batch = rison.decode_array(event.r_batch)[0];
    delete event.r_batch;
    batch.forEach(function(subevent) {
      events.push(_(subevent).defaults(event)); //defaults means it adds the properties from the parent event to the subevents
    });
  } else if ('batch' in event) {
    batch = event.batch;
    delete event.batch;
    batch.forEach(function(subevent) {
      events.push(_(subevent).defaults(event));
    });
  } else {
    events = [event];
  }
  return events;
};

export const parseAnalyticsEvent = eventUrl => {
  const event = {};
  let events = [];

  const splitArray = eventUrl.replace(/\+/g, ' ').split('?');
  if (splitArray.length > 1) {
    const pieces = splitArray[1].split('&');
    pieces.forEach(piece => {
      piece = piece.split('=');
      const key = piece[0];
      const value = piece[1];
      // creates an object mapping key to value
      event[key] = decodeURIComponent(value);
    });
    events = unrollBatch(event);
    events.forEach(evt => {
      for (let key in evt) {
        if (key === '_') {
          // ignores prepended '_' fields
          delete evt[key];
        } else if (isRisonData(key)) {
          const decoded = rison.decode(evt[key]);
          const risonPrefix = 'r_';
          delete evt[key]; // delete rison key before removing the prefix
          key =
            key.indexOf(risonPrefix) === 0
              ? key.substring(risonPrefix.length)
              : key;
          evt[key] = JSON.stringify(decoded, null, 4);
        }
      }
    });
  }
  return events;
};
