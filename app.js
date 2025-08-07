const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use("/api", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(
  cors({
    origin: "*", // Use "http://localhost:3000"
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
