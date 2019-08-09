var URL_HEADER = 'http://twitter-shield.si.umich.edu'

console.log("On submit")
console.log(accountName);
localStorage.setItem('accountName', accountName)
console.log('get following list')
getFollowingList(accountName)


function getFollowingList(accountName){

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
    var url = URL_HEADER + "/get_following?user=" + accountName;
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