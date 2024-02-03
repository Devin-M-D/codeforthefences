cDI.services.vikingChess = {
  startNewGame: async() => {

  },
  getGameState: async () => {
    var callRes = await cDI.remote.remoteCall("/crud/vikingChess/r/", { expectMany: false })
    return callRes.payload
  },
  submitMove: async (piece, newX, newY) => {
    var callRes = await cDI.remote.remoteCall("/vikingChess/submitMove/", { piece, newX, newY })
    return callRes.payload
  }
}
