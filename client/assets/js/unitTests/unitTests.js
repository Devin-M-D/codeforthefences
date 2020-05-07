async function runTests() {
  $.when($("#btnPopMdlAuth").triggerHandler("click")).then(() => {
    $("#btnLogin").triggerHandler("click")
  })
}
