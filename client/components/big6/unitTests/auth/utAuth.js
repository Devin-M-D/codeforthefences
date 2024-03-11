cDI.components.unitTests.auth = {
  section: `auth`,
  runAllAuth: async (log) => {
    return await ftbUT.UTLogSection(ftbUT.auth.section, async () => {
      await ftbUT.auth.signup(null, 1)
      await ftbUT.auth.failCreateExistingUser(1)
      await ftbUT.auth.login(1)
    })
  },
  clickUserBtn: async () => { return await ftbMockInput("click.spawnModal", $("#userBtn")) },
  clickSignup: async () => { return await ftbMockInput("click.signup", $("#btnSignup")) },
  clickLogin: async () => { return await ftbMockInput("click.login", $("#btnLogin")) },
  setSignupVals: (un) => {
    $("#txtSgnUN").html(un)
    $("#txtSgnPW").val("testpass")
    $("#txtSgnConfPW").val("testpass")
  },
  signup: async (name, log) => {
    return await ftbUT.UTIndent(ftbUT.auth.section, "signup",
      async () => {
        await cDI.session.logout()
        await ftbUT.auth.clickUserBtn()
        var randomId = name || `utAuthUser_${cDI.utils.randomString(12)}`
        ftbUT.auth.setSignupVals(randomId)
        var signupRes = await ftbUT.auth.clickSignup()
        if (signupRes.status == "s") { return signupRes.payload.username }
        else { return signupRes.payload }
      },
      async (res) => { return cDI.session.username == res }, log
    )
  },
  failCreateExistingUser: async (log) => {
    var errStr = "Unable to create new user, username is taken."
    return await ftbUT.UTIndent(ftbUT.auth.section, "failCreateExistingUser",
      async () => {
        var firstSignup = await ftbUT.auth.signup("foo")
        var secondSignup = await ftbUT.auth.signup("foo")
        return { firstSignup: firstSignup, secondSignup: secondSignup }
      },
      (res) => { return res.firstSignup == errStr || res.secondSignup == errStr }, log
    )
  },
  login: async (log) => {
    return await ftbUT.UTIndent(ftbUT.auth.section, "login",
      async () => {
        if (cDI.utils.isDef(cDI.session.token)) {
           await cDI.session.logout()
        }
        await ftbUT.auth.clickUserBtn()
        var un = cDI.session.testuser
        var pw = cDI.session.testpass
        $("#txtLoginUN").html(un)
        $("#txtLoginPW").val(pw)
        var loginRes = await ftbUT.auth.clickLogin()
      },
      (res) => { return cDI.session.username == cDI.session.testuser }, log
    )
  }
}
