cDI.components.unitTests = {
  customDevScenario: async () => {
    console.log("UT: Running custom dev scenario")
    await cDI.components.unitTests.loginIfNeccessary()
    await cDI.clickRes($(".shpPencil"))
    $(".txtIngUoM.Ing1").focus()
  },
  loginIfNeccessary: async () => {
    //if not logged in, use debugConf set in bootstrap to set an impersonate
    if (!cDI.utils.isDef(cDI.session.token)) {
      console.log(`Not logged in, logging with ${cDI.config.user.username} and ${cDI.config.user.password}`)
      await utAuth_Login()
    }
    //if we think we're logged in, verify by making a call. Triggers an implicit logout in the remoteCall func if call result has status "e".
    else { await cDI.remote.remoteCall("/user/testToken") }
  },
  runAllUnitTests: async () => {
    await runAllAuth()
  }
}
cDI.components.unitTests.init = async () => {
  var unitTestLevel = cDI.config.unitTest
  if (unitTestLevel == 1){
    console.log("Unit tests set to level 1: run all")
    await cDI.components.unitTests.runAllUnitTests()
  }
  else if (unitTestLevel == 2){
    console.log("Unit tests set to level 2: custom dev scenario")
    await cDI.components.unitTests.customDevScenario()
  }
  else if (unitTestLevel == 3){
    console.log("Unit tests set to level 3: just login if the session has expired")
    await cDI.components.unitTests.loginIfNeccessary()
  }
}

  //#region permanent tests/
    //#region auth tests
    async function runAllAuth() {
      await utAuth_Signup()
      await failCreateExistingUser()
      await utAuth_Login()
    }
    async function utAuth_clickAuthIcon(){
      await cDI.clickRes($("#iconAuth"))
    }
    async function utAuth_Signup(){
      console.log('UT: auth signup')
      await cDI.clickRes($(".iconAuth"))
      var randomId = "utAuthUser_" + await cDI.randomString(12)
      $("#txtSgnUN").val(randomId)
      $("#txtSgnPW").val("testpass")
      $("#txtSgnConfPW").val("testpass")
      await $("#btnSignup").triggerHandler("click")
    }
    async function failCreateExistingUser(){
      $("#txtSgnUN").val("foo")
      $("#txtSgnPW").val("testpass")
      $("#txtSgnConfPW").val("testpass")
      var errStr = "Unable to create new user, username is taken."

      var firstSignup = ""
      var secondSignup = ""
      firstSignup = await clickRes($("#iconAuth"))
      await $("#btnSignup").triggerHandler("click")

      if (firstSignup != errStr) {
        secondSignup = await clickRes($("#iconAuth"))
        await $("#btnSignup").triggerHandler("click")
      }
      if (firstSignup == errStr || secondSignup == errStr) {
        console.log('UT: auth failCreateExistingUser succeeded to fail')
      }
    }
    async function utAuth_Login(){
      await cDI.clickRes($("#authBox"))
      console.log("UT: logging in")
      $("#txtLoginUN").val(cDI.config.user.username)
      $("#txtLoginPW").val(cDI.config.user.password)
      await cDI.clickRes($("#btnLogin"))
    }
    //#endregion

  //#endregion
