(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3'], factory) :
  (factory((global.d3 = global.d3 || {}),global.d3));
}(this, function (exports,d3) { 'use strict';

  function graphScroll(){
    var windowHeight,
        dispatch = d3.dispatch("scroll", "active", "progress", "reachBottom", "enterTop", "exitTop"),
        sections = d3.select('null'),
        i = NaN,
        sectionPos = [],
        sectionEndPos = [],
        n,
        graph = d3.select('null'),
        isFixed = null,
        isBelow = null,
        container = d3.select('body'),
        containerStart = 0, // position of #container
        containerEnd = 0,
        belowStart,
        eventId = Math.random(),

        // customize enter/leave zone by ratio of view height
        // E.g., [{ enter: 0.6, exit: 0.4 }]
        scrollingZoneViewHeightRatios = null ,
        computedScrollingZone = null,
        hasNotReachContainer = null

    function reposition(){            
      var i1 = -1
      
      var _hasNotReachContainer = sectionPos[0] > pageYOffset - containerStart + computedScrollingZone[0][0]

      if (hasNotReachContainer != _hasNotReachContainer) {
        hasNotReachContainer = _hasNotReachContainer
        if (hasNotReachContainer) {
          dispatch.call('exitTop')
        } else {
          dispatch.call('enterTop')
        }
      }

      // Not reach yet, don't run any of below.
      if (hasNotReachContainer) { return }

      sectionPos.forEach(function(d, i){
        if (d < pageYOffset - containerStart + computedScrollingZone[i][0]) i1 = i
      })

      i1 = Math.min(n - 1, i1)

      var isBelow1 = pageYOffset > belowStart
      if (isBelow != isBelow1){
        isBelow = isBelow1
        container.classed('graph-scroll-below', isBelow)
        if (isBelow) {
          dispatch.call('reachBottom', null)
        }
      }
      var isFixed1 = !isBelow && pageYOffset > containerStart
      if (isFixed != isFixed1){
        isFixed = isFixed1
        container.classed('graph-scroll-fixed', isFixed)
      }

      if (isBelow) i1 = n - 1

      if (i != i1){
        sections.classed('graph-scroll-active', function(d, i){ return i === i1 })
        dispatch.call('active', null, i1)
        i = i1
      }

      var enterOffset = computedScrollingZone[i][0]
      var exitOffset = computedScrollingZone[i][1]

      var pos = pageYOffset - containerStart
      var enterPos = sectionPos[i] - enterOffset
      var exitPos = sectionEndPos[i] - exitOffset
      var progress = (pos - enterPos)/(exitPos - enterPos)

      if(progress >= 0 && progress <= 1) 
        dispatch.call('progress', null, i1, progress)
      else if (progress < 0)
        dispatch.call('progress', null, i1, 0)
      else if (progress > 1)
        dispatch.call('progress', null, i1, 1)
    }
    
    function computeScrollingZoneFromRatios(ratios) {
      return ratios.map(function(obj) {
        return [obj.enter * innerHeight, (1-obj.exit) * innerHeight]
      })
    }

    function resize(){
      sectionPos = []
      sectionEndPos = []
      var startPos
      sections.each(function(d, i){
        if (!i) startPos = this.getBoundingClientRect().top
        var boundingRect = this.getBoundingClientRect()
        sectionPos.push(boundingRect.top -  startPos) 
        sectionEndPos.push(boundingRect.bottom - startPos)
      })

      var containerBB = container.node().getBoundingClientRect()
      var graphNode = graph.node()
      var graphHeight = graphNode ? graphNode.getBoundingClientRect().height : 0

      containerStart = containerBB.top + pageYOffset
      containerEnd = containerBB.bottom + pageYOffset
      computedScrollingZone = computeScrollingZoneFromRatios(scrollingZoneViewHeightRatios)

      belowStart = containerEnd - computedScrollingZone[sectionPos.length-1][1]
    }

    function keydown() {
      if (!isFixed) return
      var delta
      switch (d3.event.keyCode) {
        case 39: // right arrow
        if (d3.event.metaKey) return
        case 40: // down arrow
        case 34: // page down
        delta = d3.event.metaKey ? Infinity : 1 ;break
        case 37: // left arrow
        if (d3.event.metaKey) return
        case 38: // up arrow
        case 33: // page up
        delta = d3.event.metaKey ? -Infinity : -1 ;break
        case 32: // space
        delta = d3.event.shiftKey ? -1 : 1
        ;break
        default: return
      }

      var i1 = Math.max(0, Math.min(i + delta, n - 1))
      if (i1 == i) return // let browser handle scrolling past last section
      d3.select(document.documentElement)
          .interrupt()
        .transition()
          .duration(500)
          .tween("scroll", function() {
            var i = d3.interpolateNumber(pageYOffset, sectionPos[i1] + containerStart)
            return function(t) { scrollTo(0, i(t)) }
          })

      d3.event.preventDefault()
    }


    var rv ={}

    rv.container = function(_x){
      if (!_x) return container

      container = _x
      return rv
    }

    rv.graph = function(_x){
      if (!_x) return graph

      graph = _x
      return rv
    }

    rv.eventId = function(_x){
      if (!_x) return eventId

      eventId = _x
      return rv
    }

    rv.sections = function (_x, _scrollingZoneViewHeightRatiosGenerator) {
      if (!_x) return sections

      sections = _x
      n = sections.size()

      scrollingZoneViewHeightRatios = []
      if (_scrollingZoneViewHeightRatiosGenerator) {
        for (var i = 0; i < n; i++) {
          var config = _scrollingZoneViewHeightRatiosGenerator(i, i === 0, i === n-1)
          var invalidConfig = false
          if (config === null || typeof(config) !== 'object') {
            console.error('Must return object.')
            invalidConfig = true
          }
          if (!('enter' in config) || !('exit' in config)) {
            console.error("Must return object with 'enter' and 'exit' keys.")
            invalidConfig = true
          }
          if (invalidConfig) {
            config = { 'enter': 0.6, 'exit': 0.4 }
          }
          scrollingZoneViewHeightRatios.push(config)
        }
      } else {
        for (var i = 0; i < n; i++) {
          scrollingZoneViewHeightRatios.push({ 'enter': 0.6, 'exit': 0.4 })
        }
      }

      d3.select(window)
          .on('scroll.gscroll'  + eventId, reposition)
          .on('resize.gscroll'  + eventId, resize)
          .on('keydown.gscroll' + eventId, keydown)
      
      resize()
      if (window['gscrollTimer' + eventId]) window['gscrollTimer' + eventId].stop()
      window['gscrollTimer' + eventId] = d3.timer(reposition);

      return rv
    }

    rv.on = function() {
      var value = dispatch.on.apply(dispatch, arguments);
      return value === dispatch ? rv : value;
    }

    return rv
  }

  exports.graphScroll = graphScroll;

  Object.defineProperty(exports, '__esModule', { value: true });

}));