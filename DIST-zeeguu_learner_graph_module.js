/**
 * Created by A.Lukjanenkovs on 21.06.2016.
 */

// font library
$("head").append('<link href="https://fonts.googleapis.com/css?family=PT+Sans" rel="stylesheet" type="text/css">');

// initialization function for activity graph
// input json entry format should be :
// [{"date": "2016-05-28", "count": "123"}]
function activity_graph(input_data, appendTo){
    append_css_for_activity_graph(appendTo);
    draw_activity_graph(input_data, appendTo);
}

// initialization function for line graph
// input json entry format should be :
// [{"name": "Example", "amount": "123", "date": "Jan 2016"}]
function line_graph(input_data, appendTo){
    append_css_for_line_graph(appendTo);
    draw_line_graph(input_data, appendTo);
}

// initialization function for piechart graph
// input json entry format should be :
// [{"label": "Example", "value": 111 }]
function piechart_graph(input_data, appendTo){
    append_css_for_piechart_graph(appendTo);
    draw_piechart_graph(input_data, appendTo);
}


// activity_graph css
function append_css_for_activity_graph(appendTo){
    $("appendTo").append('<link rel="stylesheet" type="text/css" href="CSS/graphs/activity_graph/activity_graph.css">');
}

// draw_activity_graph
function draw_activity_graph(input_data, appendTo){
    //    $("head").append('<script type="text/javascript" src="Scripts/graphs/activity_graph/activity_graph.js" charset="utf-8"></script>');
}


// line graph css
function append_css_for_line_graph(appendTo){
    $(appendTo).append('<style>.axis path { fill: none; stroke: #49524c; shape-rendering: crispEdges; } ' +
        '.axis text { font-family: Lato; font-size: 13px; } ' +
        '.legend { font-size: 14px; font-weight: bold; font-family: "PT Sans", sans-serif; color: #4A4A4A; line-height: 2; }</style>');
}

//line graph draw function
function draw_line_graph(input_data, appendTo){

    // fetching learner_stats_data from the server and parsing(nesting) it for d3js library
    var input_data_nested = d3.nest()
        .key(function (entry) {
            return entry.name;
        })
        .entries(input_data);

    // end of the fetching and parsing learner_stats_data

    // setting up graph and its parameters
    var WIDTH = 1200;
    var HEIGHT = 500;

    var line_graph = d3.select(appendTo)
        .append("svg")
        .attr("width", WIDTH)
        .attr("height", HEIGHT);

    // offsets of the graph
    var MARGINS = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    };

    var lSpace = WIDTH / input_data_nested.length; // offset for the labels(legends) below the graph

    var month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var date_of_today = new Date();

    var year = date_of_today.getFullYear();
    var month = date_of_today.getMonth();

    // in this case we don't care about precise day(date) ,because only months and year are used for this graph
    var date_one_year_ago = new Date(year - 1, month, 1);

    var xScale = d3.time.scale()
        .range([MARGINS.left, WIDTH - MARGINS.right])
        .domain ([ date_one_year_ago, date_of_today ]);

    var yScale = d3.scale.linear()
        .range([HEIGHT - MARGINS.top, MARGINS.bottom])
        .domain([
            0,
            +d3.max(input_data, function (entry) {return +entry.amount;})
        ]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .tickFormat(d3.time.format("%b %Y"));

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");


    // draw both axes with indicators
    line_graph.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
        .call(xAxis);

    line_graph.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
        .call(yAxis);

    // generates the line path for the graph
    var line_gen = d3.svg.line()
        .interpolate("basis")
        .x(function (entry) {
            var entry_month_number = month_names.indexOf(entry.date.split(" ")[0]) + 1;
            var entry_year = entry.date.split(" ")[1];
            return xScale(new Date(entry_month_number + ".01." + entry_year));
        })
        .y(function (entry) {
            return yScale(entry.amount);
        });

    input_data_nested.forEach(function (entry, index) {

        // generates how dark or light should be the color of the line, depending of the lines array order
        var color_tone = 50 - 20 * index;

        // draw the lines itself
        line_graph.append('svg:path')
            .attr('d', line_gen(entry.values))
            .attr('stroke', function () {
                return "hsl(" + 200 + ",100%, " + color_tone + "% )";
            })
            .attr('stroke-width', 2)
            .attr('id', 'line_' + entry.key)
            .attr('fill', 'none');

        // draw legends below the graph
        line_graph.append("text")
            .attr("x", (lSpace / 2) + index * lSpace)
            .attr("y", HEIGHT - 10)
            .style("fill", "hsl(" + 200 + ",100%, " + color_tone + "% )")
            .attr("class", "legend")
            .on('click', function () {
                var active = entry.active ? false : true;
                var opacity = active ? 0 : 1;
                d3.select("#line_" + entry.key).style("opacity", opacity);
                entry.active = active;
            })
            .text(entry.key);
    });
}

// piechart css
function append_css_for_piechart_graph(appendTo){
    $(appendTo).append('<style>.pie_graph { height: 360px; position: relative; width: 360px; text-align: center; } ' +
        '.arc path { stroke: #fff; } ' +
        '.legend { font-size: 12px; font-weight: bold; font-family: "PT Sans", sans-serif; color: #4A4A4A; line-height: 2; } ' +
    'rect { stroke-width: 2; } ' +
    '.pie_tooltip { background: #eee; box-shadow: 0 0 5px #999999; color: #333; display: none; font-size: 12px; font-family: "PT Sans", sans-serif;' +
        ' padding-left: 2px; position: absolute; text-align: center; margin-top: 100px; width: 100px; z-index: 1000; margin-left: -430px; }</style>');
}

// piechart draw function
function draw_piechart_graph(input_data, appendTo) {

    var label = "Top 10'000 Words ";
    var width = 560;
    var height = 360;
    var radius = Math.min(width, height) / 2;
    var pie_slice_color = d3.scale.ordinal()
        .domain([0, 1, 2, 3])
        .range(['#c7c7c7', '#2AE816', '#9AFF0B', '#FFD918']);

    var pie_graph = d3.select(appendTo)
        .append("svg:svg")
        .data([input_data])
        .attr("width", width)
        .attr("height", height)
        .append("svg:g")
        .attr("class", "pie_graph")
        .attr("transform", "translate(" + radius + "," + radius + ")");

    var pie = d3.layout.pie().value(function (entry) {
        return entry.value;
    });


    // declare an arc generator function
    // circular arc is a curved boundary of length L from a circular sector(slice).
    var arc = d3.svg.arc()
        .innerRadius(radius * 0.65)  // NEW
        .outerRadius(radius);

    // select paths, use arc generator to draw
    var arcs = pie_graph.selectAll("g.slice")
        .data(pie).enter()
        .append("svg:g")
        .attr("class", "arc");

    // draw the slices
    arcs.append("svg:path")
        .attr("fill", function (entry, index) {
            return pie_slice_color(index);
        })
        .attr("d", function (entry) {
            return arc(entry);
        });


    // add legends
    var legendRectSize = 18;
    var legendSpacing = 4;

    var legend = pie_graph.selectAll('.legend')
        .data(input_data) //pie_slice_color.domain()
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function (entry, index) {
            var height = legendRectSize + legendSpacing;
            var offset = height * input_data.length / 2; //pie_slice_color.domain()
            var horz = 12 * legendRectSize;
            var vert = index * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', function (entry, index) { return pie_slice_color(index) })
        .style('stroke', function (entry, index) { return pie_slice_color(index) });

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function (entry, index) {
            return input_data[index].label;
        });


    // add tooltips
    var tooltip = d3.select(appendTo)
        .append('div')
        .attr('class', 'pie_tooltip');

    tooltip.append('div')
        .attr('class', 'name');

    tooltip.append('div')
        .attr('class', 'value');

    tooltip.append('div')
        .attr('class', 'percent');

    var path = pie_graph.selectAll('path');

    path.on('mouseover', function (entry) {
        var total = d3.sum(input_data.map(function (entry) {
            return entry.value;
        }));
        var percent = Math.round(1000 * entry.data.value / total) / 10;
        tooltip.select('.name').html(entry.data.label);
        tooltip.select('.value').html(entry.data.value);
        tooltip.select('.percent').html(percent + '%');
        tooltip.style('display', 'inline-block');
    });

    path.on('mouseout', function () {
        tooltip.style('display', 'none');
    });


    // add title
    pie_graph.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .style("fill", "#606060")
        .style("font-size", "23px")
        .style("font-weight", "bold")
        .style("font-family", "'Arial', Gadget, sans-serif")
        .text(function () {
            return label; // caption of the title
        });

}