cDI.services.vikingChess = {
  startNewGame: async() => {

  },
  getGameState: async () => {
    var callRes = await cDI.remote.remoteCall("/crud/vikingChess/r/", { expectMany: false })
    return callRes.payload
  },
  getCurrentTurn: async (gameId) => {
    var callRes = await cDI.remote.remoteCall("/vikingChess/pollTurn", { gameId })
    return callRes.payload
  },
  submitMove: async (piece, newX, newY) => {
    var callRes = await cDI.remote.remoteCall("/vikingChess/submitMove/", { piece, newX, newY })
    return callRes.payload
  }
}
