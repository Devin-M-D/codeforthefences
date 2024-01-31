cDI.components.vikingChess = {
  html: `<span id="vikingChess" class="cols nowrap">
    <span class="scoreboard"><span onclick="ftbCmp('vikingChess').loadGameState()">load game</span></span>
    <span class="gameboard"></span>
  </span>`,
  init: async () => {
    await ftbLoadComponent("components/genericWidgets", "grid")
    await cDI.remote.asyncGetScript(`js/services/vikingChessService.js`)
  },
  drawGame: async (container) => {
    var thisDI = ftbCmp("vikingChess")
    container.append(thisDI.html)
    var gridDI = ftbCmp("grid")
    gridDI.drawGrid($("#vikingChess .gameboard"), 11, 11)
  },
  loadGameState: async () => {
    var gamedata = await ftbSvc["vikingChess"].getGameState()
    var gamestate = JSON.parse(gamedata.gamestate)
    var x = gamestate.w1.split(",")[0]
    var y = gamestate.w1.split(",")[1]
    var cell = $("#vikingChess .gameboard").find(`[data-gridX='${x}'][data-gridY='${y}']`)
    cell.addClass("kingPiece")
  }
}
