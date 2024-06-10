cDI.pages.games = {
  siteHeaderText: "Games",
  drawPage: async (container) => {
    container.empty()
    var html = `
    <span id="gamesMain">
      <span id="selectGame" class="cols">
        <span id="runVikingChess" class="gameBtn mgn10 btnStd hardCenter">Viking Chess</span>
        <span id="runOshi" class="gameBtn mgn10 btnStd hardCenter">Oshi</span>
      </span>
      <span id="gamePane"></span>
    </span>`
    container.append(html)
    await ftbLoadComponent("components/projectWidgets", "vikingChess")
    //await ftbLoadComponent("components/projectWidgets", "oshi")
    await cDI.addAwaitableInput("click.launchVikingChess", $("#runVikingChess"), async () => {
      await ftbCmp('games').launchGame('vikingChess', container)
    })
    await cDI.addAwaitableInput("click.launchOshi", $("#runOshi"), async () => {
      await ftbCmp('games').launchGame('oshi', container)
    })
    var game = window.location.pathname.split("/")[2]
    if (game) {
      await ftbCmp('games').launchGame(game, container)
    }
    cDI.session.logoutRoute = '/games'
  },
  launchGame: async (game, parentContainer) => {
    if (!cDI.session.token){
      $("#gamePane").addClass("hardCenter")
      $("#gamePane").html("Please log in to play!")
    }
    else {
      $("#gamePane").addClass("softCenter")
      var backBtn = $(`<span>< Back to Games Home</span>`)
      ftbAddInput("click.backGamesHome", backBtn, async () => {
        await ftbCmp("router").getRoute("/games")
        await ftbCmp('games').drawPage(parentContainer)
      })
      $("#selectGame").empty()
      $("#selectGame").addClass("back")
      $("#selectGame").append(backBtn)

      $("#gamePane").empty()
      if (game == "oshi") {
        $("#gamePane").html("Oshi coming soon!")
      }
      else {
        await ftbCmp(game).drawGame($("#gamePane"))
      }
    }
  }
}
