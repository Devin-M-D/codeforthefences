var queryBuilder = require('query-builder')(require('../../foundation/dbLogic'))
var blogModel = require('../../models/blog/blogModel')

var blogQueries = {}

blogQueries.selectBase = `SELECT
${queryBuilder.projections(blogModel, 0)}
FROM blogPost`

blogQueries.readById = `
${blogQueries.selectBase}
WHERE id = ?
`

blogQueries.getBlogList = `SELECT id, title, createdDate FROM blogPost`

module.exports = blogQueries
