
// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages':['corechart']});
var chart;
var options;
var currentPick=0;  //to save open graph when screen orientation changes

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function init() {
    chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    drawChart(0);
    initSticky();
}
function drawChart(fruitCode) {
    currentPick=fruitCode;
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Date');
    data.addColumn('number', 'Price');
    // Create the data table.

    for (var i=0; i<sortedF[fruitCode].length; i++) {

        data.addRow([mysqlTimeStampToDate(sortedF[fruitCode][i].Date), sortedF[fruitCode][i].Price]);
    }

    // Set chart options


    // Instantiate and draw our chart, passing in some options.
    var options = {'title':'Price History: ' + fruitLabels[fruitCode-1],
        'width':'100%',
        'height':'100%',
        'backgroundColor':'#dbdbdb',
        'animation': {
            'duration':600,
            'easing':'out'
        },
        series: [{color: '#ff4d6e'}],
        'legend':'none',
        'lineWidth':4,
        'vAxis': {

            viewWindowMode:'explicit',
            viewWindow:{
                min:0

            }
        }
    };
   // var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    var formatter = new google.visualization.NumberFormat({suffix: ' ₪'});
    formatter.format(data, 1); // Apply formatter to second column
    chart.draw(data, options);
    if (mystickybar !== undefined) {
        if (mystickybar.currentstate === 'hide') {
            mystickybar.toggle();
        }

    }


}


function mysqlTimeStampToDate(string) {
    var date = new Date();
    var parts = String(string).split(/[- : T Z]/);

    date.setFullYear(parts[0]);
    date.setMonth(parts[1] - 1);
    date.setDate(parts[2]);
 /*   date.setHours(parts[3]);
    date.setMinutes(parts[4]);
    date.setSeconds(parts[5]);
    date.setMilliseconds(0); */

    return date;
}

