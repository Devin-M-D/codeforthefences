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
    tempInput.off("onfocus")
    tempInput.addClass("searchSelectInputTemp")
    tempInput.focus()

    cDI.addAwaitableInput("click", inputContainer.find(".btnClearInput"), async () => {
      return await cDI.components.searchSelect.clear(tempInput)
    })
    cDI.components.searchSelect.setKeyup(source, pane, tempInput, searchRoute, propName)
    cDI.components.drawerPane.openDrawerPane(pane)

    return await cDI.awaitableInput("keyup", tempInput)
  },
  setKeyup: async (source, pane, tempInput, searchRoute, propName) => {
    cDI.addAwaitableInput("keyup", tempInput, async (e) => {
      var searchString = $(e.target).val()

      return cDI.sequencer.debounce("searchSelect", async () => {
        console.log("running search")
        $(".searchSelectResults").remove()

        var searchRes = await cDI.remote.remoteCall(searchRoute, { name: searchString })
        pane.append(`<span class="searchSelectResults cols algnSX fitH"></span>`)
        $(".searchSelectResults").append(`<span class="fitW"><span class="spinner"></span></span>`)

        if (searchRes.payload.length == 0){
          $(".searchSelectResults").append(`<span id="searchSelectAddNew" class="shpPlus"></span>`)
          cDI.addAwaitableInput("click", $("#searchSelectAddNew"), () => {
            cDI.components.searchSelect.addNew(searchString)
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
            searchOption.on("click", () => {
              source.val(searchOption.html())
              source.data("searchselectrecord", searchOption.data("dbrecord"))
              if (fn) { fn(source) }
              cDI.components.drawerPane.closeDrawerPane(searchOption.parent().parent())
            })
          });
        }
        return pane
      }, 500)
    })
  },
  addNew: async(value) => {
    console.log(value)
  },
  clear: async (input) => {
    input.val("")
    return await cDI.awaitableInput("keyup", input)
  },
  close: async(tempInput, target) => {
    cDI.components.drawerPane.closeDrawerPane($(tempInput).parent())
  }
}
