console.log("popup.js");
// This extension loads the saved background color for the current tab if one
// exists. The user can select a new background color from the dropdown for the
// current page, and it will be saved as part of the extension's isolated
// storage. The chrome.storage API is used for this purpose. This is different
// from the window.localStorage API, which is synchronous and stores data bound
// to a document's origin. Also, using chrome.storage.sync instead of
// chrome.storage.local allows the extension data to be synced across multiple
// user devices.



document.addEventListener('DOMContentLoaded', function () {
  console.log('event listener for popup')
  document.getElementById('submitId').addEventListener('click', setAccountHandle);
  console.log('set user id')
  // document.getElementById('submitId').addEventListener('click', setThreshold);
  
  
//   // console.log(msg);
//   // chrome.tabs.query({
//   //   active: true,
//   //   currentWindow: true
//   // }, function(tabs) {
//   //   chrome.tabs.sendMessage(tabs[0].id, {
//   //     greeting: 'hello'
//   //   }, function(response) {
//   //     console.log(response.data);
//   //     var pageUrl = (tabs[0].url);
//   //     msg.innerText = response.data;
//   //   });

//   // });

});

function setAccountHandle(){

  chrome.tabs.executeScript({
        code: "var accountName =" + '"' + document.getElementById('accountHandle').value +'";',
        allFrames: true
    }, function(result) {
        chrome.tabs.executeScript({file: "js/alert.js", allFrames: true}, function(result) {
         
        });
    });

<<<<<<< HEAD
var slider = document.getElementById("thresholdId");
var output = document.getElementById("demo");
output.innerHTML = 'Low Toxicity'; // Display the default slider value
   
slider.oninput = function() {
  if(slider.value < .2) {
    output.innerHTML = 'Low Toxicity';
  }
  else if((slider.value >= .2) && (slider.value < .4)) {
    output.innerHTML = 'Moderate Toxicity';
  }
  else if((slider.value >= .4) && (slider.value < .6)) {
    output.innerHTML = 'Considerable Toxicity';
  }
  else if((slider.value >= .6) && (slider.value < .8)) {
    output.innerHTML = 'High Toxicity';
  }
  else if((slider.value >= .8) && (slider.value <= 1)) {
    output.innerHTML = 'Severe Toxicity';
  }
  //output.innerHTML = this.value;
}

// maybe 
// chrome.runtime.onInstalled.addListener(function callback)
// chrome.runtime.onInstalled.addListener(function object(){
=======
  document.getElementById('statePanel').innerHTML = 'Logged in as <b>@'  + document.getElementById('accountHandle').value + '</b>'


 
  
  document.getElementById('submitPanel').remove();

   var learnMore = document.createElement('div')
  learnMore.innerHTML = 'Learn how Stranger Danger works'
  learnMore.style = 'padding: 2px 10px; text-align: center; border-radius: 8px; background-color: #67c4e7; '
                  + 'text-decoration: none; display: font-size: 14px; '
                  + 'margin-left:15px; margin-right:15px; margin-top:3px; margin-bottom: 3px; cursor: pointer; color:white;'

  var logBack = document.createElement('div')
  logBack.innerHTML = 'Log in with a different handle'
  logBack.style = 'padding: 2px 10px; text-align: center; border-radius: 8px; background-color: #428bca; '
                  + 'text-decoration: none; display: font-size: 14px; '
                  + 'margin-left:15px; margin-right:15px; margin-top:3px; margin-bottom: 3px; cursor: pointer; color:white;'
  
  document.getElementById('allPanel').append(learnMore)
  document.getElementById('allPanel').append(logBack)

  document.getElementById('statePanel').innerHTML = 'Logged in as <b>@'  + document.getElementById('accountHandle').value + '</b>'
                                                              + '<br> You successfully logged in..'
>>>>>>> 0403ba07a65e2ee7f0aa6078c4c8514e1e0da852


}



