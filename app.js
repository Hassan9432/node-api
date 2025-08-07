const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bodyParser = require("body-parser");
const cors = require("cors"); // ✅ Step 1: Import CORS

dotenv.config();
connectDB();

const app = express();

// ✅ Step 2: Use CORS Middleware
app.use(cors()); // Allow all origins by default

app.use(bodyParser.json());

app.use("/api", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use(cors({
  origin: "http://localhost:3000", // 🔒 Replace with your actual frontend URL when deployed
}));
// Allow requests from all origins (or just from React site)
app.use(cors({
  origin: "*", // Use "http://localhost:3000" or deployed React URL for better security
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
