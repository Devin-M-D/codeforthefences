cDI.components.searchSelect = {
  buildSearchPane: async (target, searchRoute, propName) => {
    var pane = await cDI.components.drawerPane.createDrawerPane($("html"))
    pane.addClass("algnSX")
    await cDI.components.drawerPane.populateDrawerPane(pane, ``)

    var tempInput = target.clone()
    var inputContainer = `<span class="searchSelectInputContainer"><span class="btnClearInput centerRight">X</span></span>`
    pane.prepend(inputContainer)
    inputContainer = pane.find(".searchSelectInputContainer")

    inputContainer.append(tempInput)
    tempInput.off("onfocus")
    tempInput.addClass("searchSelectInputTemp")
    tempInput.focus()

    inputContainer.find(".btnClearInput").on("click", () => { cDI.components.searchSelect.clear(tempInput) })

    cDI.components.drawerPane.openDrawerPane(pane)

    tempInput.on("keyup", (e) => {
      cDI.sequencer.debounce("searchSelect", async () => {
        $(".searchSelectResults").remove()

        var searchRes = await cDI.remote.remoteCall(searchRoute, { name: $(e.target).val() })
        var paneHTML = `<span class="searchSelectResults cols algnSX">`
        searchRes.payload.forEach(x => {
          paneHTML += `<span class="searchSelectOption absCen">${x[propName]}</span>`
        })
        paneHTML += `</span>`
        pane.append(paneHTML)

        $(".searchSelectOption").map((i, x) => {
          var option = $(x)
          option.on("click", () => {
            target.val(option.html())
            cDI.components.drawerPane.closeDrawerPane(option.parent().parent())
          })
        });
      }, 500)
    })

    tempInput.trigger("keyup")
  },
  clear: async (input) => {
    input.val("")
    input.trigger("keyup")
  },
  close: async(tempInput, target) => {
    cDI.components.drawerPane.closeDrawerPane($(tempInput).parent())
  }
}
