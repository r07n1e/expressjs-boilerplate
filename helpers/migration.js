const fs = require("fs");
const path = require("path");

const modelsDir = __dirname + "../../src/models";
const files = fs
  .readdirSync(modelsDir)
  .filter((file) => file !== "index.js" && file.endsWith(".js"));

const exportLines = files
  .map((file) => {
    const modelName = path.basename(file, ".js");
    return `const ${modelName} = require('./${modelName}');`;
  })
  .join("\n");

const exportContent = `${exportLines}\n\nmodule.exports = { ${files
  .map((file) => path.basename(file, ".js"))
  .join(", ")} };`;

fs.writeFileSync(path.join(modelsDir, "index.js"), exportContent);

console.log("index.js file generated successfully!");
