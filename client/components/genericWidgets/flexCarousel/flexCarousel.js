cDI.components.flexCarousel = {
  buildCarousel: async (params) => {
    var target = params.target || $(".flexCarousel")[0]
    var imagePaths = params.imagePaths || []
    var options = params.options || {

    }
    target.empty()
    target.append(`
      <span class="flexCarousel">
        <span class="crslPrevWrapper">
          <span class="crslPrev" onclick="cDI.components.flexCarousel.crslCycle(event, this, 'prev')"></span>
        </span>
        <span class="crslNextWrapper">
          <span class="crslNext" onclick="cDI.components.flexCarousel.crslCycle(event, this, 'next')"></span>
        </span>
        <span class="crslSeatPanel"></span>
      </span>
    `)
    var carouselHTML = target.find(".flexCarousel")
    imagePaths.forEach((x, i) => {
      var seatSpecial = ""
      if (i == 0) { seatSpecial = " crslLeadHorse" }
      if (i == imagePaths.length - 1) { seatSpecial = " crslAnchorHorse" }

      carouselHTML.find(".crslSeatPanel").append(`
        <span class="crslSlot${seatSpecial}" style="--idx: ${i}; background-image: url('${x}')"></span>
      `)
    })
    cDI.components.flexCarousel.setShowPony($(".crslSlot"))
  },
  crslCycle: (event, element, direction) => {
    cDI.sequencer.debounce("cycleFlexCarousel", () => {
      var target = $(element).parent().parent()
      seats = target.find(".crslSlot")

      if (direction == "prev") { cDI.components.flexCarousel.cyclePrev(seats) }
      else if (direction == "next") { cDI.components.flexCarousel.cycleNext(seats) }
      cDI.components.flexCarousel.setShowPony(seats)
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
