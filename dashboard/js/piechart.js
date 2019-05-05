function piechart(data)
{
    //var data = [{"letter":"A","presses":2},{"letter":"B","presses":2},{"letter":"C","presses":1}];
    console.log(data);

    var width = 250,
        height = 250,
        radius = Math.min(width, height) / 2;

    var color = d3.scaleOrdinal(d3.schemeCategory10)
        //.range(["#A07A19", "#AC30C0", "#EB9A72", "#BA86F5", "#EA22A8"]);

    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var pie = d3.pie()
        .value(function(d) { return d.Prob; })(data);

    var svg = d3.select("#pie")
        .select("svg")
        .attr("width", width)
        .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width/2 + "," + height/2 +")"); // Moving the center point

    svg.call(renderPlot, pie)
    
    function renderPlot(selection, data){
        selection.call(renderChart, data);
    }

    function renderChart(selection, data)
    {
        var points = selection.selectAll("arc")
            .data(data);
        
        var newPoints = points.enter()
            .append("path")
            .attr("d", arc)
            .style("fill", function(d) { return color(d.data.labels);})
        
        points.merge(newPoints)
            .attr("d", arc)
            .style("fill", function(d) { return color(d.data.labels);})
        
         points.exit()
            .select("path")
            .remove();
        

            

//        g.append("text")
//            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
//            .text(function(d) { return d.data.labels;})
//            .style("fill", "#fff")

    }


    function change() {
        var pie = d3.pie()
            .value(function(d) { return d.Prob; })(data);
        path = d3.select("#pie").selectAll("path").data(pie);
        //path.attr("d", arc);
        //d3.selectAll("text").data(pie).attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; });
        d3.selectAll("text").data(pie).transition().duration(500).attrTween("transform", labelarcTween); // Smooth transition with labelarcTween
        path.transition().duration(500).attrTween("d", arcTween); // Smooth transition with arcTween
    }

    function arcTween(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    }

    function labelarcTween(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return "translate(" + labelArc.centroid(i(t)) + ")";
      };
    }


    //d3.select("button#a")
    //	.on("click", function() {
    //		data[0].presses++;
    //		change();
    //	})
    //
    //d3.select("button#b")
    //	.on("click", function() {
    //		data[1].presses++;
    //		change();
    //	})
    //d3.select("button#c")
    //	.on("click", function() {
    //		data[2].presses++;
    //		change();
    //	})

}
