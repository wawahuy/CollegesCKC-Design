'use strict';

//const HOST = 'http://localhost:8000/';
const HOST = 'https://caothangstudent.herokuapp.com/';
const WS = 'ws://localhost:8080'
var   token;
var   realtime;
var   status;

class CacheAPI {
  constructor(){
    if(!!CacheAPI.instance){
        return CacheAPI.instance;
    }

    CacheAPI.instance = this;
    this.data = {};
    return this;
  }

  getData(res, path, data = {}, method = 'GET'){
    var obj = this.find(path, data);

    if(obj.status){
      res(obj.data);
    } 
    else if(obj.isload) {
      obj.isload = false;
      RequestAPI(path, (function (obj, data){
        if(data.status){
          obj.status = true;
          obj.data = data.data;
        }
      }).bind(this, obj), method, data);
      this.getData(res, path, data, method);
    }
    else {
      setTimeout(this.getData.bind(this), 250, res, path, data, method);
    }
  }

  find(path, data){
    if(Array.isArray(this.data[path]) == false){
      this.data[path] = [];
    }

    var obj = false;
    this.data[path].forEach(element => {
      if(element.cst_data == JSON.stringify(data)){
        obj = element;
      }
    });

    if(!obj){
      obj = {
        status: false,
        isload: true,
        cst_data: JSON.stringify(data),
        data : null,
      };
    }

    this.data[path].push(obj);

    return obj;
  }
}

const Init = function (){
    chrome.storage.sync.get(['token', 'status'], function (data){
      token = data.token;
      status = data.status ? data.status : false;
      ///realtime = new Realtime();
    });
}

const RequestAPI = function(path, response, method = "GET", data = null){
  $.ajax({
    type: method,
    data: data,
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
          if(data.status){
            res(data.data);
          }
        });
      break;

    case "get_course":
        (new CacheAPI()).getData(res, 'api/course');
      break;

    case "get_industry":
        (new CacheAPI()).getData(res, 'api/industry');
      break;

    case "get_class":
        (new CacheAPI()).getData(res, `api/class/get_by_code_course_${req.data.course}_industry_${req.data.industry}`);
      break;

    case "get_profile":
        (new CacheAPI()).getData(res, `api/profile/get_by_id_class_${req.data.cls}?short=true`);
      break;

    case "update_fb_uid":
        RequestAPI('api/profile/update_fb_uid/'+req.data.profile_id, function (data){
          if(data.status)
            res(data.data);
        }, 'POST', {
          fb_uid: req.data.fb_uid
        });
      break;

    case "find_by_name":
        RequestAPI(`api/profile/find_by_name/${req.data.start}_${req.data.num}`, function (data){
          if(data.status)
            res(data.data);
        }, 'POST', {
          name: req.data.name
        });
      break;

    case "cache_mem":
        res(memorySizeOf(CacheAPI.instance));
      break;

    case "cache_free":
        CacheAPI.instance.data = {};
        res();
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


function memorySizeOf(obj) {
  var bytes = 0;

  function sizeOf(obj) {
      if(obj !== null && obj !== undefined) {
          switch(typeof obj) {
          case 'number':
              bytes += 8;
              break;
          case 'string':
              bytes += obj.length * 2;
              break;
          case 'boolean':
              bytes += 4;
              break;
          case 'object':
              var objClass = Object.prototype.toString.call(obj).slice(8, -1);
              if(objClass === 'Object' || objClass === 'Array') {
                  for(var key in obj) {
                      if(!obj.hasOwnProperty(key)) continue;
                      sizeOf(obj[key]);
                  }
              } else bytes += obj.toString().length * 2;
              break;
          }
      }
      return bytes;
  };

  function formatByteSize(bytes) {
      if(bytes < 1024) return bytes + " bytes";
      else if(bytes < 1048576) return Math.round((bytes / 1024).toFixed(3)) + " KiB";
      else if(bytes < 1073741824) return Math.round((bytes / 1048576).toFixed(3)) + " MiB";
      else return Math.round((bytes / 1073741824).toFixed(3)) + " GiB";
  };

  return formatByteSize(sizeOf(obj));
};

Init();
