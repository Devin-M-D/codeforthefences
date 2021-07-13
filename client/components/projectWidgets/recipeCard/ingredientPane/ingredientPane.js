cDI.components.recipeCard.ingredientPane = {
  init: () => {

  },
  createIngPane: (card, editable = false) => {
    var recipe = card.data("editedrecipe") != undefined ? card.data("editedrecipe") : card.data("recipe")

    card.find(".cardIngs").empty()
    recipe.ingredients.sort((a, b) => a.idx < b.idx).forEach((ingredient, x) => {
      var ingLine = cDI.components.recipeCard.ingredientPane.createIngLine(ingredient, editable)
      card.find(".cardIngs").append(ingLine)
      if (editable){
        var line = card.find(`.cardIngs > .cardIngredient.Ing${ingredient.idx}`)

        var txtIngUoM = line.find(`.txtIngUoM.Ing${ingredient.idx}`)
        cDI.addAwaitableInput("click", txtIngUoM, async (e, s) => {
          return await cDI.components.searchSelect.buildSearchPane(
            $(e.target), '/crud/UoM/r', 'name',
            cDI.components.recipeCard.ingredientPane.acceptIngChange,
            true, "crud/UoM/c"
          )
        })

        var txtIngSubstance = line.find(`.txtIngSubstance.Ing${ingredient.idx}`)
        cDI.addAwaitableInput("click", txtIngSubstance, async (e, s) => {
          return await cDI.components.searchSelect.buildSearchPane(
            $(e.target), '/crud/substance/r', 'name',
            cDI.components.recipeCard.ingredientPane.acceptIngChange,
            true, "crud/substance/c"
          )
        })
      }
    })
  },
  createIngLine: (ingredient, editable = false) => {
    var ingNum = ingredient.idx
    var ingName = ingredient.substanceName
    if (ingredient.quantityDecimal != 1 && cDI.utils.isDef(ingredient.plural)) {
      ingName = ingredient.plural
    }

    var ing = `<span class="cardIngredient algnSS leftCopy fitW unwrap Ing${ingNum}">`
    if (editable){
      ing += `<input class="txtIngQuant Ing${ingNum}" type="text" value="${(new Fraction(ingredient.ingredientQuantity)).toFraction()}" />`
      ing += `<input class="txtIngUoM Ing${ingNum}" type="text" value="${ingredient.UoMName}" />`
      ing += `<input class="txtIngSubstance Ing${ingNum}" type="text" value="${ingName}" />`
    }
    else {
      ing += `
        <span class="noGrow">${ingNum})&nbsp;</span>
        <span class="displayBlock leftCopy">${ingredient.ingredientQuantity} ${ingredient.UoMAbbr} ${ingName}</span>
        `
    }
    ing += `</span>`
    return ing
  },
  acceptIngChange: (input) => {
    var card = input.closest(".recipeCard")
    var origRecipe = card.data("recipe")
    var editedRecipe = card.data("editedrecipe")
    var inputClasses = input.attr('class').split(" ")
    var idx = inputClasses.filter(x => x.indexOf("Ing") == 0)[0].replace("Ing", "")

    var origIng = origRecipe.ingredients.find(x => x.idx == idx)
    var editedIng = editedRecipe.ingredients.find(x => x.idx == idx)

    var newVal = input.data("searchselectrecord")

    editedIng.edited = editedIng.edited || []

    if (inputClasses.indexOf("txtIngSubstance") != -1) {
      if (origIng.substanceId != newVal.id) {
        editedIng.substanceId = newVal.id
        editedIng.substanceName = newVal.name
        if (editedIng.edited.indexOf("substance") == -1)  { editedIng.edited.push("substance") }
      }
      else {
        editedIng.substanceName = origIng.substanceName
        editedIng.edited = editedIng.edited.filter(x => x != "substance")
      }
    }

    if (inputClasses.indexOf("txtIngUoM") != -1) {
      if (origIng.UoMId != newVal.id) {
        editedIng.UoMId = newVal.id
        editedIng.UoMName = newVal.name
        editedIng.UoMAbbr = newVal.abbreviation
        if (editedIng.edited.indexOf("UoM") == -1)  { editedIng.edited.push("UoM") }
      }
      else {
        editedIng.UoMName = origIng.UoMName
        editedIng.UoMAbbr = origIng.UoMAbbr
        editedIng.edited = editedIng.edited.filter(x => x != "UoM")
      }
    }
    if (editedIng.edited.length == 0) { delete editedIng.edited }
  }
}
