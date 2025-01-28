import tweepy
import os
# from dotenv import load_dotenv

# Load environment variables
# load_dotenv()

# Twitter API credentials for OAuth 2.0
CLIENT_ID = os.getenv('TWITTER_CLIENT_ID')
CLIENT_SECRET = os.getenv('TWITTER_CLIENT_SECRET')
BEARER_TOKEN = os.getenv('TWITTER_BEARER_TOKEN')
ACCESS_TOKEN = os.getenv('ACCESS_TOKEN')

def get_bookmark():
    """Fetch a specific bookmark by tweet ID using Twitter API v2"""
    try:
        # auth = tweepy.OAuth2BearerHandler(BEARER_TOKEN)
        # api = tweepy.API(auth)
        # print(api)
        # Initialize client with Bearer Token (OAuth 2.0)
        client = tweepy.Client(
            BEARER_TOKEN
        )
        # https://www.npmjs.com/package/localtunnel
        # https://dashboard.ngrok.com/get-started/setup/macos
        # Get bookmarks with pagination
        for response in tweepy.Paginator(
            client.get_bookmarks,
            tweet_fields=['created_at', 'author_id', 'public_metrics', 'entities'],
            user_fields=['username', 'name', 'profile_image_url'],
            expansions=['author_id'],
            max_results=100
        ):
            if response.data:
                print(response.data)
         
        
        # print(f"Tweet {tweet_id} not found in your bookmarks.")
        return None
            
    except Exception as e:
        print(f"Error fetching bookmark: {str(e)}")
        return None

def remove_bookmark(tweet_id):
    """Remove a bookmark using Twitter API v2"""
    try:
        client = tweepy.Client(
            bearer_token=BEARER_TOKEN,
            wait_on_rate_limit=True
        )
        client.remove_bookmark(tweet_id)
        print(f"Bookmark removed for tweet ID: {tweet_id}")
    except Exception as e:
        print(f"Error removing bookmark: {str(e)}")

def main():
    # tweet_id = input("Enter the tweet ID to fetch: ")
    # print(f"\nFetching tweet {tweet_id}...")
    # get_bookmark()
    # Return JSON-friendly response
    return {
        'statusCode': 200,
        'body': 'it works'
    }

if __name__ == "__main__":
    main() 