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
                # Search for the specific tweet in bookmarks
                # for tweet in response.data:
                #     if str(tweet.id) == str(tweet_id):
                #         # Get author information
                #         users = {user.id: user for user in response.includes['users']} if 'users' in response.includes else {}
                #         author = users.get(tweet.author_id)
                        
                #         # Print detailed tweet information
                #         print("\nTweet Details:")
                #         print("-" * 50)
                #         print(f"Tweet ID: {tweet.id}")
                #         print(f"Author: @{author.username if author else 'unknown'}")
                #         print(f"Name: {author.name if author else 'unknown'}")
                #         print(f"Text: {tweet.text}")
                        
                #         if tweet.public_metrics:
                #             print("\nEngagement Metrics:")
                #             print(f"Likes: {tweet.public_metrics['like_count']}")
                #             print(f"Retweets: {tweet.public_metrics['retweet_count']}")
                #             print(f"Replies: {tweet.public_metrics['reply_count']}")
                #             print(f"Quote Tweets: {tweet.public_metrics['quote_count']}")
                        
                #         print(f"\nCreated at: {tweet.created_at}")
                        
                #         # Print URLs if present
                #         if hasattr(tweet, 'entities') and 'urls' in tweet.entities:
                #             print("\nLinks in Tweet:")
                #             for url in tweet.entities['urls']:
                #                 print(f"- {url['expanded_url']}")
                        
                #         return tweet
        
        print(f"Tweet {tweet_id} not found in your bookmarks.")
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
    get_bookmark()

if __name__ == "__main__":
    main() 