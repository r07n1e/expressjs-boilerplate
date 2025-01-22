const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// Function to load view routes dynamically
function loadViewRoutes(dirPath, basePath = "") {
  fs.readdirSync(dirPath).forEach((file) => {
    const filePath = path.join(dirPath, file);
    const routePath =
      basePath + "/" + file.replace(".ejs", "").replace("index", ""); // Replace `index.ejs` with `/`

    if (fs.lstatSync(filePath).isDirectory()) {
      // Recursive call for subdirectories
      loadViewRoutes(filePath, routePath);
    } else if (file.endsWith(".ejs")) {
      // Register route to render the view
      if (routePath.includes("errors")) return;
      router.get(routePath, (req, res) => {
        const relativePath = path.relative(
          path.join(__dirname, "views"),
          filePath
        );
        res.render(relativePath.replace(/\\/g, "/").replace(".ejs", "")); // Render EJS view
      });
      console.log(`Route: ${routePath}`);
    }
  });
}

// Call the function with your `views/pages` folder
const viewDir = path.join(__dirname, "../views/pages");
loadViewRoutes(viewDir);

// Middleware for handling 404
router.use((req, res) => {
  res.status(404).render("errors/404");
});

module.exports = router;
