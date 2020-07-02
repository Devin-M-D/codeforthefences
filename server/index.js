module.exports = {
  randomString:
  //#region randomString func
  async (len) => {
    var retVal
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    var now = Date.now().toString()
    if (len > 4) {
      retVal = now.substr(0, 2) + now.substr(now.length - 3, 2)
      len -= 4
    }
    for (x = 0; x < len; x++){
      if (Math.random() > 0.5){
        var idx = Math.floor(Math.random() * Math.floor(26))
        retVal += chars[idx]
      }
      else {
        retVal += Math.floor(Math.random() * 100).toString().substr(0, 1)
      }
    }
    return retVal
  }
  //#endregion
}
