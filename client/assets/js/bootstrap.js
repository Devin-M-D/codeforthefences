//jquery .ready()
$(async () => {
  //#region debugMode explanation
  //debug console logging severity should be expressed in linux style e.g.
  //TODO: this can be extended into front-end logging
  //debugMode = 0: Prod (don't log)
  //debugMode = 1: Dev (Component load notifications, most development purposes)
  //debugMode = 2: Verbose (unit tests, etc.)
  //debugMode = 3: both Dev and Verbose
  //debugMode = 4: all AJAX calls
  //debugMode = 5: both Dev and all AJAX calls
  //debugMode = 6: both Verbose and all AJAX calls
  //debugMode = 7: log everything
  //#endregion
  cDI.debugMode = 0
  cDI.debugConf = {
    username: "user1",
    password: "test"
  }
  console.log("Document ready, firing strapApp()")
  await strapApp(0)
})
