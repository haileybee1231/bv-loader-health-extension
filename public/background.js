const sendMessage = (tabInfo, action) => {
  chrome.tabs.sendMessage(tabInfo, action);
}

let extensionDidMount = false;

chrome.webRequest.onCompleted.addListener(details => {
  chrome.tabs.query({
      active: true,
      currentWindow: true
  }, tabs => {
      if (tabs[0]) {
        const sendResourceMessage = () => {
          if (extensionDidMount) {
            sendMessage(tabs[0].id, { action: "capture_events", data: details });
          } else {
            setTimeout(sendResourceMessage, 250);
          }
        }

        sendResourceMessage();
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

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.type === "bv-loader-extension-mounted") {
    extensionDidMount = true;
  }
});

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.type === "bv-loader-extension-unmounted") {
    extensionDidMount = false;
  }
});
