async function buildCarousel(params){
  var target = params.target || $(".flexCarousel")[0]
  var imagePaths = params.imagePaths || []
  var options = params.options || {

  }
  console.log(imagePaths)
  var carouselHTML = $("#cargoHold > .flexCarousel").clone()
  imagePaths.forEach((x, i) => {
    carouselHTML.find(".crslSeatPanel").append(`
      <span class="flexCarouselSlot" style="--idx: ${i}; background-image: url('${x}')">
      </span>
      `)
  });
  target.append(carouselHTML)
}
// <img class="flexCarouselImg" src="${x}" />
async function crslCycle(event, element, direction) {
  var target = $(element).parent()
  console.log("event", event)
  console.log("element", element)
  console.log("direction", direction)
}
// style=""background-image: url('');

// //Carousel
// //////////
// SC_loadedApps.push("Carousel");
//
// var SC_Carousel = function(root) {
//   var defaultParams = {
//     // "settings": {
//     //   "pane": {
//     //     "auto_rotate": false,
//     //     "orientation": "horizontal",
//     //     "orientation": "horizontal",
//     //     "nodes_in_view": 3,
//     //     "node_spacing": "10",
//     //     "featureSet": "content"
//     //   },
//     //   "nav_arrows": {
//     //     "image": "/Assets/JS/Servercide/SC_Carousel/arrow_left.png",
//     //     "display": "outer"
//     //   },
//     //   "pagination": {
//     //     "display": "bottom",
//     //     "node_count": 1
//     //   }
//     // },
//     // "nodes": {
//     //   "node_template": '<span class="nodecontent" style="background-color:{{bg_color}};width:100%;height:100%;">{{title}}</span>',
//     //   "node_content": [
//     //     { title: "foo", bg_color: "#acc" },
//     //     { title: "baz", bg_color: "#bcc" },
//     //     { title: "bar", bg_color: "#ccc" },
//     //     { title: "lorem", bg_color: "#dcc" },
//     //     { title: "ipsum", bg_color: "#ecc" },
//     //     { title: "dolor", bg_color: "#fcc" }
//     //   ]
//     // }
//   };
//   var promise = ServercideApp.call(this, root, "SC_Carousel", defaultParams);
//   // var app = this;
//   // var defNode = '<span id="node{{index}}" class="carouselSeat center_contents">' + this.getParam("nodes")["node_template"].toString() + '</span>';
//   // app.render();
//   //
//   this.finishStrapping();
//   return promise;
// }
// SC_Carousel.prototype = Object.create(ServercideApp.prototype);
//
// SC_Carousel.prototype.render = function () {
//   var app = this;
//   var seats = parseInt(app.getParam("settings").pane.nodes_in_view) + 2;
//   $(this.root).append('<span class="SC_carouselPane grid rows RowsOf' + seats + ' dirAxis_around isSet"></span>');
//   app.carouselPane = $(this.root).find(".SC_carouselPane");
//
//   app.getParam("nodes").node_content.forEach(function(idx, content_object){
//     app.carouselPane.append('<span class="carouselSeat center_contents' + ((idx == 0)?' isRef':'') + '" style="order: ' + (idx + 1) + ';">');
//   });
// }
//
// SC_Carousel.prototype.build = function () {
//   var approot = this.root;
//   var pane = this.settings.pane;
//   var node = this.settings.node;
//   var nav = this.settings.nav_arrows;
//   var pages = this.settings.page_dots;
//
//   $(this.root).html('<span class="carousel_wrap" style="width:100%;height:100%;display:flex;flex-flow:column nowrap;">' +
//       '<span class="carousel_head" style="width:100%;height:15%;display:flex;flex-flow:row nowrap;">' +
//         '<span class="head_left"  style="width:10%;height:100%;"></span>' +
//         '<span class="head_main"  style="width:80%;height:100%;"></span>' +
//         '<span class="head_right"  style="width:10%;height:100%;"></span>' +
//       '</span>' +
//       '<span class="carousel_pane" style="width:100%;height:70%;display:flex;justify-content:space-around;flex-flow:row nowrap;">' +
//         '<span class="pane_left" style="width:10%;height:100%;"></span>' +
//         '<span class="pane_main" style="width:80%;height:100%;display:flex;overflow:hidden;"></span>' +
//         '<span class="pane_right" style="width:10%;height:100%;"></span>' +
//       '</span>' +
//       '<span class="carousel_foot" style="width:100%;height:15%;display:flex;flex-flow:row nowrap;">' +
//         '<span class="foot_left" style="width:10%;height:100%;"></span>' +
//         '<span class="foot_main" style="width:80%;height:100%;"></span>' +
//         '<span class="foot_right" style="width:10%;height:100%;"></span>' +
//       '</span>' +
//     '</span>');
//
//   //Navs
//   //////
//   var sibling_navs = '<span style="display:flex;flex-flow:row nowrap;justify-content:space-between"><img class="nav_back" src="' + nav.image + '" /><img class="nav_next" src="' + nav.image + '" style="transform:rotate(180deg);" /></span>';
//   if (nav.display == "top") {$(this.root).find(".head_main").append(sibling_navs);}
//   else if (nav.display == "right") { $(this.root).find(".pane_right").append(sibling_navs); }
//   else if (nav.display == "bottom") { $(this.root).find(".foot_main").append(sibling_navs); }
//   else if (nav.display == "left") { $(this.root).find(".pane_left").append(sibling_navs); }
//   else if (nav.display == "outer") {
//     if (pane.orientation == "horizontal") { var back = ".pane_left"; var next = ".pane_right"; }
//     if (pane.orientation == "vertical") { var back = ".head_main"; var next = ".foot_main"; }
//     $(this.root).find(back).append('<span style="display:flex;flex-flow:row nowrap;justify-content:space-between"><img class="nav_back" src="' + nav.image + '" /></span>');
//     $(this.root).find(next).append('<span style="display:flex;flex-flow:row nowrap;justify-content:space-between"><img class="nav_next" src="' + nav.image + '" style="transform:rotate(180deg);" /></span>');
//   }
//   $(this.root).find(".nav_back").one("click", $.proxy(function () { this.cycleNodes($(container), "back"); }, this));
//   $(this.root).find(".nav_next").one("click", $.proxy(function () { this.cycleNodes($(container), "next"); }, this));
//   //////
//
//   //pagination dots
//   /////////////////
//   if (pages.display == "top") { $(this.root).find(".head_main").append('<span class="page_dots" style="display:flex;flex-flow:row nowrap;justify-content:space-around;"></span>'); }
//   if (pages.display == "right") { $(this.root).find(".pane_right").append('<span class="page_dots" style="display:flex;flex-flow:column nowrap;justify-content:space-around;"></span>'); }
//   if (pages.display == "bottom") { $(this.root).find(".foot_main").append('<span class="page_dots" style="display:flex;flex-flow:row nowrap;justify-content:space-around;"></span>'); }
//   if (pages.display == "left") { $(this.root).find(".pane_left").append('<span class="page_dots" style="display:flex;flex-flow:column nowrap;justify-content:space-around;"></span>'); }
//   for (var x = 0; x < this.objects.length; x++) {
//     if (x % pane.nodes_in_view == 0){
//       $(this.root).find(".page_dots").append('<span style="height:16px;width:16px;border-radius:8px;background-color:lightblue;"></span>');
//     }
//   }
//   /////////////////
//
//   //nodes
//   ///////
//   var left_place = 0;
//   var top_place = 0;
//   if (pane.orientation == "horizontal") {
//     $(this.root).find(".pane_main").css("flex-flow", "row nowrap").css("width", pane.nodes_in_view * (node.width + pane.node_spacing));
//     left_place = node.width + pane.node_spacing; top_place = 0;
//   }
//   if (pane.orientation == "vertical") {
//     $(this.root).find(".pane_main").css("flex-flow", "column nowrap").css("height", pane.nodes_in_view * (node.height + pane.node_spacing));
//     left_place = 0; top_place = node.height + pane.node_spacing;
//   }
//
//   var node_template = this.node;
//   var currNode = null;
//
//   this.objects.forEach(function (item, index) {
//     currNode = node_template.toString()
//       .replace(/{{index}}/g, index)
//       .replace(/{{left_place}}/g, index * left_place)
//       .replace(/{{top_place}}/g, index * top_place)
//       .replace(/{{node_width}}/g, node.width)
//       .replace(/{{node_height}}/g, node.height)
//       .replace(/{{node_margin}}/g, pane.node_spacing / 2);
//     for (var node_param in item) {
//       var regex = new RegExp("{{" + node_param + "}}", "g");
//       currNode = currNode.replace(regex, item[node_param]);
//     }
//     $(approot).find(".pane_main").append(currNode);
//     if (index < pane.nodes_in_view) { $(approot).find(".pane_main").last(".carouselnode").attr("carousel_position","active"); }
//     if (index == pane.nodes_in_view) { $(approot).find(".pane_main").last(".carouselnode").attr("carousel_position","avail_next"); }
//   });
//   ///////
//
//   this.preserveInfinity_SC("back");
// }
//
// SC_Carousel.prototype.cycleNodes = function(carousel, direction, speed) {
//   speed = speed || 500;
//   var app = this;
//   $(app.root).find("#carouselbackarrow").off("click");
//   $(app.root).find("#carouselnextarrow").off("click");
//
//   if ($(carousel).find("span[id^='carouselnode']").length > 1) {
//     if (direction == 'back') { var slide_direction = "+="; }
//     else if (direction == 'next') { var slide_direction = "-="; }
//
//     if (this.settings.orientation == "horizontal") {
//       $(carousel).find("span[id^='carouselnode']").each(function () {
//         var slide_dist = parseInt($(carousel).data("carousel_settings").node_width) + parseInt($(carousel).data("carousel_settings").gap_between_nodes);
//         $(this).animate({ left: slide_direction + slide_dist }, speed, function () { });
//       });
//     }
//     else if (this.settings.orientation == "vertical") {
//       $(carousel).find("span[id^='carouselnode']").each(function () {
//         var slide_dist = parseInt($(carousel).data("carousel_settings").node_height) + parseInt($(carousel).data("carousel_settings").gap_between_nodes);
//         $(this).animate({ top: slide_direction + slide_dist }, speed, function () { });
//       });
//     }
//
//     return promise = new Promise(function(fulfill, reject) {
//       $(app.root).find(":animated").promise().done(function () {
//         console.log("found animated");
//         app.preserveInfinity(direction).then(function(){
//           $(app.root).find("#carouselbackarrow").one("click", $.proxy(function() { this.cycleNodes($(app.root), "back"); }, app));
//           $(app.root).find("#carouselnextarrow").one("click", $.proxy(function() { this.cycleNodes($(app.root), "next"); }, app));
//           fulfill('cycled');
//         });
//       });
//     });
//   }
// }
//
// SC_Carousel.prototype.preserveInfinity_SC = function (direction) {
//   if (direction == "back") { $(approot).find(".pane_main").prepend($(approot).find(".pane_main").last(".carouselnode")); }
// }
//
// SC_Carousel.prototype.preserveInfinity = function (direction) {
//   var app = this;
//   var carousel = app.root;
//   var last_node = null;
//   var last_node_pos = null;
//   var cliff_edge = null;
//
//   return promise = new Promise(function(fulfill, reject) {
//   if (direction == 'next') {
//     if (app.settings.orientation == "horizontal") {
//       if (parseInt($(carousel).find("span[id^='carouselnode']").last().css("left").replace('px')) <= ($(carousel).data("total_pane_width") - $(carousel).data("carousel_settings").node_width)) {
//         $(carousel).find("span[id^='carouselnode']").first().appendTo($("#infinite_carousel"));
//         $(carousel).find("span[id^='carouselnode']").last().css("left", ($(carousel).data("total_pane_width") + $(carousel).data("carousel_settings").gap_between_nodes) + "px");
//       }
//     }
//     else if (app.settings.orientation == "vertical") {
//       if (parseInt($(carousel).find("span[id^='carouselnode']").last().css("top").replace('px')) <= ($(carousel).data("total_pane_height") - $(carousel).data("carousel_settings").node_height)) {
//         $(carousel).find("span[id^='carouselnode']").first().appendTo($("#infinite_carousel"));
//         $(carousel).find("span[id^='carouselnode']").last().css("top", ($(carousel).data("total_pane_height") + $(carousel).data("carousel_settings").gap_between_nodes) + "px");
//       }
//     }
//   }
//   else if (direction == 'back') {
//     if (app.settings.orientation == "horizontal") {
//       if (parseInt($(carousel).find("span[id^='carouselnode']").first().css("left").replace('px')) == 0) {
//         $(carousel).find("span[id^='carouselnode']").last().prependTo($("#infinite_carousel"));
//         $(carousel).find("span[id^='carouselnode']").first().css("left", "-" + $(carousel).data("node_plus_spacer_width") + "px");
//       }
//     }
//     else if (app.settings.orientation == "vertical") {
//       if (parseInt($(carousel).find("span[id^='carouselnode']").first().css("top").replace('px')) == 0) {
//         $(carousel).find("span[id^='carouselnode']").last().prependTo($("#infinite_carousel"));
//         $(carousel).find("span[id^='carouselnode']").first().css("top", "-" + $(carousel).data("node_plus_spacer_height") + "px");
//       }
//     }
//   }
//   var x = 1;
//   $(carousel).find("span[id^='carouselnode']").each(function () {
//     if ($(carousel).data("orientation") == "horizontal") {
//       if (parseInt($(this).css("left").replace("px", "")) >= 0 && parseInt($(this).css("left").replace("px", "")) <= $(carousel).data("total_pane_width")) {
//         $(carousel).find("#pagination_dot" + $(this).attr("id").match(/\d+/)[0]).css("background-color", "#bda792");
//         if (x == Math.ceil($(carousel).data("carousel_settings").nodes_in_view / 2)) { $(app.root).find("#infinite_carousel").attr("center_index", $(this).attr("id").match(/\d+/)[0]) }
//         x++;
//       }
//       else {
//         $(carousel).find("#pagination_dot" + $(this).attr("id").match(/\d+/)[0]).css("background-color", "#ded3c9");
//       }
//     }
//     else if ($(carousel).data("orientation") == "vertical") {
//       //alert($(this).css("top").replace("px", "") + ":" + ($(carousel).data("total_pane_height")));
//       if (parseInt($(this).css("top").replace("px", "")) >= 0 && parseInt($(this).css("top").replace("px", "")) <= $(carousel).data("total_pane_height")) {
//         $(carousel).find("#pagination_dot" + $(this).attr("id").match(/\d+/)[0]).css("background-color", "#bda792");
//         if (x == Math.ceil($(carousel).data("carousel_settings").nodes_in_view / 2)) { $("#infinite_carousel").attr("center_index", $(this).attr("id").match(/\d+/)[0]) }
//         x++;
//       }
//       else {
//         $(carousel).find("#pagination_dot" + $(this).attr("id").match(/\d+/)[0]).css("background-color", "#ded3c9");
//       }
//     }
//   });
//   fulfill('infinity preserved');
//   });
// }
//
// SC_Carousel.prototype.snapToIndex = function(dot_index) {
//   var app = this;
//
//   if ($(this.root).find("#infinite_carousel").attr("center_index") != dot_index) {
//     app.cycleNodes(this.root, "next", 100).then(function () { app.snapToIndex(dot_index); });
//     //$(this.root).find(":animated").promise().done(console.log("foo"));
//     //$(this.root).find(":animated").promise().done(function () { app.snapToIndex(dot_index); });
//   }
// }
//
// SC_Carousel.prototype.autoRotate = function() {
//   if (this.settings.auto_rotate == true) {
//     this.cycleNodes(carousel, "next", 1000);
//     var auto = setTimeout($.proxy(function() { this.autoRotate(); }, this), 6000, carousel);
//   }
// }
// //////////
