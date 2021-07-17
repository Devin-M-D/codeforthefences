cDI.components.recipeCard = {
  init: async () => {
    await cDI.remote.asyncGetScript(`components/projectWidgets/recipeCard/ingredientPane.js`)
    await cDI.remote.asyncGetScript(`components/projectWidgets/recipeCard/stepPane.js`)
  },
//#region main loop
  buildRecipeCardList: async (recipes) => {
    var cardList = []
    console.log(recipes)
    recipes = [...recipes, ...recipes, ...recipes ]
    recipes.forEach(async recipe => {
      // for (var x = 0; x < 11; x++){
        cardList.push(await cDI.components.recipeCard.buildRecipeCard(recipe))
      // }
    })
    return cardList
  },
  buildRecipeCard: async (recipe) => {
    var card = $("#cargoHold").find(".recipeCard").clone()
    card.find(".recipeName").html(recipe.name)
    card.data("recipe", recipe)
    card.attr("recipeId", recipe["id"])
    cDI.components.recipeCard.setEditMode(card, false)
    return card
  },
//#endregion

//#region editMode and save
  setEditMode: async (card, editMode = 0) => {
    if (editMode == 1 && card.data("editedrecipe") == undefined){
      card.data("editedrecipe", cDI.utils.clone(card.data("recipe")))
    }
    cDI.components.recipeCard.loadPanes(card, editMode)
    await cDI.components.recipeCard.buildEditBox(card, editMode)
  },
  buildEditBox: async (card, editMode = 0) => {
    var editBox = card.find(".recipeEdit")
    if (editMode == 0){
      editBox.html(`<span class="shpPencil absCen"></span>`)
      cDI.addAwaitableInput("click", editBox, async (e) => {
        await cDI.components.recipeCard.setEditMode($(e.target).closest(".recipeCard"), 1)
      })
    }
    else {
      editBox.off("click")
      editBox.html(`
        <span class="absCen fillH">
          <span class="shpCheck"></span>
        </span>
        <span class="absCen fillH">
          <span class="btnCancel">X</span>
        </span>
      `)
      cDI.addAwaitableInput("click", editBox.find(".shpCheck"), async (e) => {
        await cDI.components.recipeCard.saveChanges($(e.target).closest(".recipeCard"), 0)
    })
      cDI.addAwaitableInput("click", editBox.find(".btnCancel"), async (e) => {
        cDI.components.recipeCard.setEditMode($(e.target).closest(".recipeCard"), 0)
        e.stopPropagation()
      })
    }
  },
  loadPanes: (card, editMode) => {
    cDI.components.recipeCard.ingredientPane.createIngPane(card, editMode)
    cDI.components.recipeCard.stepPane.createStepPane(card, editMode)
  },
//#endregion

  saveChanges: async (card) => {
    await cDI.services.recipe.save(card.data("editedrecipe"))
    card.data("recipe", card.data("editedrecipe"))
    await cDI.components.recipeCard.setEditMode(card, 0)
  }
}
