//#region debugMode explanation
//debugMode = 0: Prod (don't log)
//debugMode = 1: Dev (Component load notifications, most development purposes)
//debugMode = 2: Verbose (unit tests, etc.)
//debugMode = 3: 1 + 2
//debugMode = 4: all AJAX calls
//debugMode = 5: 1 + 4
//debugMode = 6: 2 + 4
//debugMode = 7: 1 + 2 + 4
//#endregion
cDI.config.debugMode = 1
cDI.config.user = {
  username: "user1",
  password: "testpass"
}
//unitTest 1 = run all
//unitTest 2 = run custom scenario
//unitTest 3 = just log in if necessary
cDI.config.unitTest = 0
