$(async () => {
  console.log("Document ready, firing strap function")
  await cDI.remote.loadComponent($("body"), "components/big5", "contentMain")
  await cDI.remote.loadComponent($("body"), "components/big5", "cargoHold", 0)
  await cDI.remote.loadComponent($("body"), "components/big5", "header", 0)
  await cDI.remote.loadComponent($("body"), "components/big5", "footer")
  await cDI.remote.loadComponent($("#cargoHold"), "components/genericWidgets", "router")
  await cDI.remote.loadComponent($("#cargoHold"), "components/big5", "unitTests")
})
