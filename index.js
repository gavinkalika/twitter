#!/usr/bin/env node

const { main } = require('./src/program');

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
