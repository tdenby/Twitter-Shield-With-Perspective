var URL_HEADER = 'https://twitter-shield.si.umich.edu'
// var URL_HEADER = 'http://127.0.0.1:8000'

console.log('get following list')

// OAuth.popup('twitter', {cache: true}).then(function(twitter) {
OAuth.popup('twitter').then(function(twitter) {
    console.log(twitter)
    var oauth_token = twitter['oauth_token']
    var oauth_token_secret = twitter['oauth_token_secret']
    localStorage.setItem('oauth_token', oauth_token)
    localStorage.setItem('oauth_token_secret', oauth_token_secret)
    console.log(localStorage)
    var accountName = getFollowingList(oauth_token, oauth_token_secret)
    // do some stuff with result
    
});




function getFollowingList(oauth_token, oauth_token_secret){
  var followingListString = localStorage.followingList
  followingListString = (followingListString) ? followingListString : '{}'
  followingList = JSON.parse(followingListString)
  localStorage.setItem('followingList', JSON.stringify(followingList))

  console.log('following list')
  if(accountName in followingList){
    console.log('already in')
    chrome.storage.local.set({'accountName': accountName}, function(){
      console.log('set!!!!!!!!!!!!!!!!!')
    })
  }else{
    showModal()
    var url = URL_HEADER + "/get_following?oauth_token=" + oauth_token + '&oauth_token_secret=' + oauth_token_secret
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if (request.readyState == 4 && request.status == 200){
            console.log('returned: ' + request.responseText)
            console.log(request.responseText)
            var response_json = JSON.parse(request.responseText);
            //flagged_tweets = response_json.flagged_tweets
            var accountName = response_json['account_name']
            localStorage.setItem('accountName', accountName)
            var thisFollowing = response_json['following']
            followingList[accountName] = thisFollowing
            localStorage.setItem('followingList', JSON.stringify(followingList))
            console.log(followingList)
            document.getElementById('alertModal').style.display='none'
            chrome.storage.local.set({'accountName': accountName}, function(){
              console.log('set!!!!!!!!!!!!!!!!!')
            })
            return response_json['account_name']
        }
    };
    request.open('GET', url);
    request.send();



  }
  
}


function showModal(){
  console.log('show modal')
  if(document.getElementById('alertModal')==null){
    var modal = document.createElement('div');
    modal.id = 'alertModal'
    modal.classList.add('modal')
    console.log(modal)

    var modalContent =  document.createElement('div');
    modalContent.classList.add('modal-content')
    modalContent.style = "border: 1px solid #888; font-size: 20px; position: relative; background-color: white; width: 60%; height: 20%; border-radius: 5px;"

    var closeButton = document.createElement('span');
    closeButton.classList.add('close')
    console.log(closeButton)
    modalContent.append(closeButton)
    modal.append(modalContent)

    modalContent.innerText = 'We are storing the list of accounts that you follow on your browser. \nPlease wait about 10 seconds.\nThis popup will disappear automatically once finished. :)'

    document.getElementsByTagName('body')[0].appendChild(modal)
    modal.style.display='block'


    window.onclick = function(event) {
      
      if(document.getElementById('alertModal')!=null && event.target == document.getElementById('alertModal')){
        console.log(event.target)
        document.getElementById('alertModal').style.display = "none";
      }
    }
  }else{
    document.getElementById('alertModal').style.display='block'
  }


}