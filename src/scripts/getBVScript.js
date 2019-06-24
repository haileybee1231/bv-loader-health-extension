const sendMessage = type => new Promise(resolve => {
  // TODO: Refactor this to be more generalized in case we want to add more namespaces.
  try {
    document.dispatchEvent(
      new CustomEvent(
        `${type}_obj_retrieved`,
        {
          detail: JSON.stringify(
            type === '$bv'
              ? get$BVObject()
              : type === 'bva'
                ? getBVAObject()
                : getBVObject()
          )
        }
      )
    );
    resolve();
  }
  catch (e) {
    console.error(`Problem parsing ${type}: ${e}`);
  }
});

const getBVObject = () => {
  const apps = [
    'inline_ratings',
    'questions',
    'rating_summary',
    'review-highlights',
    'review_highlights',
    'reviews',
    'seller_ratings',
    'spotlights',
    'product_picker'
  ];
  const { BV } = window;

  if (!BV) {
    return;
  }

  const { global, options } = BV;

  let dataEnv, serverEnv, client, locale, siteId, SystemJS;

  if (global) {
    dataEnv = global.dataEnvironment;
    serverEnv = global.serverEnvironment;
    client = global.client;
    locale = global.locale;
    siteId = global.siteId;
    SystemJS = global.SystemJS;
  }

  const appMap = {};

  apps.forEach(app => {
    const appNamespace = BV[app];
    if (appNamespace) {
      app === 'review-highlights' && !appMap.review_highlights ? app = 'review_highlights' : null;

      appMap[app] = {
        config: {
          ...appNamespace.config,
        },
        _analytics: {
          ...appNamespace._analytics,
        }
      }
    }
  });

  const copy = {
    global: {
      dataEnv,
      serverEnv,
      client,
      locale,
      siteId,
      SystemJS
    },
    options: {
      ...options
    },
    ...appMap,
    pixel: {
      ...BV.pixel,
    },
    _render: {
      ...BV._render
    }
  }

  // TODO: This was causing circular reference issues for certain pages under certain conditions.
  // My theory is that there was a race condition in the analytics queue, where references are
  // ultimately resolved but at the time of harvesting it's possible to catch a circular reference.
  // I believe by only targeting the queue, we're not losing any necessary info, but we should still
  // figure out a better way to handle this.
  const removeAnalytics = obj => {
    for (const prop in obj) {
      if (prop === 'q') {
        delete obj[prop];
      } else if (typeof obj[prop] === 'object') {
        removeAnalytics(obj[prop]);
      }
    }
  }

  removeAnalytics(copy)

  return copy;
}

const get$BVObject = () => {
  const { $BV } = window;

  if (!$BV) {
    return;
  }

  let _baseUrl, isPRR = false, anonymous, autoTagEnabled, brandDomain, isEU, prrEnv;

  const { Internal } = $BV;

  if (Internal) {
    _baseUrl = Internal._baseUrl;
    isPRR = Internal.isPRR;

    const { _magpieSettings } = Internal;

    if (_magpieSettings) {
      anonymous = _magpieSettings.anonymous;
      autoTagEnabled = _magpieSettings.autoTagEnabled;
      brandDomain = _magpieSettings.brandDomain;
      isEU = _magpieSettings.isEU;
      prrEnv = _magpieSettings.prrENV;
    }
  }

  return {
    ...window.$BV,
    Internal: {
      _baseUrl,
      isPRR
    },
    _magpieSettings: {
      anonymous,
      autoTagEnabled,
      brandDomain,
      isEU,
      prrEnv
    }
  };;
}

const getBVAObject = () => {
  const { BVA } = window;

  return {
    ...BVA
  };
}

setTimeout(() => {
  // The $BV and BVA namespaces seem to take a little longer to be established, so
  // use promises just to be safe.
  sendMessage('bv')
    .then(() => sendMessage('$bv'))
      .then(() => sendMessage('bva'));
}, 2500);
