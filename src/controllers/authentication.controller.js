const passport = require('passport');
const jwt = require('jsonwebtoken');

// model
const UserModel = require('../models/user.model');

// services
const userSaveService = require('../services/user/save');
const userExistService = require('../services/user/find');

const catchAsync = (fn) => {
    return (req, res, next) => {
        return fn(req, res, next).catch(next);
    }
}

const register = catchAsync(async (req, res, next) => {
    const { username, password } = req.body;

    // check if user already exist
    const user = await userExistService({ username });
    if (user) return res.status(400).json({ message: `${username} already exist` });

    // save new user
    const userDto = new UserModel();
    userDto.username = username;
    userDto.password = password;

    const newUser = await userSaveService(userDto);

    res.status(200).json({ user: newUser });
});

const login = catchAsync(async (req, res, next) => {
    passport.authenticate('local', { session: false, failureMessage: 'Missing credentials' }, (error, user) => {
        if (error) return res.status(500).json({ message: 'Something bad happened' });
        if (!user) return res.status(404).json({ message: 'User not found' });
        // token generate
        const payload = {
            sub: user._id,
            iat: Date.now() + parseInt(process.env.JWT_EXPIRATION),
            username: user.username
        };

        const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET, { algorithm: process.env.JWT_ALGORITHM });
        res.status(200).json({ token: token, user: { id: user._id, username: user.username } });
    })(req, res, next);
});

module.exports = {
    register,
    login
};