var express = require('express');

module.exports = (DI) => {
  var router = express.Router();
  router.get('/', function(req, res) {
    res.json({ message: 'root route!' })
  });
  router.post('/users', function (req, res) {
    res.json({ message: 'list of users' })
    DI.data.dbConn.connect()
    DI.data.dbConn.close()
  })
  router.post('/crud/users/c/', function (req, res) {
    DI.data.connect(DI.data)
    console.log(req.body)
    DI.data.dbConn.class.get('user').then(userClass => {
      console.log(userClass)
      var newPass = ""
      // DI.bcrypt.hash(req.body.user.password, 10, function(err, hash) {
      //   if (err) { console.log(err); }
      //   else { newPass = hash }
      // });

      userClass.create({
        name: req.body.user.name,
        password: newPass
      }).then(newUser => {
        console.log('Created Record: ', newUser.name);
        DI.data.dbConn.close()
      });
    });
    res.json({ message: 'user created' })
  })
  DI.express.app.use(router)
}
