cDI.pages.games = {
  html: `
  <span id="gamesMain" class="algnSX">
    <span id="selectGame" class="rows autoH">
      <span class="gameBtn mgn10 btnStd">
        <span id="runVikingChess">Viking Chess</span>
      </span>
      <span class="gameBtn mgn10 btnStd">
        <span id="runOshi">Oshi</span>
      </span>
    </span>
    <span id="gamePane"></span>
  </span>`,
  siteHeaderText: "Games",
  init: async () => {
    await ftbLoadComponent("components/projectWidgets", "vikingChess")
    //await ftbLoadComponent("components/projectWidgets", "oshi")
    cDI.addAwaitableInput("click", $("#runVikingChess"), async () => {
      await ftbCmp('games').launchGame('vikingChess')
    })
    cDI.addAwaitableInput("click", $("#runOshi"), async () => {
      await ftbCmp('games').launchGame('oshi')
    })
  },
  launchGame: async (game) => {
    if (!cDI.session.token){
      $("#gamePane").html("Please log in to play!")
    }
    else {
      $("#gamePane").empty()
      await ftbCmp(game).drawGame($("#gamePane"))
    }
  }
}
