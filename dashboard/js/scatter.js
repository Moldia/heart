function initChart(data) {


  var totalWidth = 700,
        totalHeight = 275;

    var margin = {
            top: 10,
            left: 50,
            bottom: 30,
            right: 0
        }

    var width = totalWidth  - margin.left - margin.right,
        height = totalHeight  - margin.top - margin.bottom;

    // inner chart dimensions, where the dots are plotted
//    var width = width - margin.left - margin.right;
//    var height = height - margin.top - margin.bottom;

     var tsn = d3.transition().duration(200);

    // radius of points in the scatterplot
    var pointRadius = .5;

    var extent = {
        x: d3.extent(data, function (d) {return d.x}),
        y: d3.extent(data, function (d) {return d.y}),
    };

    var scale = {
        x: d3.scaleLinear().range([0, width]),
        y: d3.scaleLinear().range([height, 0]),
    };

    var axis = {
        x: d3.axisBottom(scale.x).ticks(xTicks).tickSizeOuter(0),
        y: d3.axisLeft(scale.y).ticks(yTicks).tickSizeOuter(0),
    };
    
    var gridlines = {
        x: d3.axisBottom(scale.x).tickFormat("").tickSize(height),
        y: d3.axisLeft(scale.y).tickFormat("").tickSize(-width),
    }

    // var colorScale = d3.scaleLinear().domain([0, 1]).range(['tomato', 'tomato']);
    var colorRamp = classColorsCodes()
    var colorMap = d3.map(colorRamp, function(d) { return d.className.traim(); });
    console.log(colorMap)

    // select the root container where the chart will be added
    var container = d3.select('#scatter-plot');

    var zoom = d3.zoom()
        .scaleExtent([1, 20])
        .on("zoom", zoomed);

    var tooltip = d3.select("body").append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);

    // initialize main SVG
    var svg = container.select('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(zoom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Clip path
    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    //Create X axis
    var renderXAxis = svg.append("g")
        .attr("class", "x axis")

    //Create Y axis
    var renderYAxis = svg.append("g")
        .attr("class", "y axis")

    // set up axis generating functions
    var xTicks = Math.round(width / 50);
    var yTicks = Math.round(height / 50);

    function updateScales(data, scale){
        scale.x.domain([extent.x[0]*0.99, extent.x[1]*1.01]).nice(),
        scale.y.domain([extent.y[1]*1.01, extent.y[0]*0.99]).nice()
    }

    function zoomed() {
        d3.event.transform.x = d3.event.transform.x;
        d3.event.transform.y = d3.event.transform.y;

        // update: rescale x axis
        renderXAxis.call(axis.x.scale(d3.event.transform.rescaleX(scale.x)));
        renderYAxis.call(axis.y.scale(d3.event.transform.rescaleY(scale.y)));

        dotsGroup.attr("transform", d3.event.transform);
    }
    
    var moveX = document.getElementById("xxValue");
    var moveY = document.getElementById("yyValue");


    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    function aggregator(data){
        var out;
        out =  d3.nest()
            .key(function(d){return d.IdentifiedType; }) //group by IdentifiedType
            .rollup(function(leaves){
                return {
                    Prob: d3.sum(leaves, function(d){return d.Prob;}), //sum all the values with the same IdentifiedType
                    color: leaves[0].color                             //Get the first color code. All codes with the same IdentifiedType are the same anyway
                }
            }).entries(data)
            .map(function(d){
                return { IdentifiedType: d.key, Prob: d.value.Prob, color: d.value.color};
            });

        // sort in decreasing order
        out.sort(function(x, y){
            return d3.ascending(y.Prob, x.Prob);
        })

        return out
    }

    function renderOrder(y) {
        return y === 'Zero' ? 1 :
            y === '14' ? 2 :
                y === '13' ? 3 :
                    y === '12' ? 4 :
                        y === '11' ? 5 :
                            y === '10' ? 6 :
                                y === '9' ? 7 :
                                    y === '8' ? 8 :
                                        y === '7' ? 9 :
                                            y === '6' ? 10 :
                                                y === '5' ? 11 :
                                                    y === '4' ? 12 :
                                                        y === '3' ? 13 :
                                                            y === '2' ? 14 :
                                                                y === '1' ? 15 :
                                                                    y === '0' ? 16 :
                                                                        17;
    }

    function dataManager(data){
        var chartData = [];
        for (var i=0; i<data.length; ++i){
            var IdentifiedType = [];
            var temp = [];
            for(var j=0; j<data[i].Prob.length; ++j)
            {
                temp.push({
                    IdentifiedType: colorMap.get(data[i].ClassName[j].trim()).IdentifiedType,
                    color: colorMap.get(data[i].ClassName[j].trim()).color,
                    Prob: data[i].Prob[j]
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
                renderOrder: renderOrder(agg[0].IdentifiedType),

        })
        }

        return chartData
    }


    var managedData = dataManager(data)

    //update now data with a managedData property
    for (var i=0; i<data.length; ++i){
        data[i].managedData = managedData[i]
    }

    // sort in ascending order
    data.sort(function(x, y){
        return d3.ascending(x.managedData.renderOrder, y.managedData.renderOrder);
    })

    // use that to check counts per IdentifiedType and then set the renderOrder in such a manner that
    // names which smaller counts (ie rarer) will be rendered on top of more frequent ones
    var countData = d3.nest()
        .key(function(d){return d.managedData.IdentifiedType})
        .rollup(function(leaves){return leaves.length})
        .entries(data)

    var dotsGroup;
    var voronoiDiagram;
    renderPlot(data);
    
    function renderPlot(data){
        console.log('Doing Scatter plot')
        renderScatter(data);

        var nodes = d3.selectAll('circle').nodes();
        for (var i=0; i<nodes.length; i++){
            if(nodes[i].getAttribute('class') === 'dotOnScatter') (
                data[i].cx = +nodes[i].getAttribute('cx'),
                data[i].cy = +nodes[i].getAttribute('cy')
                    // data[i].push({
                    //     cx: nodes[i].getAttribute('cx'),
                    //     cy: nodes[i].getAttribute('cy')
                    // })
            )
        }
        console.log('Doing DAPI')
        dapi(data);
    }



    function renderScatter(data){
        updateScales(data, scale);

        svg.select('.y.axis')
            .attr("transform", "translate(" + -pointRadius + " 0)" )
            .call(axis.y);
        
        var h = height + pointRadius;
        svg.select('.x.axis')
            .attr("transform", "translate(0, " + h + ")")
            .call(axis.x);
        
        svg.append("g")
            .attr("class", "grid")
            .call(gridlines.x);

        svg.append("g")
            .attr("class", "grid")
            .call(gridlines.y);

        dotsGroup = svg.append("g")
                       .attr("clip-path", "url(#clip)")
                       .append("g");
        
        //Do the chart
        var update = dotsGroup.selectAll("circle").data(data)
        
        update
            .enter()
            .append('circle')
            .attr('class', 'dotOnScatter')
            .attr('id', d => d.managedData.IdentifiedType)
            .attr('r', d => Math.sqrt(d.managedData.GeneCountTotal))
            .attr('cx', d => scale.x(d.x))
            .attr('cy', d => scale.y(d.y))
            .attr('fill', d => d.managedData.color)
            .attr('fill-opacity', 0.85)
        //colorScale(d.y)
        //colorMap.get(d.managedData.NickName).color
        
        
        // create a voronoi diagram 
        voronoiDiagram = d3.voronoi()
            .x(d => scale.x(d.x))
            .y(d => scale.y(d.y))
            .size([width, height])(data);

        // add a circle for indicating the highlighted point
        dotsGroup.append('circle')
            .attr('class', 'highlight-circle')
            .attr('r', pointRadius*2) // increase the size if highlighted
            //.style('fill', '#FFCE00')
            .style('display', 'none');

        // add the overlay on top of everything to take the mouse events
        dotsGroup.append('rect')
            .attr('class', 'overlay')
            .attr('width', width)
            .attr('height', height)
            .style('fill', '#FFCE00')
            .style('opacity', 0)
            .on('click', mouseClickHandler)
            .on('mousemove', mouseMoveHandler)
            .on('mouseleave', () => {
                // hide the highlight circle when the mouse leaves the chart
                console.log('mouse leave');
                highlight(null);
        });
        
        // Manually dispach a mouse click event. That will kick-off rendering of the other charts on the dashboard.
        d3.select('.overlay').dispatch('click')
    
    }; //end renderPlot


    // callback for when the mouse moves across the overlay
    function mouseMoveHandler() {
        // get the current mouse position
        const [mx, my] = d3.mouse(this);

        // use the new diagram.find() function to find the voronoi site closest to
        // the mouse, limited by max distance defined by voronoiRadius
        //const site = voronoiDiagram.find(mx, my, voronoiRadius);
        const site = voronoiDiagram.find(mx, my);

        // highlight the point if we found one, otherwise hide the highlight circle
        highlight(site && site.data);

    }
    

    // callback for when the mouse moves across the overlay
    function mouseClickHandler() {

        // get the current mouse position
        const [mx, my] = d3.mouse(this);

        // use the new diagram.find() function to find the voronoi site closest to
        // the mouse, limited by max distance defined by voronoiRadius
        //const site = voronoiDiagram.find(mx, my, voronoiRadius);
        const site = voronoiDiagram.find(mx, my);

        // highlight the point if we found one, otherwise hide the highlight circle
        highlight(site && site.data);
        refreshDashboard(site && site.data)

    }


    myFun = function (event) {
        event.preventDefault();
        x = +document.getElementById("xxValue").value
        y = +document.getElementById("yyValue").value
        var site = voronoiDiagram.find(x, y);
        highlight(site && site.data);

        return site
        //refreshDashboard(site && site.data)
    }

    myFun2 = function(event){
        var site = myFun(event);
        refreshDashboard(site && site.data);
    }

    moveX.addEventListener("moveMouse", myFun);
    moveY.addEventListener("moveMouse", myFun);
    moveX.addEventListener("clickMouse", myFun2);
    moveY.addEventListener("clickMouse", myFun2);

    var prevHighlightDotNum = null;
    // callback to highlight a point
    function highlight(d) {
        // no point to highlight - hide the circle and clear the text
        if (!d) {
            d3.select('.highlight-circle').style('display', 'none');
            prevHighlightDotNum = null;
            tooltip.style("opacity",0);
            // otherwise, show the highlight circle at the correct position
        } else {
            if (prevHighlightDotNum !== d.Cell_Num) {
                d3.select('.highlight-circle')
                    .style('display', '')
                    .style('stroke', 'tomato')
                    .attr('fill', d.managedData.color)
                    .attr('cx', scale.x(d.x))
                    .attr('cy', scale.y(d.y))
                    .attr("r", pointRadius*Math.sqrt(d.managedData.GeneCountTotal));
                
                // If event has be triggered from the scatter chart, so a tooltip
                if (d3.event && d3.event.pageX){

                    var myHtml = '<h4 style="margin-top:0px; margin-bottom:1px"><b>'+d.managedData.IdentifiedType+'</b></h4>' +
                        '<table style="width:95px;">' +
                        '<tbody>' +
                        '<tr style="width:95px; border-top:1px solid White; font-weight: bold">' +
                        '<td><div>Probability: </div></td>' +
                        '<td><div>' + Math.round(100*d.managedData.Prob)/100 + '</div></td>' +
                        '</tr>' +
                        '<tr class="">' +
                        '<td><div>Gene Count:</div>' + '</td>' +
                        '<td><div>' + Math.round(100*d.managedData.GeneCountTotal)/100 + '</div></td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>'

                    tooltip.transition()
                    .duration(200)
                    
                    tooltip
                        .style("opacity", .9)
                        .html(myHtml)
                        .style("left", (d3.event.pageX - 5) + "px")
                        .style("top", (d3.event.pageY + 25) + "px");
                    
                }
                prevHighlightDotNum = d.Cell_Num;                
            }
        }
    }

    function refreshDashboard(d) {
        // no point to highlight - hide the circle and clear the text
        if (!d) {
            d3.select('.highlight-circle').style('display', 'none');
            prevHighlightDotNum = null;
            tooltip.style("opacity", 0);
            // otherwise, show the highlight circle at the correct position
        } else {
            renderDataTable(d)
            // // Do the heatmap as well
            // d3.json("./dashboard/data/weightedMap/json/wm_" + d.Cell_Num + ".json", function (data) {
            //     data.forEach(function (d) {
            //         d.xKey = +d.xKey
            //         d.yKey = +d.yKey
            //         d.val = +d.val
            //     });
            //     console.log("Heatmap start")
            //     renderHeatmap(data)
            //     console.log("Heatmap end")
            // });

            // And the barchart, piechart too!
            // For small values assign it to a separate class labeled 'Other'
            var sdata = [];
            var ClassName;
            for (var i = 0; i < d.Prob.length; i++) {
                d.Prob[i] < 0.02? ClassName = 'Other': ClassName = d.ClassName[i].trim()
                sdata.push({
                    Prob: d.Prob[i],
                    labels: ClassName,
                })
            }

            // group by class name. This will eventually sum all the values that fall in the same class.
            //Hence if there is a class 'Other' then is will be assigned with the grand total
            sdata =  d3.nest().key(function(d){
                return d.labels; })
                .rollup(function(leaves){
                    return d3.sum(leaves, function(d){
                        return d.Prob;})
                }).entries(sdata)
                .map(function(d){
                    return { labels: d.key, Prob: d.value};
                });

            // sort in decreasing order
            sdata.sort(function(x, y){
                return d3.ascending(y.Prob, x.Prob);
            })

            barchart(sdata)
            donutchart(sdata)

            //Thats a temp solution to make the dapi chart responsive. There must be a better way
            document.getElementById("xValue").value = d.X
            document.getElementById("yValue").value = d.Y
            var evtx = new CustomEvent('change');
            document.getElementById('xValue').dispatchEvent(evtx);
            var evty = new CustomEvent('change');
            document.getElementById('yValue').dispatchEvent(evty);

        }
    }


}
