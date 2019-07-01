import React from 'react';

const serializeHtml = () => {
  // Gather a list of all bv-show containers and serialize them for the test page URL
  const htmlString = [...document.querySelectorAll('[data-bv-show]')].reduce(
    (arr, container) => {
      const clone = container.cloneNode();
      clone.innerHTML = '';

      // Remove data-bv-ready, as that's not necessary for the test page
      arr.push(clone.outerHTML.replace(/\s*data-bv-ready=".*"\s*/, ''));

      return arr;
    },
    []
  );

  return window.btoa(encodeURIComponent(htmlString.join('\n\n')));
};

const createLink = BV => {
  const { global } = BV;

  if (global) {
    const {
      client,
      siteId,
      locale,
      serverEnvironment,
      dataEnvironment,
    } = global;

    const bv_segment = window.location.href.match(/bv_segment=([a-z]*_[a-z]*)/);

    // I made a few assumptions here about how these properties work, wasn't sure about
    // all of them.
    const url = `https://apps${
      serverEnvironment === 'qa' ? '-qa' : ''
    }.bazaarvoice.com/test/index.html?client=${client}&site=${siteId}&environment=${
      serverEnvironment === 'qa' ? 'staging' : 'production'
    }&locale=${locale}&async=${true}&debug=true&mobile=false&internalEnvironments=${
      dataEnvironment === 'qa' ? 'true' : 'false'
    }&useOrigin=false${
      bv_segment ? `&bv_segment=${bv_segment[1]}` : ''
    }&internalParams=true&feature-html=${serializeHtml()}&legacyDisplayCode=&legacyHostname=&metaUsertoken=`;

    window.open(url, '_blank');
  }
};

const TestPageButton = ({ BV }) => (
  <button
    onClick={() => createLink(BV)}
    disabled={!BV}
    style={{
      // eslint-disable-next-line no-extra-boolean-cast
      cursor: !!BV ? 'pointer' : 'auto',
    }}
  >
    Open Test Page
  </button>
);

export default TestPageButton;
