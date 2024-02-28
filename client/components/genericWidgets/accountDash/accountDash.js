cDI.components.accountDash = {
  drawAccountDash: async () => {
    var dashElem = $(`<span id="accountDash">
      <span id="accountDashHeader" class="">
        <span id="accountDashTitle" class="">${cDI.session.username}'s<br /> Dash</span>
        <span id="btnLogout" class="">Logout</span>
      </span>
      <span id="accountDashBody"></span>
    </span>`)
    ftbRemoveInput("click.logout", $("#btnLogout"))
    cDI.addAwaitableInput("click.logout", $("#btnLogout"), async () => { return await cDI.session.logout() })
    return dashElem
  }
}
