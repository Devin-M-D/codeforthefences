cDI.components.unitTests.header = {
  section: `header`,
  runAllHeader: async (log) => {
    return await ftbUT.UTLogSection(ftbUT.header.section, async () => {
      await ftbUT.header.openMainNav()
      await cDI.utils.sleep(500)
      await ftbUT.header.closeMainNav()
      //await ftbUT.auth.clickUserBtn()
    })
  },
  openMainNav: async () => {
    await cDI.mockInput("click.openMainNav", $("#siteHeader > .hamburgerBox"))
  },
  closeMainNav: async () => {
    await cDI.mockInput("click.closeDrawerPane", $("#dpMainNavHeader").find(".drawerPaneClose"))
  }
}
