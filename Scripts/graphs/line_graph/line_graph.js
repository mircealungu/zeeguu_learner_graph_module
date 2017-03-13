
function draw_line_graph(input_data, appendTo, win_width) {

    // fetching learner_stats_data from the server and parsing(nesting) it for d3js library

    var input_data_nested = d3.nest()
        .key(function (entry) {
            return entry.name;
        })
        .entries(input_data);

    // end of the fetching and parsing learner_stats_data

    // setting up graph and its parameters
    // graph's width adjusts based on the client window size
    // max graph width is 1200px and min is 500px
    if (!isNaN(win_width)) {
        var WIDTH = Math.max(500 ,Math.min(1200, win_width));
    }else{
        var WIDTH = 1200;
    }

    var HEIGHT = 500;

    var months_to_show = WIDTH / 100;

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
    var date_one_year_ago = new Date(year - 1, month+(12-months_to_show), 1);

    var xScale = d3.time.scale()
        .range([MARGINS.left, WIDTH - MARGINS.right])
        .domain([date_one_year_ago, date_of_today]);

    var yScale = d3.scale.linear()
        .range([HEIGHT - MARGINS.top, MARGINS.bottom])
        .domain([
            0,
            +d3.max(input_data, function (entry) {
                return +entry.amount;
            })
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

