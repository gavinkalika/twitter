import tweepy
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Twitter API credentials
CONSUMER_KEY = os.getenv('TWITTER_CONSUMER_KEY')
CONSUMER_SECRET = os.getenv('TWITTER_CONSUMER_SECRET')
ACCESS_TOKEN = os.getenv('TWITTER_ACCESS_TOKEN')
ACCESS_TOKEN_SECRET = os.getenv('TWITTER_ACCESS_TOKEN_SECRET')

def authenticate_twitter():
    """Authenticate with Twitter API"""
    auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
    auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
    return tweepy.API(auth)

def get_bookmarks(api):
    """Fetch user's bookmarks"""
    try:
        # Note: As of 2024, bookmarks require Twitter API v2
        client = tweepy.Client(
            consumer_key=CONSUMER_KEY,
            consumer_secret=CONSUMER_SECRET,
            access_token=ACCESS_TOKEN,
            access_token_secret=ACCESS_TOKEN_SECRET
        )
        
        # Get bookmarks
        bookmarks = client.get_bookmarks()
        
        for tweet in bookmarks.data:
            print(f"Tweet ID: {tweet.id}")
            print(f"Text: {tweet.text}")
            print("-" * 50)
            
    except Exception as e:
        print(f"Error fetching bookmarks: {str(e)}")

def main():
    api = authenticate_twitter()
    get_bookmarks(api)

if __name__ == "__main__":
    main() 