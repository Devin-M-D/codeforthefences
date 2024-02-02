cDI.components.vikingChess = {
  html: `<span id="vikingChess" class="cols nowrap">
    <span class="scoreboard"></span>
    <span class="gameboard"></span>
  </span>`,
  gamestate: null,
  container: null,
  init: async () => {
    await ftbLoadComponent("components/genericWidgets", "grid")
    await cDI.remote.asyncGetScript(`js/services/vikingChessService.js`)
    var gamedata = await ftbSvc["vikingChess"].getGameState()
    var gamestate = JSON.parse(gamedata.gamestate)
    ftbCmp("vikingChess").gamestate = gamestate
  },
  drawGame: async (container) => {
    container.append(ftbCmp("vikingChess").html)
    var gridDI = ftbCmp("grid")
    await gridDI.drawGrid($("#vikingChess .gameboard"), 11, 11)
    await ftbCmp("vikingChess").loadGameState()
    ftbCmp("vikingChess").container = container
  },
  loadGameState: async () => {
    var gamestate = ftbCmp("vikingChess").gamestate
    var x = gamestate.w1.split(",")[0]
    var y = gamestate.w1.split(",")[1]
    var cell = $("#vikingChess .gameboard").find(`[data-gridx='${x}'][data-gridy='${y}']`)
    cell.addClass("kingPiece")
    cell.data("piece", "w1")
    cDI.addAwaitableInput("click", cell, async () => { await ftbCmp("vikingChess").activatePiece(cell) })
  },
  activatePiece: async (currSpace) => {
    var x = currSpace.data("gridx")
    var y = currSpace.data("gridy")
    var sibs = currSpace.siblings(`[data-gridx='${x}'], [data-gridy='${y}']`)
    //currSpace.siblings(`[data-gridy='${y}']`).addClass("validMove")
    sibs.map(async (i, validMove) => {
      validMove = $(validMove)
      validMove.addClass("validMove")
      cDI.addAwaitableInput("click", validMove, async (e) => {
        var piece = currSpace.data("piece")
        var newX = validMove.data("gridx")
        var newY = validMove.data("gridy")
        console.log(piece)
        console.log(newX)
        console.log(newY)
        await ftbCmp("vikingChess").modifyGameState(piece, newX, newY)
      })
    })
  },
  modifyGameState: async (piece, newX, newY) => {
    ftbCmp("vikingChess").gamestate[piece] = `${newX},${newY}`
    console.log(ftbCmp("vikingChess").gamestate)
    console.log(ftbCmp("games"))
    await ftbCmp("games").launchGame("vikingChess")
  }
}
