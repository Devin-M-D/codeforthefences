var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/codeforthefences', { useNewUrlParser: true, useUnifiedTopology: true })
module.exports = "Foo"
// async function createConn () {
// }
//
// module.exports = async (DI) => {
//   DI.data = {
//     runQuery: async (query, params = null) => {
//       var conn = await createConn()
//       var db = mongoose.connection
//       db.on('error', console.error.bind(console, 'connection error:'))
//       db.once('open', function() {
//         console.log("mongo connected")
//       })
//
//       // var result = await queryConn(conn, query, params)
//       // await closeConn(conn)
//       // if (result.length == 1){ return result[0] }
//       // return result
//     },
//   }
//   return true;
// }
