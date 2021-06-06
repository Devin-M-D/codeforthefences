USE codeforthefences;

INSERT INTO recipe (name, duration, servings) VALUES ('Cereal Treats', 10, '16 treats');
SET @cerealTreatsId = LAST_INSERT_ID();

INSERT INTO quantity (deci, frac) VALUES (3, '3');
SET @quantity3Id = LAST_INSERT_ID();
INSERT INTO quantity (deci, frac) VALUES (6, '6');
SET @quantity6Id = LAST_INSERT_ID();
INSERT INTO quantity (deci, frac) VALUES (0.25, '1/4');
SET @quantity14Id = LAST_INSERT_ID();

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

INSERT INTO foodVariant (name) VALUES ('mini');
SET @miniId = LAST_INSERT_ID();

INSERT INTO ingredient (quantityId, UoMId, foodVariantId, substanceId, prepStyleId) VALUES (@quantity3Id, @UoMTbspID, null, @butterId, null);
SET @butterIngredient = LAST_INSERT_ID();
INSERT INTO ingredient (quantityId, UoMId, foodVariantId, substanceId, prepStyleId) VALUES (@quantity14Id, @UoMCupID, @miniId, @marshId, null);
SET @marshIngredient = LAST_INSERT_ID();
INSERT INTO ingredient (quantityId, UoMId, foodVariantId, substanceId, prepStyleId) VALUES (@quantity6Id, @UoMCupID, null, @cerealId, null);
SET @cerealIngredient = LAST_INSERT_ID();

INSERT INTO recipe_ingredient (recipeId, ingredientId, ingredientIndex) VALUES (@cerealTreatsId, @butterIngredient, 0);
INSERT INTO recipe_ingredient (recipeId, ingredientId, ingredientIndex) VALUES (@cerealTreatsId, @marshIngredient, 1);
INSERT INTO recipe_ingredient (recipeId, ingredientId, ingredientIndex) VALUES (@cerealTreatsId, @cerealIngredient, 2);
