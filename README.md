# Twitter CLI Tool

A simple Node.js CLI tool to fetch tweets from Twitter profiles using the Twitter API v2.

## Installation

```bash
npm install
```

Create a `.env` file with your Twitter API credentials:

```env
TWITTER_BEARER_TOKEN=your_bearer_token_here
```

Get your Bearer Token from [Twitter Developer Portal](https://developer.twitter.com).

## Usage

Fetch the latest tweet from a user:

```bash
npm start <username>
```

Example:

```bash
npm start elonmusk
```

## Testing

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Architecture

- **Effect System Pattern**: All functions return `Result<T, Error>` types for explicit error handling
- **Pure Functions**: Services are testable and composable
- **Typed Errors**: `RateLimitError`, `AuthError`, `UserNotFoundError`, etc.

## Project Structure

```
src/
├── errors.js              # Error classes
├── program.js             # Main entry point
└── services/
    ├── config.js          # Config management
    ├── console.js         # Console output
    └── twitter.js         # Twitter API client

tests/                     # Unit tests
```

## License

MIT
