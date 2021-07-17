cDI.components.recipeCard.ingredientPane = {
  init: () => {

  },
  createIngPane: (card, editMode = false) => {
    var recipe = card.data("editedrecipe") != undefined ? card.data("editedrecipe") : card.data("recipe")

    card.find(".cardIngs").empty()
    var sorted = recipe.ingredients.sort((a, b) => a.idx < b.idx)

    card.find(".cardIngs").append(`
      <span class="rows autoH algnSpread">
        <span class="autoH autoW bold">Ingredients</span>
        <span class="shpPlus" style="flex-basis: 200px;"></span>
      </span>`)
    sorted.forEach(ingredient => {
      var ingLine = cDI.components.recipeCard.ingredientPane.createIngLine(ingredient, editMode)
      ingLine += sorted[sorted.length - 1].idx != ingredient.idx ? `<span class="spacer horiz slim"></span>` : ``
      card.find(".cardIngs").append(ingLine)
      if (editMode){
        var line = card.find(`.cardIngs > .cardIngredient.Ing${ingredient.idx}`)

        var txtIngQuantity = line.find(`.txtIngQuantity.Ing${ingredient.idx}`)
        cDI.addAwaitableInput("click", txtIngQuantity, async (e, s) => {
          return $(e.target)
        })
        cDI.addAwaitableInput("keyup", txtIngQuantity, async (e, s) => {
          await cDI.components.recipeCard.ingredientPane.acceptIngChange(e.target)
        })

        var txtIngUoM = line.find(`.txtIngUoM.Ing${ingredient.idx}`)
        cDI.addAwaitableInput("click", txtIngUoM, async (e, s) => {
          return await cDI.components.searchSelect.buildSearchPane(
            $(e.target), '/crud/UoM/r', 'name',
            await cDI.components.recipeCard.ingredientPane.acceptIngChange,
            true, "crud/UoM/c"
          )
        })

        var txtIngSubstance = line.find(`.txtIngSubstance.Ing${ingredient.idx}`)
        cDI.addAwaitableInput("click", txtIngSubstance, async (e, s) => {
          return await cDI.components.searchSelect.buildSearchPane(
            $(e.target), '/crud/substance/r', 'name',
            await cDI.components.recipeCard.ingredientPane.acceptIngChange,
            true, "crud/substance/c"
          )
        })
      }
    })
  },
  createIngLine: (ingredient, editMode = false) => {
    var ingNum = ingredient.idx
    var ingName = ingredient.substanceName
    if (ingredient.ingredientQuantity != 1 && cDI.utils.isDef(ingredient.plural)) {
      ingName = ingredient.plural
    }
    var UoMName = !editMode && ingredient.UoMAbbr ? UoMName = ingredient.UoMAbbr : ingredient.UoMName

    var ing = `
      <span class="cardIngredient leftCopy Ing${ingNum} rows autoH algnSS fauxrder">
        <span class="ingIdx algnSS" style="flex-basis:50px;">-&nbsp;</span>
    `
      // <span style="flex-basis:50px;">${ingNum}.&nbsp;</span>
    if (editMode){
      ing += `<span class="wrap autoH autoW algnSS">`
        ing += `<span class="fauxrder autoW autoH"><span class="txtIngQuantity Ing${ingNum} autoW autoH rounded" contenteditable="true">${(new Fraction(ingredient.ingredientQuantity)).toFraction()}</span></span>`
        ing += `<span class="fauxrder autoW autoH"><span class="txtIngUoM Ing${ingNum} autoW autoH rounded" contenteditable="true">${UoMName}</span></span>`
        ing += `<span class="fauxrder autoW autoH"><span class="txtIngSubstance Ing${ingNum} autoW autoH rounded" contenteditable="true">${ingName}</span></span>`
      ing += `</span>`
    }
    else {
      ing += `
        <span class="displayBlock leftCopy">${ingredient.ingredientQuantity} ${UoMName} ${ingName}</span>
        `
    }
    ing += `</span>`
    return ing
  },
  acceptIngChange: async (input) => {
    var card = input.closest(".recipeCard")
    var origRecipe = card.data("recipe")
    var editedRecipe = card.data("editedrecipe")
    var inputClasses = input.attr('class').split(" ")
    var idx = inputClasses.filter(x => x.indexOf("Ing") == 0)[0].replace("Ing", "")

    var origIng = origRecipe.ingredients.find(x => x.idx == idx)
    var editedIng = editedRecipe.ingredients.find(x => x.idx == idx)

    var newVal = input.data("searchselectrecord")

    editedIng.edited = editedIng.edited || []

    if (inputClasses.indexOf("txtIngQuantity") != -1) {
      if (origIng.ingredientQuantity != $(input).html()) {
        editedIng.ingredientQuantity = $(input).html()
        if (editedIng.edited.indexOf("quantity") == -1)  { editedIng.edited.push("quantity") }
        // editedRecipe.edited = true
      }
      else {
        editedIng.edited = editedIng.edited.filter(x => x != "quantity")
        // editedRecipe.edited = false
      }
    }

    if (inputClasses.indexOf("txtIngSubstance") != -1) {
      if (origIng.substanceId != newVal.id) {
        editedIng.substanceId = newVal.id
        editedIng.substanceName = newVal.name
        if (editedIng.edited.indexOf("substance") == -1)  { editedIng.edited.push("substance") }
        // editedRecipe.edited = true
      }
      else {
        editedIng.substanceName = origIng.substanceName
        editedIng.edited = editedIng.edited.filter(x => x != "substance")
        // editedRecipe.edited = false
      }
    }

    if (inputClasses.indexOf("txtIngUoM") != -1) {
      if (origIng.UoMId != newVal.id) {
        editedIng.UoMId = newVal.id
        editedIng.UoMName = newVal.name
        editedIng.UoMAbbr = newVal.abbreviation
        if (editedIng.edited.indexOf("UoM") == -1)  { editedIng.edited.push("UoM") }
        // editedRecipe.edited = true
      }
      else {
        editedIng.UoMName = origIng.UoMName
        editedIng.UoMAbbr = origIng.UoMAbbr
        editedIng.edited = editedIng.edited.filter(x => x != "UoM")
        // editedRecipe.edited = false
      }
    }
    if (editedIng.edited.length == 0) { delete editedIng.edited }

    await cDI.components.recipeCard.stepPane.reload(card, 1)
  }
}
