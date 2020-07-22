async function buildAccountDash(){
  $("#accountDashTitle").html(`${cDI.username}'s<br />Account Dash`)
  $("#btnLogout").click(async () => { cDI.logout() })
}
