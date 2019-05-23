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

