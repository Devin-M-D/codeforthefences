cDI.components.header = {
  html: `
    <span id="siteHeader">
      <span class="hamburgerBox">
        <span class="shpHamburger"></span>
      </span>
      <span id="siteHeaderText" class="rows grow hardCenter">
        <span id="siteName" class="header">Code for the Fences</span>
        <span id="pageName" class="iSubheader"></span>
      </span>
      <span id="userBtn" class="shpUser"></span>
    </span>
  `,
  init: async () => {
    await cDI.remote.asyncGetScript(`/js/services/authService.js`)
    await ftbCmp("header").strapAuthButton()
    await ftbCmp("header").strapHeaderHamburger()
  },
  setHeaderText: (text) => {
    $("#pageName").html(text)
  },
  strapAuthButton: async () => {
    if ($("#accountDash") || $("#signupLoginBox")) { ftbCmp("modal").raiseCurtain() }
    ftbCmp("modal").removeModalClick($("#userBtn"))
    var onCloseFn = async () => { return await ftbCmp("header").strapAuthButton() }
    if (cDI.utils.isDef(cDI.session.token)){
      var accountDashContent = await ftbCmp("accountDash").drawAccountDash()
      await ftbCmp("modal").clickToModal($("#userBtn"), accountDashContent, true, onCloseFn)
    }
    else {
      var authMenuContent = await ftbCmp("authMenu").drawAuthMenu()
      await ftbCmp("modal").clickToModal($("#userBtn"), authMenuContent, true, onCloseFn)

    }
  },
  strapHeaderHamburger: async () => {
    ftbAddInput("click.openMainNav", $("#siteHeader > .hamburgerBox"), async () => {
      await ftbCmp("header").buildMainNav()
    })
  },
  buildMainNav: async () => {
    var dpDI = ftbCmp("drawerPane")
    var pane = await dpDI.createDrawerPane($("html"))
    await dpDI.populateDrawerPane(pane, `
      <span id="dpMainNav">
        <span id="dpMainNavHeader" class="flex rows">
          ${dpDI.drawerPaneCloseButton}
        </span>
        <span id="dpMainNavContent" class="shyScroll">
          <span class="fauxrder">
            <span id="mainNavAbout" class="btnStd subheader">About</span>
          </span>
          <span class="fauxrder">
            <span id="mainNavBlog" class="btnStd subheader">Blog</span>
          </span>
          <span class="fauxrder">
            <span id="mainNavCookbook" class="btnStd subheader">Cookbook</span>
          </span>
          <span class="fauxrder">
            <span id="mainNavDarkRoom" class="btnStd subheader">Dark Room</span>
          </span>
          <span class="fauxrder">
            <span id="mainNavBudget" class="btnStd subheader">Budget</span>
          </span>
          <span class="fauxrder">
            <span id="mainNavGames" class="btnStd subheader">Games</span>
          </span>
        </span>
      </span>`)
    ftbAddInput("click.closeDrawerPane", pane.find(".drawerPaneClose"), async (e) => {
      await ftbCmp("drawerPane").closeDrawerPane($(e.target).parents(".drawerPane"))
    })
    ftbCmp("header").addMainNavClick(pane, $("#mainNavAbout"), '/about')
    ftbCmp("header").addMainNavClick(pane, $("#mainNavBlog"), '/blog')
    ftbCmp("header").addMainNavClick(pane, $("#mainNavCookbook"), '/cookbook')
    ftbCmp("header").addMainNavClick(pane, $("#mainNavDarkRoom"), '/darkRoom')
    ftbCmp("header").addMainNavClick(pane, $("#mainNavBudget"), '/budget')
    ftbCmp("header").addMainNavClick(pane, $("#mainNavGames"), '/games')
    await ftbCmp("drawerPane").openDrawerPane(pane)
  },
  addMainNavClick: (pane, elem, routePath) => {
    ftbAddInput("click.mainNav", elem, async e => {
      await ftbCmp("router").getRoute(routePath)
      await ftbCmp("drawerPane").closeDrawerPane(pane)
    })
  }
}
