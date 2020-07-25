async function getAllRecipes() {
  var callRes = await cDI.remote.remoteCall("/crud/recipe/r/", { expectMany: true })
  return cDI.utils.extrudeFlatGraph(callRes.payload, "recipe")
}
async function buildRecipeCard(recipe){
  var card = $("#cargoHold > .recipeCard")
  card = card.clone()
  recipe.recipeIngredient = recipe.recipeIngredient.sort((a, b) => a.ingredientNum < b.ingredientNum)
  recipe.recipeIngredient.forEach(recipeIngredient => {
    var ingredient = recipeIngredient.ingredient
    var ingName = ingredient.ingredientFood[0].foodType.name
    if (ingredient.quantity != 1 && cDI.utils.isDef(ingredient.ingredientFood[0].foodType.plural)) {
      ingName = ingredient.ingredientFood[0].foodType.plural
    }
    var ingList = ``
    ingList += `
    <span class="cardIngredient">
      ${ingredient.quantity} ${ingredient.ingredientUoM[0].UoM.abbreviation} ${ingName}
    </span>`
    card.find(".cardLeft").append(ingList)
  })
  return card

  // recipe.recipeIngredient = recipe.recipeIngredient.sort((a, b) => a.ingredientNum < b.ingredientNum)
  // recipe.recipeIngredient.forEach(recipeIngredient => {
  //   var ingredient = recipeIngredient.ingredient
  //   var ingName = ingredient.ingredientFood[0].foodType.name
  //   if (ingredient.quantity != 1 && cDI.utils.isDef(ingredient.ingredientFood[0].foodType.plural)) {
  //     ingName = ingredient.ingredientFood[0].foodType.plural
  //   }
  //   retVal += `
  //   <span class="cardIngredient">
  //     ${ingredient.quantity} ${ingredient.ingredientUoM[0].UoM.abbreviation} ${ingName}
  //   </span>`
  // })
  // retVal += `
  //   </span>
  //   <span class="spacer vert"></span>
  //   <span class="cardRight fitH">`
  //
  // recipe.recipeStep.forEach(recipeStep => {
  //   var step = recipeStep.step
  //   var stepText = step.text
  //   retVal += `
  //   <span class="cardStep">
  //     ${stepText}
  //   </span>`
  // })
  // retVal += `
  //   </span>
  // </span>`
  // return retVal
}
