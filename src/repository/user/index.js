const userModel = require('../../models/user.model');
const userRepository = require('./user.repository');

const repository = userRepository(userModel);

module.exports = repository;