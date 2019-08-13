var URL_HEADER = 'http://127.0.0.1:8000'

console.log("On submit")
console.log(accountName);
localStorage.setItem('accountName', accountName)
console.log('get following list')


console.log('oauth done')
// OAuth.popup('twitter', {cache: true}).then(function(twitter) {
OAuth.popup('twitter').then(function(twitter) {
    console.log(twitter)
    var oauth_token = twitter['oauth_token']
    var oauth_token_secret = twitter['oauth_token_secret']
    localStorage.setItem('oauth_token', oauth_token)
    localStorage.setItem('oauth_token_secret', oauth_token_secret)
    getFollowingList(accountName, oauth_token, oauth_token_secret)
    // do some stuff with result
    twitter.me().then(data => {
      console.log('data:', data);
      
    });

    twitter.get('/1.1/account/verify_credentials.json?include_email=true').then(data => {
      // console.log('self data:', data);
    }) 

});



function getFollowingList(accountName, oauth_token, oauth_token_secret){

  var followingListString = localStorage.followingList
  followingListString = (followingListString) ? followingListString : '{}'
  followingList = JSON.parse(followingListString)
  localStorage.setItem('followingList', JSON.stringify(followingList))

  console.log('following list')
  console.log(followingList)
  console.log(accountName)
  if(accountName in followingList){
    console.log('already in')
  }else{
    var url = URL_HEADER + "/get_following?user=" + accountName + '&oauth_token=' + oauth_token + '&oauth_token_secret=' + oauth_token_secret
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if (request.readyState == 4 && request.status == 200){
            // console.log('returned: ' + request.responseText)
            var response_json = JSON.parse(request.responseText);
            //flagged_tweets = response_json.flagged_tweets
            var thisFollowing = response_json['following']
            followingList[accountName] = thisFollowing
            localStorage.setItem('followingList', JSON.stringify(followingList))
            console.log(followingList)

        }
    };
    request.open('GET', url);
    request.send();

  }
  
}