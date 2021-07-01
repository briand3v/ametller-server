const factory = require('./user-service.save.factory');
const userRepository = require('../../../repository/user');

// build the service
const persistUser = async userModel => {
    return userRepository.persist(userModel);
}

const service = factory({ persistUser });

module.exports = service;