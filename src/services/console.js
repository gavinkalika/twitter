const Ok = (value) => ({ ok: true, value });

function log(message) {
  console.log(message);
  return Ok(undefined);
}

function logError(error) {
  console.error(`Error [${error.type}]: ${error.message}`);
  if (error.code) {
    console.error(`Code: ${error.code}`);
  }
  return Ok(undefined);
}

function displayTweet(tweet) {
  console.log('\n✓ Latest Tweet:');
  console.log('------------------------------');
  console.log(`ID: ${tweet.id}`);
  console.log(`Created: ${tweet.created_at}`);
  console.log(`Text: ${tweet.text}`);
  
  if (tweet.public_metrics) {
    console.log(`Likes: ${tweet.public_metrics.like_count}`);
    console.log(`Retweets: ${tweet.public_metrics.retweet_count}`);
  }
  
  console.log('------------------------------');
  return Ok(undefined);
}

module.exports = {
  log,
  logError,
  displayTweet,
  Ok
};
