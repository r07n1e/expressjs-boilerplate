require("dotenv").config();
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const express = require("express");

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS for all routes
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views/pages"));

// Function to load routes dynamically
function loadRoutes(dirPath, basePath = "") {
  fs.readdirSync(dirPath).forEach((file) => {
    const filePath = path.join(dirPath, file);
    const routePath =
      basePath +
      "/" +
      file.replace(".js", "").replace("web", "").replace("index", ""); // Replace `web.js and any index.js` with root path.

    if (fs.lstatSync(filePath).isDirectory()) {
      // Recursive call for subdirectories
      loadRoutes(filePath, routePath);
    } else if (file.endsWith(".js")) {
      try {
        const route = require(filePath); // Import the route files
        app.use(routePath, route);
      } catch (error) {
        console.error(`Error loading route ${filePath}:`, error.message);
      }
    }
  });
}

// Load routes from the `routes` directory
const routesDir = path.join(__dirname, "routes");
loadRoutes(routesDir);

// Function to log all registered routes
function logRoutes() {
  const apiRoutes = [];
  const webRoutes = [];

  // Iterate through the Express app's router stack
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Routes registered directly on the app (e.g., app.get, app.post)
      const methods = Object.keys(middleware.route.methods)
        .map((method) => method.toUpperCase())
        .join(", ");
      const route = {
        method: methods,
        path: middleware.route.path,
      };

      // Categorize as API or web route based on the path
      if (middleware.route.path.startsWith("/api")) {
        apiRoutes.push(route);
      } else {
        webRoutes.push(route);
      }
    } else if (middleware.name === "router" && middleware.handle.stack) {
      // Routes registered on a router (e.g., app.use('/api', router))
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods)
            .map((method) => method.toUpperCase())
            .join(", ");
          const basePath = middleware.regexp.source
            .replace("^", "")
            .replace("\\/?(?=\\/|$)", "")
            .replace(/\\/g, ""); // Clean up the base path
          const route = {
            method: methods,
            path: basePath + handler.route.path,
          };

          // Categorize as API or web route based on the path
          if (basePath.startsWith("/api")) {
            apiRoutes.push(route);
          } else {
            webRoutes.push(route);
          }
        }
      });
    }
  });

  // Log API routes
  console.log("\nAPI Routes:");
  apiRoutes.forEach((route) => {
    console.log(`${route.method} ${route.path}`);
  });

  // Log web routes
  console.log("\nWeb Routes:");
  webRoutes.forEach((route) => {
    console.log(`${route.method} ${route.path}`);
  });
}

// Log all routes after loading them
logRoutes();

// Middleware to handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\nServer is running on port ${PORT}`);
});
