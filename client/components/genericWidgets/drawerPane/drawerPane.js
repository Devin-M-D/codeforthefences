cDI.components.drawerPane = {
  createDrawerPane: async (target) => {
    $(target).children(".drawerCurtain").remove()

    var curtain = $("<span class='drawerCurtain'></span>")
    $(target).prepend(curtain)
    ftbAddInput("click.closeDrawerPane", curtain, async () => {
      ftbRemoveInput("click.closeDrawerPane", curtain)
      await ftbCmp("drawerPane").closeDrawerPane(createdPane)
    })

    $(curtain).append(`<span class="drawerPane"></span>`)
    var createdPane = $(target).find(".drawerPane")
    return createdPane
  },
  populateDrawerPane: async (pane, content, useHeader = 0) => {
    content = $(content)
    $(pane).append(content)
  },
  openDrawerPane: async (pane) => {
    $(pane).addClass("open")
  },
  drawerPaneCloseButton: `
    <span class="mainMenuClose centerContents">
      <span class="btnIcon" data-btnsize="55">
        <span class="shpCancel"></span>
      </span>
    </span>`,
  closeDrawerPane: async (pane) => {
    $(pane).removeClass("open")
    setTimeout(() => {
      pane.remove()
      $(".drawerCurtain").remove()
    }, 500)
  }
}
