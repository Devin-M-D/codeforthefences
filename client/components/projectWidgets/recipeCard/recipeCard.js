cDI.widgets.recipeCard = {
  buildRecipeCardList: async (recipes) => {
    var cardList = []
    recipes.map(async recipe => {
      // for (var x = 0; x < 11; x++){
        cardList.push(await cDI.widgets.recipeCard.buildRecipeCard(recipe))
      // }
    })
    return cardList
  },
  buildRecipeCard: async (recipe) => {
    function addIngredientsToSteps(step) {
      recipe.recipeIngredient.map(x => x.ingredient).forEach((ingredient, x) => {
        step.text = step.text.replace(`{i${x}}`, `<span class="stepIngredient">${ingredient.ingredientFood[0].foodType.name}</span>`)
      })
    }
    function addToolsToSteps(step) {
      recipe.tools.forEach((tool, x) => {
        step.text = step.text.replace(`{t${x}}`, `<span class="stepTool">${tool.name}</span>`)
      })
    }

    var card = $("#cargoHold").find(".recipeCard").clone()
    card.find(".recipeName").html(recipe.name)
    card.data("recipe", recipe)

    //tools
    recipe.tools = recipe.recipeTool
      .map(x => x = x.tool )

    //steps
    recipe.steps = recipe.recipeStep
      .sort((a, b) => a.stepNum < b.stepNum)
      .map(x => x = x.step )
    recipe.recipeStep.forEach((recipeStep, x) => {
      var step = recipeStep.step

      if (step.text.indexOf("{i") != -1) { addIngredientsToSteps(step) }
      if (step.text.indexOf("{t") != -1) { addToolsToSteps(step) }

      var stepList = ``
      stepList += `
      <span class="cardStep rows unwrap">
        <span class="rowNumber">${x + 1})&nbsp;</span>
        <span class="displayBlock leftCopy">${step.text}</span>
      </span>`
      card.find(".cardSteps").append(stepList)
    })

    cDI.widgets.recipeCard.setEditMode(card, false)
    return card
  },
  createIngPane: (card, editable = false) => {
    var recipe = card.data("recipe")
    card.find(".cardIngs").empty()
    recipe.recipeIngredient.forEach((ingredient, x) => {
      var ingLine = cDI.widgets.recipeCard.createIngLine(ingredient, editable)
      card.find(".cardIngs").append(ingLine)
      if (editable){
        var line = card.find(`.cardIngs > .cardIngredient.Ing${ingredient.ingredientNum}`)

        var txtIngUoM = line.find(`.txtIngUoM.Ing${ingredient.ingredientNum}`)
        txtIngUoM.on("click", (e, s) => { cDI.components.searchSelect.buildSearchPane($(e.target), '/crud/UoM/r', 'name') })

        var txtIngFood = line.find(`.txtIngFood.Ing${ingredient.ingredientNum}`)
        txtIngFood.on("click", (e, s) => { cDI.components.searchSelect.buildSearchPane($(e.target), '/crud/foodType/r', 'name') })
      }
    })
  },
  createIngLine: (ingredient, editable = false) => {
    var ingNum = ingredient.ingredientNum
    ingredient = ingredient.ingredient
    var ingName = ingredient.ingredientFood[0].foodType.name
    if (ingredient.quantity != 1 && cDI.utils.isDef(ingredient.ingredientFood[0].foodType.plural)) {
      ingName = ingredient.ingredientFood[0].foodType.plural
    }

    var ing = `<span class="cardIngredient algnSS leftCopy fitW unwrap Ing${ingNum}">`
    if (editable){
      ing += `<input class="txtIngQuant Ing${ingNum}" type="text" value="${ingredient.quantity}" />`
      ing += `<input class="txtIngUoM Ing${ingNum}" type="text" value="${ingredient.ingredientUoM[0].UoM.name}" />`
      ing += `<input class="txtIngFood Ing${ingNum}" type="text" value="${ingName}" />`
    }
    else {
      ing += `
        <span class="noGrow">${ingNum})&nbsp;</span>
        <span class="displayBlock leftCopy">${ingredient.quantity} ${ingredient.ingredientUoM[0].UoM.abbreviation} ${ingName}</span>
        `
    }
    ing += `</span>`
    return ing
  },
  setEditMode: (card, mode = 0) => {
    cDI.widgets.recipeCard.buildEditBox(card, mode)
    if (mode == 0){
      cDI.widgets.recipeCard.createIngPane(card, false)
    }
    else {
      cDI.widgets.recipeCard.createIngPane(card, true)
    }
  },
  buildEditBox: (card, mode = 0) => {
    if (mode == 0){
      var editBox = card.find(".recipeEdit")
      editBox.html(`<span class="shpPencil absCen"></span>`)
      cDI.addAsyncOnclick(editBox, async (e) => {
        cDI.widgets.recipeCard.setEditMode($(e.target).parent().parent().parent(), 1)
      })
    }
    else {
      card.find(".recipeEdit").html(`
        <span class="absCen fillH">
          <span class="shpCheck" onclick="cDI.widgets.recipeCard.saveChanges($(this).parent().parent().parent())"></span>
        </span>
        <span class="absCen fillH">
          <span class="btnCancel" onclick="cDI.widgets.recipeCard.setEditMode($(this).parent().parent().parent())">X</span>
        </span>
      `)
      cDI.addAsyncOnclick(card.find(".recipeEdit").find(".shpX"), async (e) => {
        cDI.widgets.recipeCard.setEditMode($(e.target).parent().parent().parent(), 0)
      })
    }
  },
  saveChanges: async (target) => {
    var recipe = target.data("recipe")
    console.log(recipe)
    recipe.recipeIngredient.forEach((ingredient, i) => {
      console.log(i, ingredient)
      var recipeFoodType = ingredient.ingredient.ingredientFood[0].foodType.name
      console.log(recipeFoodType)
      var ingLine = target.find(`.cardIngredient.Ing${i + 1}`)
      if (ingLine != null){
        console.log(ingLine)
        var foodInput = ingLine.find(".txtIngFood")
        console.log(foodInput)
        var foodType = foodInput.val()
        console.log(foodType)
      }
    })
    cDI.services.recipe.save(recipe)
    //cDI.widgets.recipeCard.setEditMode(target, 0)
  }
}
