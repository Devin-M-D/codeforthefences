cDI.components.flexCarousel = {
  buildCarousel: async (params) => {
    var target = params.target || $(".flexCarousel")[0]
    var imagePaths = params.imagePaths || []
    var options = params.options || {

    }
    target.empty()

    console.log(imagePaths)
    var carouselHTML = $("#cargoHold > .flexCarousel").clone()
    imagePaths.forEach((x, i) => {
      var seatSpecial = ""
      if (i == 0) { seatSpecial = " crslLeadHorse" }
      if (i == imagePaths.length - 1) { seatSpecial = " crslAnchorHorse" }

      carouselHTML.find(".crslSeatPanel").append(`
        <span class="crslSlot${seatSpecial}" style="--idx: ${i}; background-image: url('${x}')"></span>
      `)
    });
    target.append(carouselHTML)
  },
  crslCycle: (event, element, direction) => {
    cDI.sequencer.debounce("cycleFlexCarousel", () => {
      var target = $(element).parent().parent()
      seats = target.find(".crslSlot")

      if (direction == "prev"){
        seats.each((i, el) => {
          var idx = parseInt($(el).css("--idx"))
          if (idx != seats.length - 1) { $(el).css("--idx", idx + 1) }
          else { $(el).css("--idx", 0) }

          if (idx == 0) { $(el).removeClass("crslLeadHorse") }
          else if (idx == seats.length - 1) { $(el).removeClass("crslAnchorHorse").addClass("crslLeadHorse") }
          else if (idx == seats.length - 2) { $(el).addClass("crslAnchorHorse") }
        })
      }
      else if (direction == "next") {
        seats.each((i, el) => {
          var idx = $(el).css("--idx")
          if (idx == 0) { $(el).css("--idx", seats.length - 1) }
          else { $(el).css("--idx", idx - 1) }

          if (idx == 0) { $(el).removeClass("crslLeadHorse").addClass("crslAnchorHorse") }
          else if (idx == seats.length - 1) { $(el).removeClass("crslAnchorHorse") }
          else if (idx == 1) { $(el).addClass("crslLeadHorse") }
        })
      }
    },
    250)
  }
}
