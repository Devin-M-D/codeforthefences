async function strapAuthButton() {
  $("#iconAuth").off("click")
  console.log("test", cDI.session.token)
  if (cDI.utils.isDef(cDI.session.token)){
    cDI.widgets.modal.clickToModal($("html"), "/components/dialogs/accountDash/accountDash.html", async (createdElem) => {
      await strapAccountDash()
      return createdElem
    })
  }
  else {
    cDI.widgets.modal.clickToModal($("html"), "/components/dialogs/auth.html")
  }
}
cDI.log(() => { console.log("Header component loaded") })
