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
  router.post('/crud/users/r/', function (req, res) {
    DI.data.runQuery(DI.data, "SELECT * FROM user").then((data) => {
      res.json(data)
    })
  })
  router.post('/crud/users/c/', async function (req, res) {
    //{"email": email, "username": un, "password": pw }
    var user = req.body
    var newPass = ""
    DI.bcrypt.hash(user.password, 10, function(err, hash) {
      if (err) { console.log(err) }
      else {
        newPass = hash
        DI.data.runCommand(DI.data,
          "INSERT INTO user SET name = :username, password = :password"
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
