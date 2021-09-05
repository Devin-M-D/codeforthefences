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
    cDI.addAwaitableInput("click", card.find(".ingTitle > .btnIcon > .shpPlus").parent(), async e => {
      var parentCard = $(e.target).closest(".recipeCard")
      var recipe = parentCard.data("editedrecipe")
      var newIng = cDI.services.recipe.newIngredient(recipe.id, recipe.ingredients.length)
      recipe.ingredients.push(newIng)
      cDI.components.recipeCard.ingredientPane.createIngPane(parentCard, 1)
    })
    sorted.filter(x => !x.edited || !x.edited.includes("removed")).forEach(ingredient => {
      var ingLine = cDI.components.recipeCard.ingredientPane.createIngLine(ingredient, editMode)
      ingLine += sorted[sorted.length - 1].ingredientIndex != ingredient.ingredientIndex ? `<span class="rule horiz slim"></span>` : ``
      card.find(".cardIngs").append(ingLine)
      if (editMode){
        var line = card.find(`.cardIngredient[ingredientIndex=${ingredient.ingredientIndex}]`)

        var txtIngQuantity = line.find(`.txtIngQuantity[ingredientIndex=${ingredient.ingredientIndex}]`)
        cDI.addAwaitableInput("keyup", txtIngQuantity, async e => {
          await cDI.components.recipeCard.ingredientPane.acceptIngChange($(e.target))
        })

        var txtIngUoM = line.find(`.txtIngUoM[ingredientIndex="${ingredient.ingredientIndex}"]`)
        cDI.components.recipeCard.ingredientPane.addClick(txtIngUoM, "UoM", "name")

        var txtIngFoodVariant = line.find(`.txtIngFoodVariant[ingredientIndex="${ingredient.ingredientIndex}"]`)
        cDI.components.recipeCard.ingredientPane.addClick(txtIngFoodVariant, "foodVariant", "name")

        var txtIngSubstance = line.find(`.txtIngSubstance[ingredientIndex="${ingredient.ingredientIndex}"]`)
        cDI.components.recipeCard.ingredientPane.addClick(txtIngSubstance, "substance", "name")

        var txtIngPrepStyle = line.find(`.txtIngPrepStyle[ingredientIndex="${ingredient.ingredientIndex}"]`)
        cDI.components.recipeCard.ingredientPane.addClick(txtIngPrepStyle, "prepStyle", "name")

        cDI.addAwaitableInput("click", line.find(".shpMinus").parent(), async e => {
          await cDI.components.recipeCard.ingredientPane.acceptRemoval(card, $(e.target).closest(".cardIngredient").attr("ingredientIndex"))
        })
      }
    })
  },
  addClick: (textbox, obj, field) => {
    cDI.addAwaitableInput("click", textbox, async e => {
      var searchSelectPane = await cDI.components.searchSelect.buildSearchPane(
        $(e.target), `Please select a ${obj} for the ingredient`, `/crud/${obj}/r`, field,
        await cDI.components.recipeCard.ingredientPane.acceptIngChange,
        true, `crud/${obj}/c`
      )
      return searchSelectPane
    })
  },
  createIngLine: (ingredient, editMode) => {
    var iParts = cDI.services.recipe.getIngredientPlaintext(ingredient)
    var ing = `
      <span class="cardIngredient leftCopy rows autoH algnSC rounded" ingredientIndex="${iParts.idx}">
        <span class="ingIdx absCen" style="flex-basis:50px;">-&nbsp;</span>
    `
    if (editMode){
      ing += `<span class="wrap autoH algnSC">`
        ing += `<span class="fauxrder autoW autoH"><span contenteditable="true" class="txtIngQuantity autoW autoH rounded" ingredientIndex="${iParts.idx}" ingredientProp="quantity">${iParts.quantity}</span></span>`
        ing += `<span class="fauxrder autoW autoH"><span contenteditable="true" class="txtIngUoM autoW autoH rounded" ingredientIndex="${iParts.idx}" ingredientProp="UoM">${iParts.UoM}</span></span>`
        ing += iParts.foodVariant
          ? `<span class="fauxrder autoW autoH"><span contenteditable="true" class="txtIngFoodVariant autoW autoH rounded" ingredientIndex="${iParts.idx}" ingredientProp="foodVariant">${iParts.foodVariant}</span></span>`
          : cDI.stdIcons.btnAddRemove("add", 55, "btnAddfoodVariant")
        ing += `<span class="fauxrder autoW autoH"><span contenteditable="true" class="txtIngSubstance autoW autoH rounded" ingredientIndex="${iParts.idx}" ingredientProp="substance">${iParts.substance}</span></span>`
        ing += iParts.prepStyle
          ? `<span class="fauxrder autoW autoH">(<span contenteditable="true" class="txtIngPrepStyle autoW autoH rounded" ingredientIndex="${iParts.idx}" ingredientProp="prepStyle">${iParts.prepStyle}</span>)</span>`
          : cDI.stdIcons.btnAddRemove("add", 55, "btnAddprepStyle")
      ing += `</span>`
      ing += cDI.stdIcons.btnAddRemove("remove")
    }
    else {
      ing += `
        <span class="displayBlock leftCopy">${iParts.quantity} ${iParts.UoM}${iParts.foodVariant ? ` ` : ``}${iParts.foodVariant} ${iParts.substance}${iParts.prepStyle ? ` (` : ``}${iParts.prepStyle}${iParts.prepStyle ? `)` : ``}</span>
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

    if (ingredientProp == "foodVariant") {
      if (isNew || origIng.foodVariantId != newVal.id) {
        editedIng.foodVariantId = newVal.id
        editedIng.foodVariantName = newVal.name
        editedIng.foodVariantAbbr = newVal.abbreviation
        if (!isNew) {
          if (editedIng.edited.indexOf("foodVariant") == -1)  { editedIng.edited.push("foodVariant") }
        }
      }
      if (isNew || origIng.foodVariantId == newVal.id) {
        editedIng.edited = editedIng.edited.filter(x => x != "foodVariant")
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

    if (ingredientProp == "prepStyle") {
      if (isNew || origIng.prepStyleId != newVal.id) {
        editedIng.prepStyleId = newVal.id
        editedIng.prepStyleName = newVal.name
        if (!isNew) {
          if (editedIng.edited.indexOf("prepStyle") == -1)  { editedIng.edited.push("prepStyle") }
        }
      }
      if (isNew || origIng.prepStyleId == newVal.id) {
        editedIng.edited = editedIng.edited.filter(x => x != "prepStyle")
      }
    }

    if (editedIng.edited.length == 0) { delete editedIng.edited }

    await cDI.components.recipeCard.stepPane.reload(card, 1)
    cDI.components.recipeCard.setName(card, cDI.components.recipeCard.getName(card))
  },
  acceptRemoval: async (card, index) => {
    var removedIng = card.data("editedrecipe").ingredients.find(x => x.ingredientIndex == index)
    removedIng.ingredientIndex = null
    removedIng.edited = removedIng.edited || []
    removedIng.edited = ["removed"]

    card.data("editedrecipe").ingredients.forEach(x => {
      if (x.ingredientIndex > index && (!x.edited || !x.edited.includes("removed"))) {
        x.ingredientIndex = x.ingredientIndex - 1
        x.edited = x.edited || []
        if (!x.edited.includes("ingredientIndex")){ x.edited.push("ingredientIndex") }
      }
    });
    await cDI.components.recipeCard.ingredientPane.createIngPane(card, 1)
    cDI.components.recipeCard.setName(card, cDI.components.recipeCard.getName(card))
  }
}
