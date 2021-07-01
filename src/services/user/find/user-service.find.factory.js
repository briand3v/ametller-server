
module.exports = dependencies => async filterQuery => {
    const { queryUser } = dependencies;

    if (!filterQuery) {
        throw new Error('username filter query invalid');
    }

    const user = await queryUser(filterQuery);
    return user;
}
