/* Authors

June 2019-Current
Jane Im

Jan 2018-Current
Sonali Tandon

Jan 2018-June 2018
Puhe Liang
Saebom Kwon
Jacob Berman
Paiju Chang

*/

// poll frequently to check first if URL is changed - avoid calling Twitter API
// needed to go back and forth from different tabs as well

// call checkForJS_Finish() as init()
// window.onload = checkForJS_Finish()
var userID;
var currentTab;
var item, abusive_list; // jSON returned from server. Making it public for highlighting abusive words on lazy loading
// var stranger_list = [];

var ignoreURLs = ["https://twitter.com/i/bookmarks", 
                "/lists", "https://twitter.com/messages",
                "https://twitter.com/explore", "/status/", 
                "/home", "notifications"]

var withRepliesRegex = new RegExp('/with_replies'+"$")
var mediaRegex = new RegExp('/media'+"$")
var likesRegex = new RegExp('/likes'+"$")

console.log('LOCAL STORAGE')
var profileStrangerString = localStorage.profileStrangers

// var response_json = {}

// var flagged_tweets_tab;
// var flagged_tweets_flag = false;
//keep track of currentPage
// var currentPage = window.location.href;
var currentPage = '';

//global variables common to hometimeline/notificationtweets
var global_tweetcount = 0;
// var flagged_posts =[]
// var flagged_tweets =[]
var threshold;
var statusDiv;
var exampleTweets;

//styles
var toxicUserBorderStyle = '';
var computingBorderStyle = '';
var safeUserBorderStyle = '';
var notEnoughTweetsBorderStyle = '';

var URL_HEADER = 'http://127.0.0.1:8000'

var toxicityStatusDiv = '';
// var URL_HEADER. = 'http://twitter-shield.si.umich.edu'

var VERY_TOXIC_BOUNDARY = 0.8
var TOXIC_BOUNDARY = 0.6

// images
var checkImage;
var frownImage;


$(window).on('load',function(){
  console.log(currentPage)
  console.log(window.location.href)

  createCssClasses()
  setLocalStorage()
  appendImages()

  if(localStorage.getItem('threshold') != null){
    // console.log('not null!')
    threshold = localStorage.getItem('threshold');
  }else{
    // build popup
    localStorage.setItem('threshold', 0.3);
    threshold = localStorage.getItem('threshold');
    console.log('set threshold as default for now')
  }
  
  if(currentPage != window.location.href){
    if(document.location.href == 'https://twitter.com/home') {
      currentPage = document.location.href 
    }else if(document.location.href == 'https://twitter.com/notifications' || document.location.href == 'https://twitter.com/notifications/mentions') {
      currentPage = document.location.href 
    }else if(document.location.href =='https://twitter.com/messages'){
      currentPage = document.location.href 
    }else if(! ignoreURL(window.location.href)){
      console.log('likely profile page')
      // console.log('window.location: '+ window.location.href)
      $(document).arrive('[data-testid="UserProfileHeader_Items"]', function(){
        // console.log('new version of twitter- profile page')
        currentPage = window.location.href
        var thisPageID = currentPage.replace('https://twitter.com/', '')
        var result = checkTabWithinProfile(thisPageID)
        thisPageID = result[0]
        thisTab = result[1]
        console.log(thisPageID)
        if (thisPageID != userID || thisTab != currentTab){
          // update current page or/and tab
          userID = thisPageID;
          currentTab = thisTab;
          console.log(userID)
          if(thisPageID in profileStrangers){
            var thisScore = profileStrangers[thisPageID]
            changeBioElement(thisPageID, thisScore)
          }else{
            getProfileScore(thisPageID, pollStatusNewTwitter);
          }
        }
      })     
    }
  }
  // periodically call the followings
  var jsTimerForURLChange = setInterval(checkProfile, 2000);
  var notificationTimelineChecker = setInterval(checkNotificationTimeline, 5000)

});


// this visualizes flagged tweets when scrolling 
window.onscroll = function(ev) {
  if(document.location.href == 'https://twitter.com/home') {
    global_tweetcount = 0
    sendUsersToPredictTimelineNewTwitter()
  }else if(document.location.href == 'https://twitter.com/notifications') {
    sendUsersToPredictNotificationNewTwitter()
  }else if(document.location.href =='https://twitter.com/messages'){

  }
};


function checkProfile() {
  if(localStorage.getItem('threshold') != null){
    threshold = localStorage.getItem('threshold');
  }else{
    localStorage.setItem('threshold', 0.3);
    threshold = localStorage.getItem('threshold');
    console.log('set threshold as default for now')
  }
  
  if(currentPage != window.location.href){
    if(document.location.href == 'https://twitter.com/home') {
      currentPage = document.location.href 
    }else if(document.location.href == 'https://twitter.com/notifications' || document.location.href == 'https://twitter.com/notifications/mentions') {
      currentPage = document.location.href 
    }else if(document.location.href =='https://twitter.com/messages'){
      currentPage = document.location.href 
    }else if(! ignoreURL(window.location.href)){
      console.log('likely profile page')
      if(document.getElementById('toxicityStatus')!=null){
        document.getElementById('toxicityStatus').innerText = '';
      }
      
      // document.querySelectorAll('.css-1dbjc4n.r-14lw9ot.r-11mg6pl.r-sdzlij.r-1phboty.r-14f9gny.r-1gzrgec.r-cnkkqs.r-1udh08x.r-13qz1uu')[0].style.borderColor = ''
      if(document.querySelectorAll('[data-testid="UserProfileHeader_Items"]').length>0){
        currentPage = window.location.href
        var thisPageID = currentPage.replace('https://twitter.com/', '')
        var result = checkTabWithinProfile(thisPageID)
        thisPageID = result[0]
        thisTab = result[1]

        console.log(thisPageID)
        if (thisPageID != userID || thisTab != currentTab){
          userID = thisPageID;
          currentTab = thisTab;
          document.querySelectorAll('[href="/' + thisPageID + '/photo"]')[0].querySelector('div').style.borderColor = ''
          if(thisPageID in profileStrangers){
            var thisScore = profileStrangers[thisPageID]
            changeBioElement(thisPageID, thisScore)
          }else{
            getProfileScore(thisPageID, pollStatusNewTwitter);
        }  
        }
      }
    }
  
  }
}

function createExampleTweetsButton(thisID){
  exampleTweets = document.createElement('div')
  exampleTweets.id = 'exampleTweets'
  exampleTweets.style = 'padding: 2px 6px; text-align: center; border-radius: 8px; background-color: #ca3e3eb0; text-decoration: none; display: inline-block; font-size: 19px; margin-left:10px; cursor: pointer; color:white;'
  exampleTweets.innerText = 'Example toxic tweets'
  if(document.getElementById('toxicityStatus') != null){
    document.getElementById('toxicityStatus').append(exampleTweets)
  }
  $('#exampleTweets').on('mouseover', function(){
    $(this).css('background-color', 'rgba(208, 26, 26, 0.69)')
  })
  $('#exampleTweets').on('mouseout', function(){
    $(this).css('background-color', '#ca3e3eb0')
  })

}
   
function checkNotificationTimeline() {
  // console.log('notification timeline checker')
  if(document.location.href == 'https://twitter.com/home') {
    global_tweetcount = 0
    console.log('timeline')
    sendUsersToPredictTimelineNewTwitter()
  }else if(document.location.href == 'https://twitter.com/notifications' || document.location.href == 'https://twitter.com/notifications/mentions') {
    console.log('notification')
    sendUsersToPredictNotificationNewTwitter()
  }else if(document.location.href =='https://twitter.com/messages'){
  }
}


function getProfileScore(username, callback) {
    // var url = "http://twitter-shield.si.umich.edu/toxicityscore?user=" + username + '&threshold=' + threshold;
    console.log('get_score')
    var url = "http://127.0.0.1:8000/toxicityscore?user=" + username + '&threshold=' + threshold;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if (request.readyState == 4 && request.status == 200){
            console.log('returned: ' + request.responseText)
            callback(request.responseText); // Another callback here
        }
    };
    request.open('GET', url);
    request.send();

}


function getTimelineScores(username, callback, callback_input) {
    // var url = "http://twitter-shield.si.umich.edu/toxicityscore?user=" + username + '&threshold=' + threshold;
    var url = URL_HEADER + "/toxicityscore?user=" + username + '&threshold=' + threshold;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if (request.readyState == 4 && request.status == 200){
            // console.log('returned: ' + request.responseText)
            callback(request.responseText, callback_input); // Another callback here
        }
    };
    request.open('GET', url);
    request.send();

}


function pollStatusNewTwitter(response){
  // console.log('called poll status in new Twitter!')
  console.log(response)
  var response_json = JSON.parse(response);
  //flagged_tweets = response_json.flagged_tweets
  var task_id = response_json['task_id']
  var screen_name = response_json['screen_name']
  var threshold = response_json['threshold']
  var url = URL_HEADER + "/poll_status?task_id=" + task_id + '&screen_name=' + screen_name + '&threshold=' + threshold
  // var url = "http://twitter-shield.si.umich.edu/poll_status?task_id=" + task_id + '&screen_name=' + screen_name + '&threshold=' + threshold
  var request = new XMLHttpRequest();

  request.onreadystatechange = function(){
    if (request.readyState == 4 && request.status == 200){
      result = JSON.parse(request.responseText)
      console.log('poll status')
      // console.log(result)
      if (result['state'] == 'PENDING'){
        // console.log('pending')
        // console.log(request.responseText)
        var status = JSON.parse(request.responseText)['result']
        console.log(status)
        
        visualizeStatusNewTwitter(status)
        
        setTimeout(pollStatusNewTwitter(response), 5000);

      }else if (result['state'] == 'SUCCESS'){
        console.log('success')
        // checkabusiveNewTwitter(request.responseText, screen_name)
        console.log(response)
        console.log(response_json['screen_name'])
        changeBioAfterRequest(request.responseText, response_json['screen_name'])
      }

    }
  };

  request.open('GET', url);
  request.send();
}


function changeBioAfterRequest(response, screen_name){
  var response_json = JSON.parse(response);
  console.log('beginning of changeBio')
  console.log(response_json)
  var prof = document.querySelector(".ProfileAvatar");
  console.log(response_json)
  if(response_json == 'No tweets'){
    var score = -1
    changeBioElement(screen_name, -1)
  }else if('result' in response_json){
    var score = response_json['result']['TOXICITY']['score']
  }
  if(score != null){
    changeBioElement(screen_name, score)
    //store
    storeLocally(screen_name, score)
  }
  
}


function visualizeStatusNewTwitter(status){
  console.log('visualizeStatus function')
  if (document.getElementById("toxicityStatus")==null) {
    console.log('add toxicityStatus')
    toxicityStatusDiv = document.createElement('div');
    toxicityStatusDiv.id = 'toxicityStatus'
    toxicityStatusDiv.setAttribute('style', 'font-size:1.6em; padding:1px;')
    if(document.querySelector('[data-testid="UserDescription"]') != null){
      document.querySelector('[data-testid="UserDescription"]').parentElement.insertBefore(toxicityStatusDiv, document.querySelector('[data-testid="UserDescription"]'))
    }else if(document.querySelector('[data-testid="UserProfileHeader_Items"]') != null){
      document.querySelector('[data-testid="UserProfileHeader_Items"]').parentElement.insertBefore(toxicityStatusDiv, document.querySelector('[data-testid="UserProfileHeader_Items"]'))
    }  
  }
  toxicityStatusDiv = document.getElementById('toxicityStatus')
  
  if (status == 'started'){
    toxicityStatusDiv.innerHTML = ' Started! '
    toxicityStatusDiv.style.color = 'rgba(29,161,242,1.00)';
  }else{
    // statusDiv.innerHTML = status + ' stored'
    toxicityStatusDiv.innerHTML = ' Pending... '
    toxicityStatusDiv.style.color = 'rgba(29,161,242,1.00)';
  }
}

function changeBioElement(thisID, score){
  if (document.getElementById("toxicityStatus") == null) {
    console.log('insert status div')
    toxicityStatusDiv = document.createElement('div');
    toxicityStatusDiv.id = 'toxicityStatus'
    toxicityStatusDiv.setAttribute('style', 'font-size:1.6em; padding:1px;')
    if(document.querySelector('[data-testid="UserDescription"]') != null){
      document.querySelector('[data-testid="UserDescription"]').parentElement.insertBefore(toxicityStatusDiv, document.querySelector('[data-testid="UserDescription"]'))
    }else{
      document.querySelector('[data-testid="UserProfileHeader_Items"]').parentElement.insertBefore(toxicityStatusDiv, document.querySelector('[data-testid="UserProfileHeader_Items"]'))
    }
  }

  toxicityStatusDiv = document.getElementById('toxicityStatus')
  console.log(toxicityStatusDiv)

  if(score > VERY_TOXIC_BOUNDARY){
    toxicityStatusDiv.innerHTML = "Alert! Very toxic user!"
    toxicityStatusDiv.style.color = '#FC427B';
    toxicityStatusDiv.appendChild(frownImage);
    document.querySelectorAll('[href="/' + thisID + '/photo"]')[0].querySelector('div').style.borderColor = '#FC427B';
    createExampleTweetsButton(thisID)
 
  }else if(score > TOXIC_BOUNDARY){
    toxicityStatusDiv.innerHTML = "Alert! Toxic user!"
    toxicityStatusDiv.style.color = '#FC427B';
    toxicityStatusDiv.appendChild(frownImage);
    document.querySelectorAll('[href="/' + thisID + '/photo"]')[0].querySelector('div').style.borderColor = '#FC427B';
    createExampleTweetsButton(thisID)
  }else if(score == -1){
    toxicityStatusDiv.innerHTML = 'This user does not have enough English tweets.'
    toxicityStatusDiv.style.color = 'rgba(29,161,242,1.00)';
    document.querySelectorAll('[href="/' + thisID + '/photo"]')[0].querySelector('div').style.borderColor = '';
    console.log("NO TWEETS BRUTH")
    toxicityStatusDiv.innerHTML = 'This user does not have enough English tweets.'
    toxicityStatusDiv.style.color = 'rgba(29,161,242,1.00)';
    document.querySelectorAll('[href="/' + thisID + '/photo"]')[0].querySelector('div').style.borderColor = '';
  }else if(score < TOXIC_BOUNDARY){
    toxicityStatusDiv.innerHTML = "This user is safe!"
    toxicityStatusDiv.style.color = '#5aca7f';
    toxicityStatusDiv.appendChild(checkImage);
    document.querySelectorAll('[href="/' + thisID + '/photo"]')[0].querySelector('div').style.borderColor = '#5aca7f';
  }
}


function storeLocally(screen_name, score){
  profileStrangers[screen_name] = score
  localStorage.setItem('profileStrangers', JSON.stringify(profileStrangers))
}

function sendUsersToPredictNotificationNewTwitter(){
  // var notificationPage = document.querySelectorAll('.css-1dbjc4n.r-1jgb5lz.r-1ye8kvj.r-6337vo.r-13qz1uu')
  var notificationPage = document.querySelectorAll('[aria-label="Timeline: Notifications"]')
  if (notificationPage.length > 0){
    var notifySections = notificationPage[0].querySelectorAll('.css-1dbjc4n.r-my5ep6.r-qklmqi.r-1adg3ll')
  
    for(var i=0; i<notifySections.length; i++){
      var userCandidates = notifySections[i].querySelectorAll('a')
      for(var j=0; j<userCandidates.length; j++){
        var can = userCandidates[j]
        if(can.querySelectorAll('img').length == 1){
          var canId = userCandidates[j].href.replace("https://twitter.com/", '')
          console.log(canId)
          var divToColor = userCandidates[j].querySelector('.css-1dbjc4n.r-sdzlij.r-1p0dtai.r-1mlwlqe.r-1d2f490.r-1udh08x.r-u8s1d.r-zchlnj.r-ipm5af.r-417010')
          if(divToColor!=null){
            if(canId in profileStrangers){
              console.log('from localstraoge')
              var thisScore = profileStrangers[canId]
              // if(thisScore > threshold){
              if(thisScore > TOXIC_BOUNDARY){
                divToColor.classList.add('toxicUser')
              }else if(thisScore < 0){
                divToColor.classList.add('notEnoughTweets')
              }else if(0 < thisScore && thisScore < TOXIC_BOUNDARY){
                divToColor.classList.add('safeUser')
              }
            }else{
              //signal that we started to compute
              console.log('outside localStorage')
              // divToColor.style.border ='3px solid #42a5fc';
              if(divToColor.classList.contains('toxicUser') || divToColor.classList.contains('safeUser') || divToColor.classList.contains('notEnoughTweets')){
                divToColor.classList.remove('computing')
              }else{
                divToColor.classList.add('computing')
                getTimelineScores(canId, pollInTimeline, userCandidates[j])
              }
              
            }
          }
        }
        
      }
    }
  }
}

function sendUsersToPredictTimelineNewTwitter(){
  var timelinePage = document.querySelectorAll('[aria-label="Timeline: Your Home Timeline"]')
  if (timelinePage.length > 0){
    var timelineSections = timelinePage[0].querySelectorAll('[data-testid="tweet"]')
  
    // console.log(timelineSections)
    for(var i=0; i< timelineSections.length; i++){
      var userCandidate = timelineSections[i].querySelector('a')
      var canId = userCandidate.href.replace("https://twitter.com/", '')
      // console.log(canId)

      //signal that we started to compute
      console.log('change')
      var divToColor = timelineSections[i].querySelector('.css-1dbjc4n.r-sdzlij.r-1p0dtai.r-1mlwlqe.r-1d2f490.r-1udh08x.r-u8s1d.r-zchlnj.r-ipm5af.r-417010')
      if(divToColor!=null){
        // divToColor.style.border ='3px solid #42a5fc';
        if(canId in profileStrangers){
            console.log('from localstraoge')
            var thisScore = profileStrangers[canId]
            // if(thisScore > threshold){
            if(thisScore > TOXIC_BOUNDARY){
              divToColor.classList.add('toxicUser')
            }else if(thisScore < 0){
                divToColor.classList.add('notEnoughTweets')
            }else if(0 < thisScore && thisScore < TOXIC_BOUNDARY){
              divToColor.classList.add('safeUser')

            }
        }else{
          if(divToColor.classList.contains('toxicUser') || divToColor.classList.contains('safeUser') || divToColor.classList.contains('notEnoughTweets')){
            divToColor.classList.remove('computing')
          }else{
            divToColor.classList.add('computing')
            console.log('class added!')
            getTimelineScores(canId, pollInTimeline, userCandidate)
          }
        }
        
      }

      

    }
  }
}




function pollInTimeline(response, domelement){
  // console.log('called poll status in timeline')
  // console.log(domelement)
  var response_json = JSON.parse(response);
  var task_id = response_json['task_id']
  var screen_name = response_json['screen_name']
  var threshold = response_json['threshold']
 
  var url = URL_HEADER + "/poll_status?task_id=" + task_id + '&screen_name=' + screen_name + '&threshold=' + threshold
  // var url = "http://twitter-shield.si.umich.edu/poll_status?task_id=" + task_id + '&screen_name=' + screen_name + '&threshold=' + threshold
  var request = new XMLHttpRequest();

  request.onreadystatechange = function(){
    // if (request.readyState == 4 && request.status == 200){
    if (request.readyState == 4  && request.status == 200){
      result = JSON.parse(request.responseText)
      if (result['state'] == 'PENDING'){
        status = JSON.parse(request.responseText)['result']
        setTimeout(pollInTimeline(response), 5000);
      }else if (result['state'] == 'SUCCESS' && result['result']!='started'){
        console.log('success')
        highlightUser(request.responseText, domelement, response_json['screen_name'])
        // console.log(request.responseText)
      }
    }else{
      // console.log('not yet 4')
      // console.log(request)
    }
  };

  request.open('GET', url);
  request.send();
}


// used in pollInTimeline
function highlightUser(response_json, domelement, screen_name){
  if(domelement!=null){
    response_json = JSON.parse(response_json);
    
    var divToColor = domelement.querySelector('.css-1dbjc4n.r-sdzlij.r-1p0dtai.r-1mlwlqe.r-1d2f490.r-1udh08x.r-u8s1d.r-zchlnj.r-ipm5af.r-417010')
    divToColor.classList.remove('computing')
    if(divToColor!=null){
      if(response_json['result']=='No tweets'){
        divToColor.classList.add('notEnoughTweets')
        var score = -1
      }else{
        console.log(screen_name)
        console.log(response_json)
        // if(response_json['result']['TOXICITY']['score'] > threshold){
        if(response_json['result']['TOXICITY']['score'] > TOXIC_BOUNDARY){ 
          divToColor.classList.add('toxicUser')
          console.log('class added!')
        }else{
          divToColor.classList.add('safeUser')
          console.log('safe classs')
        }
      }
      storeLocally(screen_name, response_json['result']['TOXICITY']['score'])
    }
  }
}


function get_score_notif(userIDNode) {
  // var url =  "http://twitter-shield.si.umich.edu/tpi?user=" + userIDNode.innerText + "&numberTwit=200";
  var url = URL_HEADER + "/tpi?user=" + userIDNode.innerText + "&numberTwit=200";
  ////console.log(url);
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      let stranger_item = JSON.parse(request.responseText);
      ////console.log(stranger_item.yes_no);
      if (stranger_item.yes_no == true) {
        changeNameHeader(userIDNode);
      }
    }
  };
  request.open('GET', url);
  request.send();
}

function changeNameHeader(userIDNode) {
  var warningNotification = document.createElement('span');
  warningNotification.innerText = " WARNING! Potentially Abusive";
  warningNotification.id = "warning";
  userIDNode.appendChild(warningNotification);
}


function checkNotifUserId(document) {
  let container = document.querySelector(".stream");
  let items = container.querySelectorAll(".account-group");
  items.forEach(function(element) {
    let userIDNode = element.querySelector(".account-group .username > b");
    if (!stranger_list.includes(userIDNode.innerText)) {
      stranger_list.push(userIDNode.innerText);
      ////console.log(userIDNode.innerText);
      get_score_notif(userIDNode);
    }
  });
}


function highlightAbusivePostsNewTwitter(response_json) {
  flagged_tweets = response_json['tweets_with_scores']
    
  var alltweets = document.querySelectorAll('[data-testid="tweet"]')
  console.log(alltweets)

  for(i=0;i<alltweets.length;i++){
    var tweet = alltweets[i].querySelector('.css-901oao.r-hkyrab.r-1qd0xha.r-a023e6.r-16dba41.r-ad9z0x.r-bcqeeo.r-bnwqim.r-qvutc0').innerText;
    // tweet = tweet.replace(/(?:https?|www):\/\/[\n\S]+/g, '')
    // tweet = tweet.replace(/\W+/g," ")
    // tweet = tweet.toLowerCase().trim()
    //console.log(flagged_tweets)
    for(j=0;j<flagged_tweets.length;j++){
      // if(document.querySelector(".ProfileAvatar"))
      //   document.querySelector(".ProfileAvatar").style.borderColor = "rgb(252, 66, 123)";
  
      // need to change below to something else. 
      if(flagged_tweets[j]["original_tweet_text"].includes(tweet)){

        alltweets[i].style.backgroundColor = "rgba(252, 66, 123,0.1)"
        if(document.querySelector(".avatar.js-action-profile-avatar"))
          alltweets[i].parentElement.parentElement.firstElementChild.firstElementChild.firstElementChild.style.border = '3px solid rgb(252, 66, 123)';


        // if(document.getElementById('model-tag-'+j)==null){
        //   var model_tags = document.createElement('span')
        //   model_tags.innerHTML = flagged_tweets[j].models_that_agree
        //   model_tags.id = "model-tag-"+j
        //   model_tags.style.color =  "#e0245e"
        //   //////console.log(model_tags)
        //   var parent = alltweets[i].parentElement.parentElement.firstElementChild.children[1]
        //   parent.appendChild(model_tags)
        // }
      }
      else {
        if(flagged_tweets_flag){
          //console.log(alltweets[i].parentElement.parentElement.parentElement)
          alltweets[i].parentElement.parentElement.parentElement.remove()
        }
      }
    }
    flagged_tweets_flag = false
  }

  //  ////console.log(tweet_array)

  // for(j=0;j<flagged_tweets.length;j++){
  //   ////console.log(flagged_tweets[j].tweet)
  //   if(flagged_tweets[j].tweet).includes()){
  //     index = tweet_array.indexOf(flagged_tweets[j].tweet)
  //     // ////console.log(index)
  //     alltweets[index].style.backgroundColor = "rgba(252, 66, 123,0.1)";
  //   }

  //}

}

function ignoreURL(url){
  for(i = 0; i < ignoreURLs.length; i++) {
    if(url.indexOf(ignoreURLs[i]) > 0){
      console.log(ignoreURLs[i])
      return true
    }
  }
  return false
}

function checkTabWithinProfile(thisPageID){
  if(withRepliesRegex.test(thisPageID)){
    thisPageID = thisPageID.replace("/with_replies", "")
    thisTab = 'replies'
    console.log(thisPageID + '-- replies')
  }else if(mediaRegex.test(thisPageID)){
    thisPageID = thisPageID.replace("/media", "")
    thisTab = 'media'
    console.log(thisPageID + '-- media')
  }else if(likesRegex.test(thisPageID)){
    thisPageID = thisPageID.replace("/likes", "")
    thisTab = 'likes'
    console.log(thisPageID + '-- likes')
  }else{
    thisTab = ''
  }
  return [thisPageID, thisTab]
}

function createCssClasses(){
  toxicUserBorderStyle = document.createElement('style');
  toxicUserBorderStyle.type = 'text/css';
  toxicUserBorderStyle.innerHTML = '.toxicUser { border-style: solid; border-color: #FC427B; border-width: 3px; }';
  document.getElementsByTagName('head')[0].appendChild(toxicUserBorderStyle)

  safeUserBorderStyle = document.createElement('style');
  safeUserBorderStyle.type = 'text/css';
  safeUserBorderStyle.innerHTML = '.safeUser { border-style: solid; border-color: #5aca7f; border-width: 3px; }';
  document.getElementsByTagName('head')[0].appendChild(safeUserBorderStyle)

  notEnoughTweetsBorderStyle = document.createElement('style');
  notEnoughTweetsBorderStyle.type = 'text/css';
  notEnoughTweetsBorderStyle.innerHTML = '.notEnoughTweets { }';
  document.getElementsByTagName('head')[0].appendChild(notEnoughTweetsBorderStyle)

  computingBorderStyle = document.createElement('style');
  computingBorderStyle.type = 'text/css';
  computingBorderStyle.innerHTML = '.computing { border-style: solid; border-color: #1d9dfa; border-width: 3px; }';
  document.getElementsByTagName('head')[0].appendChild(computingBorderStyle)

}

function setLocalStorage(){
  profileStrangerString = (profileStrangerString) ? profileStrangerString : '{}'
  profileStrangers = JSON.parse(profileStrangerString)
  console.log(profileStrangers)

}

function appendImages(){
  checkImage = document.createElement('img')
  checkImage.id = 'check'
  checkImage.style = 'width: 17px;'
  checkImage.src = chrome.runtime.getURL('img/checkmark.png')

  frownImage = document.createElement('img')
  frownImage.id = 'frown'
  frownImage.style = 'width: 22px; padding-left: 4px;'
  frownImage.src = chrome.runtime.getURL('img/slightly-frowning.png')
}

function highlightAbusivePosts(response_json) {
  flagged_tweets = response_json['tweets_with_scores']
    
  var alltweets = document.querySelectorAll(".tweet-text");

  for(i=0;i<alltweets.length;i++){
    var tweet = alltweets[i].innerText;
    // tweet = tweet.replace(/(?:https?|www):\/\/[\n\S]+/g, '')
    // tweet = tweet.replace(/\W+/g," ")
    // tweet = tweet.toLowerCase().trim()
    //console.log(flagged_tweets)
    for(j=0;j<flagged_tweets.length;j++){
      // if(document.querySelector(".ProfileAvatar"))
      //   document.querySelector(".ProfileAvatar").style.borderColor = "rgb(252, 66, 123)";
  
      // need to change below to something else. 
      if(flagged_tweets[j]["original_tweet_text"].includes(tweet)){

        alltweets[i].style.backgroundColor = "rgba(252, 66, 123,0.1)"
        if(document.querySelector(".avatar.js-action-profile-avatar"))
          alltweets[i].parentElement.parentElement.firstElementChild.firstElementChild.firstElementChild.style.border = '3px solid rgb(252, 66, 123)';


        // if(document.getElementById('model-tag-'+j)==null){
        //   var model_tags = document.createElement('span')
        //   model_tags.innerHTML = flagged_tweets[j].models_that_agree
        //   model_tags.id = "model-tag-"+j
        //   model_tags.style.color =  "#e0245e"
        //   //////console.log(model_tags)
        //   var parent = alltweets[i].parentElement.parentElement.firstElementChild.children[1]
        //   parent.appendChild(model_tags)
        // }
      }
      else {
        if(flagged_tweets_flag){
          //console.log(alltweets[i].parentElement.parentElement.parentElement)
          alltweets[i].parentElement.parentElement.parentElement.remove()
        }
      }
    }
    flagged_tweets_flag = false
  }

}


function loader(parentElement){
  let childEle = document.createElement("span");
  childEle.className = "lds-ellipsis";
  childEle.innerText = "Hey"
  console.log(childEle);
  parentElement.appendChild(childEle);  
  console.log(parentElement);
  for(i=0;i<4;i++){
    let innerChildEle = document.createElement("div");
    innerChildEle.appendChild(childEle);
  }
}


function addFlagging(){
  if(document.getElementById('flagAccount')==null){
    flagButton = document.createElement('button');
    flagButton.id = 'flagAccount'
    flagButton.setAttribute('style', 'font-size:1em; background-color:#657786; padding:3px; margin-top: 3px; margin-bottom: 3px;')
    document.getElementsByClassName('ProfileHeaderCard')[0].insertBefore(flagButton, document.getElementsByClassName('ProfileHeaderCard-bio u-dir')[0])
    document.getElementById('flagAccount').style.color  = 'white';
    flagButton.innerHTML = ' Provide feedback about the result '
    flagButton.onmouseover = function(){
      this.style.backgroundColor = 'rgba(131, 156, 182, 1)'
    }
    flagButton.onmouseout = function(){
      this.style.backgroundColor = '#657786'
    }
  }

}

function changeAvi() {
  let container = document.getElementsByClassName("ProfileAvatar-container")[0];      //Get parent of Profile Avatar
  let avi = document.getElementsByClassName("ProfileAvatar-image");                   //Get current avatar if you want to modify it at all
  var clone = document.createElement("img");                                          // Create image that will be the overlay
  clone.classList.add("ProfileAvatar-image");
  clone.src = chrome.extension.getURL("bad-mouth.png");
  clone.style.opacity = "0.9";
  container.appendChild(clone);
}


//generic functionality that sends a bunch of tweets for prediction
// function sendPostsToPredict(){

//   var tweets = document.querySelectorAll(".tweet-text");
//   var tweets_text = []
//   console.log('Global tweet count' + global_tweetcount)
//   console.log('Tweet queried length' + tweets.length)

//     if(tweets.length > global_tweetcount){
//       ////console.log(tweets)

//       global_tweetcount = tweets.length;
//       for(i=0;i<tweets.length;i++){
//         // clean URL to form JSON parameters
//         temp = tweets[i].innerText.replace(/(?:https?|www):\/\/[\n\S]+/g, '')
//         temp =  temp.replace(/\W+/g," ")
//         tweets_text.push({"text":temp})
//       }

//       console.log('Preprocessed text length' +tweets_text.length)

//       var url = "http://127.0.0.1:5000/predict?tweets=" + JSON.stringify(tweets_text);

//       //is it not picking up on time? is 3000 too short?
//       var request = new XMLHttpRequest();
//       request.onreadystatechange = function() {
//         if (request.readyState == 4 && request.status == 200) {
//           response_json = JSON.parse(request.responseText);
//           //console.log('Flagged tweets length'+response_json.flagged_tweets.length)
//           flagged_tweets = response_json.flagged_tweets
//           highlightAbusivePosts(response_json.flagged_tweets);
//         }
//       };
//       request.open('GET', url);
//       request.send();
//       }
// }
 

// function visualizeStatus(status){
//   if(document.getElementById('status')==null){
//     statusDiv = document.createElement('span');
//     statusDiv.id = 'status'
//     statusDiv.setAttribute('style', 'font-size:1.2em; background-color:#0084B4; padding:3px; border-radius: 15px;')
//     document.getElementsByClassName('ProfileHeaderCard')[0].insertBefore(statusDiv, document.getElementsByClassName('ProfileHeaderCard-name')[0])
//     document.getElementById('status').style.color  = 'white';
//   }
//   console.log('visualizeStatus function')

//   if(status == 'done'){
//     statusDiv.innerHTML = '<br>';
//     // statusDiv.setAttribute('style', 'padding:0px; margin-bottom: 3px;')
//   }else if (status == 'started'){
//     statusDiv.setAttribute('style', 'font-size:1.2em; background-color:#0084B4; padding:3px; border-radius: 15px;')
//     statusDiv.innerHTML = ' Started! '
//   }else{
//     statusDiv.setAttribute('style', 'font-size:1.2em; background-color:#0084B4; padding:3px; border-radius: 15px;')
//     statusDiv.innerHTML = status + ' stored!'
//   }
// }


// function visualizeTicksOnTimeline(){

  // let beforele = document.getElementsByClassName("ProfileTweet-action ProfileTweet-action--more js-more-ProfileTweet-actions");
  // let childEle = document.createElement("span");
  // childEle.className = "lds-ellipsis";
  // let div1 = document.createElement("div");
  // let div2 = document.createElement("div");
  // let div3 = document.createElement("div");
  // let div4 = document.createElement("div");

  // childEle.appendChild(div1);
  // childEle.appendChild(div2);
  // childEle.appendChild(div3);
  // childEle.appendChild(div4);

  // let parentEle = document.querySelector("div.stream-item-header");

  // parentEle.insertBefore(childEle,beforele[0]);

// }