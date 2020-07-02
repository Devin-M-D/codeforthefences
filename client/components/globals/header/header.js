  async function strapAuthButton() {
    $("#iconAuth").off("click")
    if (cDI.utils.isDef(cDI.token)){
      cDI.clickToModal($("#iconAuth"), "/components/dialogs/accountDash/accountDash.html", async (createdElem) => {
        await accountDashOnStrap()
        return createdElem
      })
    }
    else {
      cDI.clickToModal($("#iconAuth"), "/components/dialogs/auth.html")
    }
  }
  cDI.log(() => { console.log("Header component loaded") })
