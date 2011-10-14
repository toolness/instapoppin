var Cornish = (function() {
  var activateOnLoad = true;

  function ParseError(message) { this.message = message; }
  
  function getTimestampInSeconds(ts) {
    if (ts.length == 0)
      return 0;
    var timeParts = ts.split(':');
    realTimeParts = [];
    timeParts.forEach(function(number) {
      if (number.length == 0)
        number = '00';
      var floatNumber = parseFloat(number);
      if (isNaN(floatNumber))
        throw new ParseError('unable to parse time: ' + ts);
      realTimeParts.push(floatNumber);
    });
    switch (realTimeParts.length) {
      case 1:
      // It's a pure seconds-based offset.
      return realTimeParts[0];
      
      case 2:
      // It's in MM:SS format.
      return realTimeParts[0] * 60 + realTimeParts[1];
      
      case 3:
      // It's in HH:MM:SS format.
      return ((realTimeParts[0] * 60) + realTimeParts[1]) * 60 +
             realTimeParts[2];
      
      default:
      throw new ParseError('too many colons in time: ' + ts);
    }
  }
  
  var self = {
    parseDurations: function parseDurations(str) {
      var durations = [];
      if (typeof(str) == 'string') {
        var segments = str.split(',');
        segments.forEach(function(segment) {
          segment = segment.trim();
          segment = segment.split('-');
          if (segment.length > 2) {
            throw new ParseError("multiple dashes in segment:" + str);
          } else if (segment.length == 1) {
            throw new ParseError("missing dash in segment:" + str);
          }
          var duration = {
            start: getTimestampInSeconds(segment[0]),
            end: getTimestampInSeconds(segment[1]) || Infinity
          };
          durations.push(duration);
        });
        return durations;
      }
      
      throw new ParseError("unable to parse time durations: " + str);
    },
    ParseError: ParseError,
    preventDefault: function preventDefault() {
      activateOnLoad = false;
    },
    getParticipatingElements: function() {
      var elements = document.querySelectorAll('[data-active-during]');
      var array = [];
      for (var i = 0; i < elements.length; i++)
        array.push(elements[i]);
      return array;
    },
    addClass: function(element, name) {
      element.classList.add(name);
    },
    removeClass: function(element, name) {
      element.classList.remove(name);
    }
  };
  
  window.addEventListener("DOMContentLoaded", function() {
    if (!activateOnLoad)
      return;
    var pop = Popcorn('.primary-video');
    Cornish.getParticipatingElements().forEach(function(elem) {
      var activeDuring = elem.getAttribute('data-active-during');
      var durations = Cornish.parseDurations(activeDuring);
      durations.forEach(function(duration) {
        pop.code({
          start: duration.start,
          end: duration.end,
          onStart: function() {
            Cornish.addClass(elem, 'active');
          },
          onEnd: function() {
            Cornish.removeClass(elem, 'active');            
          }
        });
      });
    });
  }, false);
  
  return self;
})();
