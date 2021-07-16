cDI.components.searchSelect = {
  buildSearchPane: async (source, searchRoute, propName, fn, allowAdd = false, addRoute) => {
    var pane = await cDI.components.drawerPane.createDrawerPane($("html"))
    pane.addClass("algnSX")
    await cDI.components.drawerPane.populateDrawerPane(pane, ``)

    var tempInput = source.clone()
    var inputContainer = `<span class="searchSelectInputContainer"><span class="btnClearInput centerRight">X</span></span>`
    pane.prepend(inputContainer)
    inputContainer = pane.find(".searchSelectInputContainer")

    inputContainer.append(tempInput)
    tempInput.val("")
    tempInput.off("onfocus")
    tempInput.addClass("searchSelectInputTemp")
    tempInput.focus()

    cDI.addAwaitableInput("click", inputContainer.find(".btnClearInput"), async () => {
      return await cDI.components.searchSelect.clear(tempInput)
    })
    cDI.components.searchSelect.setKeyup(source, pane, tempInput, searchRoute, propName, fn, allowAdd, addRoute)
    cDI.components.drawerPane.openDrawerPane(pane)

    return await cDI.awaitableInput("keyup", tempInput)
  },
  setKeyup: async (source, pane, tempInput, searchRoute, propName, fn, allowAdd, addRoute) => {
    cDI.addAwaitableInput("keyup", tempInput, async (e) => {
      $(".searchSelectResults").remove()
      pane.append(`
        <span class="searchSelectResults cols algnSX fitH">
          <span id="spinnerContainer" class="fitW"><span class="spinner"></span></span>
        </span>
      `)

      return cDI.sequencer.debounce("searchSelect", async () => {
        var searchString = $(e.target).html()
        ftbLogDev(`running search at ${searchRoute} for ${searchString}`)
        var searchRes = await cDI.remote.remoteCall(searchRoute, { expectMany: true, searchString: searchString })
        $("#spinnerContainer").remove()

        if (searchRes.payload.length == 0 && allowAdd){
          $(".searchSelectResults").append(`<span id="searchSelectAddNew" class="shpPlus"></span>`)
          cDI.addAwaitableInput("click", $("#searchSelectAddNew"), async () => {
            var newOption = await cDI.components.searchSelect.addNew(addRoute, searchString)
            // $(e.target).data("searchselectrecord", newOption)
            cDI.components.searchSelect.makeSelection($(e.target).parent().parent(), source, propName, newOption, fn)
          })
        }
        else {
          searchRes.payload.forEach((x, i) => {
            var searchOption = $(`<span class="searchSelectOption absCen option${i}">${x[propName]}</span>`)
            searchOption.data("dbrecord", x)
            $(".searchSelectResults").append(searchOption)
          })
          $(".searchSelectOption").map((i, x) => {
            var searchOption = $(x)
            searchOption.on("click", (e) => {
              cDI.components.searchSelect.makeSelection(searchOption.parent().parent(), source, propName, searchOption.data("dbrecord"), fn)
            })
          });
        }
        return pane
      }, 500)
    })
  },
  makeSelection: (instance, source, propName, data, fn) => {
    source.html(data[propName])
    source.data("searchselectrecord", data)
    if (fn) { fn(source) }
    cDI.components.drawerPane.closeDrawerPane(instance)
  },
  addNew: async(addRoute, newValue) => {
    var addRes = await cDI.remote.remoteCall(addRoute, { newValue: newValue, expectOne: true })
    return addRes
  },
  clear: async (input) => {
    input.val("")
    return await cDI.awaitableInput("keyup", input)
  },
  close: async(tempInput, target) => {
    cDI.components.drawerPane.closeDrawerPane($(tempInput).parent())
  }
}
