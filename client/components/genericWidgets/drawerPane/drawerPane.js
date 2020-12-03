cDI.components.drawerPane = {
  createDrawerPane: async (target) => {
    $(".drawerPane:not(.drawerPaneTemplate)").remove()

    var curtain = "<span class='drawerCurtain'></span>"
    $(target).prepend(curtain)
    curtain = $(target).find(".drawerCurtain")

    var pane = $(".drawerPane.drawerPaneTemplate").clone()
    $(target).append(pane)
    pane.removeClass("drawerPaneTemplate")
    var createdPane = $(target).children(".drawerPane")

    $(curtain).on("click", () => { cDI.components.drawerPane.closeDrawerPane(createdPane) })

    return createdPane
  },
  populateDrawerPane: async (pane, content) => {
    $(pane).append(content)
  },
  openDrawerPane: async (pane) => {
    $(pane).addClass("open")
  },
  closeDrawerPane: async (pane) => {
    $(pane).removeClass("open")
    setTimeout(() => {
      pane.remove()
      $(".drawerCurtain").remove()
    }, 500)
  }
}

//USAGE
///////
// var pane = await cDI.components.drawerPane.createDrawerPane($("html"))
// cDI.components.drawerPane.populateDrawerPane(pane, `
//   <span>Content</span>
// `)
// cDI.components.drawerPane.openDrawerPane(pane)
