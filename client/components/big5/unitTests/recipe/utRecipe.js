cDI.components.unitTests.recipe = {
  runAllEditRecipe: async () => {
    var recipeCard = $(".recipeCard[recipeid = 1]")
    var editButton = recipeCard.find(".recipeEdit")
    await cDI.awaitableInput("click", editButton)

    var searchSelectPane = await cDI.awaitableInput("click", $(".txtIngFood.Ing1"))
    await cDI.awaitableInput("click", searchSelectPane.find(".btnClearInput"))

    searchSelectPane.find(".searchSelectInputTemp").val("test")
    cDI.awaitableInput("keyup", searchSelectPane.find(".searchSelectInputTemp"))

    // await cDI.awaitableInput("click", searchSelectPane.find(".option1"))

    // var saveButton = recipeCard.find(".shpCheck")
    // await cDI.awaitableInput("click", saveButton)
  }
}
