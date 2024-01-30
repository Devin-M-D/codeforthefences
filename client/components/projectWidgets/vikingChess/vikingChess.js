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
    await ftbSvc["vikingChess"].getGameState()
  }
}
