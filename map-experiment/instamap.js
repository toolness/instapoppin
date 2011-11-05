document.addEventListener("instapoppinactive", function() {
  var idCounter = 0;
  var locs = Instapoppin.getParticipatingElements("data-map-location");
  var pop = Popcorn(Instapoppin.primarySyncSource);
  locs.forEach(function(element) {
    var id = element.getAttribute("id");
    var location = element.getAttribute("data-map-location");
    var durations = Instapoppin.getActiveDurations(element);

    if (!id || id.length == 0) {
      id = "instamap-auto-id-" + idCounter++;
      element.setAttribute("id", id);
    }

    durations.forEach(function(duration) {
      pop.googlemap({
        start: duration.start,
        end: duration.end,
        type: "STREETVIEW",
        target: id,
        location: location,
        zoom: 1
      });
    });
  });
}, false);
