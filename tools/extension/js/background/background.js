'use strict';

const HOST = 'http://localhost:8000/';
const WS = 'ws://localhost:8080'
var   token;
var   realtime;
var   status;

const Init = function (){
    chrome.storage.sync.get(['token', 'status'], function (data){
      token = data.token;
      status = data.status ? data.status : false;
      ///realtime = new Realtime();
    });
}

const RequestAPI = function(path, response){
  $.ajax({
    url: HOST+path,
    headers: {
        'x-api-token': token
    },
    success: response
  });
}

const IsPageFBFriends = function (url){
  return /.*(facebook|fb).com\/(((.+)\/friends)|.+sk=friends)/g.exec(url);
}

const IsTrue = function (b){
  return b===true || b==="true";
}


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

chrome.runtime.onMessage.addListener(function(req, sender, res) {
  switch(req.action){
    case "login":
        RequestAPI('api/auth?user='+req.user+'&pass='+req.pass, function (data){
          if(data.status){
            token = data.data.token;
            chrome.storage.sync.set({"token": data.data.token}, function (){});
          }
          res(data);
        });
      break;

    case "relogin":
        RequestAPI('api/token?key='+token, function (data){
          if(!data.status){
            token = undefined;
            chrome.storage.sync.set({"token": null}, function (){});
          }
          res(data);
        });
      break;

    case "status":
        status = req.status;
        chrome.storage.sync.set({"status" : req.status}, function (){
        });
        res();
      break;

    case "find_by_uid":
        RequestAPI('api/profile/uid_fb/'+req.data, function (data){
          if(data.status)
            res(data.data);
        });
      break;
  }

  return true;
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (IsPageFBFriends(tab.url) && changeInfo.status === 'complete' && IsTrue(status)) {
        ///chrome.tabs.insertCSS(tabId, {file:"css/style_content.css"});
        ///chrome.tabs.executeScript(tabId, {file: "js/jquery.min.js"});
        ///chrome.tabs.executeScript(tabId, {file: "js/content.js"});
        chrome.tabs.sendMessage(tabId, {action: "init"});
    }
});

Init();
