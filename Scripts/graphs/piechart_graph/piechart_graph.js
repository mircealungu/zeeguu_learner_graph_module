
function draw_piechart_graph(input_data, appendTo, label) {

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
        .style('fill', function (entry, index) {
            return pie_slice_color(index);
        })
        .style('stroke', function (entry, index) {
            return pie_slice_color(index);
        });

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