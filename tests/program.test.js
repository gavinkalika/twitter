const { main } = require('../src/program');
const { loadConfig, getUsername } = require('../src/services/config');
const { createTwitterClient, fetchUser, fetchLatestTweet } = require('../src/services/twitter');
const { log, logError, displayTweet } = require('../src/services/console');
const { ConfigError, UserNotFoundError, NoTweetsError } = require('../src/errors');

jest.mock('../src/services/config');
jest.mock('../src/services/twitter');
jest.mock('../src/services/console');

describe('Program', () => {
  let originalExit;

  beforeEach(() => {
    originalExit = process.exit;
    process.exit = jest.fn((code) => {
      throw new Error(`Process exited with code ${code}`);
    });
    
    // Set up default mock implementations before each test
    log.mockReturnValue({ ok: true });
    logError.mockReturnValue({ ok: true });
    displayTweet.mockReturnValue({ ok: true });
  });

  afterEach(() => {
    process.exit = originalExit;
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.exit = originalExit;
  });

  it('should complete successfully with full flow', async () => {
    loadConfig.mockReturnValue({ ok: true, value: { bearerToken: 'token' } });
    getUsername.mockReturnValue({ ok: true, value: 'testuser' });
    createTwitterClient.mockReturnValue({ ok: true, value: { v2: {} } });
    fetchUser.mockResolvedValue({ 
      ok: true, 
      value: { id: '123', username: 'testuser' } 
    });
    fetchLatestTweet.mockResolvedValue({
      ok: true,
      value: { id: 'tweet1', text: 'Hello', created_at: '2024-01-01' }
    });

    await expect(main()).rejects.toThrow('Process exited with code 0');

    expect(log).toHaveBeenCalledWith('Fetching tweets for @testuser...');
    expect(log).toHaveBeenCalledWith('✓ Found user: @testuser');
    expect(displayTweet).toHaveBeenCalled();
  });

  it('should exit with error when config fails', async () => {
    loadConfig.mockReturnValue({ 
      ok: false, 
      error: new ConfigError('Missing token') 
    });
    getUsername.mockReturnValue({ ok: false, error: new ConfigError('skip') });
    createTwitterClient.mockReturnValue({ ok: true, value: {} });
    fetchUser.mockResolvedValue({ ok: true, value: {} });
    fetchLatestTweet.mockResolvedValue({ ok: true, value: {} });

    await expect(main()).rejects.toThrow('Process exited with code 1');
    expect(logError).toHaveBeenCalledWith(expect.any(ConfigError));
  });

  it('should exit with error when username not provided', async () => {
    loadConfig.mockReturnValue({ ok: true, value: { bearerToken: 'token' } });
    getUsername.mockReturnValue({
      ok: false,
      error: new ConfigError('No username')
    });
    createTwitterClient.mockReturnValue({ ok: true, value: {} });
    fetchUser.mockResolvedValue({ ok: true, value: {} });
    fetchLatestTweet.mockResolvedValue({ ok: true, value: {} });

    await expect(main()).rejects.toThrow('Process exited with code 1');
    expect(logError).toHaveBeenCalledWith(expect.any(ConfigError));
  });

  it('should exit with error when client creation fails', async () => {
    loadConfig.mockReturnValue({ ok: true, value: { bearerToken: 'token' } });
    getUsername.mockReturnValue({ ok: true, value: 'testuser' });
    createTwitterClient.mockReturnValue({
      ok: false,
      error: new ConfigError('Invalid token')
    });
    fetchUser.mockResolvedValue({ ok: true, value: { id: '123', username: 'test' } });
    fetchLatestTweet.mockResolvedValue({ ok: true, value: {} });

    await expect(main()).rejects.toThrow('Process exited with code 1');
    expect(logError).toHaveBeenCalledWith(expect.any(ConfigError));
  });

  it('should exit with error when user not found', async () => {
    loadConfig.mockReturnValue({ ok: true, value: { bearerToken: 'token' } });
    getUsername.mockReturnValue({ ok: true, value: 'testuser' });
    createTwitterClient.mockReturnValue({ ok: true, value: {} });
    fetchUser.mockResolvedValue({
      ok: false,
      error: new UserNotFoundError('testuser')
    });
    fetchLatestTweet.mockResolvedValue({ ok: true, value: {} });

    await expect(main()).rejects.toThrow('Process exited with code 1');

    expect(fetchUser).toHaveBeenCalled();
    expect(logError).toHaveBeenCalledWith(expect.any(UserNotFoundError));
  });

  it('should exit gracefully when no tweets found', async () => {
    loadConfig.mockReturnValue({ ok: true, value: { bearerToken: 'token' } });
    getUsername.mockReturnValue({ ok: true, value: 'testuser' });
    createTwitterClient.mockReturnValue({ ok: true, value: {} });
    fetchUser.mockResolvedValue({
      ok: true,
      value: { id: '123', username: 'testuser' }
    });
    fetchLatestTweet.mockResolvedValue({
      ok: false,
      error: new NoTweetsError('testuser')
    });

    await expect(main()).rejects.toThrow('Process exited with code 0');

    expect(log).toHaveBeenCalledWith('No tweets found for @testuser.');
  });

  it('should exit with error on other tweet fetch failures', async () => {
    loadConfig.mockReturnValue({ ok: true, value: { bearerToken: 'token' } });
    getUsername.mockReturnValue({ ok: true, value: 'testuser' });
    createTwitterClient.mockReturnValue({ ok: true, value: {} });
    fetchUser.mockResolvedValue({
      ok: true,
      value: { id: '123', username: 'testuser' }
    });
    fetchLatestTweet.mockResolvedValue({
      ok: false,
      error: new ConfigError('API error')
    });

    await expect(main()).rejects.toThrow('Process exited with code 1');

    expect(logError).toHaveBeenCalled();
  });
});
