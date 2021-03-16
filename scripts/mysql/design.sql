USE codeforthefences;

CREATE TABLE user (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `username` nvarchar(64) NOT NULL UNIQUE,
  `password` nvarchar(128) NOT NULL,
  `sessionId` nvarchar(128) NULL
);

CREATE TABLE blogPost (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `title` nvarchar(64) NOT NULL,
  `date` nvarchar(48) NOT NULL,
  `content` nvarchar(48) NOT NULL
);

CREATE TABLE recipe (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `name` nvarchar(64) NOT NULL,
  `duration` nvarchar(48) NOT NULL,
  `servings` nvarchar(48) NOT NULL
);

CREATE TABLE toolType (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `name` nvarchar(64) NOT NULL,
  `description` nvarchar(256) NOT NULL
);

CREATE TABLE UoM (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `name` nvarchar(64) NOT NULL,
  `abbreviation` nvarchar(32) NOT NULL
);

CREATE TABLE tool (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `toolTypeId` int NOT NULL,
  `UoMId` int NOT NULL
);

CREATE TABLE recipeTool (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `recipeId` int NOT NULL,
  `toolId` int NOT NULL,
  `toolIndex` int NOT NULL
);

CREATE TABLE foodCategory (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `name` nvarchar(64) NOT NULL
);

CREATE TABLE foodType (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `name` nvarchar(32) NOT NULL,
  `plural` nvarchar(32) NOT NULL,
  `abbreviation` nvarchar(16) NOT NULL,
  `plAbbrev` nvarchar(16) NOT NULL
);

CREATE TABLE foodTypeCategory (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `foodTypeId` int NOT NULL,
  `foodCategoryId` int(64) NOT NULL
);

CREATE TABLE prepStyle (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `name` nvarchar(32) NOT NULL,
  `abbreviation` nvarchar(32) NOT NULL,
  `description` nvarchar(16) NOT NULL
);

CREATE TABLE ingredient (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `UoMId` int NOT NULL,
  `prepStyleId` int NULL,
  `foodTypeId` int NOT NULL
);

CREATE TABLE recipeIngredient (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `recipeId` int NOT NULL,
  `ingredientId` int NOT NULL,
  `quantity` float NOT NULL
);

CREATE TABLE step (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `text` nvarchar(4000) NOT NULL
);

CREATE TABLE recipeStep (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `recipeId` int NOT NULL,
  `stepId` int NOT NULL,
  `stepIndex` int NOT NULL
);

CREATE TABLE recipeStepTool (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `recipeStepId` int NOT NULL,
  `recipeToolId` int NOT NULL
);

CREATE TABLE recipeStepIngredient (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `recipeStepId` int NOT NULL,
  `recipeIngredientId` int NOT NULL
);
