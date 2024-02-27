$(async () => {
  ftbLog("Document ready, firing strap function")
  await ftbLoadComponent("components/big6", "cargoHold", $("html"))
  await ftbLoadComponent("components/big6", "header", $("body"))
  await ftbLoadComponent("components/big6", "contentMain", $("body"))
  // if (cDI.config.debugMode) { await ftbLoadComponent("components/big6", "devZone", $("#cargoHold")) }
  // await ftbLoadComponent("components/big6", "router")
  if (cDI.config.unitTest) { await ftbLoadComponent("components/big6", "unitTests") }
})
