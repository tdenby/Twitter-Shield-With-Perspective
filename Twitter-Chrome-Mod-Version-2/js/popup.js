
console.log("popup.js");
// This extension loads the saved background color for the current tab if one
// exists. The user can select a new background color from the dropdown for the
// current page, and it will be saved as part of the extension's isolated
// storage. The chrome.storage API is used for this purpose. This is different
// from the window.localStorage API, which is synchronous and stores data bound
// to a document's origin. Also, using chrome.storage.sync instead of
// chrome.storage.local allows the extension data to be synced across multiple
// user devices.

function skipLogin() {
  if(localStorage.getItem('username') != null) {
    document.getElementById('statePanel').innerHTML = 'Logged in as <b>@'  + localStorage.getItem('username') + '</b>'


 
  
  document.getElementById('submitPanel').remove();

   var learnMore = document.createElement('div')
  learnMore.innerHTML = 'Learn how Stranger Danger works'
  learnMore.style = 'padding: 2px 10px; text-align: center; border-radius: 8px; background-color: #67c4e7; '
                  + 'text-decoration: none; display: font-size: 14px; '
                  + 'margin-left:15px; margin-right:15px; margin-top:3px; margin-bottom: 3px; cursor: pointer; color:white;'

  var btn = document.createElement('div')
  btn.innerHTML = 'Log in with a different handle'
  btn.style = 'padding: 2px 10px; text-align: center; border-radius: 8px; background-color: #428bca; '
                  + 'text-decoration: none; display: font-size: 14px; '
                  + 'margin-left:15px; margin-right:15px; margin-top:3px; margin-bottom: 3px; cursor: pointer; color:white;'
  
  document.getElementById('allPanel').append(learnMore)
  document.getElementById('allPanel').append(btn)

  document.getElementById('statePanel').innerHTML = 'Logged in as <b>@'  + localStorage.getItem('username') + '</b>'
  }
}

//document.getElementById('statePanel').innerHTML = 'Logged in as <b>@'  + chrome.storage.local.get(['username']) + '</b>'

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
/*localStorage.setItem({username: document.getElementById('accountHandle').value}, function() {
  console.log('Value is set to ' + document.getElementById('accountHandle').value);
});*/
    chrome.tabs.executeScript({
        code: "var accountName =" + '"' + document.getElementById('accountHandle').value +'";',
        allFrames: true
    }, function(result) {
        chrome.tabs.executeScript({file: "js/alert.js", allFrames: true}, function(result) {
         
        });
    });
    localStorage.setItem('username', document.getElementById('accountHandle').value);
  document.getElementById('statePanel').innerHTML = 'Logged in as <b>@'  + localStorage.getItem('username') + '</b>'


 
  
  document.getElementById('submitPanel').remove();

  var learnMore = document.createElement('div')
  learnMore.innerHTML = 'Learn how Stranger Danger works'
  learnMore.style = 'padding: 2px 10px; text-align: center; border-radius: 8px; background-color: #67c4e7; '
                  + 'text-decoration: none; display: font-size: 14px; '
                  + 'margin-left:15px; margin-right:15px; margin-top:3px; margin-bottom: 3px; cursor: pointer; color:white;'

  var btn = document.createElement('div')
  btn.innerHTML = 'Log in with a different handle'
  btn.style = 'padding: 2px 10px; text-align: center; border-radius: 8px; background-color: #428bca; '
                  + 'text-decoration: none; display: font-size: 14px; '
                  + 'margin-left:15px; margin-right:15px; margin-top:3px; margin-bottom: 3px; cursor: pointer; color:white;'
  
  var slider = document.createElement('div')
  slider.className = 'slidecontainer';
  document.getElementById('allPanel').append(slider)
  document.getElementById('allPanel').append(learnMore)
  document.getElementById('allPanel').append(btn)


  btn.addEventListener('click', logOut, false);
  document.getElementById('statePanel').innerHTML = 'Logged in as <b>@'  + localStorage.getItem(['username']) + '</b>'
                                                              + '<br> You successfully logged in..'
                                                        


}

function logOut() {
  localStorage.removeItem('username');
  document.location.reload()
}

var slider = document.getElementById("thresholdId");
var output = document.getElementById("demo");
output.innerHTML = 'Less than 20% Toxic Tweets'; // Display the default slider value
   
slider.oninput = function() {
  if(slider.value < .2) {
    output.innerHTML = 'Less than 20% Toxic Tweets';
  }
  else if((slider.value >= .2) && (slider.value < .4)) {
    output.innerHTML = 'Less than 40% Toxic Tweets';
  }
  else if((slider.value >= .4) && (slider.value < .6)) {
    output.innerHTML = 'Less than 60% Toxic Tweets';
  }
  else if((slider.value >= .6) && (slider.value < .8)) {
    output.innerHTML = 'Less than 80% Toxic Tweets';
  }
  else if((slider.value >= .8) && (slider.value <= 1)) {
    output.innerHTML = 'Less than 100% Toxic Tweets';
  }
  //output.innerHTML = this.value;
}



