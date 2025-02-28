require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

connectDB();

const app = express();
app.use(express.json()); // Make sure to include this
app.use(bodyParser.json()); // Ensure request body is parsed


app.use(cors({
    origin: "*",  // Allow all origins (use a specific domain in production)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
