$(async () => {
  console.log("Document ready, firing strap function")

  var cargoHold = await cDI.asyncGet("components/big5/cargoHold/cargoHold.html")
  $("body").append(cargoHold);
  await strapCargoHold()

  var header = await cDI.asyncGet("components/big5/header/header.html")
  $("body").append(header);
  await strapHeader()

  var contentMain = await cDI.asyncGet("components/big5/contentMain/contentMain.html")
  $("body").append(contentMain);
  await strapContentMain()

  var footer = await cDI.asyncGet("components/big5/footer/footer.html")
  $("body").append(footer);
  // await strapFooter()

  if (cDI.config.unitTest > 0) {
    var unitTests = await cDI.asyncGet("components/big5/unitTests/unitTests.html")
    $("body").append(unitTests)
    await strapUnitTests()
  }
})
