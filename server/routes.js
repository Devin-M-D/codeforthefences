var path = require('path');
// var nodemailer = require('nodemailer');

module.exports = async (DI) => {
  DI.express.app.use(DI.express.api.static(__dirname + '/../client/'))
  DI.express.app.use(DI.express.api.static(__dirname + '/../client/assets'))
  DI.express.app.use(DI.express.api.static(__dirname + '/../client/components'))
  var router = DI.express.api.Router();

  //#region main route that serves client html
  router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/../client/index.html'));
  });
  //#endregion

  //#region test/playground routes
  router.get('/asyncTest', DI.express.asyncRoute(async (req, res, next) => {
    res.sendFile(path.join(__dirname + '/../'));
  }));
  //#endregion

  //#region account routes
  router.post('/login', async function(req, res) {
    let login = req.body
    var user = await DI.data.runQuery(DI.data, "SELECT * FROM user WHERE username = :username", { username: req.body.username})
    var dbPassword = user.password
    DI.bcrypt.compare(login.password, dbPassword, function(hashErr, result) {
        if (hashErr) { res.send(hashErr); }
        if(result) {
          res.json({message: 'Authenticated!'});
        } else {
          res.json({message: "Username or password is incorrect"});
        }
      });
  });
  //#endregion

  //#region crud routes
    //#region users
    router.post('/crud/users/r/', function (req, res) {
      DI.data.runQuery(DI.data, "SELECT * FROM user").then((data) => {
        res.json(data)
      })
    })
    router.post('/crud/users/c/', async function (req, res) {
      var user = req.body
      var newPass = ""
      DI.bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) { console.log(err) }
        else {
          newPass = hash
          DI.data.runCommand(DI.data,
            "INSERT INTO user SET username = :username, password = :password"
            , {
              username: user.username,
              password: newPass,
            }
          )
          .then((data) => {
            res.json(data)
          })
        }
      })
    })
    //#endregion

    //#region ingredients
    router.get('/asyncTest', DI.express.asyncRoute(async (req, res, next) => {
      res.sendFile(path.join(__dirname + '/../'));
    }));
    //#endregion

  //#endregion

  DI.express.app.use(router)
}
