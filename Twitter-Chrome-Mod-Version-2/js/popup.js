
console.log("popup.js");
console.log(localStorage)
OAuth.initialize('b7WiSGtdkDLZC1XXsW7_VCKyFwA');
console.log('initialized!')
skipLogin();
// This extension loads the saved background color for the current tab if one
// exists. The user can select a new background color from the dropdown for the
// current page, and it will be saved as part of the extension's isolated
// storage. The chrome.storage API is used for this purpose. This is different
// from the window.localStorage API, which is synchronous and stores data bound
// to a document's origin. Also, using chrome.storage.sync instead of
// chrome.storage.local allows the extension data to be synced across multiple
// user devices.

function skipLogin() {
  if(localStorage.getItem('accountName') != null) {
    document.getElementById('statePanel').innerHTML = 'Logged in as <b>@'  + localStorage.getItem('accountName') + '</b>'
  
    document.getElementById('submitPanel').remove();

     var learnMore = document.createElement('div')
    learnMore.innerHTML = 'Learn how Stranger Danger works'
    learnMore.style = 'padding: 2px 10px; text-align: center; border-radius: 8px; background-color: #67c4e7; '
                    + 'text-decoration: none; display: font-size: 14px; '
                    + 'margin-left:15px; margin-right:15px; margin-top:3px; margin-bottom: 3px; cursor: pointer; color:white;'

    var btn = document.createElement('div')
    btn.innerHTML = 'Log out'
    btn.style = 'padding: 2px 10px; text-align: center; border-radius: 8px; background-color: #428bca; '
                    + 'text-decoration: none; display: font-size: 14px; '
                    + 'margin-left:15px; margin-right:15px; margin-top:3px; margin-bottom: 3px; cursor: pointer; color:white;'
    
    var slider = document.createElement('input')
    slider.className = 'slider';
    slider.type="RANGE";
    //slider.method='POST';
    slider.step=.2;
    slider.min=0;
    slider.max=.8;
    slider.value=0;
    slider.id='ThresholdId';
    slider.name='threshold;';
    //var outputt = document.getElementById("demo");
    var sliderLabel = document.createElement('div');
    sliderLabel.innerHTML = 'Toxicity Threshold Selector';
    var br = document.createElement("br");
    sliderLabel.appendChild(br);
    document.getElementById('sliderform').append(sliderLabel);
    document.getElementById('sliderform').append(slider)
    document.getElementById('value').append("Value: ")

    var slider2 = document.createElement('input')
    slider2.className = 'slider';
    slider2.type="RANGE";
    //slider.method='POST';
    slider2.step=.2;
    slider2.min=0;
    slider2.max=.8;
    slider2.value=0;
    slider2.id='ThresholdId';
    slider2.name='threshold;';
    //var outputt = document.getElementById("demo");
    var slider2Label = document.createElement('div');
    slider2Label.innerHTML = 'Misinformation Threshold Selector';
    slider2Label.appendChild(br);
    document.getElementById('sliderform2').append(slider2Label);
    document.getElementById('sliderform2').append(slider2)
    document.getElementById('value2').append("Value: ")
    //outputt.innerHTML = slider.value; 
    //slider.oninput = function() {
    //  outputt.innerHTML = slider.value;
    //}
    document.getElementById('allPanel').append(learnMore)
    document.getElementById('allPanel').append(btn)

    btn.addEventListener('click', logOut, false);
    document.getElementById('statePanel').innerHTML = 'Logged in as <b>@'  + localStorage.getItem('accountName') + '</b>'
  }
}


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
  localStorage.setItem('accountName', document.getElementById('accountHandle').value);

  document.getElementById('statePanel').innerHTML = 'Logged in as <b>@'  + document.getElementById('accountHandle').value + '</b>'
  
  document.getElementById('submitPanel').remove();

  var learnMore = document.createElement('div')
  learnMore.innerHTML = 'Learn how Stranger Danger works'
  learnMore.style = 'padding: 2px 10px; text-align: center; border-radius: 8px; background-color: #67c4e7; '
                  + 'text-decoration: none; display: font-size: 14px; '
                  + 'margin-left:15px; margin-right:15px; margin-top:3px; margin-bottom: 3px; cursor: pointer; color:white;'

  var btn = document.createElement('div')
  btn.innerHTML = 'Log out'
  btn.style = 'padding: 2px 10px; text-align: center; border-radius: 8px; background-color: #428bca; '
                  + 'text-decoration: none; display: font-size: 14px; '
                  + 'margin-left:15px; margin-right:15px; margin-top:3px; margin-bottom: 3px; cursor: pointer; color:white;'
  
  var slider = document.createElement('div')
  slider.className = 'slider';
  slider.type="RANGE";
  //slider.method='POST';
  slider.step=.2;
  slider.min=0;
  slider.max=.8;
  slider.value=0;
  slider.id='ThresholdId';

  document.getElementById('allPanel').append(slider)
  document.getElementById('allPanel').append(learnMore)
  document.getElementById('allPanel').append(btn)


  btn.addEventListener('click', logOut, false);
  document.getElementById('statePanel').innerHTML = 'Logged in as <b>@'  + localStorage.getItem('accountName') + '</b>'
                                                              + '<br> You successfully logged in..'
                                    


}

function logOut() {
  console.log('log out!')
  localStorage.removeItem('accountName');
  document.location.reload()
  console.log(localStorage.getItem('accountName'))
}




