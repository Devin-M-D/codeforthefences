USE codeforthefences;

INSERT INTO user (username, password, sessionId) VALUES ("user1", "test", NULL);

INSERT INTO recipe (name, duration, servings) VALUES ('Cereal Treats', 10, '16 treats');
SET @recipeID = LAST_INSERT_ID();
INSERT INTO toolType (name, description) VALUES ('Pan', 'Metal pan used on the stovetop');
SET @toolTypeID = LAST_INSERT_ID();

INSERT INTO UoM (name, abbreviation) VALUES ('large', 'lg');
SET @UoMLgID = LAST_INSERT_ID();
INSERT INTO UoM (name, abbreviation) VALUES ('tablespoon', 'tbsp');
SET @UoMTbspID = LAST_INSERT_ID();
INSERT INTO UoM (name, abbreviation) VALUES ('cup', 'c');
SET @UoMCupID = LAST_INSERT_ID();

INSERT INTO tool (toolTypeId, UoMId) VALUES (@toolTypeID, @UoMLgID);
SET @lgPanId = LAST_INSERT_ID();
INSERT INTO recipeTool (recipeId, toolId, toolIndex) VALUES (@recipeID, @lgPanId, 0);

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

INSERT INTO recipeIngredient (recipeId, ingredientId, ingredientIndex) VALUES (@recipeID, @butterIngredient, 0);
INSERT INTO recipeIngredient (recipeId, ingredientId, ingredientIndex) VALUES (@recipeID, @marshMeasure, 1);
INSERT INTO recipeIngredient (recipeId, ingredientId, ingredientIndex) VALUES (@recipeID, @cerealMeasure, 2);

INSERT INTO step (text) VALUES ('Melt {i0} in {t0} over low heat');
SET @step0Id = LAST_INSERT_ID();
INSERT INTO step (text) VALUES ('Add {i0} to {t0} and melt');
SET @step1Id = LAST_INSERT_ID();
INSERT INTO step (text) VALUES ('Pour over {i0}, stir until well coated');
SET @step2Id = LAST_INSERT_ID();

INSERT INTO recipeStep (recipeId, stepId, stepIndex) VALUES (@recipeID, @step0Id, 0);
INSERT INTO recipeStep (recipeId, stepId, stepIndex) VALUES (@recipeID, @step1Id, 1);
INSERT INTO recipeStep (recipeId, stepId, stepIndex) VALUES (@recipeID, @step2Id, 2);

INSERT INTO recipeStepTool (recipeStepId, barsIndex, recipeToolIndex) VALUES (@step0Id, 0, 0);

INSERT INTO recipeStepIngredient (recipeStepId, barsIndex, recipeIngredientIndex) VALUES (@step0Id, 0, 0);
INSERT INTO recipeStepIngredient (recipeStepId, barsIndex, recipeIngredientIndex) VALUES (@step1Id, 0, 1);
INSERT INTO recipeStepIngredient (recipeStepId, barsIndex, recipeIngredientIndex) VALUES (@step2Id, 0, 2);
