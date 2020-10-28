cDI.components.searchSelect = {
  init: async (target, searchRoute) => {
    target.on("change", cDI.sequencer.debounce("testtest", async () => {
      console.log(await cDI.remote.remoteCall(searchRoute))
    }))
  }
}
