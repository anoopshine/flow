const User = require("../models/User");

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(201).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}