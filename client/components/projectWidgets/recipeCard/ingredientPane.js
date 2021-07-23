cDI.components.recipeCard.ingredientPane = {
  init: () => {

  },
  createIngPane: (card, editMode) => {
    var recipe = editMode ? card.data("editedrecipe") : card.data("recipe")

    card.find(".cardIngs").empty()
    var sorted = recipe.ingredients.sort((a, b) => a.ingredientIndex < b.ingredientIndex)

    card.find(".cardIngs").append(`
      <span class="ingTitle rows autoH algnSC">
        ${editMode ? `
        <span class="btnIcon" data-btnsize="55">
          <span class="shpPlus"></span>
        </span>` : ``}
        <span class="autoH autoW bold ingPaneTitle">Ingredients</span>
      </span>`)
    cDI.addAwaitableInput("click", card.find(".shpPlus").parent(), (e) => {
      var newIng = cDI.services.recipe.newIngredient(card.data("recipe").id, sorted[sorted.length - 1].ingredientIndex + 1)
      card.data("editedrecipe").ingredients.push(newIng)
      cDI.components.recipeCard.ingredientPane.createIngPane(card, 1)
    })
    sorted.filter(x => !x.edited || !x.edited.includes("removed")).forEach(ingredient => {
      var ingLine = cDI.components.recipeCard.ingredientPane.createIngLine(ingredient, editMode)
      ingLine += sorted[sorted.length - 1].ingredientIndex != ingredient.ingredientIndex ? `<span class="rule horiz slim"></span>` : ``
      card.find(".cardIngs").append(ingLine)
      if (editMode){
        var line = card.find(`.cardIngs > .cardIngredient[ingredientIndex=${ingredient.ingredientIndex}]`)

        var txtIngQuantity = line.find(`.txtIngQuantity.Ing${ingredient.ingredientIndex}`)
        cDI.addAwaitableInput("keyup", txtIngQuantity, async (e) => {
          await cDI.components.recipeCard.ingredientPane.acceptIngChange($(e.target))
        })

        var txtIngUoM = line.find(`.txtIngUoM.Ing${ingredient.ingredientIndex}`)
        cDI.components.recipeCard.ingredientPane.addClick(txtIngUoM, "UoM", "name")

        var txtIngSubstance = line.find(`.txtIngSubstance.Ing${ingredient.ingredientIndex}`)
        cDI.components.recipeCard.ingredientPane.addClick(txtIngSubstance, "substance", "name")

        cDI.addAwaitableInput("click", line.find(".shpMinus").parent(), async (e) => {
          await cDI.components.recipeCard.ingredientPane.acceptRemoval(card, $(e.target).closest(".cardIngredient").attr("ingredientIndex"))
        })
      }
    })
  },
  addClick: (textbox, obj, field) => {
    cDI.addAwaitableInput("click", textbox, async (e) => {
      return await cDI.components.searchSelect.buildSearchPane(
        $(e.target), `/crud/${obj}/r`, field,
        await cDI.components.recipeCard.ingredientPane.acceptIngChange,
        true, `crud/${obj}/c`
      )
    })
  },
  createIngLine: (ingredient, editMode) => {
    var ingIdx = ingredient.ingredientIndex
    var ingName = ingredient.substanceName
    if (ingredient.ingredientQuantity != 1 && cDI.utils.isDef(ingredient.plural)) {
      ingName = ingredient.plural
    }
    var UoMName = !editMode && ingredient.UoMAbbr ? UoMName = ingredient.UoMAbbr : ingredient.UoMName

    var ing = `
      <span class="cardIngredient leftCopy rows autoH algnSC rounded" ingredientIndex="${ingIdx}">
        <span class="ingIdx absCen" style="flex-basis:50px;">-&nbsp;</span>
    `
    if (editMode){
      ing += `<span class="wrap autoH algnSC">`
        ing += `<span class="fauxrder autoW autoH"><span contenteditable="true" class="txtIngQuantity Ing${ingIdx} autoW autoH rounded" ingredientProp="quantity">${(new Fraction(ingredient.ingredientQuantity)).toFraction()}</span></span>`
        ing += `<span class="fauxrder autoW autoH"><span contenteditable="true" class="txtIngUoM Ing${ingIdx} autoW autoH rounded" ingredientProp="UoM">${UoMName ? UoMName : ""}</span></span>`
        ing += `<span class="fauxrder autoW autoH"><span contenteditable="true" class="txtIngSubstance Ing${ingIdx} autoW autoH rounded" ingredientProp="substance">${ingName ? ingName : ""}</span></span>`
      ing += `</span>`
      ing += `<span class="btnIcon" data-btnsize="55">
                <span class="shpMinus"></span>
              </span>`
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
    var ingredientIndex = input.closest(".cardIngredient").attr("ingredientIndex")
    var ingredientProp = input.attr("ingredientProp")

    var origIng = origRecipe.ingredients.find(x => x.ingredientIndex == ingredientIndex)
    var editedIng = editedRecipe.ingredients.find(x => x.ingredientIndex == ingredientIndex)

    var newVal = input.data("searchselectrecord")

    editedIng.edited = editedIng.edited || []
    var isNew = editedIng.edited.indexOf("new") == 0

    if (ingredientProp == "quantity") {
      editedIng.ingredientQuantity = $(input).html()
      if (origIng && origIng.ingredientQuantity != $(input).html()) {
        if (editedIng.edited.indexOf("quantity") == -1)  { editedIng.edited.push("quantity") }
      }
      else {
        editedIng.edited = editedIng.edited.filter(x => x != "quantity")
      }
    }

    if (ingredientProp == "substance") {
      if (isNew || origIng.substanceId != newVal.id){
        editedIng.substanceId = newVal.id
        editedIng.substanceName = newVal.name
        if (!isNew) {
          if (editedIng.edited.indexOf("substance") == -1)  { editedIng.edited.push("substance") }
        }
      }
      if (isNew || origIng.substanceId == newVal.id) {
        editedIng.edited = editedIng.edited.filter(x => x != "substance")
      }
    }

    if (ingredientProp == "UoM") {
      if (isNew || origIng.UoMId != newVal.id) {
        editedIng.UoMId = newVal.id
        editedIng.UoMName = newVal.name
        editedIng.UoMAbbr = newVal.abbreviation
        if (!isNew) {
          if (editedIng.edited.indexOf("UoM") == -1)  { editedIng.edited.push("UoM") }
        }
      }
      if (isNew || origIng.UoMId == newVal.id) {
        editedIng.edited = editedIng.edited.filter(x => x != "UoM")
      }
    }
    if (editedIng.edited.length == 0) { delete editedIng.edited }

    await cDI.components.recipeCard.stepPane.reload(card, 1)
  },
  acceptRemoval: async (card, index) => {
    var removedIng = card.data("editedrecipe").ingredients.find(x => x.ingredientIndex == index)
    removedIng.ingredientIndex = null
    removedIng.edited = removedIng.edited || []
    if (!removedIng.edited.includes("removed")){ removedIng.edited.push("removed") }

    card.data("editedrecipe").ingredients.forEach(x => {
      if (x.ingredientIndex > index && (!x.edited || !x.edited.includes("removed"))) {
        x.ingredientIndex = x.ingredientIndex - 1
        x.edited = x.edited || []
        if (!x.edited.includes("ingredientIndex")){ x.edited.push("ingredientIndex") }
      }
    });
    await cDI.components.recipeCard.ingredientPane.createIngPane(card, 1)
  }
}
