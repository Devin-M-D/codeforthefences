cDI.components.modal = {
  init: () => {

  },
  drawCurtain: async (params = {}) => {
    var target = params.target || $("html")
    var content = params.content || ""
    var maximizeDialog = params.maximizeDialog || false
    target.prepend(`<span class="modalCurtain">${content}</span>`)
    var curtain = target.find(".modalCurtain")

    if (maximizeDialog){
      cDI.components.modal.maximizeDialog(target)
    }
    curtain.on("click", (e) => {
        e.stopPropagation()
        cDI.components.modal.raiseCurtain()
    })
    curtain.find(" > *").on("click", (e) => {
        e.stopPropagation()
    })
    return curtain.find(" > *")
  },
  raiseCurtain: async (target) => {
    if (target) { target = target.find(".modalCurtain") }
    else { target = $(".modalCurtain").last() }
    await target.remove()
  },
  maximizeDialog: (target) => {
    target = target || $("html")
    var content = target.find(".modalCurtain").last()
    content.addClass("max")
  },
  clickToModal: async (elem, compPath, compName, fn, maximizeDialog = false) => {
    await cDI.addAwaitableInput("click", elem, async (e) => {
      var tmpContainer = $("<span id='modalTemp'></span>")
      var contentDI = await cDI.remote.loadComponent(tmpContainer, compPath, compName)
      var content = tmpContainer.html()
      var modalElements = await cDI.components.modal.drawCurtain({ content: content, maximizeDialog: maximizeDialog })
      tmpContainer.remove()
      if (contentDI.init) {
        contentDI.init()
      }

      if (cDI.utils.isDef(fn)) { await fn(modalElements) }
      return modalElements
    })
  }
}
