module.exports = {
  getAllRecipes: {
    query: `
    SELECT @rid, @class, $depth, * FROM (
    	TRAVERSE out(), inV() FROM (
        SELECT FROM recipe
      )
    )
    ORDER BY @class`,
    params: {},
  },
}
