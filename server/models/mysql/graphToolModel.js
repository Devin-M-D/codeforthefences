var UoM = require('./graphUoMModel')

var toolType = {
  toolType: {
    id: null,
    name: null
  }
}

module.exports = {
  tool: {
    toolTypeId: toolType,
    "<UoMId": UoM
  }
}
