USE codeforthefences;

INSERT INTO user (username, password, sessionId) VALUES ("user1", "test", NULL);

INSERT INTO recipe (name, duration, servings) VALUES ('Cereal Treats', 10, '16 treats');
SET @cerealTreatsId = LAST_INSERT_ID();
INSERT INTO toolType (name, description) VALUES ('Pan', 'Metal pan used on the stovetop');
SET @panToolId = LAST_INSERT_ID();
INSERT INTO toolType (name, description) VALUES ('Wax paper', 'Non-stick wax or parchment paper');
SET @waxPaperId = LAST_INSERT_ID();


INSERT INTO UoM (name, abbreviation) VALUES ('large', 'lg');
SET @UoMLgID = LAST_INSERT_ID();
INSERT INTO UoM (name, abbreviation) VALUES ('tablespoon', 'tbsp');
SET @UoMTbspID = LAST_INSERT_ID();
INSERT INTO UoM (name, abbreviation) VALUES ('cup', 'c');
SET @UoMCupID = LAST_INSERT_ID();

INSERT INTO tool (toolTypeId, UoMId) VALUES (@panToolId, @UoMLgID);
SET @lgPanId = LAST_INSERT_ID();
INSERT INTO tool (toolTypeId, UoMId) VALUES (@waxPaperId, NULL);
SET @plainWaxPaperId = LAST_INSERT_ID();

INSERT INTO recipeTool (recipeId, toolId, toolIndex) VALUES (@cerealTreatsId, @lgPanId, 0);
INSERT INTO recipeTool (recipeId, toolId, toolIndex) VALUES (@cerealTreatsId, @plainWaxPaperId, 1);

INSERT INTO foodType (name) VALUES ('butter');
SET @butterId = LAST_INSERT_ID();
INSERT INTO foodType (name, plural) VALUES ('marshmallow', 'marshmallows');
SET @marshId = LAST_INSERT_ID();
INSERT INTO foodType (name) VALUES ('cereal');
SET @cerealId = LAST_INSERT_ID();

INSERT INTO food (foodTypeId, prepStyleId) VALUES (@butterId, NULL);
SET @butterFoodId = LAST_INSERT_ID();
INSERT INTO food (foodTypeId, prepStyleId) VALUES (@marshId, NULL);
SET @marshFoodId = LAST_INSERT_ID();
INSERT INTO food (foodTypeId, prepStyleId) VALUES (@cerealId, NULL);
SET @cerealFoodId = LAST_INSERT_ID();

INSERT INTO measureOfFood (foodId, UoMId) VALUES (@butterFoodId, @UoMTbspID);
SET @butterMeasure = LAST_INSERT_ID();
INSERT INTO measureOfFood (foodId, UoMId) VALUES (@marshFoodId, @UoMCupID);
SET @marshMeasure = LAST_INSERT_ID();
INSERT INTO measureOfFood (foodId, UoMId) VALUES (@cerealFoodId, @UoMCupID);
SET @cerealMeasure = LAST_INSERT_ID();

INSERT INTO ingredient (measureOfFoodId, quantity) VALUES (@butterMeasure, 3);
SET @butterIngredient = LAST_INSERT_ID();
INSERT INTO ingredient (measureOfFoodId, quantity) VALUES (@marshMeasure, 4);
SET @marshMeasure = LAST_INSERT_ID();
INSERT INTO ingredient (measureOfFoodId, quantity) VALUES (@cerealMeasure, 6);
SET @cerealMeasure = LAST_INSERT_ID();

INSERT INTO recipeIngredient (recipeId, ingredientId, ingredientIndex) VALUES (@cerealTreatsId, @butterIngredient, 0);
INSERT INTO recipeIngredient (recipeId, ingredientId, ingredientIndex) VALUES (@cerealTreatsId, @marshMeasure, 1);
INSERT INTO recipeIngredient (recipeId, ingredientId, ingredientIndex) VALUES (@cerealTreatsId, @cerealMeasure, 2);

INSERT INTO step (text) VALUES ('Melt {i0} in {t0} over low heat');
SET @step0Id = LAST_INSERT_ID();
INSERT INTO step (text) VALUES ('Add {i0} to {t0} and melt');
SET @step1Id = LAST_INSERT_ID();
INSERT INTO step (text) VALUES ('Pour over {i0}, stir until well coated');
SET @step2Id = LAST_INSERT_ID();

INSERT INTO recipeStep (recipeId, stepId, stepIndex) VALUES (@cerealTreatsId, @step0Id, 0);
INSERT INTO recipeStep (recipeId, stepId, stepIndex) VALUES (@cerealTreatsId, @step1Id, 1);
INSERT INTO recipeStep (recipeId, stepId, stepIndex) VALUES (@cerealTreatsId, @step2Id, 2);

INSERT INTO recipeStepTool (recipeStepId, barsIndex, recipeToolIndex) VALUES (@step0Id, 0, 0);

INSERT INTO recipeStepIngredient (recipeStepId, barsIndex, recipeIngredientIndex) VALUES (@step0Id, 0, 0);
INSERT INTO recipeStepIngredient (recipeStepId, barsIndex, recipeIngredientIndex) VALUES (@step1Id, 0, 1);
INSERT INTO recipeStepIngredient (recipeStepId, barsIndex, recipeIngredientIndex) VALUES (@step2Id, 0, 2);



INSERT INTO recipe (name, duration, servings) VALUES ('Lasagna', 60, '8 servings');
SET @lasagnaId = LAST_INSERT_ID();
INSERT INTO toolType (name, description) VALUES ('Wooden spoon', 'Heat-safe wooden spoon');
SET @spoonToolId = LAST_INSERT_ID();

INSERT INTO tool (toolTypeId, UoMId) VALUES (@spoonToolId, @UoMLgID);
SET @lgSpoonId = LAST_INSERT_ID();

INSERT INTO recipeTool (recipeId, toolId, toolIndex) VALUES (@lasagnaId, @lgSpoonId, 0);
