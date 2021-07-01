
const userRepository = (userModel) => {

    const persist = (user) => { user.save() }
    const update = (user) => {}
    const remove = (user) => {}

    const findByFilter = (filterQuery) => { return userModel.findOne(filterQuery) }

    return {
        persist,
        findByFilter,
        update,
        remove
    }
}

module.exports = userRepository;
