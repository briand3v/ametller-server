
module.exports = dependencies => async userModel => {
    const { persistUser } = dependencies;

    // check user properties
    if (!userModel.username || userModel.username.length < 2) {
        throw new Error('Invalid user name');
    }

    if (!userModel.password || userModel.password.length < 6) {
        throw new Error('Invalid user password');
    }

    // persist userModel
    await persistUser(userModel);

    return userModel;
}