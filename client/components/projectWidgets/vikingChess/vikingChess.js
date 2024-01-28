cDI.components.vikingChess = {
  html: `<span id="vikingChess" class="rows wrap"></span>`,
  init: async () => {
    var gridDI = await ftbLoadComponent("components/genericWidgets", "grid")
    console.log(gridDI)
    gridDI.drawGrid($("#vikingChess"), 11, 11)
  }
}
