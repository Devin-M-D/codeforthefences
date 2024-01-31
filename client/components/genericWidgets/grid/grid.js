cDI.components.grid = {
  drawGrid: async (elem, x, y) => {
    var gridHtml = `<span class="grid rows wrap">`
    for (var i = 0; i < x; i++){
      for (var j = 0; j < y; j++){
        gridHtml += `<span data-gridX="${i}" data-gridY="${j}" style="flex-basis: ${100/x}%; height: ${100/y}%">${i}, ${j}</span>`
      }
    }
    gridHtml += `</span>`
    elem.append(gridHtml)
  }
}
