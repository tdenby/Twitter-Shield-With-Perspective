import tweepy #https://github.com/tweepy/tweepy
import csv,json,re

#Twitter API credentials
consumer_key = "ULVFOWWRwPBG31JmCSk3pA9WY"
consumer_secret = "GkpPuajWIi8OwFNHJMnKaAvLBCQcQZdiNnEViM44eqvTvAXkf7"
access_key = "973403711518183425-CNAn0AQYiT074O0XyALXdU2LiJUzGSg"
access_secret = "s986l8COxFydEgyOCSuHrtGRSldyunsKfZh59TRyx1tVd"

#authorize twitter, initialize tweepy
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_key, access_secret)
api = tweepy.API(auth)
alltweets = []	
	
	#make initial request for most recent tweets (200 is the maximum allowed count)
new_tweets = api.user_timeline(screen_name = 'anantmittal',count=200, tweet_mode="extended")

#print(new_tweets)

	#save most recent tweets
# tweets = [[tweet.full_text] for tweet in new_tweets]

for tweet in new_tweets:
	if hasattr(tweet, 'retweeted_status'):
		print(tweet.retweeted_status.full_text)
		print('retweeted status')
		tweet = re.sub(r'(http\S+)', " ",str(tweet.retweeted_status.full_text))
		print(tweet)
		print('\n')
	else:
		print('not retweeted status')
		tweet = re.sub(r'(\W+)|(http\S+)', " ",str(tweet.full_text))
		print(tweet)