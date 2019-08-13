console.log("popup.js");
console.log(localStorage)
OAuth.initialize('b7WiSGtdkDLZC1XXsW7_VCKyFwA');
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


}



