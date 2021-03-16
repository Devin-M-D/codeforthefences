const { v4: uuidv4 } = require('uuid');

module.exports = (DI) => {
  DI.router.post('/signup', DI.rh.asyncRoute(async (req, res, next) =>
  {
    var newUser = req.body
    var existingUser = await DI.data.runQuery(`SELECT * FROM user WHERE username = ?`, [ newUser.username ])
    if (existingUser.length == 0){
      var createdUser = await DI.data.runQuery(
        `INSERT INTO user (username, password, sessionId) VALUES (?, ?, ?)`,
        [ newUser.username, newUser.password, req.cookies['connect.sid'] ]
      )
      if (createdUser.insertId){
        createdUser = await DI.data.runQuery(`SELECT * FROM user WHERE id = ?`, [ createdUser.insertId ])
        DI.rh.succeed(res, createdUser)
      }
    }
    else { DI.rh.fail(res, "Unable to create new user, username is taken.") }
    DI.rh.fail(res, "Unable to create user, reason unknown.")
  }))
  DI.router.post('/login', DI.rh.asyncRoute(async (req, res, next) =>
  {
    let login = req.body
    var user = await DI.data.runQuery(`SELECT * FROM user WHERE username = ? AND password = ?`, [ login.username, login.password ])
    console.log(user)
    if (user.id) {
      await DI.data.runQuery(`UPDATE user SET sessionId = ? WHERE id = ?`, [ req.cookies['connect.sid'], user.id ])
      DI.rh.succeed(res, req.cookies['connect.sid'])
    }
    else {
      DI.rh.fail(res, "Incorrect username or password")
    }
  }))
  DI.router.post('/logout', DI.rh.asyncRoute(async (req, res, next) =>
  {
    // var userSession = DI.utils.findSession(req)
    // if (!DI.utils.isDef(userSession)){
    //   DI.rh.fail(res, "Couldn't locate user session to log out")
    // }
    // DI.sessions = DI.sessions.map((x) => {
    //   if (x){
    //     if (x.token != userSession.token) { return x }
    //   }
    // })
    DI.rh.succeed(res, "User logged out")
  }))
  DI.router.post('/user/testToken', DI.rh.asyncRoute(async (req, res, next) =>
  {
    await DI.rh.succeed(res, "landed on /user/testToken")
  }))
}
