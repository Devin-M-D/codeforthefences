cDI.components.drawerPane = {
  createDrawerPane: async (target) => {
    $(target).children(".drawerCurtain").remove()

    var curtain = $("<span class='drawerCurtain'></span>")
    $(target).prepend(curtain)

    $(curtain).append(`<span class="drawerPane"></span>`)
    $(curtain).find(".drawerPane").click(e => {
      e.stopPropagation();
    })
    var createdPane = $(target).find(".drawerPane")
    ftbAddInput("click.closeDrawerPane", curtain, async () => {
      ftbRemoveInput("click.closeDrawerPane", curtain)
      await ftbCmp("drawerPane").closeDrawerPane(createdPane)
    })
    return createdPane
  },
  populateDrawerPane: async (pane, content) => {
    content = $(content)
    $(pane).append(content)
  },
  openDrawerPane: async (pane) => {
    await cDI.utils.sleep(1)
    $(pane).addClass("open")
  },
  drawerPaneCloseButton: `
    <span class="drawerPaneClose hardCenter">
      <span class="btnIcon" data-btnsize="55">
        <span class="shpCancel"></span>
      </span>
    </span>`,
  closeDrawerPane: async (pane) => {
    $(pane).removeClass("open")
    setTimeout(() => {
      pane.parents(".drawerCurtain").remove()
    }, 250)
  }
}
