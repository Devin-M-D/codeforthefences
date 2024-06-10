cDI.components.unitTests = {
  section: `Unit Test main`,
  init: async () => {
    ftbUT = ftbCmp("unitTests")
    var unitTestLevel = cDI.config.unitTest

    var currDebugMode = cDI.config.debugMode
    if (unitTestLevel != 0){
      await cDI.remote.asyncGetScript("/components/big6/unitTests/auth/utAuth.js")
      await cDI.remote.asyncGetScript("/components/big6/unitTests/recipe/utRecipe.js")
      await cDI.remote.asyncGetScript("/components/big6/unitTests/games/utGames.js")
      await cDI.remote.asyncGetScript("/components/big6/unitTests/header/utHeader.js")
      if ([0, 1, 4, 5].indexOf(currDebugMode) != -1) { cDI.config.debugMode = 2 }
    }

    if (unitTestLevel == 1){
      await ftbUT.runAllUnitTests(1)
    }
    else if (unitTestLevel == 2){
      await ftbUT.customDevScenario(1)
    }
    else if (unitTestLevel == 3){
      await ftbUT.loginIfNeccessary(1)
    }

    cDI.config.debugMode = currDebugMode
  },
//#region unit test main 1/2/3
  runAllUnitTests: async (log) => {
    return await ftbUT.UTLogSection("Unit Tests set to level 1: runAllUnitTests",
      async () => {
        await ftbUT.header.runAllHeader()
        await ftbUT.auth.runAllAuth()
        await ftbUT.recipe.runAllRecipe()
      })
  },
  customDevScenario: async (log) => {
    return await ftbUT.UTLogSection("Unit Tests set to level 2: customDevScenario",
      async () => {
        //await ftbUT.loginIfNeccessary()
      })
  },
  loginIfNeccessary: async () => {
    return await ftbUT.UTLogSection(
      "Unit Tests set to level 3: loginIfNeccessary (just login if the session has expired)",
      async () => {
        ftbIndent()
        //if not logged in, use saved testUser or save first testUser
        if (!cDI.utils.isDef(cDI.session.token)) {
          ftbLogUT(`Not logged in, logging with ${cDI.session.testuser} and ${cDI.session.testpass}`)
          if (!cDI.session.testuser) { ftbSetLogin(0) }
          await ftbUT.auth.login()
          ftbLogUT(`login succeeded token: ${cDI.session.token.substr(0, 5)}...`)
        }
        ftbOutdent()
      }
    )
  },
//#endregion
//#region indentation wrappers
  UTLogSection: async (sectionName, fn) => {
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
