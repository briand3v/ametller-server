const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: 'String',
        required: true
    },
    password: {
        type: 'String',
        required: true
    }
}, { timestamps: true });

userSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, 10).then(hashedPassword => {
        user.password = hashedPassword;
        next();
    })
});

userSchema.methods.comparePassword = function (password, next) {
    const user = this;
    bcrypt.compare(password, user.password, (error, isMatch) => {
        if (error) return next();
        next(null, isMatch);
    })
};


module.exports = mongoose.model('user', userSchema);