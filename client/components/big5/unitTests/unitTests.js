cDI.components.unitTests = {
  init: async () => {
    var unitTestLevel = cDI.config.unitTest

    var currDebugMode = cDI.config.debugMode
    if (unitTestLevel != 0){
      await cDI.remote.asyncGetScript("/components/big5/unitTests/auth/utAuth.js")
      await cDI.remote.asyncGetScript("/components/big5/unitTests/recipe/utRecipe.js")
      if (currDebugMode == 0) { cDI.config.debugMode = 1 }
    }

    if (unitTestLevel == 1){
      ftbLog("Unit tests set to level 1: run all")
      ftbIndent()
      await cDI.components.unitTests.runAllUnitTests()
      ftbOutdent()
    }
    else if (unitTestLevel == 2){
      ftbLog("Unit tests set to level 2: custom dev scenario")
      ftbIndent()
      await cDI.components.unitTests.customDevScenario()
      ftbOutdent()
    }
    else if (unitTestLevel == 3){
      ftbLog("Unit tests set to level 3: just login if the session has expired")
      ftbIndent()
      await cDI.components.unitTests.loginIfNeccessary()
      ftbOutdent()
    }

    cDI.config.debugMode = currDebugMode
  },
  customDevScenario: async () => {
    ftbLog("UT: customDevScenario")
    await cDI.components.unitTests.loginIfNeccessary()

    await cDI.components.unitTests.auth.runAllAuth()
    // await cDI.components.unitTests.recipe.runAllEditRecipe()
  },
  loginIfNeccessary: async () => {
    ftbLog("UT: loginIfNeccessary")
    //if not logged in, use debugConf set in bootstrap to set an impersonate
    if (!cDI.utils.isDef(cDI.session.token)) {
      ftbLog(`Not logged in, logging with ${cDI.config.user.username} and ${cDI.config.user.password}`)
      await cDI.components.unitTests.auth.login()
    }
    //if we think we're logged in, verify by making a call. Triggers an implicit logout in the remoteCall func if call result has status "e".
    else { await cDI.remote.remoteCall("/user/testToken") }
  },
  runAllUnitTests: async () => {
    ftbLog("UT: runAllUnitTests")
    await cDI.components.unitTests.auth.runAllAuth()
    await cDI.components.unitTests.recipe.runAllEditRecipe()
  }
}
