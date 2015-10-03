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
    .width(800)
    .brushOn(false)
    .valueAccessor(function(d){return d.value.sum;})
    .elasticY(true)
    .transitionDuration(0);

chart.render();

var threshold_input = document.getElementById('threshold');
var demo_selector = document.getElementById('demo_id');

demo_selector.addEventListener('change', function(ev){
    var demo = ev.target.value;
    console.log(demo);
    makeDimGroup(crossfilter(demo_data[demo]), d3.extent(demo_data[demo], function(d){
        return d[0];
    }));
    chart.group(group).dimension(dimension);
    threshold_input.value = '1000';
    chart.redraw();
});

threshold_input.addEventListener('input', function(ev){
    var threshold = +ev.target.value;
    reducer.threshold(threshold);
    console.log(threshold);
    chart.redraw();
});
