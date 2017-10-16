

var graph1 = d3.select('#c1 .graph')
                .append('svg')
                  .attr('width', 300)
                  .attr('height', 300)
                  .style('position', 'absolute')
                  .style('left', '50%')
                  .style('top', '50%')
                  .style('transform', 'translate(-50%,-50%)')
                  .style('border', '1px solid black')
graph1.append('circle')
        .attr('cx', 150)
        .attr('cy', 150)
        .attr('r', 150)
        .style('stroke', 'red')
        .style('fill', 'white')
        .style('strokeWidth', '3px')
graph1.append('rect')
        .attr('x', 150)
        .attr('y', 150)
        .attr('width', 100)
        .attr('height', 8)
        .style('stroke', 'red')
        .style('strokeWidth', '3px')

var graph2 = d3.select('#c2 .graph')
                .append('svg')
                  .attr('width', 300)
                  .attr('height', 300)
                  .style('position', 'absolute')
                  .style('left', '50%')
                  .style('top', '50%')
                  .style('transform', 'translate(-50%,-50%)')
                  .style('border', '1px solid black')
graph2.append('circle')
      .attr('cx', 150)
      .attr('cy', 150)
      .attr('r', 150)
      .style('stroke', 'green')
      .style('fill', 'pink')
      .style('strokeWidth', '3px')
graph2.append('rect')
      .attr('x', 150)
      .attr('y', 150)
      .attr('width', 100)
      .attr('height', 8)
      .style('fill', 'red')
      .style('stroke', 'green')
      .style('strokeWidth', '3px')

d3.graphScroll()
    .graph(d3.select('#c1 .graph'))
    .container(d3.select('#c1'))
  .sections(d3.selectAll('#c1 .sections > div'), function(i, isFirst, isLast) {
    if (isLast) {
      return { enter: 0.6, exit: 0.0 }
    }
    if (isFirst) {
      return { enter: 0.3, exit: 0.4 }
    }
    // IMPORTANT: prev'sexit + next's enter must < 1.0,
    // or the progress will not reach max value (~1)
    return { enter: 0.6, exit: 0.4 }
  })
  .on('progress', (i, d) => {
    if (i !== 1) d3.select('#c1 .graph svg rect').attr('transform', `rotate(${Math.ceil(d*360-90)}, 150, 150)`)
    if (i === 1) d3.select('#c1 .graph > div').text('No interaction at this section.')
    else d3.select('#c1 .graph > div').text('section = ' + i + '\nprogress = ' + d)
  })
  .on('active', (i) => {
    console.log('-----> active section', i)
    d3.select('#c1 .graph svg rect').attr('transform', `rotate(-90, 150, 150)`)
  })
  .on('reachBottom', () => {
    console.log('******** bottom 1 ********')
  })
  .on('exitTop', () => {
    console.log('[exit 1]')
    d3.select('#c1 .graph svg rect').attr('transform', `rotate(-90, 150, 150)`)
    d3.select('#c1 .graph > div').text('Exit 1')
  })
  .on('enterTop', () => {
    console.log('[enter 1]')
    d3.select('#c1 .graph svg rect').attr('transform', `rotate(-90, 150, 150)`)
    d3.select('#c1 .graph > div').text('Enter 1')
  })



d3.graphScroll()
    .graph(d3.select('#c2 .graph'))
    .container(d3.select('#c2'))
  .sections(d3.selectAll('#c2 .sections > div'), function(i, isFirst, isLast) {
    if (isLast) {
      return { enter: 0.6, exit: 0.0 }
    }
    if (isFirst) {
      return { enter: 0.3, exit: 0.4 }
    }
    // IMPORTANT: prev'sexit + next's enter must < 1.0,
    // or the progress will not reach max value (~1)
    return { enter: 0.6, exit: 0.4 }
  })
  .on('progress', (i, d) => {
    d3.select('#c2 .graph svg rect').attr('transform', `rotate(${Math.ceil(d*360-90)}, 150, 150)`)
    d3.select('#c2 .graph > div').text('section = ' + i + '\nprogress = ' + d)
  })
  .on('active', (i) => {
    console.log('-----> active section', i)
    d3.select('#c2 .graph svg rect').attr('transform', `rotate(-90, 150, 150)`)
    d3.select('#c2 .graph > p').text('active section = ' + i)
  })
  .on('reachBottom', () => {
    console.log('******** bottom 2 ********')
  })
  .on('exitTop', () => {
    console.log('[exit 2]')
    d3.select('#c2 .graph svg rect').attr('transform', `rotate(-90, 150, 150)`)
  })
  .on('enterTop', () => {
    console.log('[enter 2]')
    d3.select('#c2 .graph svg rect').attr('transform', `rotate(-90, 150, 150)`)
  })