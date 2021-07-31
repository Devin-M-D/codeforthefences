cDI.components.unitTests.auth = {
  section: `auth`,
  runAllAuth: async (log) => {
    return await cDI.components.unitTests.UTStartSection(cDI.components.unitTests.auth.section, async () => {
      await cDI.components.unitTests.auth.signup(1)
      // await cDI.components.unitTests.auth.failCreateExistingUser()
      // await cDI.components.unitTests.auth.login()
    })
  },
  clickAuthIcon: async () => { return await cDI.awaitableInput("click", $("#authBox")) },
  clickSignup: async () => { return await cDI.awaitableInput("click", $("#btnSignup")) },
  clickLogin: async () => { return await cDI.awaitableInput("click", $("#btnLogin")) },
  setSignupVals: (un) => {
    $("#txtSgnUN").html(un)
    $("#txtSgnPW").val("testpass")
    $("#txtSgnConfPW").val("testpass")
  },
  signup: async (log) => {
    return await cDI.components.unitTests.UTIndent(cDI.components.unitTests.auth.section, "signup",
      async () => {
        await cDI.session.logout()
        await cDI.components.unitTests.auth.clickAuthIcon()
        var randomId = `utAuthUser_${cDI.utils.randomString(12)}`
        cDI.components.unitTests.auth.setSignupVals(randomId)
        await cDI.awaitableInput("click", $("#btnSignup"))
        return randomId
      },
      async (res) => { return cDI.session.username == res }, log
    )
  },
  failCreateExistingUser: async (log) => {
    return await cDI.components.unitTests.UTIndent(cDI.components.unitTests.auth.section, "failCreateExistingUser",
      async () => {
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
        return { errStr: errStr, firstSignup: firstSignup, secondSignup: secondSignup}
      },
      (res) => { return res.firstSignup == res.errStr || res.secondSignup == res.errStr }, log
    )
  },
  login: async () => {
    return await cDI.components.unitTests.UTIndent(cDI.components.unitTests.auth.section, "login",
      async () => {
        await cDI.session.logout()
        await cDI.components.unitTests.auth.clickAuthIcon()
        $("#txtLoginUN").val(cDI.config.user.username)
        $("#txtLoginPW").val(cDI.config.user.password)
        await cDI.components.unitTests.auth.clickLogin()
      },
      (res) => { return cDI.session.username == cDI.config.user.username }, log
    )
  }
}
