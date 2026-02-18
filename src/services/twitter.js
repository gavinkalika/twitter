const { TwitterApi } = require('twitter-api-v2');
const { 
  TwitterError, 
  RateLimitError, 
  AuthError, 
  UserNotFoundError, 
  NoTweetsError 
} = require('../errors');

const Ok = (value) => ({ ok: true, value });
const Err = (error) => ({ ok: false, error });

function createTwitterClient(config) {
  try {
    const client = new TwitterApi(config.bearerToken);
    return Ok(client);
  } catch (error) {
    return Err(new AuthError('Failed to create client: ' + error.message));
  }
}

async function fetchUser(client, username) {
  try {
    const user = await client.v2.userByUsername(username, {
      'user.fields': ['public_metrics', 'created_at'],
    });
    
    if (!user.data) {
      return Err(new UserNotFoundError(username));
    }
    
    return Ok(user.data);
  } catch (error) {
    return Err(mapTwitterError(error));
  }
}

async function fetchLatestTweet(client, userId, username) {
  try {
    const tweets = await client.v2.userTimeline(userId, {
      max_results: 1,
      'tweet.fields': ['created_at', 'public_metrics', 'source'],
      exclude: ['replies', 'retweets'],
    });
    
    if (!tweets.data || !tweets.data.data || tweets.data.data.length === 0) {
      return Err(new NoTweetsError(username));
    }
    
    return Ok(tweets.data.data[0]);
  } catch (error) {
    return Err(mapTwitterError(error));
  }
}

function mapTwitterError(error) {
  if (error.code === 429) {
    return new RateLimitError('Rate limit exceeded. Please wait a few minutes and try again. Twitter API Free tier allows 100 requests per 15 minutes.');
  }
  if (error.code === 401) {
    return new AuthError('Authentication failed. Please check your Bearer Token.');
  }
  return new TwitterError('UNKNOWN', error.message, error.code);
}

module.exports = {
  createTwitterClient,
  fetchUser,
  fetchLatestTweet,
  Ok,
  Err
};
