const { ConfigError } = require('../errors');

const Ok = (value) => ({ ok: true, value });
const Err = (error) => ({ ok: false, error });

function loadConfig() {
  require('dotenv').config();
  
  const token = process.env.TWITTER_BEARER_TOKEN;
  if (!token) {
    return Err(new ConfigError('TWITTER_BEARER_TOKEN not set. Please copy .env.example to .env and add your Bearer Token.'));
  }
  
  return Ok({ bearerToken: token });
}

function getUsername() {
  const username = process.argv[2];
  if (!username) {
    return Err(new ConfigError('Please provide a Twitter username. Usage: npm start <username>'));
  }
  return Ok(username);
}

module.exports = {
  loadConfig,
  getUsername,
  Ok,
  Err
};
