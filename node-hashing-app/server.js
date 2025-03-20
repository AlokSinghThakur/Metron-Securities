const express = require("express");
const connectDB = require("./db"); // Import database connection
const hashRoute = require("./routes/hashRoute"); // Import hashing API
require("dotenv").config(); // Load environment variables
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use the hashing route
app.use("/hash", hashRoute);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
