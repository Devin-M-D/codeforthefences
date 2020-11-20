cDI.widgets.recipeCard = {
  editCard: async (target) => {
    cDI.widgets.recipeCard.createIngPane(target, true)
    cDI.widgets.recipeCard.setEditMode(target, 1)
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
      ing += `<input class="txtIngFood Ing${ingNum}" type="text" value="${ingName}" onfocus="cDI.components.searchSelect.focus($(this), '/crud/Food/r')" />`
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
  setEditMode: (target, mode = 0) => {
    if (mode == 0){
      var editBox = target.find(".recipeEdit")
      editBox.html(`<span class="shpPencil"></span>`)
      cDI.addAsyncOnclick(editBox.find(".shpPencil"), async (e) => {
        cDI.widgets.recipeCard.editCard($(e.target).parent().parent().parent())
      })
    }
    else {
      target.find(".recipeEdit").html(`
        <span class="shpCheck" onclick="cDI.widgets.recipeCard.saveEdits($(this).parent().parent().parent())">Save</span>
        <span class="shpX" onclick="cDI.widgets.recipeCard.setEditMode($(this).parent().parent().parent())"></span>
      `)
    }
  },
  createIngPane: (target, editable = false) => {
    var recipe = target.data("recipe")
    target.find(".cardIngs").empty()
    recipe.recipeIngredient.forEach((ingredient, x) => {
      var ingLine = cDI.widgets.recipeCard.createIngLine(ingredient, editable)
      target.find(".cardIngs").append(ingLine)

      var line = target.find(`.cardIngs > .cardIngredient.Ing${ingredient.ingredientNum}`)
      var txtIngUoM = line.find(`.txtIngUoM.Ing${ingredient.ingredientNum}`)
      txtIngUoM.on("focusin", (e, s) => { cDI.components.searchSelect.focus($(e.target), '/crud/UoM/r', 'name') })
    })
  }
}

async function buildRecipeCardList(recipes) {
  var cardList = []
  recipes.map(async recipe => {
    // for (var x = 0; x < 11; x++){
      cardList.push(await buildRecipeCard(recipe))
    // }
  })
  return cardList
}

async function buildRecipeCard(recipe) {
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

  //ingredients
  cDI.widgets.recipeCard.createIngPane(card, false)

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
  cDI.widgets.recipeCard.setEditMode(card, 0)
  return card
}
