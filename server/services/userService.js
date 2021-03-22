var user = require("../models/mysql/userModel")

module.exports = {
  getAll: async () => {
    // var user1 = user.create();
    // var foo = await user.save(user1)
    // var located = await user.find('user1')
    // console.log(`users: ${located.length}`, located)
    return "foo"
  },
  createNew: () => {
    return new user({ username: 'user1' })
  }
}
