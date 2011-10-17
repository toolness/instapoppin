/*
 * instapoppin.js version 0.2
 *
 * Copyright 2011, Mozilla Foundation
 * Licensed under the MIT license
 */

var Instapoppin = (function() {
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
    getActiveDurations: function(element) {
      var activeDuring = element.getAttribute('data-active-during');
      return Instapoppin.parseDurations(activeDuring);
    }
  };

  // Taken from http://hacks.mozilla.org/2010/01/classlist-in-firefox-3-6/
  var addClass = function (elm, className) {
      if (document.documentElement.classList) {
          addClass = function (elm, className) {
              elm.classList.add(className);
          }
      } else {
          addClass = function (elm, className) {
              if (!elm) {
                  return false;
              }
              if (!containsClass(elm, className)) {
                  elm.className += (elm.className ? " " : "") + className;
              }
          }
      }
      addClass(elm, className);
  }

  var removeClass = function (elm, className) {
      if (document.documentElement.classList) {
          removeClass = function (elm, className) {
              elm.classList.remove(className);
          }
      } else {
          removeClass = function (elm, className) {
              if (!elm || !elm.className) {
                  return false;
              }
              var regexp = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
              elm.className = elm.className.replace(regexp, "$2");
          }
      }
      removeClass(elm, className);
  }
  
  function warn(txt) {
     if (window.console && window.console.warn)
      window.console.warn(txt);
  }

  function info(txt) {
    if (window.console && window.console.info)
     window.console.info(txt);
  }
  
  window.addEventListener("DOMContentLoaded", function() {
    if (!activateOnLoad)
      return;
    var primaries = document.querySelectorAll('.primary-sync-source');
    if (primaries.length == 0) {
      var mediaElements = document.querySelectorAll('video, audio');
      
      if (mediaElements.length == 0) {
        warn("No media elements found on the page, aborting.");
        return;
      } else {
        info("No media elements found with class 'primary-sync-source', " +
             "using the first <" + mediaElements[0].nodeName + "> element " +
             "on the page.");
        primaries = mediaElements;
      }
    } else if (primaries.length > 1) {
      warn("More than one media element with class 'primary-sync-source' " +
           "found, aborting.");
      return;
    }
    var pop = Popcorn(primaries[0]);
    Instapoppin.getParticipatingElements().forEach(function(elem) {
      var durations = Instapoppin.getActiveDurations(elem);
      durations.forEach(function(duration) {
        pop.code({
          start: duration.start,
          end: duration.end,
          onStart: function() {
            addClass(elem, 'active');
          },
          onEnd: function() {
            removeClass(elem, 'active');            
          }
        });
      });
    });
  }, false);
  
  return self;
})();
