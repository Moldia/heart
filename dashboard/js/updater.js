
function updateDashboard(d) {

    if (!d) { // no point to highlight - hide the circle and clear the text
        d3.select('.highlight-circle').style('display', 'none');
        prevHighlightDotNum = null;
        tooltip.style("opacity", 0);

    } else { // otherwise, show the highlight circle at the correct position
        renderDataTable(d)

        var datapoint = partitioner(d)
        barchart(datapoint)
        donutchart(datapoint)

        //Thats a temp solution to make the dapi chart responsive. There must be a better way
        document.getElementById("xValue").value = d.X
        document.getElementById("yValue").value = d.Y
        var evtx = new CustomEvent('change');
        document.getElementById('xValue').dispatchEvent(evtx);
        var evty = new CustomEvent('change');
        document.getElementById('yValue').dispatchEvent(evty);

    }
}