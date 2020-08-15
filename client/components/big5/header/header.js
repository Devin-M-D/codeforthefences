async function strapBig5Header(){
  await strapAuthButton()
  await strapHeaderHamburger()
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
    <span class='wingedHeader'>
      <span></span>
      <span> hello world</span>
      <span onclick="closeDrawerPane($(this).parent().parent())">X</span>
    </span>
  `)

  $("#hamburgerBox").off("click")
  $("#hamburgerBox").on("click", async () => { openDrawerPane(pane) })
}

cDI.log(() => { console.log("Header component loaded") })
