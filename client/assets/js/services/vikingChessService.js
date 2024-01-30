cDI.services.vikingChess = {
  startNewGame: async() => {

  },
  getGameState: async () => {
    var callRes = await cDI.remote.remoteCall("/crud/vikingChess/r/", { expectMany: false })
    console.log(callRes)
    return callRes.payload


  }
}
