console.log("popup.js");
// This extension loads the saved background color for the current tab if one
// exists. The user can select a new background color from the dropdown for the
// current page, and it will be saved as part of the extension's isolated
// storage. The chrome.storage API is used for this purpose. This is different
// from the window.localStorage API, which is synchronous and stores data bound
// to a document's origin. Also, using chrome.storage.sync instead of
// chrome.storage.local allows the extension data to be synced across multiple
// user devices.

document.addEventListener('DOMContentLoaded', function() {

  document.getElementById('submitId').addEventListener('click', setThreshold);

  // console.log(msg);
  // chrome.tabs.query({
  //   active: true,
  //   currentWindow: true
  // }, function(tabs) {
  //   chrome.tabs.sendMessage(tabs[0].id, {
  //     greeting: 'hello'
  //   }, function(response) {
  //     console.log(response.data);
  //     var pageUrl = (tabs[0].url);
  //     msg.innerText = response.data;
  //   });

  // });

});


function setThreshold(){

    chrome.tabs.executeScript({
        code: "var threshold=" + document.getElementById('thresholdId').value
                + "; localStorage.setItem('threshold', " + document.getElementById('thresholdId').value + ");",
        allFrames: true
    }, function(result) {
        chrome.tabs.executeScript({file: "js/alert.js", allFrames: true}, function(result) {
        });
    });
   }




