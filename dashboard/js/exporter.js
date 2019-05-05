let canvas

function drawCanvas() {
    canvas = document.getElementById('canvasId')
    // build the query selector for the desired canvas
    // var query = "canvas";

    // find the canvas
    // canvas = document.querySelector(query);

    // hide the canvas
    // canvas.style.display = "none";

    let svgHtml = document.getElementById('heat-chart').innerHTML.trim()
    canvg(canvas, svgHtml)
}

function downloadPNG() {
    let filename = 'myExport'
    let url = canvas.toDataURL('image/png')
    let link = document.createElement('a')

    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
}

function downloadPDF() {
    // use html2canvas
    html2canvas(canvas, {
        onrendered: function (canvas) {
            var imgData = canvas.toDataURL('image/png')
            var doc = new jsPDF()
            doc.addImage(imgData, 'PNG', 10, 10)
            doc.save('myExport.pdf')
        }
    })
}

function saveSvg() {
    var name = 'confusion_matrix.svg'
    svg = d3.select('#heat-chart').select('svg')
    svgEl = svg.node()
    svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    var svgData = svgEl.outerHTML;
    var preface = '<?xml version="1.0" standalone="no"?>\r\n';
    var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}