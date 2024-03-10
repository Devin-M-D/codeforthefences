cDI.components.graphPaper = {
  drawGrid: async (elem, x, y) => {
    var graphPaperHtml = `<span class="graphPaper rows" style="grid-template-columns: repeat(${x}, 1fr); grid-template-rows: repeat(${y}, 1fr);">`
    for (var i = 0; i < y; i++){
      for (var j = 0; j < x; j++){
        graphPaperHtml += `<span data-gridX="${j}" data-gridY="${i}"></span>`
      }
    }
    graphPaperHtml += `</span>`
    elem.append(graphPaperHtml)
  }
}
