async function runTests() {
  $.when($("#btnPopMdlAuth").triggerHandler("click")).then(() => {
    $("#btnSignup").triggerHandler("click")
  })
}
