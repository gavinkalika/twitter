const {
  TwitterError,
  RateLimitError,
  AuthError,
  UserNotFoundError,
  ConfigError,
  NoTweetsError
} = require('../src/errors');

describe('Error Classes', () => {
  describe('TwitterError (base class)', () => {
    it('should create error with type, message, and code', () => {
      const error = new TwitterError('TEST', 'Test message', 500);
      
      expect(error.type).toBe('TEST');
      expect(error.message).toBe('Test message');
      expect(error.code).toBe(500);
    });

    it('should create error without code', () => {
      const error = new TwitterError('TEST', 'Test message');
      
      expect(error.type).toBe('TEST');
      expect(error.message).toBe('Test message');
      expect(error.code).toBeNull();
    });
  });

  describe('RateLimitError', () => {
    it('should create error with correct properties', () => {
      const error = new RateLimitError('Rate limit exceeded');
      
      expect(error.type).toBe('RATE_LIMIT');
      expect(error.message).toBe('Rate limit exceeded');
      expect(error.code).toBe(429);
    });

    it('should be instance of TwitterError', () => {
      const error = new RateLimitError('test');
      expect(error).toBeInstanceOf(TwitterError);
    });
  });

  describe('AuthError', () => {
    it('should create error with correct properties', () => {
      const error = new AuthError('Auth failed');
      
      expect(error.type).toBe('AUTH');
      expect(error.message).toBe('Auth failed');
      expect(error.code).toBe(401);
    });

    it('should be instance of TwitterError', () => {
      const error = new AuthError('test');
      expect(error).toBeInstanceOf(TwitterError);
    });
  });

  describe('UserNotFoundError', () => {
    it('should create error with username in message', () => {
      const error = new UserNotFoundError('testuser');
      
      expect(error.type).toBe('USER_NOT_FOUND');
      expect(error.message).toBe('User @testuser not found');
      expect(error.code).toBe(404);
    });

    it('should be instance of TwitterError', () => {
      const error = new UserNotFoundError('test');
      expect(error).toBeInstanceOf(TwitterError);
    });
  });

  describe('ConfigError', () => {
    it('should create error with correct properties', () => {
      const error = new ConfigError('Missing config');
      
      expect(error.type).toBe('CONFIG');
      expect(error.message).toBe('Missing config');
      expect(error.code).toBeNull();
    });

    it('should be instance of TwitterError', () => {
      const error = new ConfigError('test');
      expect(error).toBeInstanceOf(TwitterError);
    });
  });

  describe('NoTweetsError', () => {
    it('should create error with username in message', () => {
      const error = new NoTweetsError('testuser');
      
      expect(error.type).toBe('NO_TWEETS');
      expect(error.message).toBe('No tweets found for @testuser');
      expect(error.code).toBeNull();
    });

    it('should be instance of TwitterError', () => {
      const error = new NoTweetsError('test');
      expect(error).toBeInstanceOf(TwitterError);
    });
  });
});
