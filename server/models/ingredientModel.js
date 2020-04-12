var IngredientSchema   = new Schema({
    id: String,
    name: String,
    description: String
});

module.exports = new IngredientSchema(0, "test", "test ing");
