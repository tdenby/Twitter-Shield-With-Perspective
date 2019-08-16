
var URL_HEADER = 'https://twitter-shield.si.umich.edu'
// var URL_HEADER = 'http://127.0.0.1:8000'

document.addEventListener('DOMContentLoaded', function () {
  console.log('event listener for popup')
  OAuth.initialize('b7WiSGtdkDLZC1XXsW7_VCKyFwA');
  //skip login if cached
  skipLogin();
  if(document.getElementById('submitId') != null){
    document.getElementById('submitId').addEventListener('click', setAccountHandle);
  }
}); 


function renderLogin() {
  if(document.getElementById('submitId') != null){
    document.getElementById('submitId').remove()
  }
  
  // var learnMore = document.createElement('div')
  // learnMore.id = 'learnMore'
  // learnMore.innerHTML = '<a href="https://docs.google.com/document/d/12ddWNmd7TfmdMAoxhnJtHMUE9TKOMpQ1WpIzKtlWUAM/edit?usp=sharing">'
  //                       +'Learn how Stranger Danger works</a>'
  // learnMore.style = 'padding: 2px 10px; text-align: center; border-radius: 8px; background-color: #67c4e7; '
  //                 + 'text-decoration: none; display: font-size: 14px; '
  //                 + 'margin-left:15px; margin-right:15px; margin-top:3px; margin-bottom: 3px; cursor: pointer; color:white;'
  // document.getElementById('buttonPanel').append(learnMore)
  var btn = document.createElement('div')
  btn.innerHTML = 'Log out'
  btn.id = 'logoutBtn'
  btn.style = 'padding: 2px 10px; text-align: center; border-radius: 8px; background-color: #428bca; '
                  + 'text-decoration: none; display: font-size: 14px; '
                  + 'margin-left:15px; margin-right:15px; margin-top:3px; margin-bottom: 3px; cursor: pointer; color:white;'
  
  if(document.getElementById('buttonPanel') != null){
    document.getElementById('buttonPanel').append(btn)

    btn.addEventListener('click', logOut); 

    document.getElementById('statePanel').innerHTML = ''

    addSliders();
  }
}


function renderLogout(){
  document.getElementById('logoutBtn').remove()
  // document.getElementById('learnMore').remove()
  var submitButton = document.createElement('div')

  submitButton.innerHTML = 'Log in with Twitter account'
  submitButton.id = 'submitId'
  submitButton.style =  'padding: 2px 10px; text-align: center; border-radius: 8px; background-color: #428bca; '
                  + 'text-decoration: none; display: font-size: 14px; '
                  + 'margin-left:28px; margin-right:28px; margin-top:3px; margin-bottom: 3px; cursor: pointer; color:white;'
  submitButton.addEventListener('click', setAccountHandle);
  document.getElementById('contentPanel').append(submitButton)
  document.getElementById('statePanel').innerHTML = 'You are logged out.'

  removeSliders();
}

function skipLogin() {
  chrome.storage.local.get(['accountName'], function(result) {
      console.log(result.accountName)
      console.log('skip log in')
  if(result.accountName != null) {
    console.log('NOT NULLLLLLL')
    
      chrome.storage.local.get(['accountName'], function(result) {
      console.log(result)
    });

    renderLogin()
    
  }
  });
  
}


function setAccountHandle(){
  chrome.tabs.executeScript({
      // code: "var accountName =" + '"' + document.getElementById('accountHandle').value +'";',
      allFrames: true
  }, function(result) {
      chrome.tabs.executeScript({file: "js/alert.js", allFrames: true}, function(result) {
        console.log("DONENENE")
        console.log(result)

      });
  });

  
  renderLogin();
  addSliders();                                          

}


function logOut() {
  console.log('log out!')
  localStorage.removeItem('accountName');
  chrome.storage.local.set({'accountName': null}, function(){
    console.log('RESET!')
    renderLogout();

  })



}

function addSliders(){
  if(document.getElementById('toxicForm') == null){
    var toxicSlider = document.createElement('form')
    toxicSlider.id = "toxicForm"
    toxicSlider.innerHTML = '<form style="padding-left:30px; padding-right:30px;" class="sliderForm" >'
                          + '<p>Toxic tweet frequency threshold : <span id="toxicThresholdOutput">8%</span></p> '
                          + '<input type="range" step="1" min="0" max="100" name ="threshold" class = "slider" value ="8" id="toxicitySlider">'
                          + '</form>'

    document.getElementById('buttonPanel').append(toxicSlider)

    document.getElementById('toxicitySlider').onchange = function updateToxicInput(res) {
      console.log(res.target.value)
      document.getElementById('toxicThresholdOutput').innerHTML = res.target.value + '%'; 
      chrome.storage.local.set({'toxicThreshold': parseInt(res.target.value)*0.01}, function(){
        console.log('set toxic')
      })
    }

    chrome.storage.local.get(['toxicThreshold'], function(result) {
      if(result.toxicThreshold != null){
        document.getElementById('toxicThresholdOutput').innerText = Math.trunc(result.toxicThreshold * 100) +'%'
        document.getElementById('toxicitySlider').value = Math.trunc(result.toxicThreshold * 100)
      }else{
        document.getElementById('toxicThresholdOutput').innerText = '8%'
        document.getElementById('toxicitySlider').value = 8
      }
      
    });
  }
  
  if(document.getElementById('misinfoForm') == null){
    var misinfoSlider = document.createElement('form')
    misinfoSlider.id = "misinfoForm"
    misinfoSlider.innerHTML = '<form  style="padding-left:30px; padding-right:30px;" class="sliderForm" id="misinfoForm">'
                            + '<p>Misinfo. tweet frequency threshold: <span id="misinfoThresholdOutput">2%</span></p>'
                            + '<input type="range" step="1" min="0" max="100" name ="threshold" class = "slider" value ="2" id="misinfoSlider">'
                            + '</form>' 
    
    document.getElementById('buttonPanel').append(misinfoSlider)      
          
    
    document.getElementById('misinfoSlider').onchange = function updateMisinfoInput(res) {
      document.getElementById('misinfoThresholdOutput').innerHTML = res.target.value +'%'; 
      chrome.storage.local.set({'misinfoThreshold': parseInt(res.target.value)*0.01}, function(){
        console.log('set misinfo')
      })
    }
    chrome.storage.local.get(['misinfoThreshold'], function(result) {
      if(result.misinfoThreshold != null){
        document.getElementById('misinfoThresholdOutput').innerText = Math.trunc(result.misinfoThreshold * 100) +'%'
        document.getElementById('misinfoSlider').value = Math.trunc(result.misinfoThreshold * 100)
      }else{
        document.getElementById('misinfoThresholdOutput').innerText = '2%'
        document.getElementById('misinfoSlider').value = 2
      }
      
      console.log(result.misinfoThreshold)
    });

  }
}

function removeSliders(){
  document.getElementById('toxicForm').remove()
  document.getElementById('misinfoForm').remove()
  location.reload()
}

