var path = require('path');
module.exports = (DI) => {
  DI.express.app.use(DI.express.api.static(__dirname + '/../client/'))
  DI.express.app.use(DI.express.api.static(__dirname + '/../client/assets'))
  DI.express.app.use(DI.express.api.static(__dirname + '/../client/components'))
  //DI.express.app.use(DI.express.api.static(__dirname + '/client'));

  var router = DI.express.api.Router();
  router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/../client/index.html'));
    //res.json({ message: 'root route!' })
  });
  router.post('/crud/users/r/', function (req, res) {
    DI.data.runQuery(DI.data, "SELECT * FROM user").then((data) => {
      res.json(data)
    })
  })
  router.post('/crud/users/c/', async function (req, res) {
    var newPass = ""
    DI.bcrypt.hash(req.body.user.password, 10, function(err, hash) {
      if (err) { console.log(err) }
      else {
        newPass = hash
        let params = {
          name: req.body.user.name,
          password: newPass,
        }
        DI.data.runCommand(DI.data,
          "INSERT INTO user SET name = :name, password = :password", params
        )
        .then((data) => {
          res.json(data)
        })
      }
    })
  })
  DI.express.app.use(router)
}
