cDI.components.header = {
  init: async () => {
    await strapAuthButton()
    await strapHeaderHamburger()
  },
  setHeaderText: (text) => {
    $("#siteHeaderText").html(text)
  }
}

async function strapAuthButton() {
  $("#authBox").off("click")
  if (cDI.utils.isDef(cDI.session.token)){
    cDI.widgets.modal.clickToModal($("#authBox"), "/components/genericWidgets/accountDash/accountDash.html", async (createdElem) => {
      await strapAccountDash()
      return createdEle
    }, true)
  }
  else {
    cDI.widgets.modal.clickToModal($("#authBox"), "/components/genericWidgets/auth.html", async () => {})
  }
}

async function strapHeaderHamburger(){
  var pane = await createDrawerPane($("html"))
  populateDrawerPane(pane, `
    <span class='wingedHeader' data-headerheight="10">
      <span class="header noUnderline absCen bumpBottom">{}</span>
      <span class="header absCen">Code for the Fences</span>
      <span class="header noUnderline absCen bumpBottom" onclick="closeDrawerPane($(this).parent().parent())">X</span>
    </span>
    <span class="cols algnSX">
      <span class="btnStd subheader" onclick="cDI.components.router.getRoute('/Blog')">Blog</span>
      <span class="btnStd subheader" onclick="cDI.components.router.getRoute('/Cookbook')">Cookbook</span>
      <span class="btnStd subheader" onclick="cDI.components.router.getRoute('/DarkRoom')">Dark Room</span>
      <span class="btnStd subheader" onclick="cDI.components.router.getRoute('/BrewGames')">Brew Games</span>
    </span>
  `)
  pane.addClass("cols")
  $("#hamburgerBox").off("click")
  $("#hamburgerBox").on("click", async () => { openDrawerPane(pane) })
}

cDI.log(() => { console.log("Header component loaded") })
