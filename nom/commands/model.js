// nom/migration.js
const fs = require("fs");
const path = require("path");

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function run() {
  // Get the table name from the command-line arguments
  const tableName = process.argv[3];

  if (!tableName) {
    console.error("Error: Table name is required.");
    console.log("Usage: nom migration <tablename>");
    process.exit(1);
  }

  // Capitalize the table name
  const capitalizedTableName = capitalize(tableName);

  // Define the file path
  const modelsDir = path.join(__dirname, "../../src/models");
  const filePath = path.join(modelsDir, `${capitalizedTableName}.js`);

  // Define the file content
  const content = `const { db } = require("../config/db");
const Types = require("sequelize").DataTypes;

const ${capitalizedTableName} = db.define("${tableName}", {
});

module.exports = ${capitalizedTableName};
`;

  // Create the models directory if it doesn't exist
  if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
  }

  // Write the file
  fs.writeFileSync(filePath, content);
  console.log(`Created model: src/models/${capitalizedTableName}.js`);
}

module.exports = run;
