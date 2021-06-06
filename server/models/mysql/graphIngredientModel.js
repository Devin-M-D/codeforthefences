var UoM = require('./graphUoMModel')

var quantity = {
    id: null,
    deci: null,
    frac: null
}
var foodVariant = {
    id: null,
    name: null
}
var substance = {
    id: null,
    name: null
}
var prepStyle = {
    id: null,
    name: null
}

var ing = {
  ingredient: {
    quantity: quantity,
    UoMId: UoM,
    "<foodVariant": foodVariant,
    substance: substance,
    "<prepStyle": prepStyle,
  }
}

module.exports = ing
