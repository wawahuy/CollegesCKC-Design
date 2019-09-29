'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher(
        // {
        //   pageUrl: { urlMatches: '(fb|facebook)\.com' }
        // }
      )
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.storage.onChanged.addListener(function (data){
});

chrome.runtime.onMessage.addListener(function(req, sender) {
});




// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//   chrome.browserAction.disable(tabId);
//   chrome.browserAction.setPopup({
//       tabId: tabId,
//       popup: 'html/popup.html'
//   });
// });


// chrome.browserAction.onClicked.addListener(function (){
//   chrome.notifications.create('reminder', {
//     type: 'basic',
//     iconUrl: 'image/icon/128.png',
//     title: 'Don\'t forget!',
//     message: 'You have things to do. Wake up, dude!'
//   }, function(notificationId) {
//     setTimeout(
//       function (){
//         chrome.notifications.clear(notificationId);
//       },
//       2000,
//       notificationId
//     );
//   });
// })

// chrome.notifications.onClicked.addListener(function(notificationId) {
//   chrome.notifications.clear(notificationId);
// });
