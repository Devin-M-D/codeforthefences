cDI.components.accountDash = {
  html: `<span id="accountDash">
    <span id="accountDashHeader" class="rows autoH pad25 algnSpread">
      <span id="accountDashTitle" class="autoW algnSX"></span>
      <span id="btnLogout" class="autoW btnStd">Logout</span>
    </span>
    <span id="accountDashBody"></span>
  </span>`,
  init: async () => {
    return await cDI.components.accountDash.strapAccountDash()
  },
  strapAccountDash: async () => {
    $("#accountDashTitle").html(`${cDI.session.username}'s<br />Account Dash`)
    $("#btnLogout").off()
    cDI.addAwaitableInput("click", $("#btnLogout"), async () => { return await cDI.session.logout() })
  }
}
