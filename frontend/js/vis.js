 var parseDate = d3.time.format("%H-%M-%S").parse;

    var data=[
     {"category": "Source 1", "from": "00-00-00", "to": "15-06-00"},
     {"category": "Source 2", "from": "17-30-00", "to": "17-35-00"},
     {"category": "Source 3", "from": "18-00-00", "to": "18-30-00"},
     {"category": "Source 4", "from": "16-20-00", "to": "17-00-00"},
     {"category": "Source 5", "from": "20-00-00", "to": "24-00-00"},
     {"category": "Source 1", "from": "15-30-00", "to": "15-36-00"}
    ]

    data.forEach(function(d) {
        d.from = parseDate(d.from);
        d.to = parseDate(d.to);
    });
    var margin = {top: 50, right: 50, bottom: 50, left: 100},
        width = 2000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var y = d3.scale.ordinal()
        .rangeRoundBands([0, height], .2);

    var x = d3.time.scale().range([0, width]);

    y.domain(data.map(function(d) { return d.category; }));
    x.domain([d3.min(data,function(d){return d.from;}), d3.max(data,function(d){return d.to;})]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(30)
        .tickFormat(d3.time.format("%H:%M"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append("text")
          .attr("x", width-margin.right)
          .attr("dx", ".71em")
          .attr("dy", "-0.2em")
          .text("Time");

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

      svg.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("y", function(d) { return y(d.category); })
          .attr("height", "20")
          .attr("transform", "translate(0,20)")
          .attr("x", function(d) { return x(d.from); })
          .attr("width", function(d) { return x(d.to) - x(d.from)});


    // var tooltip = d3.select("#container")
    // .append('div')
    // .attr('class', 'tooltip');

    // tooltip.append('div').attr('class', 'category');
    // tooltip.append('div').attr('class', 'tempRange');
    // // tooltip.append('div').attr('class', 'progress');

    // svg.selectAll(".bar,.pending")
    // .on('mouseover', function(d) {

    //   tooltip.select('.category').html("<b>" + d.category + "</b>");
    //   tooltip.select('.tempRange').html(d.from.toDateString() + " to " + d.to.toDateString());
    //   // tooltip.select('.progress').html(d.progress + "% completed");

    //   tooltip.style('display', 'block');
    //   tooltip.style('opacity',2);

    // })
    // .on('mousemove', function(d) {
    //   tooltip.style('top', (d3.event.layerY + 10) + 'px')
    //   .style('left', (d3.event.layerX - 15) + 'px');
    // })
    // .on('mouseout', function() {
    //   tooltip.style('display', 'none');
    //   tooltip.style('opacity',0);
    // });