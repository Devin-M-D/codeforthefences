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
  },
  drawGame: async (container) => {
    var gamedata = await ftbSvc["vikingChess"].getGameState()
    console.log(gamedata)
    var gamestate = JSON.parse(gamedata.gamestate)
    ftbCmp("vikingChess").gamestate = gamestate
    container.append(ftbCmp("vikingChess").html)
    var gridDI = ftbCmp("grid")
    await gridDI.drawGrid($("#vikingChess .gameboard"), 11, 11)
    await ftbCmp("vikingChess").loadGameState()
    ftbCmp("vikingChess").container = container
  },
  loadGameState: async () => {
    var gamestate = ftbCmp("vikingChess").gamestate
    var kingSpace = $("#vikingChess .gameboard").find(`[data-gridx='5'][data-gridy='5']`).addClass("kingSpace")

    var cornerSpaces = ["0,0", "0,10", "10,0", "10,10"]
    cornerSpaces.map((item) => {
      var itemx = item.split(",")[0]
      var itemy = item.split(",")[1]
      var cornerSpace = $("#vikingChess .gameboard").find(`[data-gridx='${itemx}'][data-gridy='${itemy}']`)
      cornerSpace.addClass("cornerSpace")
    })

    var defenderSpaces = ["3,5", "4,4", "4,5", "4,6", "5,3", "5,4", "5,6", "5,7", "6,4", "6,5", "6,6", "7,5"]
    defenderSpaces.map((item) => {
      var itemx = item.split(",")[0]
      var itemy = item.split(",")[1]
      var defenderSpace = $("#vikingChess .gameboard").find(`[data-gridx='${itemx}'][data-gridy='${itemy}']`)
      defenderSpace.addClass("defenderSpace")
    })

    var attackerSpaces = [
      "3,0", "4,0", "5,0", "6,0", "7,0", "5,1",
      "0,3", "0,4", "0,5", "0,6", "0,7", "1,5",
      "10,3", "10,4", "10,5", "10,6", "10,7", "9,5",
      "5,9", "3,10", "4,10", "5,10", "6,10", "7,10"
    ]
    attackerSpaces.map((item) => {
      var itemx = item.split(",")[0]
      var itemy = item.split(",")[1]
      var attackerSpace = $("#vikingChess .gameboard").find(`[data-gridx='${itemx}'][data-gridy='${itemy}']`)
      attackerSpace.addClass("attackerSpace")
    })
    Object.entries(gamestate).map(piece => {
      const pieceName = piece[0];
      const piecePos = piece[1];
      var x = piecePos.split(",")[0]
      var y = piecePos.split(",")[1]

      var cell = $("#vikingChess .gameboard").find(`[data-gridx='${x}'][data-gridy='${y}']`)
      if (pieceName == "k") { cell.html("<span class='kingPiece shpCircle'></span>") }
      var type = ""
      if (pieceName.indexOf("k") != -1) { type = "king" }
      if (pieceName.indexOf("w") != -1) { type = "defender" }
      if (pieceName.indexOf("b") != -1) { type = "attacker" }
      cell.html(`<span class='${type}Piece shpCircle' data-piece='${pieceName}'></span>`)
      cDI.addAwaitableInput("click", cell, async () => { await ftbCmp("vikingChess").activatePiece(cell) })
    })
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
        await ftbCmp("vikingChess").modifyGameState(piece, newX, newY)
      })
    })
  },
  modifyGameState: async (piece, newX, newY) => {
    await ftbSvc["vikingChess"].submitMove(piece, newX, newY)
    await ftbCmp("games").launchGame("vikingChess")
  }
}
