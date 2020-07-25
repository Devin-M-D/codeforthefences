async function strapContentMain() {
  await $.get("pages/home/home.html", (val) => {
    $("#contentMain").append(val)
    loadPageHome()
  })
}
