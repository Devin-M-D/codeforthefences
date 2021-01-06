cDI.widgets.recipeCard = {
//#region main loop
  buildRecipeCardList: async (recipes) => {
    var cardList = []
    recipes.forEach(async recipe => {
      // for (var x = 0; x < 11; x++){
        cardList.push(await cDI.widgets.recipeCard.buildRecipeCard(recipe))
      // }
    })
    return cardList
  },
  buildRecipeCard: async (recipe) => {
    var card = $("#cargoHold").find(".recipeCard").clone()
    card.find(".recipeName").html(recipe.name)
    card.data("recipe", recipe)
    card.attr("data-rid", recipe["@rid"])

    var pieces = cDI.services.recipe.parsePieces(recipe)
    cDI.widgets.recipeCard.createStepPane(card, pieces.steps, pieces.ingredients, pieces.tools)

    cDI.widgets.recipeCard.setEditMode(card, false)
    return card
  },
//#endregion

//#region ing pane
  createIngPane: (card, editable = false) => {
    var recipe = card.data("recipe")
    card.find(".cardIngs").empty()
    recipe.recipeIngredient.forEach((ingredient, x) => {
      var ingLine = cDI.widgets.recipeCard.createIngLine(ingredient, editable)
      card.find(".cardIngs").append(ingLine)
      if (editable){
        var line = card.find(`.cardIngs > .cardIngredient.Ing${ingredient.ingredientNum}`)

        var txtIngUoM = line.find(`.txtIngUoM.Ing${ingredient.ingredientNum}`)
        cDI.addAwaitableInput("click", txtIngUoM, async (e, s) => {
          return await cDI.components.searchSelect.buildSearchPane($(e.target), '/crud/UoM/r', 'name')
        })

        var txtIngFood = line.find(`.txtIngFood.Ing${ingredient.ingredientNum}`)
        cDI.addAwaitableInput("click", txtIngFood, async (e, s) => {
          return await cDI.components.searchSelect.buildSearchPane($(e.target), '/crud/foodType/r', 'name', cDI.widgets.recipeCard.acceptIngChange)
        })
      }
    })
  },
  createIngLine: (ingredient, editable = false) => {
    var ingNum = ingredient.ingredientNum
    ingredient = ingredient.ingredient
    var ingName = ingredient.ingredientFood[0].foodType.name
    if (ingredient.quantity != 1 && cDI.utils.isDef(ingredient.ingredientFood[0].foodType.plural)) {
      ingName = ingredient.ingredientFood[0].foodType.plural
    }

    var ing = `<span class="cardIngredient algnSS leftCopy fitW unwrap Ing${ingNum}">`
    if (editable){
      ing += `<input class="txtIngQuant Ing${ingNum}" type="text" value="${ingredient.quantity}" />`
      ing += `<input class="txtIngUoM Ing${ingNum}" type="text" value="${ingredient.ingredientUoM[0].UoM.name}" />`
      ing += `<input class="txtIngFood Ing${ingNum}" type="text" value="${ingName}" />`
    }
    else {
      ing += `
        <span class="noGrow">${ingNum})&nbsp;</span>
        <span class="displayBlock leftCopy">${ingredient.quantity} ${ingredient.ingredientUoM[0].UoM.abbreviation} ${ingName}</span>
        `
    }
    ing += `</span>`
    return ing
  },
  acceptIngChange: (input) => {
    var card = input.closest(".recipeCard")
    var recipe
    if (card.data("editedrecipe")){
      recipe = card.data("editedrecipe")
    }
    else {
      recipe = card.data("recipe")
    }
    var inputClasses = input.attr('class').split(" ")
    var ingNum = inputClasses.filter(x => x.indexOf("Ing") == 0)[0].replace("Ing", "")
    var origIng = recipe.recipeIngredient.filter(x => x.ingredientNum == ingNum)[0].ingredient.ingredientFood[0].foodType
    var newIng = input.data("searchselectrecord")

    if (origIng["@rid"] != newIng["@rid"]){
      var editedRecipe = card.data("editedrecipe")
      editedRecipe.recipeIngredient.find(x => x.ingredientNum == ingNum).ingredient.ingredientFood[0].foodType = newIng
      card.data("editedrecipe", editedRecipe)
      cDI.widgets.recipeCard.createStepPane(card, null, null, null, true)
    }
  },
  //#endregion

//#region step pane
  createStepPane: async (card, steps, ingredients, tools, useEdited = false) => {
    var stepsPane = card.find(".cardSteps")
    var build = () => {
      if (steps == null || ingredients == null || tools == null){
        var recipe = ((useEdited) ? card.data("editedrecipe") : card.data("recipe"))
        var pieces = cDI.services.recipe.parsePieces(recipe)
        steps = pieces.steps
        ingredients = pieces.ingredients
        tools = pieces.tools
      }
      var filledStepText = cDI.widgets.recipeCard.getFilledSteps(steps, ingredients, tools)
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
  getFilledSteps: (steps, ingredients, tools) => {
    var stepList = ``
    steps.forEach((step, x) => {
      var stepText = step.text
      if (step.text.indexOf("{i") != -1) { stepText = cDI.widgets.recipeCard.addIngredientsToStep(ingredients, stepText) }
      if (step.text.indexOf("{t") != -1) { stepText = cDI.widgets.recipeCard.addToolsToSteps(tools, stepText) }

      stepList += `
      <span class="cardStep rows unwrap">
        <span class="rowNumber">${x + 1})&nbsp;</span>
        <span class="displayBlock leftCopy">${stepText}</span>
      </span>`
    })
    return stepList
  },
  addIngredientsToStep: (ingredients, stepText) => {
    ingredients.forEach((ingredient, x) => {
      stepText = stepText.replace(`{i${x}}`, `<span class="stepIngredient">${ingredient.ingredientFood[0].foodType.name}</span>`)
    })
    return stepText
  },
  addToolsToSteps: (tools, stepText) => {
    tools.forEach((tool, x) => {
      stepText = stepText.replace(`{t${x}}`, `<span class="stepTool">${tool.name}</span>`)
    })
    return stepText
  },
//#endregion

//#region editMode and save
  setEditMode: (card, mode = 0) => {
    cDI.widgets.recipeCard.buildEditBox(card, mode)
    if (mode == 0){
      cDI.widgets.recipeCard.createIngPane(card, false)
    }
    else {
      card.data("editedrecipe", cDI.utils.clone(card.data("recipe")))
      cDI.widgets.recipeCard.createIngPane(card, true)
    }
  },
  buildEditBox: (card, mode = 0) => {
    var editBox = card.find(".recipeEdit")
    if (mode == 0){
      editBox.html(`<span class="shpPencil absCen"></span>`)
      cDI.addAwaitableInput("click", editBox, async (e) => {
        cDI.widgets.recipeCard.setEditMode($(e.target).parent().parent(), 1)
      })
    }
    else {
      editBox.html(`
        <span class="absCen fillH">
          <span class="shpCheck"></span>
        </span>
        <span class="absCen fillH">
          <span class="btnCancel">X</span>
        </span>
      `)
      cDI.addAwaitableInput("click", card.find(".recipeEdit").find(".shpCheck"), async (e) => {
        cDI.widgets.recipeCard.saveChanges($(e.target).parent().parent().parent().parent(), 0)
      })
      cDI.addAwaitableInput("click", card.find(".recipeEdit").find(".btnCancel"), async (e) => {
        cDI.widgets.recipeCard.setEditMode($(e.target).parent().parent().parent().parent(), 0)
      })
    }
  },
//#endregion

  saveChanges: async (card) => {
    cDI.services.recipe.save(card.data("editedrecipe"))

    // var recipe = card.data("recipe")
    // var editedRecipe = card.data("editedrecipe")
    // console.log(recipe)
    // recipe.recipeIngredient.forEach((ingredient, i) => {
    //   // console.log(i, ingredient)
    //   var recipeFoodType = ingredient.ingredient.ingredientFood[0].foodType.name
    //   console.log(recipeFoodType)
    //   var ingLine = card.find(`.cardIngredient.Ing${i + 1}`)
    //   if (ingLine != null){
    //     var foodInput = ingLine.find(".txtIngFood")
    //     var inputFoodType = foodInput.val()
    //     console.log(inputFoodType)
    //     if (inputFoodType != ingredient.ingredient.ingredientFood[0].foodType.name && inputFoodType != ingredient.ingredient.ingredientFood[0].foodType.plural){
    //       console.log(`update ing ${i + 1}: ${recipeFoodType} to ${inputFoodType}`)
    //       editedRecipe.recipeIngredient[i] = inputFoodType
    //     }
    //   }
    // })
    // console.log(card.data("editedrecipe"))
    // cDI.services.recipe.save(recipe)
    //cDI.widgets.recipeCard.setEditMode(target, 0)
  }
}
