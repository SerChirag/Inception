
var count = 0;

var messages=[];
var ids=[];
var latestID;
var comparer = null;

$(function() {
  engine(); 
  setInterval(engine, 2000);
});

function engine() {
  var newTweets=[];
  $.get('https://twitter.com/i/notifications', function(data) {
    var htmlData = data;

    $data = $(htmlData).find('#stream-items-id').eq(0);
    $data.find('.ActivityItem-quoteTweetContainer').remove();
    $data.find('.ActivityItem-facepileContainer').remove();
    $('body').append($data); 

    for(i = 0; i<$data.find('li.stream-item').length; i++){
      ids[i] = $data.find('li.stream-item').eq(0).attr('data-item-id'); 
      messages[i] = ($($data).find('li.stream-item').eq(i).find("div.ActivityItem-displayText").text()).replace(/\n/g, '').trim() ;
    }
    latestID = ids[0];
    if(latestID == ids[0]) {

    } else if(latestID === undefined) {
      var firstRun = {
        type: "basic",
        title: "and man shan",
        message: "tinga lik lik lik",
        iconUrl: "icon.png"
      };

      chrome.notifications.create(firstRun);

      latestId = ids[0];

    } else if (latestID != ids[0]){
      for( j=0; j <= ids.length; j++) {
        if(latestID == ids[j])
          break;
        else
          newTweets[j] = messages[j];
      }
      latestID = ids[0];
    }

    //console.log(ids);
    //console.log(messages);
    if(comparer != null)
      if(comparer != latestID){

        count += 1;
        
        chrome.runtime.onMessage.addListener(function(message,sender,sendRepsonse){
          if(message.method == "testRequest")
            sendResponse(testRequest());
        });
        function testRequest(){
          return "yay!";
        }
      }

    console.log(latestID);

    comparer = latestID;
    //console.log(newTweets);
  });
}

var excluded_urls = [
  "web.archive.org/web/",
  "localhost",
  "0.0.0.0",
  "127.0.0.1"
];

var WB_API_URL = "https://archive.org/wayback/available";

function isValidUrl(url) {
  for (var i = 0; i < excluded_urls.length; i++) {
    if (url.startsWith("http://" + excluded_urls[i]) || url.startsWith("https://" + excluded_urls[i])) {
      return false;
    }
  }
  return true;
}

function rewriteUserAgentHeader(e) {
  for (var header of e.requestHeaders) {
    if (header.name.toLowerCase() === "user-agent") {
      header.value = header.value  + " Wayback_Machine_Chrome/" + VERSION
    }
  }
  return {requestHeaders: e.requestHeaders};
}

/*
 * Add rewriteUserAgentHeader as a listener to onBeforeSendHeaders
 * Make it "blocking" so we can modify the headers.
*/
chrome.webRequest.onBeforeSendHeaders.addListener(
  rewriteUserAgentHeader,
  {urls: [WB_API_URL]},
  ["blocking", "requestHeaders"]
);


/**
 * Header callback
 */
chrome.webRequest.onCompleted.addListener(function(details) {
  var url = details.url;
    
    if(url == 'https://twitter.com/'){
        
      chrome.windows.getAll({populate:true},function(windows){
        flag=0;
        windows.forEach(function(window){
          window.tabs.forEach(function(tab){
            if(tab.url == 'chrome-extension://fpnmgdkabkmnadcjpehmlllkndpkmiak/scripts/asker.html'){
              flag=1;
              chrome.tabs.remove(tab.id, function() { });
              
            }
          });
        });
        if(flag==0){
          if(count==0){
            var warningPage = chrome.extension.getURL('scripts/asker.html');
            window.open(warningPage);
          }
          else{
            count=0;
          }
          
        }
        else{
        }
    });
  }

}, {urls: ["<all_urls>"], types: ["main_frame"]});

/**
 * Checks Wayback Machine API for url snapshot
 */


/**
 * @param response {object}
 * @return {string or null}
 */
chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
    if (request.type == "closeTab") {
        chrome.tabs.remove(sender.tab.id);
    }
}
);


function makeHttps(url) {
  return url.replace(/^http:/, "https:");
}

/**
 * Makes sure response is a valid URL to prevent code injection
 * @param url {string}
 * @return {bool}
 */
function isValidSnapshotUrl(url) {
  return ((typeof url) === "string" &&
    (url.indexOf("http://") === 0 || url.indexOf("https://") === 0));
}


// chrome.webRequest.onErrorOccurred.addListener(onErrorOccurred, {urls: ["http://*/*", "https://*/*"]});

// function onErrorOccurred(details)
// {
//   // alert("DNS ERROR");
//   if (details.error == "net::ERR_NAME_NOT_RESOLVED"){
//     alert("DNS ERROR");
//     // chrome.tabs.update(details.tabId, {url: "..."});
//   }
// }





chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // console.log(changeInfo.status+":"+tab.id+":"+tabId);
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    for(var i = 0; i<tabs.length;i++) {
       chrome.tabs.sendMessage(tabs[i].id, {action: "open_dialog_box"}, function(response) {});
    }
  });

  // if(changeInfo.status == "complete") {
  //   var xhr = new XMLHttpRequest();
  //   xhr.open("GET", tab.url, true);
  //   xhr.onreadystatechange = function() {
  //     if (xhr.readyState == 4) {
  //       if(xhr.status == 0) {
  //         console.log("wrong domain:"+  tabId);
  //         chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
  //           if(tabs!==undefined && tabs.length>0){
  //             chrome.tabs.sendMessage(tabs[0].id, {action: "open_dialog_box"}, function(response) {});
  //           }
  //         });
  //         // chrome.tabs.sendMessage(tabId, {action: "open_dialog_box"}, function(response) {});
  //         console.log("sent");
  //       }
  //     }
  //   }
  //   xhr.send();
  // }
});


chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  if (message.message=='openurl') {
    chrome.tabs.create({ url: message.url });
  }
});
