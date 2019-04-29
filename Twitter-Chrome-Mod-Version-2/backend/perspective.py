from googleapiclient import discovery
from langdetect import detect
import re, sys 

API_KEY='AIzaSyDlpWkkECadgt55aVD0tKIrTcjHpIBk3i8'

# Generates API client object dynamically based on service name and version.
service = discovery.build('commentanalyzer', 'v1alpha1', developerKey=API_KEY)

tweet = 'I made a bet that a Naive Bayes classifier would work as well on humor recognition as a neural net with fine-tuned Bert embeddings. I won 🙃 #voicefirst @diana www.sonalitandon.com'
analyze_request = {
  'comment': { 'text': tweet},
  'requestedAttributes': {'TOXICITY':{'scoreThreshold':'0'}, 'PROFANITY':{'scoreThreshold':'0.5'}
}}

response = service.comments().analyze(body=analyze_request).execute()

print(sys.getsizeof(tweet))

tweet = re.sub(r'(\W+)|(http\S+)', " ",str(tweet))
tweet = tweet.lower().strip()

print(tweet)
print(detect(tweet) == 'en')

import json
print (json.dumps(response['attributeScores']['TOXICITY']['summaryScore']['value'], indent=2))

