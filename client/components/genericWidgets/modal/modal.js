cDI.components.modal = {
  showModal: (params = {}) => {
    var target = params.target || $("html")
    var content = params.content || ""
    var maximizeDialog = params.maximizeDialog || false
    var onCloseFn = params.onCloseFn || null

    ftbCmp("modal").drawCurtain(target)
    target.find(" > .modalCurtain").append(content)
    var curtain = target.find(".modalCurtain")

    if (maximizeDialog){
      ftbCmp("modal").maximizeDialog(target)
    }
    ftbCmp("modal").addRaiseCurtainEvent(curtain, onCloseFn)
    var pane = curtain.find(" > *")
    return pane
  },
  drawCurtain: (target) => {
    target.prepend(`<span class="modalCurtain hardCenter"></span>`)
  },
  addRaiseCurtainEvent: (curtain, onCloseFn) => {
    curtain.on("click.raiseModalCurtain", async (e) => {
        e.stopPropagation()
        if (onCloseFn) {
          await onCloseFn()
        }
        ftbCmp("modal").raiseCurtain()
    })
    curtain.find(" > *").on("click", (e) => {
        e.stopPropagation()
    })
  },
  raiseCurtain: (target) => {
    if (target) { target = target.find(".modalCurtain") }
    else { target = $(".modalCurtain").last() }
    target.remove()
  },
  maximizeDialog: (target) => {
    target = target || $("html")
    var content = target.find(".modalCurtain").last()
    content.addClass("max")
  },
  clickToModal: async (elem, content, maximizeDialog = false, onCloseFn = null) => {
    ftbAddInput("click.spawnModal", elem, async (e) => {
      var modalElements = await ftbCmp("modal").showModal({ content: content, maximizeDialog: maximizeDialog, onCloseFn: onCloseFn })
      return modalElements
    })
  },
  removeModalClick: async (elem) => {
    ftbRemoveInput("click.spawnModal", elem)
  }
}
