#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

// Get command-line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: nom <command>");
  process.exit(1);
}

const [command, ...options] = args;

// Path to the nom folder
const commandsDir = path.join(__dirname, "nom/commands");

// Check if the command file exists
const commandFile = path.join(commandsDir, `${command}.js`);

if (fs.existsSync(commandFile)) {
  // Load and run the command
  const commandFunction = require(commandFile);
  commandFunction();
} else {
  console.log(`Unknown command: ${command}`);
  process.exit(1);
}
