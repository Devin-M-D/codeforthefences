async function runTests() {
  //console.log($("#btnPopMdlAuth").triggerHandler("click"))
  $.when($("#btnPopMdlAuth").triggerHandler("click")).then(() => {
    console.log($("#btnSignup"))
    //signup("1","2","3","4")
    console.log("foo", new Date())

    setTimeout(() => {
      console.log("bar", new Date())
      $("#btnSignup").click()
    }, 2000)
    //$("#btnSignup").click()
  })
}
