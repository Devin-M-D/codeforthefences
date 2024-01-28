cDI.pages.games = {
  siteHeaderText: "Games",
  init: async () => {
    $("#contentMain").html(`
      <span id="gamesMain" class="algnSX">
        <span id="selectGame" class="rows autoH">
          <span class="gameBtn mgn10 btnStd">
            <span onclick="cDI.pages.games.launchGame('vikingChess')">Viking Chess</span>
          </span>
          <span class="gameBtn mgn10 btnStd">
            <span onclick="cDI.pages.games.launchGame('oshi')">Oshi</span>
          </span>
        </span>
        <span id="gamePane"></span>
      </span>
    `)
  },
  launchGame: async(game) => {
    await cDI.remote.loadComponent($("#gamePane"), "components/projectWidgets", "vikingChess")
  }
}
