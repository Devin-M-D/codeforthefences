cDI.components.unitTests.recipe = {
  runAllEditRecipe: async () => {
    var recipeCard = $(".recipeCard[recipeid = 1]")
    var editButton = recipeCard.find(".recipeEdit")
    await cDI.awaitableInput("click", editButton)
    // 
    // var searchSelectPane = await cDI.awaitableInput("click", $(".txtIngSubstance.Ing0"))
    // await cDI.awaitableInput("click", searchSelectPane.find(":contains('parsley'):last"))
    //
    // var saveButton = recipeCard.find(".shpCheck")
    // await cDI.awaitableInput("click", saveButton)
  }
}
