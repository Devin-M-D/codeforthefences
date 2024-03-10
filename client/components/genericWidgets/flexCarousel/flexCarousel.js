cDI.components.flexCarousel = {
  buildCarousel: async (container, imagePaths) => {
    container.empty()
    var html = $(`
      <span class="flexCarousel">
        <span class="crslPrevWrapper hardCenter">
          <span class="crslPrev"></span>
        </span>
        <span class="crslSeatPanel"></span>
        <span class="crslNextWrapper hardCenter">
          <span class="crslNext"></span>
        </span>
      </span>`)
    await ftbAddInput("click.cycleCarouselLeft", html.find(".crslPrev"), async (e) => {
      await ftbCmp("flexCarousel").crslCycle(event, e.target, 'prev')
    })
    await ftbAddInput("click.cycleCarouselLeft", html.find(".crslNext"), async (e) => {
      await ftbCmp("flexCarousel").crslCycle(event, e.target, 'next')
    })
    var seatPanel = html.find(".crslSeatPanel")
    imagePaths.forEach((x, i) => {
      var seatSpecial = ""
      if (i == 0) { seatSpecial = " crslLeadHorse" }
      if (i == imagePaths.length - 1) { seatSpecial = " crslAnchorHorse" }

      seatPanel.append(`<span class="crslSlot${seatSpecial}" style="--idx: ${i}; background-image: url('${x}')"></span>`)
    })
    ftbCmp("flexCarousel").setShowPony($(".crslSlot"))
    container.append(html)
  },
  crslCycle: (event, element, direction) => {
    cDI.sequencer.debounce("cycleFlexCarousel", () => {
      var target = $(element).parent().parent()
      seats = target.find(".crslSlot")

      if (direction == "prev") { ftbCmp("flexCarousel").cyclePrev(seats) }
      else if (direction == "next") { ftbCmp("flexCarousel").cycleNext(seats) }
      ftbCmp("flexCarousel").setShowPony(seats)
    },
    250)
  },
  cyclePrev: (seats) => {
    seats.each((i, el) => {
      var idx = parseInt($(el).css("--idx"))
      if (idx != seats.length - 1) { $(el).css("--idx", idx + 1) }
      else { $(el).css("--idx", 0) }

      if (idx == 0) { $(el).removeClass("crslLeadHorse") }
      else if (idx == seats.length - 1) { $(el).removeClass("crslAnchorHorse").addClass("crslLeadHorse") }
      else if (idx == seats.length - 2) { $(el).addClass("crslAnchorHorse") }
    })
  },
  cycleNext: (seats) => {
    seats.each((i, el) => {
      var idx = parseInt($(el).css("--idx"))
      if (idx == 0) { $(el).css("--idx", seats.length - 1) }
      else { $(el).css("--idx", idx - 1) }

      if (idx == 0) { $(el).removeClass("crslLeadHorse").addClass("crslAnchorHorse") }
      else if (idx == seats.length - 1) { $(el).removeClass("crslAnchorHorse") }
      else if (idx == 1) { $(el).addClass("crslLeadHorse") }
    })
  },
  setShowPony: (seats) => {
    seats.each((i, el) => {
      if (parseInt($(el).css("--idx")) == 1) { $(el).addClass("crslShowPony") }
      else { $(el).removeClass("crslShowPony") }
    })
  }
}
