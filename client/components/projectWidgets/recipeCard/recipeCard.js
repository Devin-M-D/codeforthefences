async function buildRecipeCardList(recipes) {
  console.log(recipes)
  var cardList = []
  recipes.map(async recipe => {
    cardList.push(await buildRecipeCard(recipe))
  })
  return cardList
}

async function buildRecipeCard(recipe) {
  function addIngredientsToSteps(step) {
    recipe.ingredients.forEach((ingredient, x) => {
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

  //tools
  recipe.tools = recipe.recipeTool
    .map(x => x = x.tool )
  console.log(recipe.tools)

  //ingredients
  recipe.ingredients = recipe.recipeIngredient
    .sort((a, b) => a.ingredientNum < b.ingredientNum)
    .map(x => x = x.ingredient )
  recipe.ingredients.forEach((ingredient, x) => {
    var ingName = ingredient.ingredientFood[0].foodType.name
    if (ingredient.quantity != 1 && cDI.utils.isDef(ingredient.ingredientFood[0].foodType.plural)) {
      ingName = ingredient.ingredientFood[0].foodType.plural
    }
    var ingList = ``
    ingList += `
    <span class="cardIngredient algnSS leftCopy">
      ${x + 1}) ${ingredient.quantity} ${ingredient.ingredientUoM[0].UoM.abbreviation} ${ingName}
    </span>`
    card.find(".cardLeft").append(ingList)
  })

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
      <span style="flex-grow: 1;">${x + 1})&nbsp;</span>
      <span class="displayBlock leftCopy"  style="flex-grow: 9;">${step.text}</span>
    </span>`
    card.find(".cardRight").append(stepList)
  })

  return card
}
