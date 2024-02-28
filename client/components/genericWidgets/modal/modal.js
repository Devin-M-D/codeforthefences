cDI.components.modal = {
  showModal: (params = {}) => {
    var target = params.target || $("html")
    var content = params.content || ""
    var maximizeDialog = params.maximizeDialog || false

    cDI.components.modal.drawCurtain(target)
    target.find(" > .modalCurtain").append(content)
    var curtain = target.find(".modalCurtain")

    if (maximizeDialog){
      cDI.components.modal.maximizeDialog(target)
    }
    cDI.components.modal.addRaiseCurtainEvent(curtain)
    var pane = curtain.find(" > *")
    return pane
  },
  drawCurtain: async (target) => {
    target.prepend(`<span class="modalCurtain centerContents"></span>`)
  },
  addRaiseCurtainEvent: (curtain) => {
    curtain.on("click", (e) => {
        e.stopPropagation()
        cDI.components.modal.raiseCurtain()
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
    target = target || $("body")
    var content = target.find(".modalCurtain").last()
    content.addClass("max")
  },
  clickToModal: async (elem, content, maximizeDialog = false) => {
    ftbAddInput("click.spawnModal", elem, async (e) => {
      var modalElements = await ftbCmp("modal").showModal({ content: content, maximizeDialog: maximizeDialog })
      return modalElements
    })
  },
  removeModalClick: async (elem) => {
    ftbRemoveInput("click.spawnModal", elem)
  }
}
