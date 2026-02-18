const {
  createTwitterClient,
  fetchUser,
  fetchLatestTweet
} = require('../../src/services/twitter');
const {
  RateLimitError,
  AuthError,
  UserNotFoundError,
  NoTweetsError,
  TwitterError
} = require('../../src/errors');

// Mock twitter-api-v2
jest.mock('twitter-api-v2', () => {
  return {
    TwitterApi: jest.fn()
  };
});

const { TwitterApi } = require('twitter-api-v2');

describe('Twitter Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTwitterClient', () => {
    it('should create client with valid config', () => {
      const mockClient = { v2: {} };
      TwitterApi.mockImplementation(() => mockClient);
      
      const config = { bearerToken: 'test-token' };
      const result = createTwitterClient(config);
      
      expect(result.ok).toBe(true);
      expect(result.value).toBe(mockClient);
      expect(TwitterApi).toHaveBeenCalledWith('test-token');
    });

    it('should return AuthError on creation failure', () => {
      TwitterApi.mockImplementation(() => {
        throw new Error('Invalid token format');
      });
      
      const config = { bearerToken: 'bad-token' };
      const result = createTwitterClient(config);
      
      expect(result.ok).toBe(false);
      expect(result.error).toBeInstanceOf(AuthError);
      expect(result.error.message).toContain('Failed to create client');
    });
  });

  describe('fetchUser', () => {
    it('should return user data on success', async () => {
      const mockClient = {
        v2: {
          userByUsername: jest.fn().mockResolvedValue({
            data: {
              id: '12345',
              username: 'testuser',
              public_metrics: { followers_count: 100 }
            }
          })
        }
      };
      
      const result = await fetchUser(mockClient, 'testuser');
      
      expect(result.ok).toBe(true);
      expect(result.value).toEqual({
        id: '12345',
        username: 'testuser',
        public_metrics: { followers_count: 100 }
      });
      expect(mockClient.v2.userByUsername).toHaveBeenCalledWith('testuser', {
        'user.fields': ['public_metrics', 'created_at']
      });
    });

    it('should return UserNotFoundError when user not found', async () => {
      const mockClient = {
        v2: {
          userByUsername: jest.fn().mockResolvedValue({ data: null })
        }
      };
      
      const result = await fetchUser(mockClient, 'nonexistent');
      
      expect(result.ok).toBe(false);
      expect(result.error).toBeInstanceOf(UserNotFoundError);
      expect(result.error.message).toBe('User @nonexistent not found');
    });

    it('should return RateLimitError on 429', async () => {
      const mockClient = {
        v2: {
          userByUsername: jest.fn().mockRejectedValue({ code: 429, message: 'Too many requests' })
        }
      };
      
      const result = await fetchUser(mockClient, 'testuser');
      
      expect(result.ok).toBe(false);
      expect(result.error).toBeInstanceOf(RateLimitError);
    });

    it('should return AuthError on 401', async () => {
      const mockClient = {
        v2: {
          userByUsername: jest.fn().mockRejectedValue({ code: 401, message: 'Unauthorized' })
        }
      };
      
      const result = await fetchUser(mockClient, 'testuser');
      
      expect(result.ok).toBe(false);
      expect(result.error).toBeInstanceOf(AuthError);
    });

    it('should return TwitterError on unknown error', async () => {
      const mockClient = {
        v2: {
          userByUsername: jest.fn().mockRejectedValue({ message: 'Network error' })
        }
      };
      
      const result = await fetchUser(mockClient, 'testuser');
      
      expect(result.ok).toBe(false);
      expect(result.error).toBeInstanceOf(TwitterError);
      expect(result.error.type).toBe('UNKNOWN');
    });
  });

  describe('fetchLatestTweet', () => {
    it('should return tweet on success', async () => {
      const mockClient = {
        v2: {
          userTimeline: jest.fn().mockResolvedValue({
            data: {
              data: [{
                id: 'tweet123',
                text: 'Hello world',
                created_at: '2024-01-15T10:30:00Z',
                public_metrics: { like_count: 10 }
              }]
            }
          })
        }
      };
      
      const result = await fetchLatestTweet(mockClient, 'user123', 'testuser');
      
      expect(result.ok).toBe(true);
      expect(result.value).toEqual({
        id: 'tweet123',
        text: 'Hello world',
        created_at: '2024-01-15T10:30:00Z',
        public_metrics: { like_count: 10 }
      });
      expect(mockClient.v2.userTimeline).toHaveBeenCalledWith('user123', {
        max_results: 1,
        'tweet.fields': ['created_at', 'public_metrics', 'source'],
        exclude: ['replies', 'retweets']
      });
    });

    it('should return NoTweetsError when no tweets found', async () => {
      const mockClient = {
        v2: {
          userTimeline: jest.fn().mockResolvedValue({
            data: { data: [] }
          })
        }
      };
      
      const result = await fetchLatestTweet(mockClient, 'user123', 'testuser');
      
      expect(result.ok).toBe(false);
      expect(result.error).toBeInstanceOf(NoTweetsError);
      expect(result.error.message).toContain('No tweets found for @testuser');
    });

    it('should return NoTweetsError when data is null', async () => {
      const mockClient = {
        v2: {
          userTimeline: jest.fn().mockResolvedValue({ data: null })
        }
      };
      
      const result = await fetchLatestTweet(mockClient, 'user123', 'testuser');
      
      expect(result.ok).toBe(false);
      expect(result.error).toBeInstanceOf(NoTweetsError);
    });

    it('should return RateLimitError on 429', async () => {
      const mockClient = {
        v2: {
          userTimeline: jest.fn().mockRejectedValue({ code: 429 })
        }
      };
      
      const result = await fetchLatestTweet(mockClient, 'user123', 'testuser');
      
      expect(result.ok).toBe(false);
      expect(result.error).toBeInstanceOf(RateLimitError);
    });
  });
});
