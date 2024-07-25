import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // If user doesn't exist, create a new User instance
        user = new User({ name, email, password });

        // Generate a salt and hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save the user to the database
        await user.save();

        // Prepare payload for JWT token
        const payload = { user: { id: user.id } };

        // Sign the JWT token with expiration time (e.g., 1 hour)
        jwt.sign(payload, 'Reshan522', (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Prepare payload for JWT token
        const payload = { user: { id: user.id } };

        // Sign the JWT token with expiration time (e.g., 1 hour)
        jwt.sign(payload, 'Reshan522', (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
exports.getUser = async (req, res) => {
    try {
        // Fetch user data excluding password
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
