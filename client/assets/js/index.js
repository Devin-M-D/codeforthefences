$(async () => {
  ftbLog("Document ready, firing strap function")

  cDI.session.validateLogin()

  //services
  await cDI.remote.asyncGetScript(`/js/services/vikingChessService.js`)

  //draw big6
  await ftbLoadComponent("components/big6", "cargoHold", $("html"))
  await ftbLoadComponent("components/big6", "header", $("body"))
  await ftbLoadComponent("components/big6", "contentMain", $("body"))
  await ftbLoadComponent("components/big6", "router")
  // if (cDI.config.debugMode) { await ftbLoadComponent("components/big6", "devZone", $("#cargoHold")) }
  if (cDI.config.unitTest) { await ftbLoadComponent("components/big6", "unitTests") }
})
