cDI.components.modal = {
  html: `<span id="modals"></span>`,
  init: () => {

  },
  showModal: (params = {}) => {
    var target = params.target || $("body")
    var content = params.content || ""
    var maximizeDialog = params.maximizeDialog || false

    cDI.components.modal.drawCurtain(target)
    target.find(" > .modalCurtain").html(content)
    var curtain = target.find(".modalCurtain")

    if (maximizeDialog){
      cDI.components.modal.maximizeDialog(target)
    }
    cDI.components.modal.addRaiseCurtainEvent(curtain)
    var pane = curtain.find(" > *")
    return pane
  },
  drawCurtain: async (target) => {
    target.prepend(`<span class="modalCurtain"></span>`)
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
  clickToModal: async (elem, compPath, compName, fn, maximizeDialog = false) => {
    cDI.addAwaitableInput("click", elem, async (e) => {
      var tmpContainer = $("<span id='modalTemp'></span>")
      var contentDI = await ftbLoadComponent(compPath, compName, tmpContainer)
      var content = tmpContainer.html()
      var modalElements = await cDI.components.modal.showModal({ content: content, maximizeDialog: maximizeDialog })
      tmpContainer.remove()
      if (contentDI.init) {
        contentDI.init()
      }

      if (cDI.utils.isDef(fn)) { await fn(modalElements) }
      return modalElements
    })
  }
}
