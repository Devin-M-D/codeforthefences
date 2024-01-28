cDI.components.grid = {
  drawGrid: async (elem, x, y) => {
    for (var i = 0; i < x; i++){
      for (var j = 0; j < y; j++){
        elem.append(`<span style="flex-basis: ${100/x}%; height: ${100/y}%">${i}, ${j}</span>`)
      }
    }
  }
}
