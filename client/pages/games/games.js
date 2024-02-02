cDI.pages.games = {
  html: `
  <span id="gamesMain" class="algnSX">
    <span id="selectGame" class="rows autoH">
      <span class="gameBtn mgn10 btnStd">
        <span id="runVikingChess">Viking Chess</span>
      </span>
      <span class="gameBtn mgn10 btnStd">
        <span id="runOshi" onclick="cDI.pages.games.launchGame('oshi')">Oshi</span>
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
    await cDI.mockInput("click", $("#runVikingChess"))
  },
  launchGame: async (game) => {
    $("#gamePane").empty()
    await ftbCmp(game).drawGame($("#gamePane"))
  }
}
