async function strapAuthButton() {
  $(".iconAuth").off("click")
  if (cDI.utils.isDef(cDI.session.token)){
    cDI.widgets.modal.clickToModal($(".iconAuth"), "/components/genericWidgets/accountDash/accountDash.html", async (createdElem) => {
      await strapAccountDash()
      return createdElem
    }, true)
  }
  else {
    cDI.widgets.modal.clickToModal($(".iconAuth"), "/components/genericWidgets/auth.html", async () => {})
  }
}
cDI.log(() => { console.log("Header component loaded") })
