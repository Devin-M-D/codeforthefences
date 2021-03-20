module.exports = {
  getAll: async () => {
    var data = await DI.data.runQuery(
      `SELECT * FROM recipe WHERE name LIKE '%?%'`,
      [ search.name ]
    )
  }
  // for ()
  // return
}
