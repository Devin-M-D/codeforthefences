cDI.components.grid = {
  drawGrid: async (elem, x, y) => {
    var gridHtml = `<span class="grid rows wrap algnCC">`
    for (var i = 0; i < y; i++){
      for (var j = 0; j < x; j++){
        gridHtml += `<span data-gridX="${j}" data-gridY="${i}" style="flex-basis: ${100/x}%; height: ${100/y}%"></span>`
      }
    }
    gridHtml += `</span>`
    elem.append(gridHtml)
  }
}
