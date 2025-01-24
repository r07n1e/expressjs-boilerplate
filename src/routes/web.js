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
      // Skip error pages (handled separately)
      if (routePath.includes("errors")) return;

      // Register route to render the view
      router.get(routePath, (req, res) => {
        try {
          const relativePath = path.relative(
            path.join(__dirname, "views"),
            filePath
          );
          const viewPath = relativePath.replace(/\\/g, "/").replace(".ejs", "");
          res.render(viewPath); // Render EJS view
        } catch (error) {
          console.error(`Error rendering view ${filePath}:`, error.message);
          res.status(500).render("errors/500"); // Render a generic error page
        }
      });
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
