cDI.components.unitTests = {
  section: `Unit Test main`,
  init: async () => {
    var unitTestLevel = cDI.config.unitTest

    var currDebugMode = cDI.config.debugMode
    if (unitTestLevel != 0){
      await cDI.remote.asyncGetScript("/components/big5/unitTests/auth/utAuth.js")
      await cDI.remote.asyncGetScript("/components/big5/unitTests/recipe/utRecipe.js")
      if ([0, 1, 4, 5].indexOf(currDebugMode) != -1) { cDI.config.debugMode = 2 }
    }

    if (unitTestLevel == 1){
      await cDI.components.unitTests.runAllUnitTests(1)
    }
    else if (unitTestLevel == 2){
      await cDI.components.unitTests.customDevScenario(1)
    }
    else if (unitTestLevel == 3){
      await cDI.components.unitTests.loginIfNeccessary(1)
    }

    cDI.config.debugMode = currDebugMode
  },
//#region unit test main 1/2/3
  runAllUnitTests: async (log) => {
    return await cDI.components.unitTests.UTStartSection("Unit Tests set to level 1: runAllUnitTests",
      async () => {
        await cDI.components.unitTests.auth.runAllAuth()
        await cDI.components.unitTests.recipe.runAllRecipe()
      })
  },
  customDevScenario: async (log) => {
    return await cDI.components.unitTests.UTStartSection("Unit Tests set to level 2: customDevScenario",
      async () => {
        await cDI.components.unitTests.loginIfNeccessary()
        await cDI.components.unitTests.recipe.runAllRecipe()
      })
  },
  loginIfNeccessary: async () => {
    return await cDI.components.unitTests.UTStartSection("Unit Tests set to level 3: loginIfNeccessary (just login if the session has expired)",
      async () => {
        ftbIndent()
        //if not logged in, use debugConf set in bootstrap to set an impersonate
        if (!cDI.utils.isDef(cDI.session.token)) {
          ftbLogUT(`Not logged in, logging with ${cDI.config.user.username} and ${cDI.config.user.password}`)
          await cDI.components.unitTests.auth.login()
          ftbLogUT(`login succeeded token: ${cDI.session.token.substr(0, 5)}...`)
        }
        //if we think we're logged in, verify by making a call. Triggers an implicit logout in the remoteCall func if call result has status "e".
        else {
          ftbLogUT(`active session detected, testing`)
          var sessionTest = await cDI.remote.remoteCall("/user/testToken")
          if (sessionTest.status == 's'){
            ftbLogUT(`active session still valid, proceeding: (session id: ${cDI.session.token.substr(0, 5)}...)`)
          }
          else {
          ftbLogUT(`error logging in`)
          }
        }
        ftbOutdent()
      })
  },
//#endregion
//#region indentation wrappers
  UTStartSection: async (sectionName, fn) => {
    ftbLogUT(`** ${sectionName}`)
    ftbIndent()
    var res = await fn()
    ftbOutdent()
    ftbLogUT(`** ${sectionName} passed`)
    return res
  },
  UTIndent: async (sectionName, testTitle, fn, validator, log) => {
    if (log) {
      ftbLogUT(`#${sectionName} - ${testTitle}`)
      ftbIndent()
    }
    var res = await fn()
    if (log) {
      if (!validator || validator(res)) { ftbLogUT('+++passed') }
      else { ftbLogUT(`---failed`) }
      ftbOutdent()
    }
    if (!validator || validator(res)) { return res }
    else { return false }
  }
//#endregion
}
