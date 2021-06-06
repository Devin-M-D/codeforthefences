USE codeforthefences;

-- CREATE TABLE user (
--   `id` int AUTO_INCREMENT primary key NOT NULL,
--   `username` nvarchar(64) UNIQUE NOT NULL,
--   `password` nvarchar(128) NOT NULL,
--   `sessionId` nvarchar(128) NULL,
--   `lastLogin` datetime NULL
-- );
--
-- CREATE TABLE blogPost (
--   `id` int AUTO_INCREMENT primary key NOT NULL,
--   `title` nvarchar(64) NOT NULL,
--   `date` datetime NOT NULL,
--   `content` mediumtext NOT NULL
-- );
--
-- CREATE TABLE user_blogPost (
--   `userId` int NOT NULL,
--   `blogPostId` nvarchar(64) NOT NULL,
-- );

CREATE TABLE recipe (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `name` nvarchar(64) NOT NULL,
  `duration` nvarchar(64) NOT NULL,
  `servings` nvarchar(64) NOT NULL
);

CREATE TABLE toolType (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `name` nvarchar(64) NOT NULL,
  `description` nvarchar(256) NOT NULL
);
CREATE TABLE tool (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `toolTypeId` int NOT NULL,
  `UoMId` int NULL
);
CREATE TABLE recipe_tool (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `recipeId` int NOT NULL,
  `toolId` int NOT NULL,
  `toolIndex` int NOT NULL
);

CREATE TABLE ingredient (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `quantityId` int NOT NULL,
  `UoMId` int NOT NULL,
  `foodVariantId` int NULL,
  `substanceId` int NOT NULL,
  `prepStyleId` int NULL
);

CREATE TABLE quantity (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `deci` float NOT NULL,
  `frac` nvarchar(64) NOT NULL
);

CREATE TABLE UoM (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `name` nvarchar(64) NOT NULL,
  `abbreviation` nvarchar(32) NOT NULL
);

CREATE TABLE foodVariant (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `name` nvarchar(32) NOT NULL,
  `abbreviation` nvarchar(32) NULL,
  `description` nvarchar(64) NULL
);

CREATE TABLE substance (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `name` nvarchar(32) NOT NULL UNIQUE,
  `plural` nvarchar(32) NULL,
  `abbreviation` nvarchar(16) NULL,
  `plAbbrev` nvarchar(16) NULL
);

CREATE TABLE prepStyle (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `name` nvarchar(32) NOT NULL,
  `description` nvarchar(64) NOT NULL
);

-- CREATE TABLE ingredient_quantity (
--   `id` int AUTO_INCREMENT primary key NOT NULL,
--   `ingredientId` int NOT NULL,
--   `quantityId` int NOT NULL,
-- );
--
-- CREATE TABLE ingredient_UoM (
--   `id` int AUTO_INCREMENT primary key NOT NULL,
--   `ingredientId` int NOT NULL,
--   `UoMId` int NOT NULL,
-- );
--
-- CREATE TABLE ingredient_foodVariant (
--   `id` int AUTO_INCREMENT primary key NOT NULL,
--   `ingredientId` int NOT NULL,
--   `foodVariantId` int NOT NULL,
-- );
--
-- CREATE TABLE ingredient_substance (
--   `id` int AUTO_INCREMENT primary key NOT NULL,
--   `ingredientId` int NOT NULL,
--   `substanceId` int NOT NULL,
-- );
--
-- CREATE TABLE ingredient_prepStyle (
--   `id` int AUTO_INCREMENT primary key NOT NULL,
--   `ingredientId` int NOT NULL,
--   `prepStyleId` int NOT NULL,
-- );

CREATE TABLE recipe_ingredient (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `recipeId` int NOT NULL,
  `ingredientId` int NOT NULL,
  `ingredientIndex` int NOT NULL
);
