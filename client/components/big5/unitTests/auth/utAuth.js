cDI.components.unitTests.auth = {
  runAllAuth: async () => {
    ftbIndent()
    ftbLogUT('UT: runAllAuth')
    ftbIndent()
    await cDI.components.unitTests.auth.signup()
    await cDI.components.unitTests.auth.failCreateExistingUser()
    await cDI.components.unitTests.auth.login()
    ftbOutdent()
    ftbLogUT('UT: runAllAuth passed')
    ftbOutdent()
  },
  clickAuthIcon: async () => { return await cDI.awaitableInput("click", $("#authBox")) },
  clickSignup: async () => { return await cDI.awaitableInput("click", $("#btnSignup")) },
  clickLogin: async () => { return await cDI.awaitableInput("click", $("#btnLogin")) },
  setSignupVals: (un) => {
    $("#txtSgnUN").val(un)
    $("#txtSgnPW").val("testpass")
    $("#txtSgnConfPW").val("testpass")
  },
  signup: async () => {
    ftbLogUT('UT: auth - 1. signup')
    await cDI.session.logout()
    await cDI.components.unitTests.auth.clickAuthIcon()
    var randomId = "utAuthUser_" + await cDI.utils.randomString(12)
    await cDI.components.unitTests.auth.setSignupVals(randomId)
    await cDI.awaitableInput("click", $("#btnSignup"))

    if (cDI.session.username == randomId){ ftbLogUT("passed") }
    else { ftbLogUT("UT: auth - signup failed") }
  },
  failCreateExistingUser: async () => {
    ftbLogUT('UT: auth - 2. failCreateExistingUser')
    await cDI.session.logout()
    var errStr = "Unable to create new user, username is taken."

    var firstSignup = ""
    firstSignup = await cDI.components.unitTests.auth.clickAuthIcon()
    cDI.components.unitTests.auth.setSignupVals("foo")
    firstSignup = await cDI.components.unitTests.auth.clickSignup()

    await cDI.session.logout()

    var secondSignup = ""
    if (firstSignup != errStr) {
      secondSignup = await cDI.components.unitTests.auth.clickAuthIcon()
      cDI.components.unitTests.auth.setSignupVals("foo")
      secondSignup = await cDI.components.unitTests.auth.clickSignup()
    }

    if (firstSignup == errStr || secondSignup == errStr) { ftbLogUT('passed') }
    else {
      ftbLogUT('UT: auth - failCreateExistingUser failed')
    }
  },
  login: async () => {
    ftbLogUT("UT: auth - 3. login")
    await cDI.session.logout()
    await cDI.components.unitTests.auth.clickAuthIcon()
    $("#txtLoginUN").val(cDI.config.user.username)
    $("#txtLoginPW").val(cDI.config.user.password)
    await cDI.components.unitTests.auth.clickLogin()

    if (cDI.session.username == cDI.config.user.username){ ftbLogUT("passed") }
    else { ftbLogUT("UT: auth - login failed") }
  }
}
