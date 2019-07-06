function section() {

    var totalWidth = 350,
        totalHeight = 280;

    var margin = {
        top: 10,
        left: 60,
        bottom: 30,
        right: 0
    }

    var width = totalWidth - margin.left - margin.right,
        height = totalHeight - margin.top - margin.bottom;

    var tsn = d3.transition().duration(1000);

    // radius of points in the scatterplot
    var pointRadius = .0001;

    var scale = {
        x: d3.scaleLinear().range([0, width]),
        y: d3.scaleLinear().range([height, 0]),
    };

    var axis = {
        x: d3.axisBottom(scale.x).ticks(xTicks).tickSizeOuter(0),
        y: d3.axisLeft(scale.y).ticks(yTicks).tickSizeOuter(0),
    };

    var gridlines = {
        x: null,
        y: null,
    }

    // var colorScale = d3.scaleLinear().domain([0, 1]).range(['tomato', 'tomato']);
    var colorRamp = classColorsCodes()
    var colorMap = d3.map(colorRamp, function (d) {
        return d.className;
    });

    // select the root container where the chart will be added
    var container = d3.select('#scatter-plot');

    var zoom = d3.zoom()
        .scaleExtent([1, 20])
        //.on("zoom", zoomed);

    var tooltip = d3.select("body").append("div")
        .attr("id", "tooltip")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // initialize main SVG
    var svg = container.select('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(zoom)
        .append("g")
        .attr('id', 'sectionChartGroup')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // grid lines group must be before the dotsGroup group so that the
    /// gridlines are rendered under the circles and not above!
    var xGrid = svg.append("g")
        .attr("class", "grid")
        // .call(sectionFeatures.gridlines.x);

    var yGrid = svg.append("g")
        .attr("class", "grid")
        // .call(sectionFeatures.gridlines.y);

    // Clip path
    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    var dotsGroup = svg.append("g")
        .attr("clip-path", "url(#clip)")
        .attr("transform", "translate(4, 0)") // no idea why!
        .append("g")
        .attr('id', 'dotsGroup');

    //Create X axis
    var renderXAxis = svg.append("g")
        .attr("class", "x axis")

    //Create Y axis
    var renderYAxis = svg.append("g")
        .attr("class", "y axis")

    //Create X grilines
    var renderXGridline = svg.append("g")
        .attr("class", "x gridline")

    //Create Y gridlines
    var renderYGridline = svg.append("g")
        .attr("class", "y gridline")

    // set up axis generating functions
    var xTicks = Math.round(width / 50);
    var yTicks = Math.round(height / 50);


    var moveX = document.getElementById("xxValue");
    var moveY = document.getElementById("yyValue");


    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    // voronoi
    var voronoi = d3.voronoi()


    function renderOrder(y) {
        return y === 'Uncalled' ? 1 :
            // y === '(13) Immune cells' ? 3 :
            // y === '(11) Erythrocytes-2' ? 5 :
            // y === '(6) Erythrocytes-1' ? 10 :
            y === '(10) Endohelium/ pericytes/ adventia' ? 2 :
            y === '(8) Fibroblast-like (larger vascular development)' ? 3 :
            y === '(4) Fibroblast-like (smaller vascular development)' ? 4 :
            y === '(2) Fibroblast-like (connective tissue related)' ? 5 :
            y === '(0) Capillary endothelium' ? 6 :
            y === '(12) Cardiomyocytes' ? 7 :
            y === '(7) Atrial cardiomyocytes' ? 8 :
            y === '(1) Ventricular cardiomyocytes' ? 9 :
            y === '(5) Smooth muscle cells/ fibroblast-like' ? 10 :
            y === '(9) Epicardial cells' ? 11:
            y === '(3) Epicardium-derived cells' ? 12 :
            y === '(14) Cardiac neural crest cells & Schwann progenitor cells' ? 13 :
                14;
}


    var chartData = {};
    chartData.svg = svg;
    chartData.dotsGroup = dotsGroup;
    chartData.width = width;
    chartData.height = height;
    chartData.renderXAxis = renderXAxis;
    chartData.renderYAxis = renderYAxis;
    chartData.renderXGridline = renderXGridline;
    chartData.renderYGridline = renderYGridline;
    chartData.renderOrder = renderOrder;
    chartData.tsn = tsn;
    chartData.pointRadius = pointRadius;
    chartData.scale = scale;
    chartData.axis = axis;
    chartData.xTicks = xTicks;
    chartData.yTicks = yTicks;
    chartData.gridlines = gridlines;
    chartData.colorRamp = colorRamp;
    chartData.colorMap = colorMap;
    chartData.zoom = zoom;
    chartData.tooltip = tooltip;
    chartData.xGrid = xGrid;
    chartData.yGrid = yGrid;
    chartData.voronoi = voronoi;

    return chartData
}

function aggregator(data) {
    var out;
    out = d3.nest()
        .key(function (d) {
            return d.IdentifiedType;
        }) //group by IdentifiedType
        .rollup(function (leaves) {
            return {
                Prob: d3.sum(leaves, function (d) {
                    return d.Prob;
                }), //sum all the values with the same IdentifiedType
                color: leaves[0].color //Get the first color code. All codes with the same IdentifiedType are the same anyway
            }
        }).entries(data)
        .map(function (d) {
            return {IdentifiedType: d.key, Prob: d.value.Prob, color: d.value.color};
        });

    // sort in decreasing order
    out.sort(function (x, y) {
        return d3.ascending(y.Prob, x.Prob);
    })

    return out
}

function dataManager(sectionFeatures, data) {
    var chartData = [];
    for (var i = 0; i < data.length; ++i) {
        var temp = [];
        for (var j = 0; j < data[i].ClassName.length; ++j) {
            // console.log(data[i].ClassName[j])
            temp.push({
                IdentifiedType: sectionFeatures.colorMap.get(data[i].ClassName[j].trim()).IdentifiedType,
                color: sectionFeatures.colorMap.get(data[i].ClassName[j].trim()).color,
                Prob: data[i].Prob[j]? data[i].Prob[j]: [data[i].Prob] //Maybe that one is better
            })
        }
        var agg = aggregator(temp);
        chartData.push({
            x: data[i].x,
            y: data[i].y,
            GeneCountTotal: data[i].CellGeneCount.reduce((a, b) => a + b, 0), //get the sum of all the elements in the array
            IdentifiedType: agg[0].IdentifiedType,
            color: agg[0].color,
            Prob: agg[0].Prob,
            renderOrder: sectionFeatures.renderOrder(agg[0].IdentifiedType),

        })
    }

    return chartData
}

var sectionFeatures; // This is now a global variable!
function sectionChart(data) {

    console.log('Doing Section Overview plot')

    var svg = d3.select('#scatter-plot').select("svg")
    if (svg.select('#sectionChartGroup').empty()) {
        sectionFeatures = section()
    }

    svg = sectionFeatures.svg;
    // console.log(sectionFeatures.height)

    var managedData = dataManager(sectionFeatures, data)
    //update now data with a managedData property
    for (var i = 0; i < data.length; ++i) {
        data[i].managedData = managedData[i]
    }

    // sort in ascending order
    data.sort(function (x, y) {
        return d3.ascending(x.managedData.renderOrder, y.managedData.renderOrder);
    })

    // var extent = {
    //     x: d3.extent(data, function (d) {
    //         return d.x
    //     }),
    //     y: d3.extent(data, function (d) {
    //         return d.y
    //     }),
    // };

    function getExtent(){
        var out = {};

        out.x = d3.extent(data, function (d) {return d.x});
        out.y = d3.extent(data, function (d) {return d.y});


        if (typeof (out.x[0] || out.x[1]) == 'undefined') {
            out.x = [0, 1];
        }
         if (typeof (out.y[0] || out.y[1]) == 'undefined') {
            out.y = [0, 1];
        }
        return out
    }


    function updateScales() {
        var extent = getExtent();

        // TODO: adjust axes based on image size, not selected data
        // sectionFeatures.scale.x.domain([extent.x[0] -40, extent.x[1] +40]).nice()
        // sectionFeatures.scale.y.domain([extent.y[1] +40, extent.y[0] -150]).nice()
        sectionFeatures.scale.x.domain([-20, 20000]).nice()
        sectionFeatures.scale.y.domain([20000, -100]).nice()
    }

    var gridlines = {
        x: d3.axisBottom(sectionFeatures.scale.x).tickFormat("").tickSize(sectionFeatures.height),
        y: d3.axisLeft(sectionFeatures.scale.y).tickFormat("").tickSize(-sectionFeatures.width),
    }

    function updateGridlines() {
        sectionFeatures.xGrid.call(gridlines.x);
        sectionFeatures.yGrid.call(gridlines.y);
    }

    function updateAxes(){
        sectionFeatures.axis.x = d3.axisBottom(sectionFeatures.scale.x).ticks(sectionFeatures.xTicks).tickSizeOuter(0);
        sectionFeatures.axis.y = d3.axisLeft(sectionFeatures.scale.y).ticks(sectionFeatures.yTicks).tickSizeOuter(0);
    }

    function updateVoronoi(data){
        var v =  sectionFeatures.voronoi
                    .x(d => sectionFeatures.scale.x(d.x))
                    .y(d => sectionFeatures.scale.y(d.y))
                    .size([sectionFeatures.width, sectionFeatures.height])(data);

        // Is this how it should be done? Do I have to remove them each time?
        // highlight circle and sectionOverlay must be on top of everything else. Hence they
        // should be rendered last. Especially when using filters on the section chart you need to guarantee
        // that these are drawn at very end, otherwise they wont work properly.
        // Draw the highlight circle
        d3.select('#dotsGroup').select('.highlight-circle').remove()
        if (d3.select('#dotsGroup').select('.highlight-circle').empty()){
            sectionFeatures.dotsGroup
                            .append('circle')
                            .attr('class', 'highlight-circle')
                            // .style('fill', '#FFCE00')
                            .style('display', 'none')
        }
        d3.select('#dotsGroup')
            .select('.highlight-circle')
            .attr('r', sectionFeatures.pointRadius * 2);

        // Now draw the overlay on top of everything to take the mouse events
        d3.select('#dotsGroup').select('#sectionOverlay').remove()
        if (d3.select('#dotsGroup').select('#sectionOverlay').empty()){
            sectionFeatures.dotsGroup
                            .append('rect')
                            .attr('class', 'overlay')
                            .attr('id', 'sectionOverlay')
                            // .style('fill', '#FFCE00')
                            .style('opacity', 0)
                            .on('click', mouseClickHandler)
                            .on('mousemove', mouseMoveHandler)
                            .on('mouseleave', () => {
                                // hide the highlight circle when the mouse leaves the chart
                                console.log('mouse leave');
                                dapiConfig.map.removeLayer(voronoiMarker);
                                highlight(null);
                            });

        }
        d3.select('#dotsGroup')
            .select('#sectionOverlay')
            .attr('width', sectionFeatures.width)
            .attr('height', sectionFeatures.height)

        //Finally return the voronoi
        return v
    }

    updateScales();
    updateAxes();
    updateGridlines();

    svg.select('.y.axis')
        .attr("transform", "translate(" + sectionFeatures.pointRadius + " 0)")
        .call(sectionFeatures.axis.y);

    var h = sectionFeatures.height + sectionFeatures.pointRadius;
    svg.select('.x.axis')
        .attr("transform", "translate(0, " + h + ")")
        .call(sectionFeatures.axis.x);

    // var xGrid = svg.append("g")
    //     .attr("class", "grid")
    //     .call(sectionFeatures.gridlines.x);
    //
    // var yGrid = svg.append("g")
    //     .attr("class", "grid")
    //     .call(sectionFeatures.gridlines.y);

    // var dotsGroup = svg.append("g")
    //     .attr("clip-path", "url(#clip)")
    //     .attr("transform", "translate(4, 0)") // no idea why!
    //     .append("g");

    var dotsGroup = sectionFeatures.dotsGroup;


    // Do the chart
    // Note: DO NOT do the usual selectAll('circle'). As new data are
    // pushed in, you will end-up with one circle not being shown
    // because it will carry the styling from the highlight-circle
    // That styling is set to:
    // style="stroke: tomato; display: none;"
    var update = dotsGroup.selectAll(".dotOnScatter").data(data);

    // Note: Setting the transition here messes up the landing cell
    // The DOM has the circles but without id, r, cx, cy and opacity.
    // Not why, I think the function that sets the landing cell, grabs
    // section chart too early, before it has been populated properly
    // and that happens because of the transition (I think!!)
    // Solution: set the transition in the CSS
    update
        .enter()
        .append('circle')
        .merge(update)
        // .transition(d3.transition().duration(500))
        // .transition().duration(500)
        .attr('class', 'dotOnScatter')
        .attr('id', d => 'Cell_Num_' + d.Cell_Num)
        .attr('r', d => Math.sqrt(d.managedData.GeneCountTotal))
        .attr('cx', d => sectionFeatures.scale.x(d.x))
        .attr('cy', d => sectionFeatures.scale.y(d.y))
        .attr('fill', d => d.managedData.color)
        .attr('fill-opacity', 0.85)

    update.exit().remove();

    //
    d3.select('#dotsGroup').select('.highlight-rect').remove()
    if (d3.select('#dotsGroup').select('.highlight-rect').empty()){
        dotsGroup.append('rect').attr('class', 'highlight-rect')
    };

    var voronoiDiagram = updateVoronoi(data);

    //collect the coordinates of the circles and push the to the data object
    var nodes = d3.selectAll('circle').nodes();
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].getAttribute('class') === 'dotOnScatter') {
            data[i].cx = +nodes[i].getAttribute('cx')
            data[i].cy = +nodes[i].getAttribute('cy')
        }
    }

    sectionFeatures.zoom.on("zoom", zoomed);

    function zoomed() {
        // d3.event.transform.x = d3.event.transform.x;
        // d3.event.transform.y = d3.event.transform.y;

        // update: rescale x and y axes
        sectionFeatures.renderXAxis.call(sectionFeatures.axis.x.scale(d3.event.transform.rescaleX(sectionFeatures.scale.x)));
        sectionFeatures.renderYAxis.call(sectionFeatures.axis.y.scale(d3.event.transform.rescaleY(sectionFeatures.scale.y)));

        sectionFeatures.xGrid.call(gridlines.x.scale(d3.event.transform.rescaleX(sectionFeatures.scale.x)));
        sectionFeatures.yGrid.call(gridlines.y.scale(d3.event.transform.rescaleY(sectionFeatures.scale.y)));

        dotsGroup.attr("transform", d3.event.transform);
        // xGrid.attr("transform", d3.event.transform);
        // yGrid.attr("transform", d3.event.transform);
    }

// callback for when the mouse moves across the overlay
    function mouseMoveHandler() {
        // make sure you hide the rect
        d3.select('.highlight-rect')
            .attr("width", 0)
            .attr("height",0)
            .attr('opacity', 0)

        // get the current mouse position
        const [mx, my] = d3.mouse(this);

        // use the new diagram.find() function to find the voronoi site closest to
        // the mouse, limited by max distance defined by voronoiRadius
        //const site = voronoiDiagram.find(mx, my, voronoiRadius);
        const site = voronoiDiagram.find(mx, my);

        // highlight the point if we found one, otherwise hide the highlight circle
        highlight(site && site.data);

        highlightDapi(site && site.data)

    }

    function highlightDapi(d){

        try {
            dapiConfig.map.removeLayer(voronoiMarker)
        }
        catch(err) {
            // do nothing
        }

        if(d){
            styleVoronoiMarkers(d)
        }
    }

    var styleVoronoiMarkers = function (d) {
        var p = dapiConfig.t.transform(L.point([d.x, d.y]));
        voronoiMarker = L.circleMarker([p.y, p.x], {
            radius: 15,
            fillColor: "orange",
            color: "red",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5,
            interactive: false,
        }).addTo(dapiConfig.map);
    }

// callback for when the mouse moves across the overlay
    function mouseClickHandler() {
        console.log('pageX is: ' + d3.event.pageX)
        console.log('pageY is: ' + d3.event.pageY)

        // get the current mouse position
        const [mx, my] = d3.mouse(this);

        // use the new diagram.find() function to find the voronoi site closest to
        // the mouse, limited by max distance defined by voronoiRadius
        //const site = voronoiDiagram.find(mx, my, voronoiRadius);
        const site = voronoiDiagram.find(mx, my);

        // 1. highlight the point if we found one, otherwise hide the highlight circle
        highlight(site && site.data);

        // 2.
        updateDashboard(site && site.data)

        // 3.
        drawMarker(site && site.data)

    }

    function drawMarker(d){
        if (dapiConfig){
            var p = dapiConfig.t.transform(L.point([d.x, d.y]));

            try {
                dapiConfig.map.removeLayer(voronoiMarker)
            }
            catch(err) {
                // do nothing
            }

            voronoiMarker = L.circleMarker([p.y, p.x], {
                radius: 15,
                fillColor: "orange",
                color: "red",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.5,
                interactive: false,
            }).addTo(dapiConfig.map);
        }
    }

    var prevHighlightDotNum = null;

// callback to highlight a point
    function highlight(d) {
        // no point to highlight - hide the circle and clear the text
        if (!d) {
            d3.select('.highlight-circle').style('display', 'none');
            prevHighlightDotNum = null;
            sectionFeatures.tooltip.style("opacity", 0);
            // otherwise, show the highlight circle at the correct position
        } else {
            if (prevHighlightDotNum !== d.Cell_Num) {
                d3.select('.highlight-circle')
                    .style('display', '')
                    .style('stroke', 'tomato')
                    .attr('fill', d.managedData.color)
                    .attr('cx', sectionFeatures.scale.x(d.x))
                    .attr('cy', sectionFeatures.scale.y(d.y))
                    .attr("r", sectionFeatures.pointRadius * Math.sqrt(d.managedData.GeneCountTotal));

                // If event has be triggered from the scatter chart, so a tooltip
                if (d3.event && d3.event.pageX) {

                    var myHtml = '<h4 style="margin-top:0px; margin-bottom:1px"><b>' + d.managedData.IdentifiedType + '</b></h4>' +
                        '<table style="width:95px;">' +
                        '<tbody>' +
                        '<tr style="width:95px; border-top:1px solid White; font-weight: bold">' +
                        '<td><div>Probability: </div></td>' +
                        '<td><div>' + Math.round(100 * d.managedData.Prob) / 100 + '</div></td>' +
                        '</tr>' +
                        '<tr class="">' +
                        '<td><div>Gene Count:</div>' + '</td>' +
                        '<td><div>' + Math.round(100 * d.managedData.GeneCountTotal) / 100 + '</div></td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>'

                    sectionFeatures.tooltip.transition()
                        .duration(200)

                    sectionFeatures.tooltip
                        .style("opacity", .9)
                        .html(myHtml)
                        .style("left", (d3.event.pageX - 5) + "px")
                        .style("top", (d3.event.pageY + 25) + "px");

                }
                prevHighlightDotNum = d.Cell_Num;
            }
        }
    }


    // use that to check counts per IdentifiedType and then set the renderOrder in such a manner that
    // names which smaller counts (ie rarer) will be rendered on top of more frequent ones
    var countData = d3.nest()
        .key(function (d) {
            return d.managedData.IdentifiedType
        })
        .rollup(function (leaves) {
            return leaves.length
        })
        .entries(data)

    console.log('Finished Section Overview plot')
    return data
}

