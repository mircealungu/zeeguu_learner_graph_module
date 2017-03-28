# zeeguu_learner_graph_module

zeeguu_learner_graph_module is a library based on the d3js to help to quickly make nice graphs on your page without a hassle.

# First step - setup

1) Include dependencies :
    
```
    <!--dependencies-->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script type="text/javascript" src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>
```

2) Add distrubution version of zeeguu_learner_graph_module:
```
    <script type="text/javascript" src="DIST-zeeguu_learner_graph_module.js" charset="utf-8"></script>
```

# Second step - adding graphs

## Activity graph
### Input data format
Input json entry format should be :
> [{"date": "2016-05-28", "count": "123"}, {...}, ...]

### Call the function
```
    activity_graph(<input_data>, <append_to>);
```

### Example
```
    // add next 2 lines anywhere you want display the graph (html)
    <agraph></agraph>
    <br/><br/><br/>
```
```
    // prepare the input_data (js)
    a_data = [{"date": "2016-06-01", "count": "123"}, {"date": "2016-05-28", "count": "5"}];
    
    
    // call the function (js)
     activity_graph(a_data, "agraph");
```

----------------

## Line graph
### Input data format
Input json entry format for multiple months should be :
> [{"name": "Example", "amount": "123", "date": "Jan 2016"}, {"name": "Example", "amount": "52", "date": "Feb 2016"}, ...]

Input json entry format for the one month (~30 days) should be :
> [{"name": "Example", "amount": "123", "date": "1 Jan 2016"}, {"name": "Example", "amount": "52", "date": "2 Jan 2016"}, ...]

NB: Every month (if showing period of 5..12 months) or date (if showing period of 1 month) needs to have a entry (even if it is 0). 

### Call the function
```
    line_graph(<input_data>, <append_to>, <window_width>, <months_to_display>);
```

NB: <months_to_display> is a parameter how many months to display in the graph (not including the current month). If number 6 is typed, then 7 months will actually be displayed.

 Displaying for one year :   
```
    line_graph(<input_data>, <append_to>, window_width);
    or
    line_graph(<input_data>, <append_to>, window_width, 12);
```
 
 Displaying for one month :  
```
    line_graph(<input_data>, <append_to>, window_width, 1);
```

### Example 
Full example of 1 year period :
```
    // add next 2 lines anywhere you want display the graph (html)
    <lgraph></lgraph>
    <br/><br/><br/>
```
```
    // prepare the input_data (js)
        l_data = [
        {"name": "Mathematics", "amount": "6", "date": "Apr 2016"}, {"name": "Mathematics", "amount": "6", "date": "May 2016"}, 
        {"name": "Mathematics", "amount": "7", "date": "Jun 2016"}, {"name": "Mathematics", "amount": "7", "date": "Jul 2016"}, 
        {"name": "Mathematics", "amount": "5", "date": "Aug 2016"}, {"name": "Mathematics", "amount": "6", "date": "Sep 2016"}, 
        {"name": "Mathematics", "amount": "7", "date": "Oct 2016"}, {"name": "Mathematics", "amount": "8", "date": "Nov 2016"}, 
        {"name": "Mathematics", "amount": "9", "date": "Dec 2016"}, {"name": "Mathematics", "amount": "8", "date": "Jan 2017"}, 
        {"name": "Mathematics", "amount": "7", "date": "Feb 2017"}, {"name": "Mathematics", "amount": "6", "date": "Mar 2017"}, 
        {"name": "History", "amount": "6", "date": "Apr 2016"}, {"name": "History", "amount": "7", "date": "May 2016"}, 
        {"name": "History", "amount": "8", "date": "Jun 2016"}, {"name": "History", "amount": "9", "date": "Jul 2016"},
        {"name": "History", "amount": "10", "date": "Aug 2016"}, {"name": "History", "amount": "8", "date": "Sep 2016"},
        {"name": "History", "amount": "9", "date": "Oct 2016"}, {"name": "History", "amount": "8", "date": "Nov 2016"},
        {"name": "History", "amount": "7", "date": "Dec 2016"}, {"name": "History", "amount": "6", "date": "Jan 2017"},
        {"name": "History", "amount": "5", "date": "Feb 2017"}, {"name": "History", "amount": "6", "date": "Mar 2017"}
    ];
    
    
    // get the window with to make the graph fit to its width
    var window_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    // call the function (js)
    line_graph(l_data, "lgraph", window_width);
```

----------------

## Piechart graph
### Input data format
Input json entry format should be :
>[  {"label": "Example", "value": 10}, {"label": "Example1", "value": 10}, {"label": "Example2", "value": 10}, {"label": "Example3", "value": 10} ]

### Call the function
```
    piechart_graph(<input_data>, <append_to>, <name>);
```

### Example
```
    // add next 2 lines anywhere you want display the graph
    <pgraph></pgraph>
    <br/><br/><br/>
```
```
    // prepare the input_data
    p_data = [
        {"label": "Example", "value": 111}, {"label": "Example1", "value": 111},
        {"label": "Example2", "value": 111}, {"label": "Example3", "value": 111}
    ];

    // call the function
    piechart_graph(p_data, "pgraph", "Test");
```

----------------


# Third step - adding scalability for the line graph (optional)
1) Adding realtime scalability for the line graph.  
```
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
```
----------------
2) Adding buttons which change the graph per user request.

Example function for changing the line graph (js) :
```
function display_months(months_to_show, append_to, input_data){
    var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    d3.selectAll(append_to + ' > svg').remove();
    global_months_to_show = months_to_show;
    line_graph(input_data, append_to, width, months_to_show);
}
```
Add this html code anywhere you want buttons for the line graph.
```
    <button onclick="display_months(6, 'lgraph', l_data)" value="6 months">6 months</button>
    <button onclick="display_months(9, 'lgraph', l_data)" value="9 months">9 months</button>
    <button onclick="display_months(12, 'lgraph', l_data)" value="12 months">1 year</button>
```

----------------
