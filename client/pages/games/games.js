cDI.pages.games = {
  html: `
  <span id="gamesMain" class="algnSX">
    <span id="selectGame" class="rows autoH">
      <span class="gameBtn mgn10 btnStd">
        <span id="runVikingChess" onclick="ftbCmp('games').launchGame('vikingChess')">Viking Chess</span>
      </span>
      <span class="gameBtn mgn10 btnStd">
        <span onclick="cDI.pages.games.launchGame('oshi')">Oshi</span>
      </span>
    </span>
    <span id="gamePane"></span>
  </span>`,
  siteHeaderText: "Games",
  init: async () => {
    await ftbLoadComponent("components/projectWidgets", "vikingChess")
    //await ftbLoadComponent("components/projectWidgets", "oshi")
  },
  launchGame: async(game) => {
    $("#gamePane").empty()
    await ftbCmp(game).drawGame($("#gamePane"))
  }
}
