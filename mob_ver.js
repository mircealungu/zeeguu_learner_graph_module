
window.onresize = resize;
var global_months_to_show = 12;

function resize() {
    var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    // line graph resizing
    // 1200 px for full year
    // 100 px per month
    var months_to_show = Math.min(global_months_to_show, Math.round(width / 100));
    var append_to = "lgraph";
    d3.selectAll(append_to + ' > svg').remove();
    line_graph(l_data, append_to, width, months_to_show);
    // end of line graph resizing
}

function display_months(months_to_show, append_to, input_data){
    var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    d3.selectAll(append_to + ' > svg').remove();
    global_months_to_show = months_to_show;
    line_graph(input_data, append_to, width, months_to_show);
}



