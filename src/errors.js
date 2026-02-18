class TwitterError {
  constructor(type, message, code = null) {
    this.type = type;
    this.message = message;
    this.code = code;
  }
}

class RateLimitError extends TwitterError {
  constructor(message) {
    super('RATE_LIMIT', message, 429);
  }
}

class AuthError extends TwitterError {
  constructor(message) {
    super('AUTH', message, 401);
  }
}

class UserNotFoundError extends TwitterError {
  constructor(username) {
    super('USER_NOT_FOUND', `User @${username} not found`, 404);
  }
}

class ConfigError extends TwitterError {
  constructor(message) {
    super('CONFIG', message);
  }
}

class NoTweetsError extends TwitterError {
  constructor(username) {
    super('NO_TWEETS', `No tweets found for @${username}`);
  }
}

module.exports = {
  TwitterError,
  RateLimitError,
  AuthError,
  UserNotFoundError,
  ConfigError,
  NoTweetsError
};
