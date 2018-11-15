d3.json("https://gist.githubusercontent.com/dmesquita/41d02eb763f52158990e89b0e4691ada/raw/654125c9c41d9b5be0a0153465b1f767ffcf4687/dataset_final.json", function(error, data) {
            chart(data.projects);
});
function chart(data) {
    var dateFormat = d3.timeParse("%d/%m/%Y");
    var timeScale = d3.scaleTime()
                   .domain(d3.extent(data, d => dateFormat(d.date)))
                   .range([0, 1000]);
  
    let dataByDates = d3.nest().key(d => d.date).entries(data);
    let tickValues = dataByDates.map(d => dateFormat(d.key));
  
    let dataByCategories = d3.nest().key(d => d.status).entries(data);
    let categories = dataByCategories.map(d => d.key).sort();
    let colorScale = d3.scaleLinear()
                 .domain([0, categories.length])
                 .range(["#00B9FA", "#F95002"])
                 .interpolate(d3.interpolateHcl);
  
    var xAxis = d3.axisBottom()
                .scale(timeScale)
                .tickValues(tickValues)
                .tickSize(250, 0, 0)
                .tickSizeOuter(0);
    var grid = d3.select("svg").append('g').call(xAxis);
  
    yScale = d3.scaleLinear().domain([0, data.length]).range([0, 250]);
  
    var projects = d3.select("svg")
                   .append('g')
                   .selectAll("this_is_empty")
                   .data(data)
                   .enter();
  
    var barWidth = 140;
  
    var innerRects = projects.append("rect")
                  .attr("rx", 3)
                  .attr("ry", 3)
                  .attr("x", (d,i) => timeScale(dateFormat(d.date)) - barWidth/2)
                  .attr("y", (d,i) => yScale(i))
                  .attr("width", barWidth)
                  .attr("height", 30)
                  .attr("stroke", "none")
                  .attr("fill", d => d3.rgb(colorScale(categories.indexOf(d.status))));
  
    var rectText = projects.append("text")
                  .text(d => d.label)
                  .attr("x", d => timeScale(dateFormat(d.date)))
                  .attr("y", (d,i) => yScale(i) + 20)
                  .attr("font-size", 11)
                  .attr("text-anchor", "middle")
                  .attr("text-height", 30)
                  .attr("fill", "#fff"); 
}
