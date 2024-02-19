cDI.pages.games = {
  html: `
  <span id="gamesMain" class="algnSX noShadow">
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
    await cDI.addAwaitableInput("click.launchVikingChess", $("#runVikingChess"), async () => {
      await ftbCmp('games').launchGame('vikingChess')
    })
    await cDI.addAwaitableInput("click.launchOshi", $("#runOshi"), async () => {
      await ftbCmp('games').launchGame('oshi')
    })
  },
  launchGame: async (game) => {
    if (!cDI.session.token){
      $("#gamePane").html("Please log in to play!")
    }
    else {
      await ftbCmp(game).drawGame($("#gamePane"))
    }
  }
}
