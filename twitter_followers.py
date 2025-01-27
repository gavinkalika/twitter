import tweepy
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Twitter API credentials
consumer_key = os.getenv('TWITTER_CONSUMER_KEY')
consumer_secret = os.getenv('TWITTER_CONSUMER_SECRET')
access_token = os.getenv('TWITTER_ACCESS_TOKEN')
access_token_secret = os.getenv('TWITTER_ACCESS_TOKEN_SECRET')

def get_followers(username):
    try:
        # Authenticate with Twitter
        auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
        auth.set_access_token(access_token, access_token_secret)
        api = tweepy.API(auth, wait_on_rate_limit=True)

        # Get user's followers
        followers = []
        for follower in tweepy.Cursor(api.get_followers, screen_name=username).items():
            followers.append({
                'username': follower.screen_name,
                'name': follower.name,
                'followers_count': follower.followers_count,
                'location': follower.location,
                'description': follower.description
            })
            print(f"Found follower: @{follower.screen_name} - {follower.name}")

        return followers

    except tweepy.TweepError as e:
        print(f"Error: {str(e)}")
        return None

def main():
    username = input("Enter the Twitter username to check followers: ")
    print(f"\nFetching followers for @{username}...")
    followers = get_followers(username)
    
    if followers:
        print(f"\nTotal followers found: {len(followers)}")
        print("\nFollower Details:")
        for follower in followers:
            print(f"\nUsername: @{follower['username']}")
            print(f"Name: {follower['name']}")
            print(f"Followers: {follower['followers_count']}")
            if follower['location']:
                print(f"Location: {follower['location']}")
            if follower['description']:
                print(f"Bio: {follower['description']}")
            print("-" * 50)

if __name__ == "__main__":
    main() 