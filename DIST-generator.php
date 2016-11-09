<?php
/**
 * Created by PhpStorm.
 * User: Alexander Lukjanenkovs
 * Date: 20.07.2016
 */

$filename = "DIST-zeeguu_learner_graph_module.js";
$genfile = fopen($filename, "w");


$today_date = date("d.m.Y");
$intro = '
/**
* Created by A.Lukjanenkovs on 21.06.2016. This DIST version generated on '.$today_date.'
*/

';
fwrite($genfile, $intro);


// add all graphs CSS

// activity_graph css
$activity_graph_css = "
function append_css_for_activity_graph(appendTo){
    $(appendTo).append('<style> " . preg_replace( "/\r|\n/", "", file_get_contents('CSS/graphs/activity_graph/activity_graph.css') ) . " </style>');
}
";
fwrite($genfile, $activity_graph_css);

// line graph css
$line_graph_css = "
function append_css_for_line_graph(appendTo){
    $(appendTo).append('<style> " . preg_replace( "/\r|\n/", "", file_get_contents('CSS/graphs/line_graph/line_graph.css') ) . " </style>');
}
";
fwrite($genfile, $line_graph_css);

// piechart css
$piechart_css = "
function append_css_for_piechart_graph(appendTo){
    $(appendTo).append('<style> " . preg_replace( "/\r|\n/", "", file_get_contents('CSS/graphs/piechart_graph/piechart_graph.css') ) . " </style>');
}

";
fwrite($genfile, $piechart_css);


// add all graphs draw functions
file_put_contents($filename, file_get_contents('Scripts/graphs/activity_graph/activity_graph.js'), FILE_APPEND | LOCK_EX);
file_put_contents($filename, file_get_contents('Scripts/graphs/line_graph/line_graph.js'), FILE_APPEND | LOCK_EX);
file_put_contents($filename, file_get_contents('Scripts/graphs/piechart_graph/piechart_graph.js'), FILE_APPEND | LOCK_EX);


$main = '

// font library
$("head").append(\'<link href="https://fonts.googleapis.com/css?family=PT+Sans" rel="stylesheet" type="text/css">\');

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
function piechart_graph(input_data, appendTo, label){
    append_css_for_piechart_graph(appendTo);
    draw_piechart_graph(input_data, appendTo, label);
}
';

file_put_contents($filename, $main, FILE_APPEND | LOCK_EX);
//fwrite($genfile, $main);


fclose($genfile);

?>