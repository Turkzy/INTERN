const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");

exports.createAccount = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: true, message: "All fields are required" });
        }

        const isUser = await User.findOne({ email });
        if (isUser) {
            return res.status(400).json({ error: true, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "72h" });

        return res.status(201).json({
            error: false,
            user: { name: user.name, email: user.email },
            accessToken,
            message: "Registration Successful",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

exports.login = async (req, res) => {
    try {
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

        const accessToken = jwt.sign({ userId: user._id, name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "72h" });

        return res.json({
            error: false,
            user: { name: user.name },
            accessToken,
            message: "Login Successful",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};


exports.getUser = async (req, res) => {
    try {
        const { userId } = req.user;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: true, message: "User not found" });
        }

        return res.status(200).json({ error: false, user, message: "User fetched successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};
