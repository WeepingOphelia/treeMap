
jsonurl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'

const colors = ['indianred', 'mediumpurple', 'darkseagreen', 'gold', 'orange', 'cornflowerblue', 'darkslategrey']

svg = d3.select('#chartbox')
  .append('svg')
  .attr('width', 1200)
  .attr('height', 600)

const tooltip = d3.select('#chartbox')
  .append('div')
  .attr('id','tooltip')
  .style('display','none')

const legend = d3.select('#legendbox')
  .append('svg')
  .attr('id','legend')
  .attr('width', colors.length * 100)

d3.json(jsonurl)
  .then(ref => {

    const root = d3.hierarchy(ref)
      .sum(d => d.value ? d.value : 0)
      .sort((a, b) => b.height - a.height || b.value - a.value)

    const treemap = d3.treemap()
      .tile(d3.treemapBinary)
      .size([1200, 600])


    treemap(root)

    const genres = ref.children.map(d => d.name)

    const color = genre => colors[genres.indexOf(genre)]

    const cells = svg.selectAll('g')
      .data(root.leaves())
      .enter()
      .append('g')
      .attr('class','cell')
      .attr('transform', d => 'translate(' + d.x0 + ',' + d.y0 + ')')

    const titleSplit = (title, width) => title.match(/.{1,14}(?:[\s-]|$)/g)

    cells
      .append('rect')
      .attr('id', d => d.data.name)
      .attr('class', 'tile')
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('ry', 3)
      .attr('data-name', d => d.data.name)
      .attr('data-category', d => d.data.category)
      .attr('data-value', d => d.data.value)
      .attr('fill', d => color(d.data.category))
      .attr('stroke','black')
      .on( 'mouseover', (event, d) => {

        tooltip
          .attr('data-value', d.data.value)
          .style('display','')
          .style('top', event.pageY - 150 + 'px')
          .html(`
            ${d.data.name}<br>
            <span style="color: ${color(d.data.category)}">${d.data.category}
            `)
        
        if (event.pageX <= window.innerWidth / 2) {
          tooltip
            .style('right', 'auto')
            .style('left', event.pageX + 20 + 'px')
        } else {
          tooltip
            .style('left', 'auto')
            .style('right', (window.innerWidth - event.pageX + 20) + 'px')
        }

      })

      .on( 'mouseout', (event, d) => {
        tooltip.style('display','none')
      })

    cells
      .append('text')
      .attr('x','5')
      .attr('y','10')
      .attr('cursor','default')
      .selectAll('tspan')
      .data(d => titleSplit(d.data.name, d.x1 - d.x0))
      .enter()
      .append('tspan')
      .attr('x', 5)
      .attr('y', (d, i) => (i * 10) + 10)
      .text(d => d)

    glegend = legend.selectAll('g')
      .data(genres)
      .enter()
      .append('g')

    glegend
      .append('rect')
      .attr('class','legend-item')
      .attr('height', 50)
      .attr('width', 50)
      .attr('x', (d, i) => i * 100)
      .attr('y', '20')
      .attr('fill', d => color(d))
      
    glegend
      .append('text')
      .attr('class','legendtext')
      .attr('x', (d, i) => i * 100)
      .attr('y', 90)
      .attr('fill','grey')
      .text(d => d)
  })