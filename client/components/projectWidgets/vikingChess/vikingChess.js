cDI.components.vikingChess = {
  html: `<span id="vikingChess" class="cols nowrap">
    <span class="scoreboard rows">
      <span id="vikingChessP1" class="absCen"></span>
      <span id="vikingChessP1Captures" class="vikingChessCaptures"></span>
      <span id="vikingChessP2Captures" class="vikingChessCaptures"></span>
      <span id="vikingChessP2" class="absCen"></span>
    </span>
    <span class="gameboard"></span>
  </span>`,
  gamedata: null,
  container: null,
  poll: null,
  init: async () => {
    await ftbLoadComponent("components/genericWidgets", "grid")
    await cDI.remote.asyncGetScript(`js/services/vikingChessService.js`)
  },
  drawGame: async (container) => {
    container.empty()
    var gamedata = await ftbSvc["vikingChess"].getGameState()
    ftbCmp("vikingChess").gamedata = gamedata
    container.append(ftbCmp("vikingChess").html)
    await ftbCmp("grid").drawGrid($("#vikingChess .gameboard"), 11, 11)
    await ftbCmp("vikingChess").loadGameState()
    ftbCmp("vikingChess").container = container
    ftbCmp("vikingChess").pollUpdates()
  },
  loadGameState: async () => {
    var gamedata = ftbCmp("vikingChess").gamedata
    $("#vikingChessP1").html(gamedata.player1.username)
    $("#vikingChessP2").html(gamedata.player2.username)
    if (gamedata.ended) {
      $(`#vikingChessP${gamedata.winner}`).addClass("winner")
    }
    else {
      if (gamedata.turn % 2 == 1) {
        $("#vikingChessP1").addClass("sectionHeader").addClass("underline")
        $("#vikingChessP2").removeClass("sectionHeader").removeClass("underline")
      }
      else {
        $("#vikingChessP1").removeClass("sectionHeader").removeClass("underline")
        $("#vikingChessP2").addClass("sectionHeader").addClass("underline")
      }
    }
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
    $("#vikingChess .scoreboard .vikingChessCaptures").html("")
    var playerSide = ftbCmp("vikingChess").playerSide(gamedata)
    var isPlayerTurn = ftbCmp("vikingChess").isPlayerTurn(playerSide, gamedata.turn)
    await Object.entries(gamedata.gamestate).map(async piece => {
      var pieceName = piece[0];
      var piecePos = piece[1];
      var isDefenderPiece = ftbCmp("vikingChess").isDefenderPiece(pieceName)
      var isAttackerPiece = ftbCmp("vikingChess").isAttackerPiece(pieceName)

      if (piecePos == "cap" ){
        var captureId = ""
        if (isDefenderPiece) { captureId = "vikingChessP2Captures" }
        else if (isAttackerPiece) { captureId = "vikingChessP1Captures" }
        $(`#vikingChess .scoreboard #${captureId}`).append(`<span class='capBox'><span class='${pieceName[0]}Piece shpCircle'></span></span>`)
      }
      var x = piecePos.split(",")[0]
      var y = piecePos.split(",")[1]

      var cell = $("#vikingChess .gameboard").find(`[data-gridx='${x}'][data-gridy='${y}']`)
      cell.html(`<span class='${pieceName[0]}Piece shpCircle' data-piece='${pieceName}'></span>`)

      if (!gamedata.ended){
        if (playerSide == 1 && isPlayerTurn && isDefenderPiece){
          await cDI.addAwaitableInput("click.activatePiece", cell, ftbCmp("vikingChess").activatePiece)
        }
        else if (playerSide == 2 && isPlayerTurn && isAttackerPiece) {
          await cDI.addAwaitableInput("click.activatePiece", cell, ftbCmp("vikingChess").activatePiece)
        }
      }
    })
  },
  isPlayerTurn: (playerSide, turn) => {
    if ((playerSide == 1 && turn % 2 == 1) || (playerSide == 2 && turn % 2 == 0)) { return true }
    else { return false }
  },
  playerSide: (gamedata) => {
    if (cDI.session.userId == gamedata.player1.id) { return 1 }
    else if (cDI.session.userId == gamedata.player2.id) { return 2 }
  },
  isDefenderPiece: (pieceName) => {
    if (pieceName.indexOf("k") != -1 || pieceName.indexOf("w") != -1) { return true }
    else if (pieceName.indexOf("b") != -1) { return false }
  },
  isAttackerPiece: (pieceName) => {
    if (pieceName.indexOf("k") != -1 || pieceName.indexOf("w") != -1) { return false }
    else if (pieceName.indexOf("b") != -1) { return true }
  },
  pollUpdates: async () => {
    if (ftbCmp("vikingChess").poll == null) {
      var fn = setInterval(async () => {
        var dataFromServer = await ftbSvc["vikingChess"].getCurrentTurn(ftbCmp("vikingChess").gamedata.id)
        if (ftbCmp("vikingChess").gamedata.turn != dataFromServer){
          await ftbCmp("vikingChess").drawGame(ftbCmp("vikingChess").container)
        }
      }, 3000)
      ftbCmp("vikingChess").poll = fn
    }
  },
  hasPiece: (space) => {
    if (space.children("span").length > 0){
      return space.children("span").data("piece")
    }
    else {
      return false
    }
  },
  deactivatePiece: async (event) => {
    var currSpace = $(event.currentTarget)
    var existingValids = $("#vikingChess .validMove")
    cDI.removeAwaitableInput("click.movePiece", existingValids)
    existingValids.removeClass("validMove")
    cDI.removeAwaitableInput("click.deactivatePiece", currSpace)
    cDI.addAwaitableInput("click.activatePiece", currSpace, ftbCmp("vikingChess").activatePiece)
  },
  isValidMove: async (currSpace, potX, potY) => {
    var potMove = currSpace.siblings(`[data-gridx='${potX}'][data-gridy='${potY}']`)
    if (ftbCmp("vikingChess").hasPiece(potMove) != false) { return false }
    else {
      var piece = currSpace.children("span").data("piece")
      potMove.addClass("validMove")
      await cDI.addAwaitableInput("click.movePiece", potMove, async () => { await ftbCmp("vikingChess").movePiece(piece, potX, potY) } )
      return true
    }
  },

  activatePiece: async (event) => {
    var currSpace = $(event.currentTarget)
    cDI.removeAwaitableInput("click.activatePiece", currSpace)
    cDI.addAwaitableInput("click.deactivatePiece", currSpace, ftbCmp("vikingChess").deactivatePiece)

    $("#vikingChess .validMove").removeClass("validMove")

    var x = currSpace.data("gridx")
    var y = currSpace.data("gridy")
    while (x > 0) {
      x--
      if (await ftbCmp("vikingChess").isValidMove(currSpace, x, y) == false) break
    }
    x = currSpace.data("gridx")
    while (x < 10) {
      x++
      if (await ftbCmp("vikingChess").isValidMove(currSpace, x, y) == false) break
    }
    x = currSpace.data("gridx")

    while (y > 0) {
      y--
      if (await ftbCmp("vikingChess").isValidMove(currSpace, x, y) == false) break
    }
    y = currSpace.data("gridy")
    while (y < 10) {
      y++
      if (await ftbCmp("vikingChess").isValidMove(currSpace, x, y) == false) break
    }
  },
  movePiece: async (piece, newX, newY) => {
    await ftbSvc["vikingChess"].submitMove(piece, newX, newY)
    await ftbCmp("games").launchGame("vikingChess")
  }
}
