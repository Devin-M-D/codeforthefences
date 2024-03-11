USE codeforthefences;

CREATE TABLE user (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `username` nvarchar(64) UNIQUE NOT NULL,
  `password` nvarchar(128) NOT NULL,
  `sessionId` nvarchar(128) NULL,
  `lastLogin` datetime NULL
);

CREATE TABLE blogPost (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `authorId` int NOT NULL,
  `title` nvarchar(64) NOT NULL,
  `createdDate` datetime NOT NULL,
  `content` mediumtext NOT NULL
);

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
  `UoMId` int NULL,
  `foodVariantId` int NULL,
  `substanceId` int NOT NULL,
  `prepStyleId` int NULL
);

CREATE TABLE UoM (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `name` nvarchar(64) NOT NULL,
  `plural` nvarchar(64) NULL,
  `abbreviation` nvarchar(32) NULL
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

CREATE TABLE recipe_ingredient (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `recipeId` int NOT NULL,
  `ingredientId` int NOT NULL,
  `ingredientIndex` int NOT NULL,
  `quantity` float NOT NULL
);

CREATE TABLE step (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `text` nvarchar(4000) NOT NULL
);

CREATE TABLE recipe_step (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `recipeId` int NOT NULL,
  `stepId` int NOT NULL,
  `stepIndex` int NOT NULL
);

CREATE TABLE stepMapType (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `mapType` nvarchar(32) NOT NULL
);

CREATE TABLE stepMap (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `recipeStepId` int NOT NULL,
  `stepMapTypeId` int NOT NULL,
  `barsIndex` int NOT NULL,
  `recipeIndex` int NOT NULL
);

CREATE TABLE vikingChess (
  `id` int AUTO_INCREMENT primary key NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `player1` int NOT NULL,
  `player2` int NOT NULL,
  `turn` int NOT NULL DEFAULT 0,
  `ended` TINYINT NOT NULL DEFAULT 0,
  `winner` int DEFAULT NULL,
  `gamestate` nvarchar(1000) NOT NULL DEFAULT '{ "k": "5,5", "w1": "5,3", "w2": "4,4", "w3": "5,4", "w4": "6,4", "w5": "3,5", "w6": "4,5", "w7": "6,5", "w8": "7,5", "w9": "4,6", "w10": "5,6", "w11": "6,6", "w12": "5,7", "b1": "3,0", "b2": "4,0", "b3": "5,0", "b4": "6,0", "b5": "7,0", "b6": "5,1", "b7": "0,3", "b8": "0,4", "b9": "0,5", "b10": "0,6", "b11": "0,7", "b12": "1,5", "b13": "10,3", "b14": "10,4", "b15": "10,5", "b16": "10,6", "b17": "10,7", "b18": "9,5", "b19": "5,9", "b20": "3,10", "b21": "4,10", "b22": "5,10", "b23": "6,10", "b24": "7,10"}'
);
