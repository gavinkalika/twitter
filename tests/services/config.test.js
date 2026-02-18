const { loadConfig, getUsername } = require('../../src/services/config');

describe('Config Service', () => {
  const originalEnv = process.env;
  const originalArgv = process.argv;

  beforeEach(() => {
    // Reset modules to re-evaluate dotenv
    jest.resetModules();
    process.env = { ...originalEnv };
    process.argv = [...originalArgv];
  });

  afterAll(() => {
    process.env = originalEnv;
    process.argv = originalArgv;
  });

  describe('loadConfig', () => {
    it('should return error when TWITTER_BEARER_TOKEN is missing', () => {
      delete process.env.TWITTER_BEARER_TOKEN;
      
      const result = loadConfig();
      
      expect(result.ok).toBe(false);
      expect(result.error.type).toBe('CONFIG');
      expect(result.error.message).toContain('TWITTER_BEARER_TOKEN not set');
    });

    it('should return config when TWITTER_BEARER_TOKEN exists', () => {
      process.env.TWITTER_BEARER_TOKEN = 'test-bearer-token-123';
      
      const result = loadConfig();
      
      expect(result.ok).toBe(true);
      expect(result.value).toEqual({
        bearerToken: 'test-bearer-token-123'
      });
    });
  });

  describe('getUsername', () => {
    it('should return error when no username provided', () => {
      process.argv = ['node', 'index.js'];
      
      const result = getUsername();
      
      expect(result.ok).toBe(false);
      expect(result.error.type).toBe('CONFIG');
      expect(result.error.message).toContain('Please provide a Twitter username');
    });

    it('should return username when provided', () => {
      process.argv = ['node', 'index.js', 'elonmusk'];
      
      const result = getUsername();
      
      expect(result.ok).toBe(true);
      expect(result.value).toBe('elonmusk');
    });

    it('should handle usernames with special characters', () => {
      process.argv = ['node', 'index.js', 'user_name-123'];
      
      const result = getUsername();
      
      expect(result.ok).toBe(true);
      expect(result.value).toBe('user_name-123');
    });
  });
});
