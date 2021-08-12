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
      <span class="wingedHeader algnSpread" data-headerheight="120px" data-headerwings="20%">
        <span class="recipeStats">
          <span class="recipeTime"></span>
          <span class="recipeServings"></span>
          <span class="recipeCalories"></span>
        </span>
        <span class="recipeName subheader"></span>
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
    card.find(".recipeName").html(recipe.name)
    card.data("recipe", recipe)
    card.attr("recipeId", recipe["id"])
    cDI.components.recipeCard.ingredientPane.createIngPane(card, false)
    cDI.components.recipeCard.stepPane.build(card, false)
    cDI.components.recipeCard.buildEditBox(card, false)
    return card
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
        return await cDI.components.recipeCard.setEditMode($(e.target).closest(".recipeCard"), 0)
      })
    }
  },
//#endregion

  saveChanges: async (card) => {
    var res = await cDI.services.recipe.save(card.data("editedrecipe"))
    if (res.status == "s") {
      card.data("recipe", res.payload)
      card.data("editedrecipe", res.payload)
      res = res.payload
    }
    await cDI.components.recipeCard.setEditMode(card, 0)
    return res
  }
}
