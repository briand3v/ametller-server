const factory = require('./user-service.find.factory');
const userRepository = require('../../../repository/user');

const queryUser = async filterQuery => {
    return userRepository.findByFilter(filterQuery);
}

const service = factory({ queryUser });

module.exports = service;