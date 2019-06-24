const sendMessage = (tabInfo, action) => {
  chrome.tabs.sendMessage(tabInfo, action);
}

let extensionDidMount = false;

// Set up a listener for all web traffic, which is parsed on the front end
chrome.webRequest.onCompleted.addListener(details => {
  chrome.tabs.query({
      active: true,
      currentWindow: true
  }, tabs => {
      if (tabs[0]) {
        const sendResourceMessage = () => {
          // Don't send messages to the extension until it has mounted and can receive them
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
    // Toggle the extension when a user clicks the icon.
    sendMessage(tabs[0].id, { action: 'toggle' });
  });
});

chrome.runtime.onMessage.addListener(function(request, sender) {
  // When the extension mounts, set this variable to true
  if (request.type === "bv-loader-extension-mounted") {
    extensionDidMount = true;
  }
});

chrome.runtime.onMessage.addListener(function(request, sender) {
  // Whenever the initial injection script, popup.js, is invoked, it sends this
  // request so it can reinitialize the context.
  if (request.type === "bv-loader-extension-unmounted") {
    extensionDidMount = false;
  }
});
