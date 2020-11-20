cDI.components.searchSelect = {
  focus: async (target, searchRoute, propName) => {
    var pane = await cDI.components.drawerPane.createDrawerPane($("html"))
    await cDI.components.drawerPane.populateDrawerPane(pane, ``)
    var tempInput = target.clone()
    tempInput.prependTo(pane)
    pane.addClass("algnSX")

    tempInput.off("onfocus")
    tempInput.on("focusout", (e, s) => { cDI.components.searchSelect.loseFocus(tempInput, target) })
    tempInput.addClass("searchSelectInputTemp")
    tempInput.focus()

    cDI.components.drawerPane.openDrawerPane(pane)

    tempInput.val(target.val())

    tempInput.on("keyup", (e) => {
      cDI.sequencer.debounce("testtest", async () => {
        console.log("searchFiring")
        $(".searchSelectResults").remove()
        var searchRes = await cDI.remote.remoteCall(searchRoute, { name: $(e.target).val() })
        var paneHTML = `<span class="searchSelectResults cols algnSX">`
        searchRes.payload.forEach(x => {
          paneHTML += `<span class="searchSelectOption absCen">${x[propName]}</span>`
        })
        paneHTML += `</span>`
        pane.append(paneHTML)
      }, 500)
    })

    tempInput.trigger("keyup")
  },
  loseFocus: async(tempInput, target) => {
    //cDI.components.drawerPane.closeDrawerPane($(tempInput).parent())
  }
}
