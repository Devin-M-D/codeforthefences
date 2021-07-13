cDI.components.unitTests.recipe = {
  runAllEditRecipe: async () => {
    var recipeCard = $(".recipeCard[recipeid = 1]")
    var editButton = recipeCard.find(".recipeEdit")
    if (0) {
      await cDI.awaitableInput("click", editButton)

      var searchSelectPane = await cDI.awaitableInput("click", $(".txtIngSubstance.Ing0"))
      await cDI.awaitableInput("click", searchSelectPane.find(":contains('parsley'):last"))

      var searchSelectPane = await cDI.awaitableInput("click", $(".txtIngUoM.Ing0"))
      await cDI.awaitableInput("click", searchSelectPane.find(":contains('cup'):last"))

      var searchSelectPane = await cDI.awaitableInput("click", $(".txtIngUoM.Ing1"))
      await cDI.awaitableInput("click", searchSelectPane.find(":contains('tablespoon'):last"))

      var searchSelectPane = await cDI.awaitableInput("click", $(".txtIngSubstance.Ing2"))
      await cDI.awaitableInput("click", searchSelectPane.find(":contains('sausage'):last"))

      var searchSelectPane = await cDI.awaitableInput("click", $(".txtIngUoM.Ing2"))
      await cDI.awaitableInput("click", searchSelectPane.find(":contains('large'):last"))

      // var saveButton = recipeCard.find(".shpCheck")
      // await cDI.awaitableInput("click", saveButton)
    }
  }
}
