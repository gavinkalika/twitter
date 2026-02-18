# Twitter CLI Tool

## Overview
This is a JavaScript Node.js CLI tool that connects to the Twitter API to pull tweets for specific profiles using an **Effect System-inspired architecture** with explicit error handling.

## Technology Stack
- **Language**: JavaScript (Node.js)
- **Runtime**: Node.js 20 LTS (minimum)
- **Type**: CLI Application
- **Architecture**: Effect System Pattern (Lightweight Result Types)
- **Twitter API Client**: twitter-api-v2

## Project Phase
**Current Phase**: Phase 2 - Refactored with Effect System Pattern

## Architecture Pattern

### Effect System with Result Types
We use a lightweight Effect System pattern without external dependencies:

```javascript
// Result Type - explicit success/failure
type Result<T, E> = 
  | { ok: true; value: T }
  | { ok: false; error: E };
```

**Key Benefits:**
- **Zero Dependencies** - Pure JavaScript implementation
- **Explicit Errors** - Every failure path is typed and checked
- **Pure Functions** - Services are testable and composable
- **Clear Flow** - Program logic is traceable in `program.js`

### File Structure
```
src/
├── errors.js              # Error classes (TwitterError, RateLimitError, etc.)
├── services/
│   ├── config.js         # Config effects (env vars, CLI args)
│   ├── twitter.js        # Twitter API effects
│   └── console.js        # Console output effects
└── program.js            # Main program composition
```

## Features
- Connect to Twitter API (Free Tier)
- Pull tweets from specific Twitter profiles
- Handle API throttling and rate limits with explicit error types
- Command-line interface for easy usage
- Fetch single tweets with comprehensive error handling
- **Effect System Pattern** - All side effects are explicit

## API Considerations
- Uses Twitter API Free tier
- Implements rate limiting/throttling error handling
- Handle API quotas appropriately
- Fetches 1 tweet per request (configurable)
- All errors are typed: RateLimitError, AuthError, UserNotFoundError, etc.

## Development Guidelines
- Follow Node.js best practices
- All effects (side effects) are explicit and wrapped in Result types
- Services are pure functions returning Result<T, Error>
- Main program composes effects in `src/program.js`
- Support CLI arguments for profile targeting

## Commands

### Fetch Tweets
```bash
npm start <username>
```

Example:
```bash
npm start elonmusk
```

## Environment Variables

Create a `.env` file in the project root:

```env
TWITTER_BEARER_TOKEN=your_bearer_token_here
```

**Note**: Copy from `.env.example` and fill in your actual credentials from https://developer.twitter.com

## Dependencies

- **twitter-api-v2**: Official Twitter API v2 client with built-in rate limiting
- **dotenv**: For loading environment variables from .env file

## Architecture Details

### Services (Explicit Effects)

**Config Service (`src/services/config.js`)**
- `loadConfig()` - Effect: Reads environment variables
- `getUsername()` - Effect: Reads CLI arguments

**Twitter Service (`src/services/twitter.js`)**
- `createTwitterClient(config)` - Effect: Creates API client
- `fetchUser(client, username)` - Effect: Fetches user data
- `fetchLatestTweet(client, userId, username)` - Effect: Fetches tweets

**Console Service (`src/services/console.js`)**
- `log(message)` - Effect: Console output
- `logError(error)` - Effect: Error output
- `displayTweet(tweet)` - Effect: Formatted tweet display

### Error Types

All errors extend `TwitterError`:
- `RateLimitError` - API rate limit exceeded (429)
- `AuthError` - Authentication failed (401)
- `UserNotFoundError` - User not found (404)
- `ConfigError` - Missing configuration
- `NoTweetsError` - User has no tweets

### Result Pattern

```javascript
// Success
{ ok: true, value: userData }

// Failure
{ ok: false, error: new UserNotFoundError(username) }
```

## Usage Examples

### Fetch a single tweet from a user
```bash
npm start jack
```

### Fetch tweets with error handling
The tool automatically handles:
- Rate limiting (typed RateLimitError)
- Authentication errors (typed AuthError)
- User not found errors (typed UserNotFoundError)
- Network issues
- Missing configuration (typed ConfigError)

### Expected Output
```
Fetching tweets for @jack...
✓ Found user: @jack

✓ Latest Tweet:
------------------------------
ID: 1234567890123456789
Created: 2024-01-15T10:30:00Z
Text: This is the tweet text content...
Likes: 42
Retweets: 12
------------------------------
```

## Testing

Each service function can be tested independently:

```javascript
// Test config service
const result = loadConfig();
assert(result.ok === true);
assert(result.value.bearerToken);

// Test with mock
const mockClient = { /* mock */ };
const result = await fetchUser(mockClient, 'testuser');
```
