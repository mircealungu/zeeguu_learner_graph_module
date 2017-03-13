
window.onresize = resize;

function resize() {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    // line graph resizing
    // 1200 px for full year
    // 100 px per month
    var months_to_show = Math.min(12, Math.round(w / 100));
    console.log("resize event detected! " +  " : " + months_to_show );

    d3.selectAll('lgraph > svg').remove();
    // var l_data_part = l_data.slice(-months_to_show, l_data.length); // optional
    line_graph(l_data, "lgraph", months_to_show*100);
    // end of line graph resizing
}

