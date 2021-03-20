cDI.pages.darkRoom = {
  siteHeaderText: "Dark Room",
  setGallery: (folder) => {
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
    cDI.components.flexCarousel.buildCarousel({ target: $(".carousel"), imagePaths: imgs })
  }

}
cDI.pages.darkRoom.init = () => {
  cDI.pages.darkRoom.setGallery("shoot")
}
