cDI.components.unitTests.header = {
  section: `header`,
  runAllHeader: async (log) => {
    return await ftbUT.UTLogSection(ftbUT.header.section, async () => {
      // await ftbUT.header.openMainNav()
      await ftbUT.header.openAuth()
    })
  },
  openMainNav: async () => {
    await cDI.mockInput("click.openHamburger", $("#siteHeader > .hamburgerBox"))
  },
  openAuth: async () => {
    await cDI.mockInput("click", $("#acctMenuBtn"))
  }
}
