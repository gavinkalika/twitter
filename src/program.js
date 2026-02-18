const { loadConfig, getUsername } = require('./services/config');
const { createTwitterClient, fetchUser, fetchLatestTweet } = require('./services/twitter');
const { log, logError, displayTweet } = require('./services/console');

async function main() {
  // Step 1: Load config
  const configResult = loadConfig();
  if (!configResult.ok) {
    await logError(configResult.error);
    process.exit(1);
  }
  
  // Step 2: Get username
  const usernameResult = getUsername();
  if (!usernameResult.ok) {
    await logError(usernameResult.error);
    process.exit(1);
  }
  const username = usernameResult.value;
  
  // Step 3: Create client
  const clientResult = createTwitterClient(configResult.value);
  if (!clientResult.ok) {
    await logError(clientResult.error);
    process.exit(1);
  }
  const client = clientResult.value;
  
  // Step 4: Log start
  await log(`Fetching tweets for @${username}...`);
  
  // Step 5: Fetch user
  const userResult = await fetchUser(client, username);
  if (!userResult.ok) {
    await logError(userResult.error);
    process.exit(1);
  }
  const user = userResult.value;
  
  await log(`✓ Found user: @${user.username}`);
  
  // Step 6: Fetch tweet
  const tweetResult = await fetchLatestTweet(client, user.id, username);
  if (!tweetResult.ok) {
    if (tweetResult.error.type === 'NO_TWEETS') {
      await log(`No tweets found for @${username}.`);
      process.exit(0);
    }
    await logError(tweetResult.error);
    process.exit(1);
  }
  const tweet = tweetResult.value;
  
  // Step 7: Display
  await displayTweet(tweet);
  
  process.exit(0);
}

module.exports = { main };
