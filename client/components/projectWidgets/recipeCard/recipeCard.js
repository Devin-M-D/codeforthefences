cDI.components.recipeCard = {
  init: async () => {
    await cDI.remote.asyncGetScript(`components/projectWidgets/recipeCard/ingredientPane.js`)
    await cDI.remote.asyncGetScript(`components/projectWidgets/recipeCard/stepPane.js`)
  },
//#region main loop
  appendList: async (counterTop, recipes) => {
    for (var x = 0; x < recipes.length; x++){
      await cDI.components.recipeCard.appendRecipeCard(counterTop, recipes[x])
    }
  },
  appendRecipeCard: async (counterTop, recipe) => {
    var recipeCard = `
    <span class="recipeCard autoH roundedWide algnSX">
      <span class="wingedHeader algnSpread autoH"  data-headerwings="20%">
        <span class="recipeStats">
          <span class="recipeTime"></span>
          <span class="recipeServings"></span>
          <span class="recipeCalories"></span>
        </span>
        <span class="recipeName header"></span>
        <span class="recipeEdit row"></span>
      </span>
      <span class="cardIngs autoH rounded fauxrder algnSX shyScroll"></span>
      <span class="rule horiz"></span>
      <span class="cardSteps autoH rounded fauxrder algnSX shyScroll"></span>
    </span>`
    counterTop.append(recipeCard)
    await cDI.components.recipeCard.buildRecipeCard($("#counterTop > .recipeCard").last(), recipe)
  },
  buildRecipeCard: async (card, recipe) => {
    cDI.components.recipeCard.setName(card, recipe.name)
    card.data("recipe", recipe)
    card.attr("recipeId", recipe["id"])
    cDI.components.recipeCard.ingredientPane.createIngPane(card, false)
    cDI.components.recipeCard.stepPane.build(card, false)
    cDI.components.recipeCard.buildEditBox(card, false)
    return card
  },
  setName: (card, name) => {
    var editsExist = cDI.components.recipeCard.editsExist(card)
    card.find(".recipeName").html(`${name}${editsExist ? `*` : ``}`)
  },
//#endregion

//#region editMode and save
  setEditMode: async (card, editMode = 0) => {
    if (editMode && card.data("editedrecipe") == undefined){
      card.data("editedrecipe", cDI.utils.clone(card.data("recipe")))
    }
    cDI.components.recipeCard.ingredientPane.createIngPane(card, editMode)
    await cDI.components.recipeCard.stepPane.reload(card, editMode)
    await cDI.components.recipeCard.buildEditBox(card, editMode)
    cDI.components.recipeCard.setName(card, cDI.components.recipeCard.getName(card))
  },
  buildEditBox: (card, editMode = 0) => {
    var editBox = card.find(".recipeEdit")
    if (editMode == 0){
      editBox.html(`<span class="btnIcon" data-btnsize="80"><span class="shpPencil absCen"></span></span>`)
      cDI.addAwaitableInput("click", editBox.find(".shpPencil").parent(), async e => {
        await cDI.components.recipeCard.setEditMode($(e.target).closest(".recipeCard"), 1)
      })
    }
    else {
      editBox.off("click")
      editBox.html(`
        <span class="btnIcon" data-btnsize="55">
          <span class="shpCheck"></span>
        </span>
        <span class="spacer5px"></span>
        <span class="btnIcon" data-btnsize="55">
          <span class="shpCancel"></span>
        </span>
      `)
      cDI.addAwaitableInput("click", editBox.find(".shpCheck").parent(), async e => {
        return await cDI.components.recipeCard.saveChanges($(e.target).closest(".recipeCard"))
      })
      cDI.addAwaitableInput("click", editBox.find(".shpCancel").parent(), async e => {
        card.removeData("editedrecipe")
        return await cDI.components.recipeCard.setEditMode($(e.target).closest(".recipeCard"), 0)
      })
    }
  },
  saveChanges: async (card) => {
    var res = await cDI.services.recipe.save(card.data("editedrecipe"))
    if (res.status == "s") {
      card.data("recipe", res.payload)
      card.removeData("editedrecipe")
    }
    await cDI.components.recipeCard.setEditMode(card, 0)
    return res.payload
  },
//#endregion

//#region utils
  editsExist: (card) => {
    var editedRecipe = card.data("editedrecipe")
    if (editedRecipe) {
      var ingEdits = editedRecipe.ingredients.filter(x => x.edited && x.edited.length > 0)
      var stepEdits = editedRecipe.steps.filter(x => x.edited && x.edited.length > 0)
      return ingEdits.length > 0 || stepEdits.length > 0
    }
    return false
  },
  getName: (card) => {
    var recipe = card.data("editedrecipe") ? card.data("editedrecipe") : card.data("recipe")
    return recipe.name
  },
  getIngredients: (card) => {
    var recipe = card.data("editedrecipe") ? card.data("editedrecipe") : card.data("recipe")
    return recipe.ingredients
  },
  getSteps: (card) => {
    var recipe = card.data("editedrecipe") ? card.data("editedrecipe") : card.data("recipe")
    return recipe.steps
  }
//#endregion
}
