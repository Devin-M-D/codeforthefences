module.exports = (expressApp, debugging) => {
  expressApp.use(async(req, res, next) => {
    if (res._headerSent == false && res.payload){
      if (req.body.expectMany == true && res.payload.constructor.name != "Array"){
        res.payload = [ res.payload ]
      }
      res.json({ status: res.status, payload: res.payload })
    }
  })
}
