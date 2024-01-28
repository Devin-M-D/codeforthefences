cDI.components.contentMain = {
  html: `<span id="contentMain" class="shyScroll algnSX"></span>`,
  loadPage: async (name) => {
    $("#contentMain").empty()
    return await ftbLoadComponent("pages", name, $("#contentMain"))
  }
}
