const { log, logError, displayTweet } = require('../../src/services/console');

describe('Console Service', () => {
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('log', () => {
    it('should log message to console', () => {
      const result = log('Test message');
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Test message');
      expect(result.ok).toBe(true);
    });

    it('should return Ok result', () => {
      const result = log('Test');
      
      expect(result.ok).toBe(true);
      expect(result.value).toBeUndefined();
    });
  });

  describe('logError', () => {
    it('should log error type and message', () => {
      const error = {
        type: 'TEST_ERROR',
        message: 'Something went wrong',
        code: 500
      };
      
      logError(error);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error [TEST_ERROR]: Something went wrong');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Code: 500');
    });

    it('should log error without code', () => {
      const error = {
        type: 'CONFIG',
        message: 'Missing token'
      };
      
      logError(error);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error [CONFIG]: Missing token');
      expect(consoleErrorSpy).not.toHaveBeenCalledWith(expect.stringContaining('Code:'));
    });

    it('should return Ok result', () => {
      const result = logError({ type: 'TEST', message: 'test' });
      
      expect(result.ok).toBe(true);
    });
  });

  describe('displayTweet', () => {
    it('should display tweet with all fields', () => {
      const tweet = {
        id: '1234567890',
        created_at: '2024-01-15T10:30:00Z',
        text: 'This is a test tweet',
        public_metrics: {
          like_count: 42,
          retweet_count: 12
        }
      };
      
      displayTweet(tweet);
      
      expect(consoleLogSpy).toHaveBeenCalledWith('\n✓ Latest Tweet:');
      expect(consoleLogSpy).toHaveBeenCalledWith('------------------------------');
      expect(consoleLogSpy).toHaveBeenCalledWith('ID: 1234567890');
      expect(consoleLogSpy).toHaveBeenCalledWith('Created: 2024-01-15T10:30:00Z');
      expect(consoleLogSpy).toHaveBeenCalledWith('Text: This is a test tweet');
      expect(consoleLogSpy).toHaveBeenCalledWith('Likes: 42');
      expect(consoleLogSpy).toHaveBeenCalledWith('Retweets: 12');
      expect(consoleLogSpy).toHaveBeenCalledWith('------------------------------');
    });

    it('should display tweet without metrics', () => {
      const tweet = {
        id: '1234567890',
        created_at: '2024-01-15T10:30:00Z',
        text: 'Simple tweet'
      };
      
      displayTweet(tweet);
      
      expect(consoleLogSpy).toHaveBeenCalledWith('ID: 1234567890');
      expect(consoleLogSpy).not.toHaveBeenCalledWith(expect.stringContaining('Likes:'));
    });

    it('should return Ok result', () => {
      const result = displayTweet({ id: '1', text: 'test' });
      
      expect(result.ok).toBe(true);
    });
  });
});
