USE codeforthefences;

INSERT INTO user (createdDate, username, password) VALUES (NOW(), 'system', 'system');
SET @user1 = LAST_INSERT_ID();
INSERT INTO user (createdDate, username, password) VALUES (NOW(), 'user1', 'test');
SET @user2 = LAST_INSERT_ID();

INSERT INTO blogPost (authorId, title, createdDate, content) VALUES (@user1, 'blog post 1', NOW(), 'test blog 1');
INSERT INTO blogPost (authorId, title, createdDate, content) VALUES (@user2, 'blog post 2', NOW(), 'test blog 2');

INSERT INTO recipe (name, duration, servings) VALUES ('Cereal Treats', 10, '16 treats');
SET @cerealTreatsId = LAST_INSERT_ID();
INSERT INTO recipe (name, duration, servings) VALUES ('Faux Banana Ice Cream', 24, '1 pint');
SET @bananaIceCreamId = LAST_INSERT_ID();

INSERT INTO UoM (name, plural, abbreviation) VALUES ('tablespoon', 'tablespoons', 'tbsp');
SET @UoMTbspId = LAST_INSERT_ID();
INSERT INTO UoM (name, plural, abbreviation) VALUES ('cup', 'cups', 'c');
SET @UoMCupId = LAST_INSERT_ID();
INSERT INTO UoM (name, abbreviation) VALUES ('large', 'lg');
SET @UoMLgId = LAST_INSERT_ID();
INSERT INTO UoM (name, plural, abbreviation) VALUES ('pound', 'pounds', 'lb');

INSERT INTO toolType (name, description) VALUES ('Pan', 'Metal pan used on the stovetop');
SET @panToolId = LAST_INSERT_ID();
INSERT INTO toolType (name, description) VALUES ('Wax paper', 'Non-stick wax or parchment paper');
SET @waxPaperId = LAST_INSERT_ID();
INSERT INTO toolType (name, description) VALUES ('Blender', 'Pitcher with spinning blades at the bottom used to mix and liquify food');
SET @blenderId = LAST_INSERT_ID();

INSERT INTO tool (toolTypeId, UoMId) VALUES (@panToolId, @UoMLgID);
SET @lgPanId = LAST_INSERT_ID();
INSERT INTO tool (toolTypeId, UoMId) VALUES (@waxPaperId, NULL);
SET @plainWaxPaperId = LAST_INSERT_ID();

INSERT INTO recipe_tool (recipeId, toolId, toolIndex) VALUES (@cerealTreatsId, @lgPanId, 0);
INSERT INTO recipe_tool (recipeId, toolId, toolIndex) VALUES (@cerealTreatsId, @plainWaxPaperId, 1);
INSERT INTO recipe_tool (recipeId, toolId, toolIndex) VALUES (@bananaIceCreamId, @blenderId, 0);

INSERT INTO substance (name) VALUES ('butter');
SET @butterId = LAST_INSERT_ID();
INSERT INTO substance (name, plural) VALUES ('marshmallow', 'marshmallows');
SET @marshId = LAST_INSERT_ID();
INSERT INTO substance (name) VALUES ('cereal');
SET @cerealId = LAST_INSERT_ID();
INSERT INTO substance (name) VALUES ('banana');
SET @bananaId = LAST_INSERT_ID();
INSERT INTO substance (name) VALUES ('milk');
SET @milkId = LAST_INSERT_ID();
INSERT INTO substance (name) VALUES ('cream');
SET @creamId = LAST_INSERT_ID();

INSERT INTO substance (name) VALUES ('parsley');
INSERT INTO substance (name) VALUES ('sausage');

INSERT INTO foodVariant (name) VALUES ('mini');
SET @miniId = LAST_INSERT_ID();
INSERT INTO foodVariant (name) VALUES ('heavy whipping');
SET @heavyWhippingId = LAST_INSERT_ID();

INSERT INTO prepStyle (name, description) VALUES ('sliced', 'cut into slices');
SET @slicedId = LAST_INSERT_ID("");

INSERT INTO ingredient (UoMId, foodVariantId, substanceId, prepStyleId) VALUES (@UoMTbspID, null, @butterId, null);
SET @butterIngredient = LAST_INSERT_ID();
INSERT INTO ingredient (UoMId, foodVariantId, substanceId, prepStyleId) VALUES (@UoMCupID, @miniId, @marshId, null);
SET @marshIngredient = LAST_INSERT_ID();
INSERT INTO ingredient (UoMId, foodVariantId, substanceId, prepStyleId) VALUES (@UoMCupID, null, @cerealId, null);
SET @cerealIngredient = LAST_INSERT_ID();

INSERT INTO ingredient (UoMId, foodVariantId, substanceId, prepStyleId) VALUES (@UoMLgId, null, @bananaId, @slicedId);
SET @bananaIngredient = LAST_INSERT_ID();
INSERT INTO ingredient (UoMId, foodVariantId, substanceId, prepStyleId) VALUES (@UoMCupID, null, @milkId, null);
SET @milkIngredient = LAST_INSERT_ID();
INSERT INTO ingredient (UoMId, foodVariantId, substanceId, prepStyleId) VALUES (@UoMCupID, @heavyWhippingId, @creamId, null);
SET @creamIngredient = LAST_INSERT_ID();


INSERT INTO recipe_ingredient (recipeId, ingredientId, ingredientIndex, quantity) VALUES (@cerealTreatsId, @butterIngredient, 0, 3);
INSERT INTO recipe_ingredient (recipeId, ingredientId, ingredientIndex, quantity) VALUES (@cerealTreatsId, @marshIngredient, 1, 0.25);
INSERT INTO recipe_ingredient (recipeId, ingredientId, ingredientIndex, quantity) VALUES (@cerealTreatsId, @cerealIngredient, 2, 6);

INSERT INTO recipe_ingredient (recipeId, ingredientId, ingredientIndex, quantity) VALUES (@bananaIceCreamId, @bananaIngredient, 0, 4);
INSERT INTO recipe_ingredient (recipeId, ingredientId, ingredientIndex, quantity) VALUES (@bananaIceCreamId, @milkIngredient, 1, 0.5);
INSERT INTO recipe_ingredient (recipeId, ingredientId, ingredientIndex, quantity) VALUES (@bananaIceCreamId, @creamIngredient, 2, 0.5);

INSERT INTO step (text) VALUES ('Melt {i} in {t} over low heat');
SET @step0Id = LAST_INSERT_ID();
INSERT INTO step (text) VALUES ('Add {i} to {t} and melt');
SET @step1Id = LAST_INSERT_ID();
INSERT INTO step (text) VALUES ('Pour over {i}, stir until well coated');
SET @step2Id = LAST_INSERT_ID();

INSERT INTO step (text) VALUES ('Freeze {i}');
SET @ICstep0Id = LAST_INSERT_ID();
INSERT INTO step (text) VALUES ('Blend {i} with {i} and {i} until smooth');
SET @ICstep1Id = LAST_INSERT_ID();
INSERT INTO step (text) VALUES ('Freeze 2 more hours');
SET @ICstep2Id = LAST_INSERT_ID();

INSERT INTO recipe_step (recipeId, stepId, stepIndex) VALUES (@cerealTreatsId, @step0Id, 0);
SET @recipeStep0Id = LAST_INSERT_ID();
INSERT INTO recipe_step (recipeId, stepId, stepIndex) VALUES (@cerealTreatsId, @step1Id, 1);
SET @recipeStep1Id = LAST_INSERT_ID();
INSERT INTO recipe_step (recipeId, stepId, stepIndex) VALUES (@cerealTreatsId, @step2Id, 2);
SET @recipeStep2Id = LAST_INSERT_ID();

INSERT INTO recipe_step (recipeId, stepId, stepIndex) VALUES (@bananaIceCreamId, @ICstep0Id, 0);
SET @ICrecipeStep0Id = LAST_INSERT_ID();
INSERT INTO recipe_step (recipeId, stepId, stepIndex) VALUES (@bananaIceCreamId, @ICstep1Id, 1);
SET @ICrecipeStep1Id = LAST_INSERT_ID();
INSERT INTO recipe_step (recipeId, stepId, stepIndex) VALUES (@bananaIceCreamId, @ICstep2Id, 2);
SET @ICrecipeStep2Id = LAST_INSERT_ID();

INSERT INTO stepMapType (mapType) VALUES ('tool');
SET @stepMapType0 = LAST_INSERT_ID();
INSERT INTO stepMapType (mapType) VALUES ('ingredient');
SET @stepMapType1 = LAST_INSERT_ID();

INSERT INTO stepMap (recipeStepId, stepMapTypeId, barsIndex, recipeIndex) VALUES (@recipeStep0Id, @stepMapType0, 0, 0);
INSERT INTO stepMap (recipeStepId, stepMapTypeId, barsIndex, recipeIndex) VALUES (@recipeStep0Id, @stepMapType1, 0, 0);
INSERT INTO stepMap (recipeStepId, stepMapTypeId, barsIndex, recipeIndex) VALUES (@recipeStep1Id, @stepMapType0, 0, 0);
INSERT INTO stepMap (recipeStepId, stepMapTypeId, barsIndex, recipeIndex) VALUES (@recipeStep1Id, @stepMapType1, 0, 1);
INSERT INTO stepMap (recipeStepId, stepMapTypeId, barsIndex, recipeIndex) VALUES (@recipeStep2Id, @stepMapType1, 0, 2);

INSERT INTO stepMap (recipeStepId, stepMapTypeId, barsIndex, recipeIndex) VALUES (@ICrecipeStep0Id, @stepMapType1, 0, 0);
INSERT INTO stepMap (recipeStepId, stepMapTypeId, barsIndex, recipeIndex) VALUES (@ICrecipeStep1Id, @stepMapType1, 0, 0);
INSERT INTO stepMap (recipeStepId, stepMapTypeId, barsIndex, recipeIndex) VALUES (@ICrecipeStep1Id, @stepMapType1, 1, 1);
INSERT INTO stepMap (recipeStepId, stepMapTypeId, barsIndex, recipeIndex) VALUES (@ICrecipeStep1Id, @stepMapType1, 2, 2);
