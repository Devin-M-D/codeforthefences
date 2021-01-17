cDI.components.accountDash = {
  init: async () => {
    return await cDI.components.accountDash.strapAccountDash()
  },
  strapAccountDash: async () => {
    $("#accountDashTitle").html(`${cDI.session.username}'s<br />Account Dash`)
    $("#btnLogout").click(async () => { cDI.logout() })
  }
}
