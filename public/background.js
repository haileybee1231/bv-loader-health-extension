// /* global chrome */
var URL_FILTER = [
  '*://network.bazaarvoice.com/*',
  '*://network-eu.bazaarvoice.com/*',
  '*://network-a.bazaarvoice.com/*',
  '*://network-eu-a.bazaarvoice.com/*',
  '*://network-stg.bazaarvoice.com/*',
  '*://network-eu-stg.bazaarvoice.com/*',
  '*://network-stg-a.bazaarvoice.com/*',
  '*://network-eu-stg-a.bazaarvoice.com/*',
  '*://magpie.bazaarvoice.com/*',
  '*://magpie-a.bazaarvoice.com/*',
  '*://magpie-stg.bazaarvoice.com/*',
  '*://magpie-stg-a.bazaarvoice.com/*',
  '*://magpie-static.ugc.bazaarvoice.com/*',
  '*://analytics-static.ugc.bazaarvoice.com/*',
  // events are sent to this domain when validation
  // is enabled, instead of cookie monster
  '*://schema.mag.bazaarvoice.com/*'
];

const sendMessage = (tabInfo, action) => {
  chrome.tabs.sendMessage(tabInfo, action);
}

chrome.webRequest.onCompleted.addListener(details => {
  chrome.tabs.query({
      active: true,
      currentWindow: true
  }, tabs => {
      if (tabs[0]) {
        // We need to set a timeout to prevent race conditions for resources loaded early in waterfall
        setTimeout(() => {
          sendMessage(tabs[0].id, { action: "capture_events", data: details });
        }, 1500)
      }
  });
}, {urls: ['<all_urls>'] });

chrome.browserAction.onClicked.addListener(tab => {
	chrome.tabs.query({
    active: true,
    currentWindow:true
  }, function(tabs) {
    sendMessage(tabs[0].id, { action: 'toggle' });
  });
});

