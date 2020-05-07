var path = require('path');
// var nodemailer = require('nodemailer');

module.exports = async (DI) => {
  DI.express.app.use(DI.express.api.static(__dirname + '/../client/'))
  DI.express.app.use(DI.express.api.static(__dirname + '/../client/assets'))
  DI.express.app.use(DI.express.api.static(__dirname + '/../client/components'))

  var router = DI.express.api.Router();
  router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/../client/index.html'));
  });
  router.get('/asyncTest', DI.express.asyncRoute(async (req, res, next) => {
    res.sendFile(path.join(__dirname + '/../'));
  }));
  router.post('/login', async function(req, res) {
    let login = req.body
    var user = await DI.data.runQuery(DI.data, "SELECT * FROM user WHERE username = :username", { username: req.body.username})
    console.log(user)
    var dbPassword = user.password
    console.log(dbPassword)
    DI.bcrypt.compare(login.password, dbPassword, function(hashErr, result) {
        if (hashErr) { res.send(hashErr); }
        if(result) {
          res.json({message: 'authenticated!'});
        } else {
          res.json({message: "password incorrect"});
        }
      });
  });

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

  DI.express.app.use(router)
}
