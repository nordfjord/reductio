var dimension = null, group = null, reducer = null;

var chart = dc.lineChart(document.getElementById('chart'));

function makeDimGroup(cf, scale){
    dimension = cf.dimension(function(d){
        return d[0];
    });

    group = dimension.group();

    reducer = reductio()
        .sum('1')
        .downsample('sum')
        .threshold(1000);

    reducer(group);
    var x = d3.scale.linear().domain(scale);
    chart.dimension(dimension);
    chart.group(group);
    chart.x(x);
}
makeDimGroup(crossfilter(demo_data[0]), d3.extent(demo_data[0], function(d){return d[0];}));

chart
    .height(200)
    .brushOn(false)
    .valueAccessor(function(d){return d.value.sum;})
    .elasticY(true)
    .transitionDuration(0);

chart.margins().right = 5;
chart.render();

var threshold_input = document.getElementById('threshold');
var threshold_value = document.getElementById('threshold_value');
var total_count = document.getElementById('total_count');
var demo_selector = document.getElementById('demo_id');

demo_selector.addEventListener('change', function(ev){
    var demo = ev.target.value;
    var extent = d3.extent(demo_data[demo], function(d){
        return d[0];
    });
    makeDimGroup(crossfilter(demo_data[demo]), extent);
    chart.group(group).dimension(dimension);
    threshold_input.value = '1000';
    threshold_value.innerHTML = '1000';
    total_count.innerHTML = extent[1];
    chart.redraw();
});

threshold_input.addEventListener('input', function(ev){
    var threshold = +ev.target.value;
    threshold_value.innerHTML = threshold;
    reducer.threshold(threshold);

    chart.redraw();
});
