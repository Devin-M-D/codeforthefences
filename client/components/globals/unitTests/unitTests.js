async function unitTests(runCondition) {
  //#region if 1 run all if 2 run custom if 3 log in
  if (runCondition == 1){
    //list all test sections here
    await runAllAuth()
  }
  else if (runCondition == 2){
    await customTestScenario()
  }
  else if (runCondition == 3){
    await loginIfNeccessary()
  }
  //#endregion

  //#region utility functions
  function utlog(){

  }
  async function loginIfNeccessary(){
    //if not logged in, use debugConf set in bootstrap to set an impersonate
    if (!cDI.utils.isDef(cDI.session.token)) {
      console.log(`Not logged in, logging with ${cDI.config.user.username} and ${cDI.config.user.password}`)
      await utAuth_Login()
    }
    //if we think we're logged in, verify by making a call. Triggers an implicit logout in the remoteCall func if call result has status "e".
    else { await cDI.remote.remoteCall("/user/testToken") }
  }
  //#endregion

  async function customTestScenario() {
    console.log("UT: Running custom UI test scenario")
    await loginIfNeccessary()
    //custom logged in tasks
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
      await cDI.clickRes($("#iconAuth"))
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
      await cDI.clickRes($(".iconAuth"))
      console.log("UT: logging in")
      $("#txtLoginUN").val(cDI.config.user.username)
      $("#txtLoginPW").val(cDI.config.user.password)
      await cDI.clickRes($("#btnLogin"))
    }
    //#endregion

  //#endregion
}
