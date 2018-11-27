// Asks JavaScript to show more errors.
"use strict";



$(function() {
    $.getJSON("js/projects.json")
        .done(function(data) { visualize(data); })
        .fail(function() { alert("Failed to load the JSON file!\n(Did your Python run?)"); });
});


var visualize = function(data) {
 // var parseDate = d3.time.format("%H-%M-%S").parse;
    var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

    data.forEach(function(d) {
        d.from = parseDate(d.from);
        d.to = parseDate(d.to);
    });
    var margin = {top: 50, right: 50, bottom: 50, left: 150},
        width = 2000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var y = d3.scale.ordinal()
        .rangeRoundBands([0, height], .1);

    var x = d3.time.scale().range([0, width]);

    y.domain(data.map(function(d) { return d.name; }));
    x.domain([d3.min(data,function(d){return d.from;}), d3.max(data,function(d){return d.to;})]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(10).outerTickSize(0)
        .tickSize(0)
        .tickPadding(10)
        // .attr("font-size","4em")
        .tickFormat(d3.time.format("%H %p"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(0)
        .tickPadding(10)
        // .attr("fill","none")
        .orient("left");

    var svg = d3.select("#container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("g")
          .attr("class", "x axis")
          .style('font-weight','bold')
          .style('font-family','Raleway')
          .style('text-transform','lowercase')
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append("text")
          .attr("x", width-margin.right)
          .attr("dx", ".71em")
          .attr("dy", "-0.2em")

          .text("Time");

      function customYAxis(g) {
        var s = g.selection ? g.selection() : g;
        g.call(yAxis);
        s.select(".domain").remove();
        
      }

      svg.append("g")
          .attr("class", "y axis")
          .style('font-style', 'italic')
          .style('font-family','Raleway')
          .call(customYAxis);

      svg.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("y", function(d) { return y(d.name); })
          .attr("height", "10")
          .attr("fill",function(d) {
            if(d.task == "on") {
              return "#ffcc2e";
            }
            else if(d.task == "off") {
              return "#3498df";
            }
            else {
              return "#444";
            }
          })
          .attr("transform", "translate(0,16)")
          .attr("x", function(d) { return x(d.from); })
          .attr("width", function(d) { return x(d.to) - x(d.from)});


    var tooltip = d3.select("#container")
    .append('div')
    .attr('class', 'tooltip');

    tooltip.append('div').attr('class', 'name');
    tooltip.append('div').attr('class', 'task')
    tooltip.append('div').attr('class', 'tempRange');
    // tooltip.append('div').attr('class', 'progress');

    svg.selectAll(".bar,.pending")
    .on('mouseover', function(d) {

      tooltip.select('.name').html("<b>" + d.name + "</b>");
      tooltip.select('.name').html("<b>" + d.name + "</b>");
      tooltip.select('.tempRange').html(d.from.toString().substr(4,20) + " TO " + d.to.toString().substr(4,20));
      
      // tooltip.select('.progress').html(d.progress + "% completed");

      tooltip.style('display', 'block');
      tooltip.style('opacity',2);

    })
    .on('mousemove', function(d) {
      tooltip.style('top', (d3.event.layerY + 10) + 'px')
      .style('left', (d3.event.layerX) + 'px');
      console.log(d3.event.layerX);
    })
    .on('mouseout', function() {
      tooltip.style('display', 'none');
      tooltip.style('opacity',0);
    });



};