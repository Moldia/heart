function heatmap(dataset) {
    console.log("I am in heatmap.js")

    var svg = d3.select("#heat-chart").select("svg")

    var tsn = d3.transition().duration(1000);

    var margin = {top: 10, right: 85, bottom: 130, left: 160};

    var width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    var valRange = d3.extent(dataset, function (d) {
        return d.val
    });

    // var colors = ['#2C7BB6', '#00A6CA', '#00CCBC', '#90EB9D', '#FFFF8C', '#F9D057', '#F29E2E', '#E76818', '#D7191C'];
    var bluecolors = ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
        redcolors = ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'];

    var colorScale = d3.scaleLinear()
        .domain(valRange)
        .range(['#f7fbff', '#08306b'])
        .interpolate(d3.interpolateHcl);

    // the scale
    // var scale = {
    //     x: d3.scaleLinear().range([0, width]),
    //     y: d3.scaleLinear().range([height, 0]),
    // };

    // these will be populated later on
    var labels = {
        x: null,
        y: null,
    };

    var dot = {
        spacing: null,
        width: null,
        height: null,
    }

    var band = {
        x: null,
        y: null
    };

    var axis = {
        x: null,
        y: null,
    };

    // just set the variable here, them stick it to the return object and then do the rest
    // inside renderHeatmap()
    var zoom = d3.zoom()
    // var zoom = d3.zoom()
    //     .scaleExtent([1, dot.height])
    //     .on("zoom", zoomed);

    var tooltip = d3.select("body").append("div")
        .attr("id", "tooltip_heatmap")
        .attr('class', 'tooltip')
        .style("opacity", 0);

    var percentFormat = d3.format('.0%') // rounded percentage

    // SVG canvas
    svg = d3.select("#heat-chart").select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(zoom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Clip path
    svg.append("clipPath")
        .attr("id", "clipHeatMap")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    svg.append('clipPath')
        .attr('id', 'xClipHeatMap')
        .append("rect")
        .attr('x', 0)
        .attr('y', height)
        .attr("width", width)
        .attr("height", margin.bottom);


    // Heatmap dots
    var heatDotsGroup = svg.append("g")
        .attr("clip-path", "url(#clipHeatMap)")
        .append("g");


    //Create X axis
    var renderXAxis = svg.append("g")
        .attr("class", "x axis")
    // .attr("transform", "translate(0," + scale.y(-0.5) + ")")

    //Create Y axis
    var renderYAxis = svg.append("g")
        .attr("class", "y axis")
    // .attr("transform", "translate(0," + (-1)*dot.height + ")")


    // function zoomed() {
    //     d3.event.transform.y = 0;
    //     d3.event.transform.x = Math.min(d3.event.transform.x, 5);
    //     d3.event.transform.x = Math.max(d3.event.transform.x, (1 - d3.event.transform.k) * width);
    //
    //     // update: rescale x axis
    //     renderXAxis.call(axis.x.scale(d3.event.transform.rescaleX(scale.x)));
    //
    //     // Make sure that only the x axis is zoomed
    //     heatDotsGroup.attr("transform", d3.event.transform.toString().replace(/scale\((.*?)\)/, "scale($1, 1)"));
    // }

    // text label for the x axis
    var textGroup = svg.append('g')
        .attr('id', 'axesLabels')

    textGroup
        .append('g')
        .attr('id', 'xAxisLabel')
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom - 5) + ")")
        .attr('font-family', 'sans-serif')
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')
        .append('g')
        .attr('id', 'xAxisLabelText')
        .append('text')
        .text("Predicted");

    // text label for the y axis
    textGroup
        .append('g')
        .attr('id', 'yAxisLabel')
        .attr('transform', "translate(" + (-0.9*margin.left) + " ," + (height/2) + ") rotate(-90)")
        .attr('font-family', 'sans-serif')
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')
        .append('g')
        .attr('id', 'yAxisLabelText')
        .append('text')
        .text("Actual");


    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////// Draw the legend ////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    // Create the gradient
    svg.append("defs")
        .append("linearGradient")
        .attr("id", "legend-traffic")
        .attr("x1", "0%").attr("y1", "100%")
        .attr("x2", "0%").attr("y2", "0%")
        .selectAll("stop")
        .data(d3.range(0.0, 1.0, 1/9))
        .enter().append("stop")
        .attr("offset", function (d, i) {
            return i/10;
        })
        .attr("stop-color", function (d, i) {
            return colorScale(d);
        });


    var legend = {  height: Math.min(width * 0.8, 400),
                    width: 10};

    // Color Legend container
    var legendsvg = svg.append("g")
        .attr("class", "legendWrapper")
        .attr("transform", "translate(" + (width + margin.right/2) + "," + (height/2 -legend.height/2) + ")" )

    // Draw the Rectangle
    legendsvg.append("rect")
        .attr("class", "legendRect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", legend.width)
        .attr("height", legend.height)
        .style("fill", "url(#legend-traffic)");

    // Set scale for x-axis
    var xScaleLegend = d3.scaleLinear()
        .range([-legend.height / 2, legend.height / 2])
        .domain([1, 0]);

    // Define x-axis
    var xAxisLegend = d3.axisRight()
        .tickFormat(percentFormat)
        .ticks(5)
        .scale(xScaleLegend);

    // Set up X axis
    legendsvg.append("g")
        .attr("class", "axis")
        .style("font-size", "8px")
        .attr("transform", "translate(" + (legend.width) + "," + (legend.height/2) + ")")
        .call(xAxisLegend);


    var chartData = {};
    // chartData.scale = scale;
    chartData.labels = labels;
    chartData.axis = axis;
    chartData.band = band;
    chartData.colorScale = colorScale;
    chartData.heatDotsGroup = heatDotsGroup;
    chartData.dot = dot;
    chartData.tsn = tsn;
    chartData.width = width;
    chartData.height = height;
    chartData.margin = margin;
    chartData.zoom = zoom;
    chartData.textGroup = textGroup;

    return chartData;

};

function updateScales(data, scale) {
    scale.x.domain([0, d3.max(data, d => d.xKey)]),
        scale.y.domain([0, d3.max(data, d => d.yKey)])
}

function updateLabels(data, labels) {
    labels.x = d3.map(data, function (d) {
        return d.xLabel;
    }).keys(),
        labels.y = d3.map(data, function (d) {
            return d.yLabel;
        }).keys()
}

function updateDot(chartData) {
    chartData.dot.width = chartData.width / (1 * (chartData.labels.x.length)),
        chartData.dot.height = chartData.height / (1 * chartData.labels.y.length)
}

function updateAxes(data, chartData) {
    var band = chartData.band,
        labels = chartData.labels;

    chartData.axis.x = d3.axisBottom(band.x).ticks(labels.x.length).tickFormat((d, i) => d)
    chartData.axis.y = d3.axisLeft(band.y).ticks(labels.y.length).tickFormat((d, i) => d) // if (d, i) => d is too cryptic it can be replaced by (d) => labels.y[i]
    // The following also work:
    // d3.axisBottom(band.x).ticks(labels.x.length)
    // d3.axisLeft(band.y).ticks(labels.x.length).tickFormat((d, i) => d)
    // d3.axisLeft(band.y).ticks(labels.x.length).tickFormat((d, i) => labels.x[i])
    // BUT NOT
    // d3.axisLeft(band.y).ticks(labels.x.length).tickFormat(d)
    //
    // Also just writing
    // axis.x = d3.axisBottom(band.x)
    // seems to be just fine!!
}

function updateBands(chartData) {
    chartData.band.x = d3.scaleBand().domain(chartData.labels.x).range([0, chartData.width]),
        chartData.band.y = d3.scaleBand().domain(chartData.labels.y).range([chartData.height, 0])
}

function renderHeatmap(dataset) {
    var percentFormat = d3.format('.2%');

    var svg = d3.select("#heat-chart")
        .select("svg");
    if (svg.select("#clipHeatMap").empty()) {
        chartData = heatmap(dataset);
    }

    //chartData = svg.datum();
    //Do the axes
    updateLabels(dataset, chartData.labels);

    updateBands(chartData)

    //updateScales(dataset, chartData.scale);

    updateAxes(dataset, chartData);

    updateDot(chartData);

    var yAxis = svg.select('.y.axis').call(chartData.axis.y)
    var xAxis = svg.select('.x.axis')
        .attr("transform", "translate(0, " + chartData.height + ")")
        .call(chartData.axis.x)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-60)");

    var zoom = chartData.zoom
        .scaleExtent([1, chartData.dot.height])

    // .on("zoom", zoomed); // Inactivate the zoom until it is properly working

    function zoomed() {
        // I am almost there. What doesnt work:
        // 1) x axis needs a clip path cause it stretches beyond the proper boundaries
        // 2) When the user changed the data passed in (using the checkboxes for example) the heatmap is messed up
        //
        // Code here based at
        // https://stackoverflow.com/questions/49279159/add-zoom-to-a-grouped-bar-chart-that-uses-a-scaleband/49286715#49286715
        // and
        // https://stackoverflow.com/questions/49334856/scaleband-with-zoom/49342403#49342403
        //
        var _t = d3.event.transform;
        var t = _t
        t.x = Math.min(_t.x, 5);
        t.x = Math.max(t.x, (1 - t.k) * chartData.width);

        // translate and scale the x dimension only
        var my_transform = "translate(" + t.x + ", " + 0 + ") scale(" + t.k + ", 1)"

        chartData.band.x.range([0, chartData.width * t.k]);
        chartData.heatDotsGroup.selectAll("rect")
            .attr("transform", my_transform);

        svg.select('.x.axis')
            .attr("transform", "translate(" + t.x + "," + (chartData.height) + ")")
            .call(chartData.axis.x);
    }

    // Do the chart
    const update = chartData.heatDotsGroup.selectAll("rect")
        .data(dataset);

    update
        .enter()
        .append("rect")
        .on("mouseover", function (d) {
            $("#tooltip_heatmap").html("Predicted: " + d.xLabel + "<br/>Actual: " + d.yLabel + "<br/>Prob: " + percentFormat(d.val));
            var xpos = d3.event.pageX + 10;
            var ypos = d3.event.pageY + 20;
            $("#tooltip_heatmap").css("left", xpos + "px").css("top", ypos + "px").animate().css("opacity", 1);
        }).on("mouseout", function () {
        $("#tooltip_heatmap").animate({
            duration: 500
        }).css("opacity", 0);
    })
        .merge(update)
        .transition(chartData.tsn)
        .attr("width", chartData.dot.width)
        .attr("height", chartData.dot.height)
        .attr("x", function (d) {
            return chartData.band.x(d.xLabel);
        })
        .attr("y", function (d) {
            return chartData.band.y(d.yLabel);
        })
        .attr("fill", function (d) {
            return chartData.colorScale(d.val);
        });

    update.exit().remove();


    // Now set the appropriate axes labels depending on which checkbox is ticked
    if (document.getElementById('genes42').checked) {
        d3.select('#xAxisLabel').html('<text>Predicted</text>');
        d3.select('#yAxisLabel').html('<text>Actual</text>');
    }
    else {
        d3.select('#xAxisLabel').html('<text>Predicted</text>');
        d3.select('#yAxisLabel').html('<text>Actual</text>');
    }



}
