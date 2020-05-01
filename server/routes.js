module.exports = (DI) => {
  var router = DI.express.api.Router();
  router.get('/', function(req, res) {
    res.json({ message: 'root route!' })
  });
  router.post('/users', function (req, res) {
    res.json({ message: 'list of users' })
    DI.data.dbConn.connect()
    DI.data.dbConn.close()
  })
  router.post('/crud/users/c/', function (req, res) {
    console.log(DI.data)
    console.log(DI.data.runQuery)

    DI.data.runQuery(DI.data, "SELECT * FROM user").then((data) => {
    console.log(data)
    })

    // DI.data.connect(DI.data)
    // console.log(req.body)
    // DI.data.dbConn.class.get('user').then(userClass => {
    //   console.log(userClass)
    //
    //   userClass.list()
    //  .then(
    //     function(user){
    //        console.log('Records Found: ' + user.length());
    //     }
    //  );
    //   var newPass = ""
    //   // DI.bcrypt.hash(req.body.user.password, 10, function(err, hash) {
    //   //   if (err) { console.log(err); }
    //   //   else { newPass = hash }
    //   // });
    //   var foo = {
    //     name: req.body.user.name,
    //     password: newPass
    //   }
    //   console.log(foo)
    //   userClass.create(foo).then(newUser => {
    //     console.log('Created Record: ', newUser.name);
    //     DI.data.dbConn.close()
    //   });
    // });
    res.json({ message: 'user created' })
  })
  DI.express.app.use(router)
}
