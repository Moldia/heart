
// THESE ARE NOW IN THE GLOBAL SCOPE
var cookie = sessionStorage['myvariable'],
    localhostFolderCookie = sessionStorage['localhostFolderPath'],
    issFileCookie = sessionStorage['issFilePath'],
    spotsFileCookie = sessionStorage['spotsFilePath'],
    portCookie = sessionStorage['myPort'],
    roiCookie = sessionStorage['roi'],
    tilesCookie = sessionStorage['tilesPath'],
    imageSizeCookie = sessionStorage['imageSizeStr'],
    cellData,
    geneData,
    configSettings;


if (!issFileCookie){ // if you dont have cookie, run the default selection
    console.log('No cookie, starting with default dataset');
    configSettings = config().get('week 4.5')
}
else {
    console.log('Found cookie: ' + cookie);
    configSettings = config().get(cookie)
}
run(configSettings);


function dispatcher(userInputs){
    console.log('Starting '+ userInputs.x);

    //save a cookie
    sessionStorage['myvariable'] = userInputs.x;
    sessionStorage['localhostFolderPath'] = userInputs.localhostPath;
    sessionStorage['myPort'] = userInputs.localhostPort;
    sessionStorage['issFilePath'] = userInputs.issFile;
    sessionStorage['spotsFilePath'] = userInputs.spotsFile;
    sessionStorage['roi'] = userInputs.roiPoints;
    sessionStorage['tilesPath'] = userInputs.tilesRoot;
    sessionStorage['imageSizeStr'] = userInputs.imageSizeStr;

    //reload the page
    location.reload(true);

}


function run(c){
    var cellJson = c.cellData;
    var geneJson = c.geneData;

    if (configSettings.name === 'week 4.5'){
        console.log('config is set to week 4.5')
        console.log('cellJson is ' + cellJson)
        console.log('geneJson is ' + geneJson)
        d3.queue()
        .defer(d3.json, cellJson)
        .defer(d3.json, geneJson)
        .await(splitCharts(c))
    }
    else {
        d3.queue()
        .defer(d3.json, cellJson)
        .defer(d3.csv, geneJson)
        .await(splitCharts(c))
    }

}


function splitCharts(myParam) {
    return (err, ...args) => {

        cellData = args[0];
        geneData = args[1];

        for (i = 0; i < cellData.length; ++i) {
            // make sure Prob and ClassName are arrays
            cellData[i].myProb = Array.isArray(cellData[i].Prob)? cellData[i].Prob: [cellData[i].Prob];
            cellData[i].myClassName = Array.isArray(cellData[i].ClassName)? cellData[i].ClassName: [cellData[i].ClassName];

            cellData[i].Cell_Num = +cellData[i].Cell_Num;
            cellData[i].x = +cellData[i].X;
            cellData[i].y = +cellData[i].Y;
        }

        //render now the charts
        var issData = sectionChart(cellData);
        dapiChart(issData, geneData, myParam);
        landingPoint(configSettings.name)
    }
}

function landingPoint(name){
    console.log(name)
    var coords = getLandingCoords(name)

    var evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: coords.x,
        clientY: coords.y,
        /* whatever properties you want to give it */
    });
    document.getElementById('sectionOverlay').dispatchEvent(evt);
}

//create ramp
function getLandingCellNum(str) {
    return str === '99 gene panel' ? 2279 :
        str === 'week 4.5' ? 2855 :
            str === 'Simulated spots (98 gene panel)' ? 2279 :
                str === 'Simulated spots (62 gene panel)' ? 2279 :
                    str === 'Simulated spots (42 gene panel)' ? 2279 :
                            1;
}


function getLandingCoords(str){
    console.log('Getting the landing cell')
    var cn = getLandingCellNum(str);
    var x,
        y;

    if ( !d3.select('#Cell_Num_' + cn).empty() ){
        x = +d3.select('#Cell_Num_' + cn).attr('cx');
        y = +d3.select('#Cell_Num_' + cn).attr('cy');
    }
    else{
        x = 0;
        y = 0;
    }

    var px = $('#sectionOverlay').offset().left + x;
    var py = $('#sectionOverlay').offset().top + y;

    var out = {x:px, y:py};

    return out
}

function getMinZoom(str) {
    return str === 'default' ? 4 : 2;
}
