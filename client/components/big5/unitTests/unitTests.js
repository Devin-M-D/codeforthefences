cDI.components.unitTests = {
  init: async () => {
    var unitTestLevel = cDI.config.unitTest

    var currDebugMode = cDI.config.debugMode
    if (unitTestLevel != 0){
      await cDI.remote.asyncGetScript("/components/big5/unitTests/auth/utAuth.js")
      await cDI.remote.asyncGetScript("/components/big5/unitTests/recipe/utRecipe.js")
      if ([0, 1, 4, 5].indexOf(currDebugMode) != -1) { cDI.config.debugMode = 2 }
    }

    if (unitTestLevel == 1){
      ftbLogUT("Unit tests set to level 1: run all")
      ftbIndent()
      await cDI.components.unitTests.runAllUnitTests()
      ftbOutdent()
    }
    else if (unitTestLevel == 2){
      ftbLogUT("Unit tests set to level 2: custom dev scenario")
      ftbIndent()
      await cDI.components.unitTests.customDevScenario()
      ftbOutdent()
    }
    else if (unitTestLevel == 3){
      ftbLogUT("Unit tests set to level 3: just login if the session has expired")
      ftbIndent()
      await cDI.components.unitTests.loginIfNeccessary()
      ftbOutdent()
    }

    cDI.config.debugMode = currDebugMode
  },
  customDevScenario: async () => {
    // await cDI.components.unitTests.loginIfNeccessary()
    ftbLogUT("UT: customDevScenario")
    ftbIndent()
    await cDI.components.unitTests.recipe.runAllRecipe()
    ftbOutdent()
    ftbLogUT("UT: customDevScenario completed")
  },
  loginIfNeccessary: async () => {
    ftbLogUT("UT: loginIfNeccessary")
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
        ftbLogUT(`active session still valid, proceeding: ${cDI.session.token.substr(0, 5)}...`)
      }
      else {
      ftbLogUT(`error logging in`)
      }
    }
    ftbOutdent()
  },
  runAllUnitTests: async () => {
    ftbLogUT("UT: runAllUnitTests")
    await cDI.components.unitTests.auth.runAllAuth()
    await cDI.components.unitTests.recipe.runAllRecipe()
  },
  UTStartSection: async (sectionName, fn) => {
    ftbIndent()
    ftbLogUT(`${"=".repeat(sectionName.length)} ${sectionName}`)
    ftbIndent()
    var res = await fn()
    ftbOutdent()
    ftbLogUT(`${"=".repeat(`${sectionName}`.length)} ${sectionName} passed`)
    ftbOutdent()
  },
  UTIndent: async (sectionName, testTitle, fn, validator, log) => {
    if (log) {
      ftbLogUT(`##${sectionName} - ${testTitle}`)
      ftbIndent()
    }
    var res = await fn()
    if (log) {
      if (!validator || validator(res)) { ftbLogUT('+++passed') }
      else { ftbLogUT(`---failed`) }
      ftbOutdent()
    }
    if (!validator || validator(res)) { return true }
    else { return false }
  }
}
