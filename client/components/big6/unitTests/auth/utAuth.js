cDI.components.unitTests.auth = {
  section: `auth`,
  runAllAuth: async (log) => {
    return await cDI.components.unitTests.UTLogSection(cDI.components.unitTests.auth.section, async () => {
      await cDI.components.unitTests.auth.signup(null, 1)
      await cDI.components.unitTests.auth.failCreateExistingUser(1)
      await cDI.components.unitTests.auth.login(1)
    })
  },
  clickAuthIcon: async () => { return await cDI.mockInput("click", $("#authBox")) },
  clickSignup: async () => { return await cDI.mockInput("click", $("#btnSignup")) },
  clickLogin: async () => { return await cDI.mockInput("click", $("#btnLogin")) },
  setSignupVals: (un) => {
    $("#txtSgnUN").html(un)
    $("#txtSgnPW").val("testpass")
    $("#txtSgnConfPW").val("testpass")
  },
  signup: async (name, log) => {
    return await cDI.components.unitTests.UTIndent(cDI.components.unitTests.auth.section, "signup",
      async () => {
        await cDI.session.logout()
        await cDI.components.unitTests.auth.clickAuthIcon()
        var randomId = name || `utAuthUser_${cDI.utils.randomString(12)}`
        cDI.components.unitTests.auth.setSignupVals(randomId)
        var signupRes = await cDI.components.unitTests.auth.clickSignup()
        if (signupRes.status == "s") { return signupRes.payload.username }
        else { return signupRes.payload }
      },
      async (res) => { return cDI.session.username == res }, log
    )
  },
  failCreateExistingUser: async (log) => {
    var errStr = "Unable to create new user, username is taken."
    return await cDI.components.unitTests.UTIndent(cDI.components.unitTests.auth.section, "failCreateExistingUser",
      async () => {
        var firstSignup = await cDI.components.unitTests.auth.signup("foo")
        var secondSignup = await cDI.components.unitTests.auth.signup("foo")
        return { firstSignup: firstSignup, secondSignup: secondSignup }
      },
      (res) => { return res.firstSignup == errStr || res.secondSignup == errStr }, log
    )
  },
  login: async (log) => {
    return await cDI.components.unitTests.UTIndent(cDI.components.unitTests.auth.section, "login",
      async () => {
        if (cDI.utils.isDef(cDI.session.token)) {
           await cDI.session.logout()
        }
        await cDI.components.unitTests.auth.clickAuthIcon()
        var un = cDI.session.testuser
        var pw = cDI.session.testpass
        $("#txtLoginUN").html(un)
        $("#txtLoginPW").val(pw)
        await cDI.components.unitTests.auth.clickLogin()
      },
      (res) => { return cDI.session.username == cDI.session.testuser }, log
    )
  }
}
