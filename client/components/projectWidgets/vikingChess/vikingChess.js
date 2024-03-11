cDI.components.vikingChess = {
  html: `<span id="vikingChess" class="rows shyScroll">
    <span class="scoreboard cols">
      <span id="vikingChessP1" class="hardCenter"></span>
      <span id="vikingChessP1Captures" class="vikingChessCaptures"></span>
      <span id="vikingChessP2Captures" class="vikingChessCaptures"></span>
      <span id="vikingChessP2" class="hardCenter"></span>
    </span>
    <span class="gameboard flex"></span>
    <span id="rules" class="">
      <b style="text-align: center;width:100%;padding: 20px 0px 10px 0px;">&#9660;  Rules  &#9660;</b>
      <span class="fontSm pad10 italic">
        Tafl, or Viking Chess, is a family of board games played across ancient northern Europe. There are many variations
        on the rules, and this one is based on a version sold by a viking museum.
      </span>
      <ol class="spaceList leftCopy">
        <li>Defending side (P1) has a king and 12 defenders and starts in the center. Attacking side (P2) has 24 attackers and starts around the edges of the board.</li>
        <li>The center space is the throne and only the king can occupy it (other pieces may pass through).</li>
        <li>The corner spaces represent escape to safety, if the king makes it to a corner space, the defending side wins.</li>
        <li>Players take turns moving 1 piece at a time.</li>
        <li>All pieces can move any number of spaces in a straight line.</li>
        <li>Jumping over pieces is not allowed.</li>
        <li>Pieces are captured when an enemy piece moves adjacent to it, and there is another enemy piece on the other side "sandwiching" the threatened piece. *Note: if a piece moves itself into threat, it is safe and not captured.</li>
        <li>Corner spaces and the throne can act as hostile "sandwiching" spaces, unless the throne is occupied by the king and the threatened piece is a defender.</li>
        <li>The king can participate in captures.</li>
        <li>The king can only be captured by surrounding on all four sides, one of which can be the throne.</li>
        <li>If the king is captured, the attacking side wins.</li>
      </ol>
    </span>
  </span>`,
  gamedata: null,
  container: null,
  poll: null,
  init: async () => {
  },
  drawGame: async (container) => {
    container.empty()
    var gameId = window.location.pathname.split("/")[3]
    if (gameId){
      var gamedata = await cDI.services.vikingChess.loadUserGame(gameId)
      ftbCmp("vikingChess").gamedata = gamedata
      container.append(ftbCmp("vikingChess").html)
      await ftbCmp("graphPaper").drawGrid($("#vikingChess .gameboard"), 11, 11)
      await ftbCmp("vikingChess").loadGameState(gameId)
      ftbCmp("vikingChess").container = container
      ftbCmp("vikingChess").pollUpdates()
    }
    else {
      var newGameHtml = $(`
        <span>
          Challenge Player: <span id="opponentName" type="text" contenteditable="true"></span>
          <span id="startVCGame" class="btnStd">Let battle be joined!</span>
        </span>`)
      ftbAddInput("click.startNewGame", newGameHtml.find("#startVCGame"), async () => {
        var newGame = await cDI.services.vikingChess.startNewGame($("#opponentName").html())
        await ftbCmp("router").getRoute("/games", `/vikingChess/${newGame.id}`)
      })
      container.append(newGameHtml)
    }
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
