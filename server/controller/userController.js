const userModel = require('../model/userModel');

const validator = require('validator');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    const jwtKey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ _id }, jwtKey, { expiresIn: '15d' });
}

const registerUser = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        let User = await userModel.findOne({ email });

        if (User) {
            res.status(400).json({ error: 'Ooops... A user with this email address already exist' });
            return;
        }

        if (!name || !email || !password) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }

        if (!validator.isEmail(email)) {
            res.status(400).json({ error: 'Not a valid email address' });
            return;
        }

        if (!validator.isStrongPassword(password)) {
            res.status(400).json({ error: 'Password must contain at least an uppercase, lowercase, and a number' });
            return;
        }

        User = new userModel({ name, email, password });

        const salt = await bcrypt.genSalt(10);
        User.password = await bcrypt.hash(User.password, salt);

        const saveUser = await User.save();

        const token = createToken(User._id);
        res.status(200).json({ _id: User._id, name, email, token });

    } catch(e) {
        console.error(new Error(e));
        res.status(500).json(e);
    }
}

const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;

        let User = await userModel.findOne({ email });

        if (!User) {
            res.status(400).json({ error: 'Invalid email address or password' });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, User.password);

        if (!isValidPassword) {
            res.status(400).json({ error: 'Invalid email address or password' });
            return;
        }

        const token = createToken(User._id);
        res.status(200).json({ _id: User._id, name: User.name, email: User.email, token });
    } catch (e) {
        console.error(new Error(e));
        res.status(500).json(e);
    }
}

const findUser = async(req, res) => {
    try {
        const UserId = req.params.UserId;

        let User = await userModel.findById(UserId);

        res.status(200).json(User);
    } catch (e) {
        console.error(new Error (e));
        res.status(200).json(e);
    }
}

const getUsers = async(req, res) => {
    try {
        let Users = await userModel.find();

        res.status(200).json(Users);
    } catch (e) {
        console.error(new Error (e));
        res.status(500).json(e);
    }
}

module.exports = { registerUser, loginUser, findUser, getUsers }