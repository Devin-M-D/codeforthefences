USE codeforthefences;

INSERT INTO recipe (name, duration, servings) VALUES ('Cereal Treats', 10, '16 treats');
SET @cerealTreatsId = LAST_INSERT_ID();

-- INSERT INTO quantity (deci, frac) VALUES (3, '3');
-- SET @quantity3Id = LAST_INSERT_ID();
-- INSERT INTO quantity (deci, frac) VALUES (6, '6');
-- SET @quantity6Id = LAST_INSERT_ID();
-- INSERT INTO quantity (deci, frac) VALUES (0.25, '1/4');
-- SET @quantity4Id = LAST_INSERT_ID();

INSERT INTO UoM (name, abbreviation) VALUES ('tablespoon', 'tbsp');
SET @UoMTbspId = LAST_INSERT_ID();
INSERT INTO UoM (name, abbreviation) VALUES ('cup', 'c');
SET @UoMCupId = LAST_INSERT_ID();
INSERT INTO UoM (name, abbreviation) VALUES ('large', 'lg');
SET @UoMLgId = LAST_INSERT_ID();

INSERT INTO toolType (name, description) VALUES ('Pan', 'Metal pan used on the stovetop');
SET @panToolId = LAST_INSERT_ID();
INSERT INTO toolType (name, description) VALUES ('Wax paper', 'Non-stick wax or parchment paper');
SET @waxPaperId = LAST_INSERT_ID();

INSERT INTO tool (toolTypeId, UoMId) VALUES (@panToolId, @UoMLgID);
SET @lgPanId = LAST_INSERT_ID();
INSERT INTO tool (toolTypeId, UoMId) VALUES (@waxPaperId, NULL);
SET @plainWaxPaperId = LAST_INSERT_ID();

INSERT INTO recipe_tool (recipeId, toolId, toolIndex) VALUES (@cerealTreatsId, @lgPanId, 0);
INSERT INTO recipe_tool (recipeId, toolId, toolIndex) VALUES (@cerealTreatsId, @plainWaxPaperId, 1);


INSERT INTO substance (name) VALUES ('butter');
SET @butterId = LAST_INSERT_ID();
INSERT INTO substance (name, plural) VALUES ('marshmallow', 'marshmallows');
SET @marshId = LAST_INSERT_ID();
INSERT INTO substance (name) VALUES ('cereal');
SET @cerealId = LAST_INSERT_ID();

INSERT INTO substance (name) VALUES ('parsley');
INSERT INTO substance (name) VALUES ('sausage');

INSERT INTO foodVariant (name) VALUES ('mini');
SET @miniId = LAST_INSERT_ID();

INSERT INTO ingredient (UoMId, foodVariantId, substanceId, prepStyleId) VALUES (@UoMTbspID, null, @butterId, null);
SET @butterIngredient = LAST_INSERT_ID();
INSERT INTO ingredient (UoMId, foodVariantId, substanceId, prepStyleId) VALUES (@UoMCupID, @miniId, @marshId, null);
SET @marshIngredient = LAST_INSERT_ID();
INSERT INTO ingredient (UoMId, foodVariantId, substanceId, prepStyleId) VALUES (@UoMCupID, null, @cerealId, null);
SET @cerealIngredient = LAST_INSERT_ID();

INSERT INTO recipe_ingredient (recipeId, ingredientId, ingredientIndex, quantity) VALUES (@cerealTreatsId, @butterIngredient, 0, 3);
INSERT INTO recipe_ingredient (recipeId, ingredientId, ingredientIndex, quantity) VALUES (@cerealTreatsId, @marshIngredient, 1, 0.25);
INSERT INTO recipe_ingredient (recipeId, ingredientId, ingredientIndex, quantity) VALUES (@cerealTreatsId, @cerealIngredient, 2, 6);

INSERT INTO step (text) VALUES ('Melt {i} in {t} over low heat');
SET @step0Id = LAST_INSERT_ID();
INSERT INTO step (text) VALUES ('Add {i} to {t} and melt');
SET @step1Id = LAST_INSERT_ID();
INSERT INTO step (text) VALUES ('Pour over {i}, stir until well coated');
SET @step2Id = LAST_INSERT_ID();

INSERT INTO recipe_step (recipeId, stepId, stepIndex) VALUES (@cerealTreatsId, @step0Id, 0);
SET @recipeStep0Id = LAST_INSERT_ID();
INSERT INTO recipe_step (recipeId, stepId, stepIndex) VALUES (@cerealTreatsId, @step1Id, 1);
SET @recipeStep1Id = LAST_INSERT_ID();
INSERT INTO recipe_step (recipeId, stepId, stepIndex) VALUES (@cerealTreatsId, @step2Id, 2);
SET @recipeStep2Id = LAST_INSERT_ID();

INSERT INTO stepMapType (mapType) VALUES ('tool');
SET @stepMapType0 = LAST_INSERT_ID();
INSERT INTO stepMapType (mapType) VALUES ('ingredient');
SET @stepMapType1 = LAST_INSERT_ID();

INSERT INTO stepMap (recipeStepId, stepMapTypeId, barsIndex, recipeIndex) VALUES (@recipeStep0Id, @stepMapType0, 0, 0);
INSERT INTO stepMap (recipeStepId, stepMapTypeId, barsIndex, recipeIndex) VALUES (@recipeStep0Id, @stepMapType1, 0, 0);

INSERT INTO stepMap (recipeStepId, stepMapTypeId, barsIndex, recipeIndex) VALUES (@recipeStep1Id, @stepMapType0, 0, 0);
INSERT INTO stepMap (recipeStepId, stepMapTypeId, barsIndex, recipeIndex) VALUES (@recipeStep1Id, @stepMapType1, 0, 1);

INSERT INTO stepMap (recipeStepId, stepMapTypeId, barsIndex, recipeIndex) VALUES (@recipeStep2Id, @stepMapType1, 0, 2);
