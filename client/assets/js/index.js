$(async () => {
  console.log("Document ready, firing strap function")

  var cargoHold = await cDI.asyncGet("components/globals/cargoHold/cargoHold.html")
  $("body").append(cargoHold);
  await strapCargoHold()

  var header = await cDI.asyncGet("components/globals/header/header.html")
  $("body").append(header);
  await strapHeader()

  var contentMain = await cDI.asyncGet("components/globals/contentMain/contentMain.html")
  $("body").append(contentMain);
  await strapContentMain()

  if (cDI.config.unitTest > 0) {
    var unitTests = await cDI.asyncGet("components/globals/unitTests/unitTests.html")
    $("body").append(unitTests)
    await strapUnitTests()
  }
})
