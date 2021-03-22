var mongoose = require("mongoose")
var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  sessionId: String,
  lastLogin: Date
})
var userModel = mongoose.model('user', userSchema)
module.exports = {
  model: userModel,
  create: (name) => {
    return new userModel({
      username: "user1",
      password: "testpass"
    })
  },
  save: (user) => {
    return new Promise((f, r) => {
      user.save(function (err, user1) {
        if (err) r()
        f(`${user1.username} saved`)
      })
    })
  },
  find: (search) => {
    console.log(search)
    var user = userModel.find({"username": search})
    //return userModel.find({"username": /user1/}).exec()
    return user
  }
}
