cDI.components.accountDash = {
  drawAccountDash: async () => {
    var dashElem = $(`<span id="accountDash" class="max">
      <span id="accountDashHeader">
        <span id="accountDashTitle" class="header">${cDI.session.username}</span>
        <span id="btnLogout" class="btnStd hardCenter">Logout</span>
      </span>
      <span id="accountDashBody"></span>
    </span>`)
    ftbRemoveInput("click.logout", dashElem.find("#btnLogout"))
    ftbAddInput("click.logout", dashElem.find("#btnLogout"), async () => { return await cDI.session.logout() })
    return dashElem
  }
}
