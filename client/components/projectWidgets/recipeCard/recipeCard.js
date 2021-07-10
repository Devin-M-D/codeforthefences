cDI.components.recipeCard = {
  init: async () => {
    await cDI.remote.asyncGetScript(`components/projectWidgets/recipeCard/ingredientPane/ingredientPane.js`)
  },
//#region main loop
  buildRecipeCardList: async (recipes) => {
    var cardList = []
    console.log(recipes)
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

    cDI.components.recipeCard.createStepPane(card, recipe.steps, recipe.ingredients, recipe.tools)

    cDI.components.recipeCard.setEditMode(card, false)
    return card
  },
//#endregion


//#region step pane
  createStepPane: async (card, steps, ingredients, tools, useEdited = false) => {
    var stepsPane = card.find(".cardSteps")
    var stepMaps = (useEdited ? card.data("editedrecipe") : card.data("recipe")).stepMaps
    var build = () => {
      var filledStepText = cDI.components.recipeCard.getFilledSteps(steps, ingredients, tools, stepMaps)
      stepsPane.html(filledStepText)
    }

    if (useEdited) {
      stepsPane.fadeOut(500, () => {
        build();
        stepsPane.fadeIn(500);
      })
    }
    else { build() }
  },
  getFilledSteps: (steps, ingredients, tools, stepMaps) => {
    var stepList = ``
    var currMaps
    steps.forEach((step, x) => {
      var stepText = step.text
      currMaps = stepMaps.filter(x => x.recipeStepId == step.id)
      if (step.text.indexOf("{i") != -1) { stepText = cDI.components.recipeCard.addIngredientsToStep(ingredients, stepText, currMaps.filter(x => x.mapType == "ingredient")) }
      if (step.text.indexOf("{t") != -1) { stepText = cDI.components.recipeCard.addToolsToSteps(tools, stepText, currMaps.filter(x => x.mapType == "tool")) }

      stepList += `
      <span class="cardStep rows unwrap">
        <span class="rowNumber">${x + 1})&nbsp;</span>
        <span class="displayBlock leftCopy">${stepText}</span>
      </span>`
    })
    return stepList
  },
  addIngredientsToStep: (ingredients, stepText, maps) => {
    maps.forEach((map) => {
      stepText = stepText.replace(`{i${map.barsIndex}}`, `<span class="stepIngredient">${ingredients.filter(x => x.idx == map.recipeIndex)[0].substanceName}</span>`)
    })
    return stepText
  },
  addToolsToSteps: (tools, stepText, maps) => {
    tools.forEach((tool, x) => {
      stepText = stepText.replace(`{t${x}}`, `<span class="stepTool">${tool.toolTypeName.toLowerCase()}</span>`)
    })
    return stepText
  },
//#endregion

//#region editMode and save
  setEditMode: async (card, mode = 0) => {
    if (mode == 1 && card.data("editedrecipe") == undefined){
      card.data("editedrecipe", cDI.utils.clone(card.data("recipe")))
    }
    cDI.components.recipeCard.ingredientPane.createIngPane(card, mode)
    await cDI.components.recipeCard.buildEditBox(card, mode)
  },
  buildEditBox: async (card, mode = 0) => {
    var editBox = card.find(".recipeEdit")
    if (mode == 0){
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
//#endregion

  saveChanges: async (card) => {
    await cDI.services.recipe.save(card.data("editedrecipe"))
    cDI.components.recipeCard.setEditMode(card, 0)
  }
}
