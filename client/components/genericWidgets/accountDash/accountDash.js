cDI.components.accountDash = {
  drawAccountDash: async () => {
    var dashElem = $(`<span id="accountDash" class="max">
      <span id="accountDashHeader">
        <span id="accountDashTitle" class="header">${cDI.session.username}</span>
        <span id="btnLogout" class="btnStd hardCenter">Logout</span>
      </span>
      <span id="accountDashBody" class="rows">
        <span class="underline algnS">Viking Chess Games</span>
      </span>
    </span>`)
    ftbAddInput("click.logout", dashElem.find("#btnLogout"), async () => { return await cDI.session.logout() })
    await ftbCmp("accountDash").addGamesList(dashElem)
    return dashElem
  },
  addGamesList: async (dash) => {
    var currVCGames = await cDI.services.vikingChess.getAllUserGames()
    currVCGames.map((x, i) => {
      var html = $(`
        <span class="vcGameOverview rows">
          <span class="cols">
            <span></span>
            <span class="algnXE grayUnderline miniFont bold">Player Side</span>
            <span class="algnXE softcenter grayUnderline miniFont bold">Current Turn</span>
            <span class="algnXE softcenter grayUnderline miniFont bold">Cap. Defenders</span>
            <span class="algnXE softcenter grayUnderline miniFont bold">Cap. Attackers</span>
            <span class="algnXE softcenter grayUnderline miniFont bold">Opp.</span>
          </span>
          <span class="cols">
            <span class="softcenter">${i}.</span>
            <span class="playerSide"><span class="shpCircle"></span></span>
            <span class="turn softcenter">${x.turn}</span>
            <span class="defCaps softcenter">${x.p1Caps}</span>
            <span class="attCaps softcenter">${x.p2Caps}</span>
            <span class="opponent softcenter">${x.opponentName}</span>
          </span>
        </span>`)
      ftbAddInput("click.launchVCGame", html, async () => {
        await ftbCmp("router").getRoute("/games", `/vikingChess/${x.id}`)
        await ftbMockInput("click.raiseModalCurtain", $(".modalCurtain"))
      })
      if (x.player1 == cDI.session.userId){
        html.find(".playerSide").css("background-color", "white")
      }
      dash.find("#accountDashBody").append(html)
    })
  }
}
