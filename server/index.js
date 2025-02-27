require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const User = require("./models/usermodel");
const {authenticateToken} = require("./utils")

mongoose.connect(config.connectionString);

const app = express();

app.use(express.json());


const corsOptions = {
    origin: ["http://localhost:3000", "https://test-ihub-cloud-database.onrender.com"], // Explicitly allow only your frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    credentials: true, // ✅ Required for authentication tokens
};

app.use(cors(corsOptions));

// Handle preflight requests (OPTIONS)
app.options("*", cors(corsOptions));


  

// Create Account
app.post("/create-account", async (req, res) => {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        return res.status(400)
        .json({ error: true, message: "All fields are required"});
    }

    const isUser = await User.findOne({email});
    if (isUser) {
        return res.status(400)
        .json({error: true, message: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User ({
        name,
        email,
        password: hashedPassword,
    });

    await user.save();

    const accessToken = jwt.sign ({
        userId: user._id},
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "72h",
        }
    );

    return res.status(201).json ({
        error: false,
        user: { name: user.name, email: user.email},
        accessToken,
        message: "Registration Successful",
    })
});

// Login 
app.post("/login", async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ error: true, message: "Name and password are required" });
    }

    const user = await User.findOne({ name });
    if (!user) {
        return res.status(400).json({ error: true, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ error: true, message: "Invalid password" });
    }

    const accessToken = jwt.sign(
        { userId: user._id, name: user.name }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: "72h" }
    );

    return res.json({
        error: false,
        user: { name: user.name , email: user.email},
        accessToken,
        message: "Login Successful",
    });
});

// Get User
app.get("/get-user", authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;

        const user = await User.findById(userId); // Simplified query

        if (!user) {
            return res.status(404).json({ error: true, message: "User not found" });
        }

        return res.status(200).json({
            error: false,
            user,
            message: "User fetched successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});



app.listen(5000);
module.exports = app;