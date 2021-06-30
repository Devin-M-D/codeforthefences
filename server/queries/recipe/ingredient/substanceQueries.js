module.exports = {
  getAll:
`
SELECT * FROM substance
`,
  getByName:
`
SELECT * FROM substance WHERE name = ?
`
}
