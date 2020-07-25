async function buildAccountDash(){
  $("#accountDashTitle").html(`${cDI.session.username}'s<br />Account Dash`)
  $("#btnLogout").click(async () => { cDI.logout() })
}
