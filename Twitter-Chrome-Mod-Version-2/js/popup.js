
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
                  + 'margin-left:15px; margin-right:15px; margin-top:32px; margin-bottom: 6px; cursor: pointer; color:white;'
                
  if(document.getElementById('buttonPanel') != null){

    //addSliders();

    newAddSliders();

    //document.getElementById('demo').append(btn)

    btn.addEventListener('click', logOut); 

    document.getElementById('statePanel').innerHTML = ''

    
  }
  document.getElementById('buttonPanel').append(btn);  
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
                          + '<p>Maximum percentage of <b>toxic</b> tweets you would like to allow: <span id="toxicThresholdOutput">8%</span></p> '
                          + '<input type="range" step="1" min="1" max="100" name ="threshold" class = "slider" value ="8" id="toxicitySlider">'
                          + '</form>'

    document.getElementById('buttonPanel').append(toxicSlider)
    var thisSlider = document.getElementById('toxicitySlider')

    document.getElementById('toxicitySlider').onchange = function updateToxicInput(res) {
      console.log(res.target.value)
      document.getElementById('toxicThresholdOutput').innerHTML = res.target.value + '%'; 
      chrome.storage.local.set({'toxicThreshold': parseInt(res.target.value)*0.01}, function(){
        console.log('set toxic')
      })

      var thisSlider = document.getElementById('toxicitySlider')
      var val = (res.target.value - res.target.min) / (res.target.max - res.target.min);
      console.log(val)
      thisSlider.style.backgroundImage = '-webkit-gradient(linear, left top, right top, '
                + 'color-stop(' + val + ', rgb(42, 190, 14, 0.58)), '
                + 'color-stop(' + val + ', #ea0505a8)'
                + ')'
    }

    chrome.storage.local.get(['toxicThreshold'], function(result) {
      var thisSlider = document.getElementById('toxicitySlider')
      if(result.toxicThreshold != null){
        document.getElementById('toxicThresholdOutput').innerText = Math.trunc(result.toxicThreshold * 100) +'%'
        document.getElementById('toxicitySlider').value = Math.trunc(result.toxicThreshold * 100)

        var val = (Math.trunc(result.toxicThreshold * 100) - thisSlider.min) / (thisSlider.max - thisSlider.min);
        console.log(val)
        thisSlider.style.backgroundImage = '-webkit-gradient(linear, left top, right top, '
                + 'color-stop(' + val + ', rgb(42, 190, 14, 0.58)), '
                + 'color-stop(' + val + ', #ea0505a8)'
                + ')'
      }else{
        document.getElementById('toxicThresholdOutput').innerText = '8%'
        document.getElementById('toxicitySlider').value = 8

        var toxicDefault = 8
        var val = (toxicDefault - thisSlider.min) / (thisSlider.max - thisSlider.min);
        console.log(val)
        thisSlider.style.backgroundImage = '-webkit-gradient(linear, left top, right top, '
                + 'color-stop(' + val + ', rgb(42, 190, 14, 0.58)), '
                + 'color-stop(' + val + ', #ea0505a8)'
                + ')'
      }
      
    });
  }
  
  if(document.getElementById('misinfoForm') == null){
    var misinfoSlider = document.createElement('form')
    misinfoSlider.id = "misinfoForm"
    misinfoSlider.innerHTML = '<form style="padding-left:30px; padding-right:30px;" class="sliderForm" id="misinfoForm">'
                            + '<p>Maximum percentage of <b>misinformation</b> tweets you would like to allow: <span id="misinfoThresholdOutput">2%</span></p>'
                            + '<input type="range" step="1" min="1" max="100" name ="threshold" class = "slider" value ="2" id="misinfoSlider">'
                            + '</form>' 
    
    document.getElementById('buttonPanel').append(misinfoSlider)      
    var thisSlider = document.getElementById('misinfoSlider')
    
    document.getElementById('misinfoSlider').onchange = function updateMisinfoInput(res) {
      document.getElementById('misinfoThresholdOutput').innerHTML = res.target.value +'%'; 
      chrome.storage.local.set({'misinfoThreshold': parseInt(res.target.value)*0.01}, function(){
        console.log('set misinfo')
      })
      var val = (res.target.value - res.target.min) / (res.target.max - res.target.min);
      console.log(val)
      thisSlider.style.backgroundImage = '-webkit-gradient(linear, left top, right top, '
                + 'color-stop(' + val + ',  rgb(42, 190, 14, 0.58)), '
                + 'color-stop(' + val + ', #ea0505a8)'
                + ')'
    }
    chrome.storage.local.get(['misinfoThreshold'], function(result) {
      if(result.misinfoThreshold != null){
        document.getElementById('misinfoThresholdOutput').innerText = Math.trunc(result.misinfoThreshold * 100) +'%'
        document.getElementById('misinfoSlider').value = Math.trunc(result.misinfoThreshold * 100)
        
        var val = (Math.trunc(result.misinfoThreshold * 100) - thisSlider.min) / (thisSlider.max - thisSlider.min);
        thisSlider.style.backgroundImage = '-webkit-gradient(linear, left top, right top, '
                + 'color-stop(' + val + ',  rgb(42, 190, 14, 0.58)), '
                + 'color-stop(' + val + ', #ea0505a8)'
                + ')'
      }else{
        document.getElementById('misinfoThresholdOutput').innerText = '2%'
        document.getElementById('misinfoSlider').value = 2
        
        var misinfoDefault = 2
        var val = (misinfoDefault - thisSlider.min) / (thisSlider.max - thisSlider.min);
        thisSlider.style.backgroundImage = '-webkit-gradient(linear, left top, right top, '
                + 'color-stop(' + val + ',  rgb(42, 190, 14, 0.58)), '
                + 'color-stop(' + val + ', #ea0505a8)'
                + ')'
      }
      
    });

  }
  // console.log('change color')
  // $('input[type="range"]').change(function () {
  //   var val = ($(this).val() - $(this).attr('min')) / ($(this).attr('max') - $(this).attr('min'));
    
  //   $(this).css('background-image',
  //               '-webkit-gradient(linear, left top, right top, '
  //               + 'color-stop(' + val + ', #94A14E), '
  //               + 'color-stop(' + val + ', #C5C5C5)'
  //               + ')'
  //               );
  // });
}

function newAddSliders() {

  var toxicHeader = document.createElement('div');

  toxicHeader.innerHTML = '<form style="padding-left:30px; padding-right:30px;" class="sliderForm" >'
  + '<p>Maximum percentage of <b>toxic</b> tweets you would like to allow: </p> '
  

  var toxicSliderr = document.createElement('wrapper');

  toxicSliderr.innerHTML = '<div class="wrapper"  id="sliderWrapper">'
    + '<article class="content">'
    + '<div class="rangepresenter">'
    + '<div class="rangewrapper horizontal">'
    + '<div class="sliderfill">'
    + '<input class="customrange" type="range" min="0" max="100" value="50" id="toxicSliderId">'
    + '</div>'
    + '<div class="sliderthumb"></div>'
    + '<div class="slidervalue id="toxicSliderValue">80</div>'
    + '</div>'
    + '</div>'
    + '</article>'
    + '</div>';

    document.getElementById('buttonPanel').append(toxicHeader);
    document.getElementById('buttonPanel').append(toxicSliderr);
    //document.addEventListener('DOMContentLoaded', function (e) { 
    //  if(e.target && e.target.id== 'sliderWrapper'){
    //    init();
    //  }
    //}); 
    init();
    //$('#demo').on('click', 'yourSelector', function()
    document.getElementById('toxicSliderId').onchange = function updateToxicInput(res) {
      chrome.storage.local.set({'toxicThreshold': parseInt(res.target.value)*0.01}, function(){
        console.log('set toxicicity')
      })
    }

    var misinfoHeader = document.createElement('div');

  misinfoHeader.innerHTML = '<form style="padding-left:30px; padding-right:30px;" class="sliderForm" >'
  + '<p>Maximum percentage of <b>misinforming</b> tweets you would like to allow: </p> '
  

  var misinfoSliderr = document.createElement('wrapper');

  misinfoSliderr.innerHTML = '<div class="wrapper"  id="sliderWrapper">'
    + '<article class="content">'
    + '<div class="rangepresenter">'
    + '<div class="rangewrapper horizontal">'
    + '<div class="sliderfill">'
    + '<input class="customrange" type="range" min="0" max="100" value="50" id="misinfoSliderId">'
    + '</div>'
    + '<div class="sliderthumb"></div>'
    + '<div class="slidervalue id="misinfoSliderValue">80</div>'
    + '</div>'
    + '</div>'
    + '</article>'
    + '</div>';

    document.getElementById('buttonPanel').append(misinfoHeader);
    document.getElementById('buttonPanel').append(misinfoSliderr);
    //document.addEventListener('DOMContentLoaded', function (e) { 
    //  if(e.target && e.target.id== 'sliderWrapper'){
    //    init();
    //  }
    //}); 
    init();
    //$('#demo').on('click', 'yourSelector', function()
    document.getElementById('misinfoSliderId').onchange = function updateToxicInput(res) {
      chrome.storage.local.set({'misinfoThreshold': parseInt(res.target.value)*0.01}, function(){
        console.log('set misinfo')
      })
    }
    
}

function removeSliders(){
  document.getElementById('toxicForm').remove()
  document.getElementById('misinfoForm').remove()
  location.reload()
}



let sliders, sliderfills, thumbs, slidervalues;
let initialValue = [80, 80]; //initial values for the sliders

 
//document.addEventListener('DOMContentLoaded', function (e) { init();});
//$(document).on('DOMContentLoaded','#sliderWrapper',function(){ init();});

function init(){
  sliders = document.querySelectorAll(".customrange");
  sliderfills = document.querySelectorAll(".sliderfill");
  thumbs = document.querySelectorAll(".sliderthumb");
  slidervalues = document.querySelectorAll(".slidervalue");
  /* We need to change slider appearance to respond to both input and change events. */ 
  
  for (let i=0;i<sliders.length;i++){
    sliders[i].addEventListener("input",function(e){updateSlider(i,sliders[i].value);});
    sliders[i].addEventListener("change",function(e){updateSlider(i,sliders[i].value);});
    //set initial values for the sliders
    sliders[i].value = initialValue[i];
    //update each slider
    updateSlider(i,sliders[i].value);
  }
}
function updateSlider(fillindex,val){
  //sets the text display and location for each thumb and the slider fill  
  let min = Number(sliders[fillindex].getAttribute("min"));
  let max = Number(sliders[fillindex].getAttribute("max"));
  let pc = (val/(max-min)) * 100
  setThumbText(slidervalues[fillindex],val,pc);
  setThumb(thumbs[fillindex],pc);
  setSliderFill(sliderfills[fillindex],pc);
}
function setThumbText(elem,val,pc){
  let size = getComputedStyle(elem).getPropertyValue("--thumbsize");
  let newx = `calc(${pc}% - ${parseInt(size)/2}px)`;
  elem.style.left = newx;
  elem.innerHTML = val;
}
function setThumb(elem,val){
  let size = getComputedStyle(elem).getPropertyValue("--thumbsize");
  let newx = `calc(${val}% - ${parseInt(size)/2}px)`;
  elem.style.left = newx;
  let max = 100;
  let degrees = 360 * (val/max);
}
function setSliderFill(elem,val){
  let fillcolor = getComputedStyle(elem).getPropertyValue("--accentcolor");
  let alphafillcolor = getComputedStyle(elem).getPropertyValue("--accentcoloralpha");
  // we create a linear gradient with a color stop based on the slider value
  let gradient = `linear-gradient(to right, ${fillcolor} 0%, 
${alphafillcolor} ${val}%, 
rgba(255,255,255,0.1) ${Number(val) + 1}%, 
rgba(255,255,255,0)  100%)`;
  elem.style.backgroundImage = gradient;
}

