cDI.components.unitTests.games = {
  section: `games`,
  runAllGames: async () => {
    await cDI.components.unitTests.UTStartSection(cDI.components.unitTests.games.section, async () => {
      await cDI.components.unitTests.games.launchVikingChess()
      // await cDI.components.unitTests.games.selectPiece()
      // await cDI.components.unitTests.games.movePiece()
    })
  },
  launchVikingChess: async () => {
    if (cDI.session.token){
      await cDI.mockInput("click", $("#runVikingChess"))
    }
  },
  selectPiece: async () => {
      await cDI.mockInput("click.activatePiece", $("[data-piece='w7']").parent())
  },
  movePiece: async () => {
      await cDI.mockInput("click.movePiece", $("[data-gridx='6'][data-gridy='3']"))
  },
}
