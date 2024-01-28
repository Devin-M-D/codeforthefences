cDI.pages.games = {
  html: `
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
  </span>`,
  siteHeaderText: "Games",
  launchGame: async(game) => {
    $("#gamePane").empty()
    await ftbLoadComponent("components/projectWidgets", "vikingChess", $("#gamePane"))
  }
}
