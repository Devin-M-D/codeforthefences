cDI.pages.darkRoom = {
  siteHeaderText: "Dark Room",
  drawPage: async (container) => {
    var html = $(`
    <span id="darkRoomMain">
      <span id="darkRoomSelectShoot" class="cols"></span>
      <span id="darkRoomCarousel"></span>
    </span>`)
    await cDI.pages.darkRoom.addShoot(html.find("#darkRoomSelectShoot"), "Whitney Plantation Trip", "2020-07-31", "shoot")
    await cDI.pages.darkRoom.addShoot(html.find("#darkRoomSelectShoot"), "Hurricane Laura", "2020-08-27", "shoot2")
    container.append(html)
    await cDI.pages.darkRoom.setGallery("shoot")
  },
  addShoot: async (container, name, date, folder) => {
    var button = $(`<span class="shootBtn mgn10 btnStd hardCenter">${name}<br />${date}</span>`)
    await ftbAddInput("click.setShoot", button, async () => {
      await cDI.pages.darkRoom.setGallery(folder)
    })
    container.append(button)
  },
  setGallery: async (folder) => {
    var imgs = []
    if (folder == "shoot"){
      imgs.push("img/shoot/tiny1jpg.jpg")
      imgs.push("img/shoot/tiny2jpg.jpg")
      imgs.push("img/shoot/tiny3jpg.jpg")
      imgs.push("img/shoot/tiny4jpg.jpg")
      imgs.push("img/shoot/tiny5jpg.jpg")
      imgs.push("img/shoot/tiny6jpg.jpg")
      imgs.push("img/shoot/tiny7jpg.jpg")
      imgs.push("img/shoot/tiny8jpg.jpg")
      imgs.push("img/shoot/tiny9jpg.jpg")
      imgs.push("img/shoot/tiny10jpg.jpg")
    }
    else if (folder == "shoot2") {
      imgs.push("img/shoot2/hl1.jpg")
      imgs.push("img/shoot2/hl2.jpg")
      imgs.push("img/shoot2/hl3.jpg")
      imgs.push("img/shoot2/hl4.jpg")
      imgs.push("img/shoot2/hl5.jpg")
      imgs.push("img/shoot2/hl6.jpg")
    }
    await ftbCmp("flexCarousel").buildCarousel($("#darkRoomCarousel"), imgs)
  }
}
