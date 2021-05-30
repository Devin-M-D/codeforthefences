var db

var createChainable = () => {
  var query = ""

  return {
    query: () => { return query },
    select: (tableName) => {
      query += `SELECT * FROM ${tableName}`
    },
    where: () => {

    },
    send: async () => {
      return await db.runQuery(query)
    }
  }
}

module.exports = (_db) => {
  db = _db
  return {
    create: () => {
      return createChainable()
    },
    read: (tableName) => {
      var chain = createChainable()
      chain.select(tableName)
      return chain
    },
    update: () => {
      return createChainable()
    },
    delete: () => {
      return createChainable()
    }
  }
}
