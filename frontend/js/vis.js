// Asks JavaScript to show more errors.
"use strict";

// $(function() {
//     $.getJSON("js/projects.json")
//         .done(function(data) {
//         alert(data); 
//         localStorage.setItem('key',JSON.stringify(data));
//           visualize(data); })
//         .fail(function() { alert("Failed to load the JSON file!\n(Did your Python run?)"); });
// });
// PULLING FROM FILE

var today, today2, day2, day, month, year, siteNum;
var userDate = localStorage.getItem('date'); // Fetches user-defined date input from localStorage
var rtKey = localStorage.getItem('rtKey'); // 
var calKey = localStorage.getItem('calKey');
var calEKey = localStorage.getItem('calEKey');
var numberSites = localStorage.getItem('siteNum');

if(numberSites == null){
    siteNum = 8;
}
else{ 
    siteNum = numberSites; 
}

if(userDate == null && rtKey == null && calKey == null && calEKey == null){
  window.location.href = "signup.html";
}

if(userDate != null) {
  today=userDate;
  var temp = userDate.substr(8,9);
  var day2 = parseInt(temp, 10);
  day2 = day2+1;
  if(day2<10) {
      day2 = '0'+day2;
  } 
  today2=userDate.substr(0,8);
  today2=today2+day2;
}
else{
  today = new Date();
  day2 = today.getDate();
  day = day2-1;
  month = today.getMonth()+1;
  year = today.getFullYear();
  if(day<10) {
      day = '0'+day;
  } 
  if(day2<10) {
      day2='0'+day2;
  }
  if(month<10) {
      month = '0'+month;
  } 
  today = year + '-' + month + '-' + day;
  var today2 = year + '-' + month + '-' + day2;
}

if(rtKey.length==0) {
  //Haven't set up RT API
  alert("Trouble finding your RescueTime API Key, please check that it is set up properly!");
}
if(calKey.length==0) {
  alert("Trouble finding your Google Cal Key API Key, please check that it is set up properly!");
}



$.ajax({
  type: 'GET',
  url: 'https://hourglass-api.herokuapp.com/api/rank-distract-for-d3?start_date='+today+'&end_date='+today+'&n='+ siteNum,
  headers: { 'key': rtKey },
  success: function(data) {
    console.log(data);
    localStorage.setItem('key',JSON.stringify(data));
    visualize(data); 
  },
  error: function() {
      alert('error pulling visualization data from API');
  }
});

$.ajax({
  type: 'GET',
  url: 'https://hourglass-api.herokuapp.com/api/get-calendar?start_date='+today+'&end_date='+today2,
  headers: { 
    "Key": calKey,
    "calendar": calEKey
  },
  success: function(data) {
    console.log(data);
    visualizeCal(data); 
  },
  error: function() {
      alert('error pulling calendar data from API');
  }
});


$.ajax({
  type: 'GET',
  url: 'https://hourglass-api.herokuapp.com/api/pro-nonpro-time?start_date='+today+'&end_date='+today,
  headers: { 
    "Key": rtKey,
  },
  success: function(data) {
    console.log(data);
    visualizeProductivity(data); 
  },
  error: function() {
      alert('error pulling productivity data from API');
  }
});


// https://hourglass-api.herokuapp.com/api/pro-nonpro-time?start_date=2018-12-01&end_date=2018-12-01

// $(function() {
//     $.getJSON("js/calData.json")
//         .done(function(data) { 
//         // localStorage.setItem('key',JSON.stringify(data));
//           visualizeCal(data); })
//         .fail(function() { alert("Failed to load the JSON file!\n(Did your Python run?)"); });
// });

// #Google Calendar API Key and Calendar Key:
// "Key": "AIzaSyBPhqIfGLwvO9srD22V8kLXAd3p58PxdjQ"
// "calendar": "a2975667@gmail.com"

// https://hourglass-api.herokuapp.com/api/get-calendar?start_date=2018-11-20&end_date=2018-11-25


var visualize = function(data) {
 // var parseDate = d3.time.format("%H-%M-%S").parse;
    var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;
    data.forEach(function(d) {
        d.from = parseDate(d.from);
        d.to = parseDate(d.to);
    });
    var margin = {top: 0, right: 50, bottom: 50, left: 180},
        width = 1350 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    var y = d3.scale.ordinal()
        .rangeRoundBands([0, height], .1);

    var x = d3.time.scale()
        .domain([new Date(year, month-1, day), new Date(year, month-1, day2)])
        .range([0, width]);

    y.domain(data.map(function(d) { return d.name; }));
    // x.domain([d3.min(data,function(d){return d.from;}), d3.max(data,function(d){return d.to;})]);
    // x.domain([d3.time, new Date(2012, 11, 4)]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(7).outerTickSize(0)
        .tickSize(3)
        .tickPadding(10)
        .tickFormat(d3.time.format("%I %p"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(0)
        .tickPadding(10)
        .orient("left");

    var svg = d3.select("#index_gantt_graph").append("svg")
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
            var p = localStorage.getItem('productive');
            var np = localStorage.getItem('non-productive');
            if(p == null || np == null){
                return "#3498df";
                alert(d.name);
              }
            p = p.split(",");
            np = np.split(",");
            for(var i = 0 ; i < p.length; i++){
              if (p[i]==d.name) {
                return "#ffcc2e";
              }
              else {
                return "#3498df";
              }
            }
            for(var i = 0; i < np.length; i++) {
              if (np[i] == d.name) {
                return "#3498df";
              }
              else {
                return "#3498df";
              }
            }
          })
          .attr("transform", "translate(0,9)")
          .attr("x", function(d) { return x(d.from); })
          .attr("width", function(d) { return x(d.to) - x(d.from)});


    var tooltip = d3.select("#index_gantt_graph")
    .append('div')
    .attr('class', 'tooltip');

    tooltip.append('div').attr('class', 'name');
    tooltip.append('div').attr('class', 'category')
    tooltip.append('div').attr('class', 'ran');
    // tooltip.append('div').attr('class', 'progress');

    svg.selectAll(".bar,.pending")
    .on('mouseover', function(d) {

      tooltip.select('.name').html("Site: <b>" + d.name + "</b>");
      tooltip.select('.category').html("Category: <b>" + d.category + "</b>");
      tooltip.select('.ran').html(d.from.toString().substr(4,20) + " TO " + d.to.toString().substr(4,20));
      
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

var visualizeProductivity = function(data) {
 // var parseDate = d3.time.format("%H-%M-%S").parse;
    var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

    data.forEach(function(d) {
        d.from = parseDate(d.from);
        d.to = parseDate(d.to);
    });
    var margin = {top: 0, right: 50, bottom: 10, left: 180},
        width = 1350 - margin.left - margin.right,
        height = 80;

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
        .tickPadding(-5000)
        // .attr("font-size","4em")
        .tickFormat(d3.time.format("%H %p"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(0)
        .tickPadding(10)
        // .attr("fill","none")
        .orient("left");

    var svg = d3.select("#index_productivity_graph").append("svg")
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
          .call(customXAxis)
          .append("text")
          .attr("x", width-margin.right)
          .attr("dx", ".71em")
          .attr("dy", "-0.2em");


      function customYAxis(g) {
        var s = g.selection ? g.selection() : g;
        g.call(yAxis);
        s.select(".domain").remove();
        
      }

      function customXAxis(g) {
        var s = g.selection ? g.selection() : g;
        g.call(xAxis);
        s.select(".domain").remove();
      }
      
      svg.append("g")
          .attr("class", "y axis")
          .style('font-weight','bold')
          .style('font-family','Raleway')
          .call(customYAxis);

      svg.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("y", function(d) { return y(d.name); })
          .attr("height", "10")
          .attr("fill",function(d) {
            if(d.name == "productive") {
              return "#3498df";
            }
            else if(d.name == "unproductive") {
              return "#ffcc2e";
            }
            // else {
            //   return "#444";
            // }
          })
          .attr("transform", "translate(0,12)")
          .attr("x", function(d) { return x(d.from); })
          .attr("width", function(d) { return x(d.to) - x(d.from)});


    var tooltip = d3.select("#index_gantt_graph")
    .append('div')
    .attr('class', 'tooltip');

    tooltip.append('div').attr('class', 'name');
    tooltip.append('div').attr('class', 'ran');
    // tooltip.append('div').attr('class', 'progress');

    svg.selectAll(".bar,.pending")
    .on('mouseover', function(d) {

      tooltip.select('.name').html("Aggregated Category: <b>" + d.name + "</b>");
      tooltip.select('.ran').html(d.from.toString().substr(4,20) + " TO " + d.to.toString().substr(4,20));
      
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


var visualizeCal = function(data) {
 // var parseDate = d3.time.format("%H-%M-%S").parse;
    var parseDate2 = d3.time.format("%Y-%m-%dT%H:%M:%S-06:00").parse;

    data.forEach(function(dd) {
        dd.from = parseDate2(dd.start_time);
        dd.to = parseDate2(dd.end_time);
    });
    var margin = {top: 130, right: 50, bottom: 10, left: 180},
        width = 1350 - margin.left - margin.right,
        height = 80;

    var y2 = d3.scale.ordinal()
        .rangeRoundBands([0, height], .1);

    var x2 = d3.time.scale().range([0, width]);

    y2.domain(data.map(function(dd) { return dd.name; }));
    x2.domain([d3.min(data,function(dd){return dd.from;}), d3.max(data,function(dd){return dd.to;})]);

    var xAxis2 = d3.svg.axis()
        .scale(x2)
        .orient("bottom")
        .ticks(10).outerTickSize(0)
        .tickSize(0)
        .tickPadding(-5000)
        // .attr("font-size","4em")
        .tickFormat(d3.time.format("%H %p"));

    var yAxis2 = d3.svg.axis()
        .scale(y2)
        .tickSize(0)
        .tickPadding(10)
        // .attr("fill","none")
        .orient("left");

    var svg = d3.select("#index_calendar_graph").append("svg")
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
          .call(customXAxis2)
          .append("text")
          .style('font-size','2em')
          .attr('fill','none')
          .attr('stroke','#fff')
          .attr("x", width-margin.right)
          .attr("dx", ".71em")
          .attr("dy", "-0.2em");

      function customYAxis2(g) {
        var s = g.selection ? g.selection() : g;
        g.call(yAxis2);
        s.select(".domain").remove();
        
      }

      function customXAxis2(g) {
        var s = g.selection ? g.selection() : g;
        g.call(xAxis2);
        s.select(".domain").remove();
      }

      svg.append("g")
          .attr("class", "y axis")
          .style('font-weight', 'bold')
          .style('font-family','Raleway')
          .call(customYAxis2);

      svg.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("y", function(dd) { return y2(dd.name); })
          .attr("height", "10")
          .attr("fill",function(d){
            if(d.status == "busy") {
              return "#555";
            }
            else{
              return "#ddd";
            }
          })
          .attr("transform", "translate(0,11)")
          .attr("x", function(dd) { return x2(dd.from); })
          .attr("width", function(dd) { return x2(dd.to) - x2(dd.from)});


    var tooltip = d3.select("#index_calendar_graph")
    .append('div')
    .attr('class', 'tooltip');

    tooltip.append('div').attr('class', 'cat');
    tooltip.append('div').attr('class', 'status')
    tooltip.append('div').attr('class', 'tempRange');
    // tooltip.append('div').attr('class', 'progress');

    svg.selectAll(".bar,.pending")
    .on('mouseover', function(d) {

      tooltip.select('.cat').html("Status: <b>" + d.name + "</b>");
      // tooltip.select('.status').html("<b> + d.name </b>");
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
