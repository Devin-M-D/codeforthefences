cDI.services.vikingChess = {
  startNewGame: async(opponentName) => {
    var callRes = await cDI.remote.remoteCall("/crud/vikingChess/c/startNewGame", { opponentName })
    return callRes.payload
  },
  getAllUserGames: async () => {
    var callRes = await cDI.remote.remoteCall("/crud/vikingChess/r/allUserGames")
    return callRes.payload
  },
  loadUserGame: async (gameId) => {
    var callRes = await cDI.remote.remoteCall("/crud/vikingChess/r/getSingleUserGame", { gameId }, { expectMany: false })
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
