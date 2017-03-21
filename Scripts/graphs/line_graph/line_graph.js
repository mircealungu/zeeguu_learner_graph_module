
function draw_line_graph(input_data, appendTo, win_width, months_to_show) {

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

    // how many months to show
    if (isNaN(months_to_show)) {
        var months_to_show = Math.round(WIDTH / 100);
    }

    var extraHeight = 0;
    // check if 1 month was requested
    if (months_to_show != 1) {
        months_to_show = Math.max(5, months_to_show);
        // slice array and take only part we need based on how many months to show
        input_data_nested.forEach(function (element) {
            element.values = element.values.slice(-months_to_show - 1, element.values.length);
        });
    }else{
        extraHeight = 55; // added extraHeight for better displaying date names for month
    }


    var line_graph = d3.select(appendTo)
        .append("svg")
        .attr("width", WIDTH)
        .attr("height", HEIGHT+extraHeight);

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

    if (months_to_show == 1) {
        var date = date_of_today.getDate();
        var date_one_year_ago = new Date(year, month-1, date);
    }else{
        // in this case we don't care about precise day(date) ,because only months and year are used for this graph
        var date_one_year_ago = new Date(year - 1, month+(12-months_to_show), 1);
    }


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


    if (months_to_show == 1) {
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom").ticks(30)
            .tickFormat(d3.time.format("%d %b %Y"));
    }else{
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .tickFormat(d3.time.format("%b %Y"));
    }

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");


    // draw both axes with indicators
    if (months_to_show == 1) {
        line_graph.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
            .call(xAxis)
            .selectAll("text") // added to month
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", function(d) {
                        return "rotate(-65)"
                    });
    }else{
        line_graph.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
            .call(xAxis);
    }

    line_graph.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
        .call(yAxis);

    // generates the line path for the graph
    var line_gen = d3.svg.line()
        .interpolate("basis")
        .x(function (entry) {
            if (months_to_show == 1) {
                var entry_day = entry.date.split(" ")[0];
                var entry_month_number = month_names.indexOf(entry.date.split(" ")[1]) + 1;
                var entry_year = entry.date.split(" ")[2];
            }else {
                var entry_day = 1;
                var entry_month_number = month_names.indexOf(entry.date.split(" ")[0]) + 1;
                var entry_year = entry.date.split(" ")[1];
            }
            return xScale(new Date(entry_month_number + "." + entry_day + "." + entry_year));
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
            .attr("y", HEIGHT - 10 + extraHeight)
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

