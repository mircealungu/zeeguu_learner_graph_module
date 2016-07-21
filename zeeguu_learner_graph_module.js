/**
 * Created by A.Lukjanenkovs on 21.06.2016.
 */

// font library
$("head").append('<link href="https://fonts.googleapis.com/css?family=PT+Sans" rel="stylesheet" type="text/css">');

// initialization function for activity graph
// input json entry format should be :
// [{"date": "2016-05-28", "count": "123"}]
function activity_graph(input_data, appendTo){
    $("head").append('<link rel="stylesheet" type="text/css" href="CSS/graphs/activity_graph/activity_graph.css">');
    $("head").append('<script type="text/javascript" src="Scripts/graphs/activity_graph/activity_graph.js" charset="utf-8"></script>');
    draw_activity_graph(input_data, appendTo);
}

// initialization function for line graph
// input json entry format should be :
// [{"name": "Example", "amount": "123", "date": "Jan 2016"}]
function line_graph(input_data, appendTo){
    $("head").append('<link rel="stylesheet" type="text/css" href="CSS/graphs/line_graph/line_graph.css">');
    $("head").append('<script type="text/javascript" src="Scripts/graphs/line_graph/line_graph.js" charset="utf-8"></script>');
    draw_line_graph(input_data, appendTo);
}

// initialization function for piechart graph
// input json entry format should be :
// [{"label": "Example", "value": 111 }]
function piechart_graph(input_data, appendTo, label){
    $("head").append('<link rel="stylesheet" type="text/css" href="CSS/graphs/piechart_graph/piechart_graph.css">');
    $("head").append('<script type="text/javascript" src="Scripts/graphs/piechart_graph/piechart_graph.js" charset="utf-8"></script>');
    draw_piechart_graph(input_data, appendTo, label);
}