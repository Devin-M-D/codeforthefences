const { v4: uuidv4 } = require('uuid');

module.exports = (DI) => {
  DI.router.post('/signup', DI.rh.asyncRoute(async (req, res, next) =>
  {
    var newUser = req.body
    var existingUser = await DI.data.rootQuery(`SELECT FROM user WHERE username = :username`, { username: newUser.username})
    if (existingUser == null || existingUser.length == 0){
      await DI.data.rootCommand(`CREATE USER ${newUser.username} IDENTIFIED BY ${newUser.password} ROLE admin`, {})
        .then((data) => { DI.rh.succeed(res, data) })
    }
    else { DI.rh.fail(res, "Unable to create new user, username is taken.") }
    DI.rh.succeed(res, data)
  }))
  DI.router.post('/login', DI.rh.asyncRoute(async (req, res, next) =>
  {
    let login = req.body
    var dbPool = await DI.data.startPool(login.username, login.password)
    var newSess = { token: uuidv4(), username: login.username, dbPool: dbPool }
    DI.sessions.push(newSess)
    DI.rh.succeed(res, newSess.token)
  }))
  DI.router.post('/logout', DI.rh.asyncRoute(async (req, res, next) =>
  {
    var userSession = DI.utils.findSession(req)
    if (!DI.utils.isDef(userSession)){
      DI.rh.fail(res, "Couldn't locate user session to log out")
    }
    DI.sessions = DI.sessions.map((x) => {
      if (x){
        if (x.token != userSession.token) { return x }
      }
    })
    DI.rh.succeed(res, "User logged out")
  }))
  DI.router.post('/user/testToken', DI.rh.asyncRoute(async (req, res, next) =>
  {
    await DI.rh.succeed(res, "landed on /user/testToken")
  }))
}
