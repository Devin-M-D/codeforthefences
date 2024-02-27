cDI.components.unitTests.mainNav = {
  section: `mainNav`,
  runAllMainNav: async (log) => {
    return await ftbUT.UTStartSection(ftbUT.mainNav.section, async () => {
      await cDI.mockInput("click.openHamburger", $("#siteHeader > .hamburgerBox"))
    })
  }
}
