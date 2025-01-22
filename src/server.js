require("dotenv").config();
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
// Enable CORS for all routes
app.use(cors());

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views/pages"));
app.use(express.static("/public"));

// Function to load routes dynamically
function loadRoutes(dirPath, basePath = "") {
  fs.readdirSync(dirPath).forEach((file) => {
    const filePath = path.join(dirPath, file);
    const routePath =
      basePath + "/" + file.replace(".js", "").replace("web", ""); // Replace `web.js` with root path.

    if (fs.lstatSync(filePath).isDirectory()) {
      // Recursive call for subdirectories
      loadRoutes(filePath, routePath);
    } else if (file.endsWith(".js")) {
      const route = require(filePath); // Import the route files
      app.use(routePath, route);

      if (routePath == "/") return;
      console.log(`Route: ${routePath}`);
    }
  });
}

// Call the function with your `src/routes` folder
const routesDir = path.join(__dirname, "routes");
loadRoutes(routesDir);

// Middleware to handle 404 errors
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running`);
});
