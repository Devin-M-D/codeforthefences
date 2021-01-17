cDI.components.unitTests.auth = {
  runAllAuth: async () => {
    await cDI.components.unitTests.auth.signup()
    await cDI.components.unitTests.auth.failCreateExistingUser()
    await cDI.components.unitTests.auth.login()
  },
  clickAuthIcon: async () => {
    await cDI.awaitableInput("click", $("#iconAuth"))
  },
  signup: async () => {
    console.log('UT: auth signup')
    await cDI.awaitableInput("click", $(".iconAuth"))
    var randomId = "utAuthUser_" + await cDI.utils.randomString(12)
    $("#txtSgnUN").val(randomId)
    $("#txtSgnPW").val("testpass")
    $("#txtSgnConfPW").val("testpass")
    await $("#btnSignup").triggerHandler("click")
  },
  failCreateExistingUser: async () => {
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
  },
  login: async () => {
    await cDI.awaitableInput("click", $("#authBox"))
    console.log("UT: logging in")
    $("#txtLoginUN").val(cDI.config.user.username)
    $("#txtLoginPW").val(cDI.config.user.password)
    await cDI.awaitableInput("click", $("#btnLogin"))
  }
}
