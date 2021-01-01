cDI.components.searchSelect = {
  buildSearchPane: async (target, searchRoute, propName, fn) => {
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

    cDI.addAwaitableInput("click", inputContainer.find(".btnClearInput"), async () => { return await cDI.components.searchSelect.clear(tempInput) })

    cDI.components.drawerPane.openDrawerPane(pane)

    cDI.addAwaitableInput("keyup", tempInput, async (e) => {
      return cDI.sequencer.debounce("searchSelect", async () => {
        $(".searchSelectResults").remove()

        var searchRes = await cDI.remote.remoteCall(searchRoute, { name: $(e.target).val() })
        var paneHTML = $(`<span class="searchSelectResults cols algnSX"></span>`)
        searchRes.payload.forEach((x, i) => {
          var searchOption = $(`<span class="searchSelectOption absCen option${i}">${x[propName]}</span>`)
          searchOption.data("dbrecord", x)
          paneHTML.append(searchOption)
        })
        pane.append(paneHTML)

        $(".searchSelectOption").map((i, x) => {
          var searchOption = $(x)
          searchOption.on("click", () => {
            target.val(searchOption.html())
            target.data("searchselectrecord", searchOption.data("dbrecord"))
            if (fn) { fn(target) }
            cDI.components.drawerPane.closeDrawerPane(searchOption.parent().parent())
          })
        });
        return pane
      }, 500)
    })

    return await cDI.awaitableInput("keyup", tempInput)
  },
  clear: async (input) => {
    input.val("")
    return await cDI.awaitableInput("keyup", input)
  },
  close: async(tempInput, target) => {
    cDI.components.drawerPane.closeDrawerPane($(tempInput).parent())
  }
}
