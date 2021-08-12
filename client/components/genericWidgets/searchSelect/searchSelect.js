cDI.components.searchSelect = {
  buildSearchPane: async (source, text, searchRoute, propName, fn, allowAdd = false, addRoute) => {
    var pane = `
      <span class="searchSelectPane autoH algnSX pad10">
      <span class="searchSelectTopText autoH algnXS pad10 bold italic">${text}</span>
        <span class="searchSelectHeader autoH wingedHeader" data-headerwings="20%">
          <span></span>
          <span class="searchSelectTempInput fauxrder"></span>
          <span class="closeModal">
            <span class="btnIcon" data-btnsize="55" data-headerwingmax="80">
              <span class="btnClearInput shpCancel"></span>
            </span>
          </span>
        </span>
      </span>`
    pane = await cDI.components.modal.init({ content: pane })

    pane.find(".searchSelectTempInput").append(source.clone())
    var tempInput = pane.find('[contenteditable="true"]')
    tempInput.removeClass("autoW")
    tempInput.addClass("searchSelectInputTemp")
    tempInput.val("")
    tempInput.off("onfocus")
    tempInput.focus()

    cDI.addAwaitableInput("click", pane.find(".btnClearInput"), async () => {
      return await cDI.components.searchSelect.clear(tempInput)
    })
    cDI.components.searchSelect.setKeyup(source, pane, tempInput, searchRoute, propName, fn, allowAdd, addRoute)

    await cDI.components.searchSelect.clear(tempInput)
    return pane
  },
  setKeyup: async (source, pane, tempInput, searchRoute, propName, fn, allowAdd, addRoute) => {
    cDI.addAwaitableInput("keyup", tempInput, async (e) => {
      $(".searchSelectResults").remove()
      pane.append(`
        <span class="searchSelectResults algnSX shyScroll">
          <span class="spinnerContainer"><span class="spinner"></span></span>
        </span>
      `)

      return cDI.sequencer.debounce("searchSelect", async () => {
        var searchString = $(e.target).html()
        ftbLogDev(`running search at ${searchRoute} for ${searchString}`)
        var searchRes = await cDI.remote.remoteCall(searchRoute, { expectMany: true, searchString: searchString })
        $(".spinnerContainer").remove()

        if (searchRes.payload.length == 0 && allowAdd){
          $(".searchSelectResults").append(`
            <span class="autoH fauxrder">
              <span class="btnIcon" data-btnsize="80">
                <span id="searchSelectAddNew" class="shpPlus"></span>
              </span>
            </span>`)
          cDI.addAwaitableInput("click", $("#searchSelectAddNew"), async () => {
            var newOption = await cDI.components.searchSelect.addNew(addRoute, searchString)
            cDI.components.searchSelect.makeSelection($(e.target).parent().parent(), source, propName, newOption, fn)
          })
        }
        else if (searchRes.payload.length == 0 && !allowAdd) {
          $(".searchSelectResults").append(`<span class="italic">No results</span>`)
        }
        else {
          for (var x = 0; x < searchRes.payload.length; x++){
            $(".searchSelectResults").append(`
              <span class="autoH fauxrder">
                <span class="searchSelectOption autoH btnStd">${searchRes.payload[x][propName]}</span>
              </span>`)
            var searchOption = $(".searchSelectResults").find(".searchSelectOption").last()
            searchOption.data("dbrecord", searchRes.payload[x])
            await cDI.addAwaitableInput("click", searchOption, e => {
              cDI.components.searchSelect.makeSelection(searchOption.parent().parent().parent(), source, propName, $(e.target).data("dbrecord"), fn)
            })
          }
        }
        return pane
      }, 500)
    })
  },
  makeSelection: (instance, source, propName, data, fn) => {
    source.html(data[propName])
    source.data("searchselectrecord", data)
    if (fn) { fn(source) }
    cDI.components.modal.raiseCurtain($("html"))
  },
  addNew: async (addRoute, newValue) => {
    var addRes = await cDI.remote.remoteCall(addRoute, { newValue: newValue, expectOne: true })
    return addRes
  },
  clear: async (input) => {
    input.html("")
    return await cDI.awaitableInput("keyup", input)
  },
  close: async(tempInput, target) => {
    cDI.components.modal.raiseCurtain($("html"))
  }
}
