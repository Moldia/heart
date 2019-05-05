function dapi(config) {

    var img = config.imageSize;
    // var img = [
    //     65536, // original width of image
    //     47168 // original height of image
    // ];

    var roi = config.roi;
    // var roi = { //range of interest
    //     x0: 6150,
    //     x1: 13751,
    //     y0: 12987,
    //     y1: 18457
    // };

    a = img[0] / (roi.x1 - roi.x0)
    b = -img[0] / (roi.x1 - roi.x0) * roi.x0
    c = -img[1] / (roi.y1 - roi.y0)
    d = -img[1] / (roi.y1 - roi.y0) * roi.y0 + img[1]

    // This transformation maps a point in pixel dimensions to our user defined roi
    var t = new L.Transformation(a, b, c, d);

    //create color ramp. It would be better to have that in glyphAssignment.js since this is where glyph configuration is set.
    function getColor(y) {
        return y === '0' ? '#FFFFFF' : //hsv: [0 0 1]);
            y === '1' ? '#407F59' :      //hsv: [.4 .5 .5]);
                y === '2' ? '#96B38F' :   //hsv: [.3 .2 .7]);
                    y === '3' ? '#00FF00' :            //hsv: [1/3 1 1]);
                        y === '4' ? '#44B300' :           //hsv: [.27 1 .7]);
                            y === '5' ? '#0000FF' :    //hsv: [2/3 1 1]);
                                y === '6' ? '#00B3FF' :           //hsv: [.55 1 1]);
                                    y === '7' ? '#5C33FF' :         //hsv: [.7 .8 1]);
                                        y === '8' ? '#FF00E6' :           //hsv: [.85 1 1]);
                                            y === '9' ? '#FF0000' :          //hsv: [ 1 1 1]);
                                                y === '10' ? '#FFC700' :           //hsv: [.13 1 1]);
                                                y === '11' ? '#5C33FF' :         //hsv: [.7 .8 1]);
                                                y === '12' ? '#FF00E6' :           //hsv: [.85 1 1]);
                                                    y === '13' ? '#FF0000' :          //hsv: [ 1 1 1]);
                                                        y === '14' ? '#FFC700' :           //hsv: [.13 1 1]);
                                                             y === 'less_active' ? '#995C00' :        //hsv: [.1 1 .6]);
                                                        '#FD6A02';
    }

    function getTaxonomy(gene){
        if(glyphMap.get(gene)){
            out = glyphMap.get(gene).taxonomy
        }
        else {
            out = glyphMap.get('Generic').taxonomy
        }
        return out
    }

    function getGlyphName(gene){
        if(glyphMap.get(gene)){
            out = glyphMap.get(gene).glyphName
        }
        else {
            out = glyphMap.get('Generic').glyphName
        }
        return out
    }

    // get the svg markers
    var glyphs = glyphAssignment();
    var glyphMap = d3.map(glyphs, function (d) {
        return d.gene;
    });

    //get the class colors
    var classColors = classColorsCodes();
    var classColorsMap = d3.map(classColors, function (d) {
        return d.className;
    });

    //calculate radius so that resulting circles will be proportional by area
    function getRadius(y) {
        r = Math.sqrt(y / Math.PI)
        return r;
    }

    var minZoom = getMinZoom(config.name),
        maxZoom = 7;

    // The transformation in this CRS maps the bottom left corner to (0,0) and the top right to (256, 256). (Tiles are assumed to be 256x256)
    // Assuming you are working with 7 zoom levels that means the longest side (height or width, should not matter) of the image is 16384px.
    // The transformation works as explained below:
    // Top left corner    : In d3 this is at (0, 0).         This is mapped to (0, 256)   because X = 1/64*0     + 0 and Y = -1/64*0     + 256
    // Bottom left corner : In d3 this is at (0, 16384).     This is mapped to (0, 0)     because X = 1/64*0     + 0 and Y = -1/64*16384 + 256
    // Bottom right corner: In d3 this is at (16384, 16384). This is mapped to (256, 0)   because X = 1/64*16384 + 0 and Y = -1/64*16384 + 256
    // Top right corner   : In d3 this is at (16384, 0).     This is mapped to (256, 256) because X = 1/64*16384 + 0 and Y = -1/64*0     + 256
    //
    // If you have 8 zoom levels then your longest size of your image is 65536px, ie an 4time increase from 16384 shown above. Hence the denominator
    // in the equations above has to also increase by 4, ie 64 must become 64*4 = 256. The transformation will now be: (1 /256, 0, -1 / 256, 256)
    L.CRS.MySimple = L.extend({}, L.CRS.Simple, {
        transformation: new L.Transformation(1 / 64, 0, -1 / 64, 256),
    });

    var yx = L.latLng;

    var xy = function (x, y) {
        if (L.Util.isArray(x)) { // When doing xy([x, y]);
            return yx(x[1], x[0]);
        }
        return yx(y, x); // When doing xy(x, y);
    };

    var bounds = L.latLngBounds([
        xy(0, 0),
        xy(img)
    ]);


    var map = L.map('mymap', {
        crs: L.CRS.MySimple, // http://leafletjs.com/reference-1.0.3.html#map-crs
        maxBounds: bounds.pad(.5), // http://leafletjs.com/reference-1.0.3.html#map-maxbounds
        minZoom: minZoom,
        maxZoom: maxZoom,
        attributionControl: false,
    }).setView([img[1] / 7, img[0] / 2], 7);

    // //remove the rect from the section chart when you leave the dapi chart
    // map.on('mouseout', hideRect);
    // function hideRect(e){
    //     console.log('Exiting map. Hide rect on section chart')
    //     d3.select('.highlight-rect').attr("x",0)
    //         .attr("y", 0)
    //         .attr("width", 0)
    //         .attr("height",0)
    //         .attr('opacity', 0)
    // }


    var urlStr = config.tiles
    //var urlStr = "./dashboard/data/img/65536px/{z}/{x}/{y}.png"

    var tl = L.tileLayer(urlStr, {
        attribution: 'KDH',
        continuousWorld: false,
        minZoom: minZoom,
        noWrap: true
    }).addTo(map);

    //Minimap plugin magic goes here! Note that you cannot use the same layer object again, as that will confuse the two map controls
    var tlMinimap = L.tileLayer(urlStr, {
        minZoom: 0,
        maxZoom: maxZoom
    });
    var miniMap = new L.Control.MiniMap(tlMinimap, { toggleDisplay: true }).addTo(map);

    //Add fullscreen button
    map.addControl(new L.Control.Fullscreen());


    // Looks a bit confusing this one. Why am I using nest?
    // I think I did this for future use.
    // For now, it is not getting used whatsoever, I could have equally
    // used a flat array, not a nested one.
    function make_dots(data) {
        var arr = [];
        var nest = d3.nest()
            .key(function (d) {
                return Math.floor(d.Expt / 10);
            })
            .entries(data);

        for (var k = 0; k < nest.length; ++k) {
            arr[k] = helper(nest[k].values);
        }
        return arr;
    }

    function getNeighbours(neighbour_array, neighbour_prob) {
        var data = [];
        if (neighbour_array) {
            for (var i = 0; i < neighbour_array.length; i++) {
                data.push({
                    Cell_Num: +neighbour_array[i],
                    Prob: +neighbour_prob[i],
                })
            }

            // Sort now in decreasing order.
            data.sort(function(x, y){return d3.ascending(y.Prob, x.Prob)})
        }
        else {
            data.push({
                Cell_Num: null, // null or NaN ?
                Prob: null,
                }
            )
        }

        return data
    }

    function helper(data) {
        var dots = {
            type: "FeatureCollection",
            features: []
        };
        for (var i = 0; i < data.length; ++i) {
            x = data[i].x;
            y = data[i].y;
            gene = data[i].Gene;
            //console.log(gene)
            var lp = t.transform(L.point([x, y]));
            var g = {
                "type": "Point",
                "coordinates": [lp.x, lp.y]
            };

            //create feature properties
            var p = {
                "id": i,
                "x": x,
                "y": y,
                "Gene": gene,
                "taxonomy": getTaxonomy(gene),
                "glyphName": getGlyphName(gene),
                "glyphColor": getColor(gene),
                //"popup": label + " " + i,
                "size": 30,
                "type": 'gene',
                "neighbour": parseFloat(data[i].neighbour), // why you are using parseFloat?? Cant remember why I did this!
                "neighbours": getNeighbours(data[i].neighbour_array,  data[i].neighbour_prob),
            };

            //create features with proper geojson structure
            dots.features.push({
                "geometry": g,
                "type": "Feature",
                "properties": p
            });
        }
        return dots;
    }

    function makeCellFeatures(data) {
        var dots = {
            type: "FeatureCollection",
            features: []
        };
        for (var i = 0; i < data.length; ++i) {
            x = data[i].x;
            y = data[i].y;
            var lp = t.transform(L.point([x, y]));
            var g = {
                "type": "Point",
                "coordinates": [lp.x, lp.y]
            };

            //create feature properties
            var p = {
                "id": i,
                "Cell_Num": data[i].Cell_Num,
                "Genenames": data[i].Genenames,
                "CellGeneCount": data[i].CellGeneCount,
                "ClassName": data[i].ClassName,
                "Prob": data[i].Prob,
                "x": x,
                "y": y,
                "cx": data[i].cx,
                "cy": data[i].cy,
                "popup": "Cell " + i,
                "size": 30,
                "type": 'cell',
            };

            //create features with proper geojson structure
            dots.features.push({
                "geometry": g,
                "type": "Feature",
                "properties": p
            });
        }
        return dots;
    }


    function makePolygonFeatures(data) {
        var out = {
            type: "FeatureCollection",
            features: []
        };
        for (var i = 0; i < data.length; ++i) {
            var g = {
                "type": "Polygon",
                "coordinates": [data[i]]
            };

            //create feature properties
            var p = {
                "id": i, //just a basic one, something like a placeholder
            };

            //create features with proper geojson structure
            out.features.push({
                "geometry": g,
                "type": "Feature",
                "properties": p
            });
        }
        return out;
    }

    function makeLineStringFeatures(destination, origin) {
        var fromPoint = origin.generator;
        var out = {
            type: "FeatureCollection",
            features: []
        };
        for (var i = 0; i < destination.length; ++i) {
            var spot = destination[i]
            var x = +spot.x,
                y = +spot.y,
                gene = spot.Gene,
                lp = t.transform(L.point([x, y])),
                toPoint = [lp.x, lp.y];
            var g = {
                "type": "LineString",
                "coordinates": [fromPoint, toPoint]
            };

            //create feature properties
            var p = {
                "gene": gene,
                "Cell_Num": origin.Cell_Num,
                "fromPoint": fromPoint,
                "toPoint": toPoint,
                "color": getColor(glyphMap.get(gene).taxonomy),
            };

            //create features with proper geojson structure
            out.features.push({
                "geometry": g,
                "type": "Feature",
                "properties": p
            });
        }
        return out;
    }


    // control that shows state info on hover
    var info = L.control({
        position: 'bottomleft'
    });

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    function infoMsg(cellFeatures) {
        var str1 = '</div></td></tr><tr class><td nowrap><div><b>';
        var str2 = '&nbsp </b></div></td><td><div>';
        var out = '';
        var temp = [];
        var sdata = [];
        if (cellFeatures) {
            for (var i = 0; i < cellFeatures.ClassName.length; ++i) {
                temp.push({
                    ClassName: cellFeatures.ClassName[i].trim(),
                    IdentifiedType: classColorsMap.get(cellFeatures.ClassName[i].trim()).IdentifiedType,
                    Prob: cellFeatures.Prob[i],
                })
            }

            temp = d3.nest()
                .key(function (d) {
                    return d.IdentifiedType;
                })
                .rollup(function (leaves) {
                    return d3.sum(leaves, function (d) {
                        return d.Prob;
                    })
                }).entries(temp)
                .map(function (d) {
                    return {IdentifiedType: d.key, Prob: d.value};
                });

            // sort in decreasing order
            temp.sort(function (x, y) {
                return d3.ascending(y.Prob, x.Prob);
            })

            for (var i = 0; i < temp.length; i++) {
                out += str1 + temp[i].IdentifiedType + str2 +
                    Math.floor(temp[i].Prob * 10000) / 100 + '%'
            }
        }
        else {
            // do nothing
        }
        ;

        return out;

    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (cellFeatures) {
        var msg = infoMsg(cellFeatures);
        this._div.innerHTML = '<h4>Nearest Cell Info</h4>' + (cellFeatures ?
                '<table style="width:110px;">' +
                '<tbody><tr style="width:110px; border-bottom:1px solid Black; font-weight: bold"><td><div><b>Class </b></div></td><td><div> Prob' +
                msg +
                '<tbody><tr style="width:110px; border-top:1px solid black;"><td><div><b>Cell Num: </b></div></td><td><div>' + cellFeatures.Cell_Num +
                '</div></td></tr></tbody></table>' :
                '<b>Hover around  a cell</b>'

        );
    };


    // //calculate radius so that resulting circles will be proportional by area
    // function getRadius(y) {
    //     r = Math.sqrt(y / Math.PI)
    //     return r;
    // }

    // This is very important! Use a canvas otherwise the chart is too heavy for the browser when
    // the number of points is too high, as in this case where we have around 300K points to plot
    var myRenderer = L.canvas({
        padding: 0.5,
    });

    //create style, with fillColor picked from color ramp
    function style(feature) {
        return {
            radius: getRadius(feature.properties.size),
            shape: feature.properties.glyphName,
            //fillColor: "none",//getColor(feature.properties.taxonomy),
            color: getColor(feature.properties.taxonomy),
            weight: 1,
            opacity: 1,
            fillOpacity: 0.0,
            renderer: myRenderer,
        };
    }







    ////////////////////////////////////////////////////////////////////////////
    // FlyTo
    ////////////////////////////////////////////////////////////////////////////
    var fly1 = document.getElementById("xValue");
    var fly2 = document.getElementById("yValue");
    //var container = document.getElementById("container");

    fly1.addEventListener("change", function (event) {
        event.preventDefault();
        x = +document.getElementById("xValue").value
        y = +document.getElementById("yValue").value
        p = t.transform(L.point([x, y]));
        //p = xy(project([x, y], img, grid))

        if ((x === x) && (y === y)){
            map.flyTo([p.y, p.x], 5);
        }
        // Note:
        // Since NaN is the only JavaScript value that is treated as unequal to itself, you can always test if a value is NaN by checking it for equality to itself:
        // From https://stackoverflow.com/questions/2652319/how-do-you-check-that-a-number-is-nan-in-javascript
    });

    fly2.addEventListener("change", function (event) {
        event.preventDefault();
        x = +document.getElementById("xValue").value
        y = +document.getElementById("yValue").value
        p = t.transform(L.point([x, y]));
        //p = xy(project([x, y], img, grid))
        if ((x === x) && (y === y)){
            map.flyTo([p.y, p.x], 5);
        }
    });


    // Why am I still carrying all these key/values pairs. Only a few are needed by the dapiChart function.
    dapiData = {};
    dapiData.img = img;
    dapiData.t = t;
    dapiData.getColor = getColor;
    dapiData.classColors = classColors;
    dapiData.classColorsMap = classColorsMap;
    dapiData.glyphs = glyphs;
    dapiData.glyphMap = glyphMap;
    dapiData.getRadius = getRadius;
    dapiData.map = map;
    dapiData.makeCellFeatures = makeCellFeatures;
    dapiData.makePolygonFeatures = makePolygonFeatures;
    dapiData.makeLineStringFeatures = makeLineStringFeatures;
    dapiData.make_dots = make_dots;
    dapiData.info = info;
    // dapiData.getRadius = getRadius;
    dapiData.myRenderer = myRenderer;
    dapiData.style = style;
    // dapiData.highlightStyle = highlightStyle;
    // // dapiData.clickDot = clickDot;
    // dapiData.highlightDot = highlightDot;
    // dapiData.resetDotHighlight = resetDotHighlight;
    // dapiData.onEachDot = onEachDot;

    return dapiData
}

var dapiConfig;
function dapiChart(cellData, geneData, config) {
    console.log('Doing Dapi plot')


    dapiConfig = dapi(config)
    var map = dapiConfig.map;
    var zoomLevel;
    // mapOnDapi = dapiConfig.map;

    map.on('mouseout', outsideMap)
    map.on('mouseover', insideMap)
    var isInside = true

    function resetSectionRect(){
        d3.select('.highlight-rect')
            .attr("width", 0)
            .attr("height",0)
            .attr('opacity', 0)

    }

    function styleSectionRect(x,y){
        var width = 35*1.6;
        var height = 35;
        d3.select('.highlight-rect')
            .attr("x", x-width/2)
            .attr("y", y-height/2)
            .attr("width", width)
            .attr("height",height)
            .attr('fill', 'orange')
            .attr('fill-opacity', 0.5)
            .attr('opacity', 1)
            .attr('stroke', 'red')
            // .attr('stroke-dasharray', '10,5')
            // .attr('stroke-linecap', 'butt')
            .attr('stroke-width', '3')
    }

    function outsideMap(e){
        resetSectionRect()
        console.log('triggering mouseout event')
    }

    function insideMap(e){
        console.log('triggering mouseover event')

        // // make sure map is clear of voronoi markers when you enter the map
        // try {
        //     dapiConfig.map.removeLayer(voronoiMarker)
        // }
        // catch(err) {
        //     // do nothing
        // }
    }

    // var genes = d3.map(geneData, function (d) {return d.Gene;}).keys();
    var myDots = dapiConfig.make_dots(geneData);

    // Define an array to keep layers
    var dotlayer = [];

    // specify popup options
    var customOptions = {
            'className' : 'popupCustom'
    };

    //create marker layer and display it on the map
    for (var i = 0; i < myDots.length; i += 1) {
        dotlayer[i] = L.geoJson(myDots[i], {
            pointToLayer: function (feature, latlng) {
                return new svgGlyph(latlng, dapiConfig.style(feature, 'gene'))
                                .bindTooltip(feature.properties.Gene, {className: 'myCSSClass'})
            },
            onEachFeature: onEachDot
        });
    }


    function onEachDot(feature, layer) {
        layer.on({
            mouseover: glyphMouseOver, // highlightDot,
            mouseout: glyphMouseOut, //resetDotHighlight,
            click: clickGlyph,
            popupopen: onPopupOpen,
        });
        if (feature.properties.neighbour){
            layer.bindPopup(spotPopup, customOptions)
        }

    }

    function onPopupOpen(e) {
        // show the popup only at the deepest zoom level
        if ( zoomLevel < dapiConfig.map.getMaxZoom() ) {
        this.closePopup();
      }
    }

    function glyphMouseOver(e){
        // 1. hightlight glyph
        highlightDot(e)
        // 2. Highlight the voronoi generator
        var point = voronoiHighlight(e);
        // 3. Update the info control
        dapiConfig.info.update(point.properties);
        console.log("updating info control");
        // 4. Highlight the rect on the section chart
        rectHighlight(e)

        // 5. Show the coordinates control
        $('.uiElement.label').show()
    }

    function glyphMouseOut(e){
        resetDotHighlight(e)
        if (voronoiMarker) {
            map.removeLayer(voronoiMarker)
        }
    }

    //create highlight style, with darker color and larger radius
    function highlightStyle(feature) {
        return {
            radius: dapiConfig.getRadius(feature.properties.size) * 2,
            fillColor: "#FFCE00",
            color: "#FFCE00",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.9
        };
    }


    function clickGlyph(e) {
        console.log('glyph clicked')
        zoomLevel = dapiConfig.map.getZoom()
        // 1.
        if (zoomLevel < dapiConfig.map.getMaxZoom()){
            // do not fit the bounds if you are in the deepest zoom level
            fitBounds(e)
        }

        // 2.
        updateDashboard(point.properties)

        // voronoiHighlight(e)
        var layer = e.target;
        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }

        console.log('Current zoom level is: ' + dapiConfig.map.getZoom())

    }

    function fitBounds(e){
        var idx = delaunay.find(e.latlng.lng, e.latlng.lat);
        point = cellFeatures[idx];
        var polyBounds = L.polygon(voronoi.cellPolygon(idx)).getBounds()
        var checkMe = polyBounds
        // Dont know why, but you have to swap the coordinates
        polyBounds._northEast = new L.LatLng(polyBounds._northEast.lng, polyBounds._northEast.lat)
        polyBounds._southWest = new L.LatLng(polyBounds._southWest.lng, polyBounds._southWest.lat)

        map.fitBounds(polyBounds);
    }

    //attach styles and popups to the marker layer
    function highlightDot(e) {
        var layer = e.target;
        dotStyleHighlight = highlightStyle(layer.feature);
        layer.setStyle(dotStyleHighlight);
        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }

        if (layer.feature.properties.type === "cell") {
            console.log('updating info...');
            info.update(layer.feature.properties);
            dispachCustomEvent(layer);
        }
        else {
            console.log("I am not hovering over a cell");
        }
    }


    function resetDotHighlight(e) {

        var layer = e.target;
        dotStyleDefault = dapiConfig.style(layer.feature);
        layer.setStyle(dotStyleDefault);

        if (layer.feature.properties.type === "cell"){
            console.log('resetting info...')
            info.update()

        }else{
            console.log("I am not hovering over a cell");
        }
    }



    // Keep these layers on a single layer group and call this to add them to the map
    var lg = new L.LayerGroup();

    function addLayers() {
        $('#pleasewait').show();
        setTimeout(function () {
            $('#pleasewait').hide();

            for (var i = 0; i < myDots.length; i += 1) {
                lg.addLayer(dotlayer[i]);
            }
            ;
            lg.addTo(map);

        }, 500);
    }

    // Call this to clear chart from the layers grouped together on the layer group
    function removeLayers() {
        $('#pleasewait').show();
        setTimeout(function () {
            $('#pleasewait').hide();
            lg.clearLayers();
        }, 500);
//            $('#pleasewait').hide();
    }

    //add now the grouped layers to the map
    addLayers()


    //Now add the info control  to map
    dapiConfig.info.addTo(map);

    // Plot now the cells
    var cellDots = dapiConfig.makeCellFeatures(cellData);
    var cellFeatures = cellDots.features;
    // var fc = turf.featureCollection(cellFeatures)
    // var cellLayer = L.geoJSON(fc, {
    //     pointToLayer: function (feature, latlng){
    //         return L.circleMarker(latlng, dapiConfig.style(feature, 'cell'));
    //     },
    //     //onEachFeature: dapiConfig.onEachDot
    // }).addTo(map);


    //var cl = L.control.layers(null, {}).addTo(map);


    // // Lets remove that for now, will come back later
    // var cl = L.control.layers(null, {}).addTo(map);
    // for (j = 0; j < dotlayer.length; j += 1) {
    //     var name = "Group " + j + "0-" + j + "9";
    //     cl.addOverlay(dotlayer[j], name);
    // }
    // cl.addOverlay(cellLayer, "Cells");
    // cl.addOverlay(voronoiLayer, "Voronoi Polygons");


    // Voronoi
    // var voronoiPolygons = turf.voronoi(fc, {bbox: [0, 0, dapiConfig.img[0], dapiConfig.img[1]]});

    // Alternative way to calc voronois
    var myDelaunayPoints = []
    for (i = 0; i < cellFeatures.length; ++i) {
        myDelaunayPoints[i] = cellFeatures[i].geometry.coordinates
    }

    var delaunay = d3.Delaunay.from(myDelaunayPoints);
    var voronoi = delaunay.voronoi([0, 0, dapiConfig.img[0], dapiConfig.img[1]]);
    var voronoiArray = Array.from(voronoi.cellPolygons())
    var voronoiPolygons = dapiConfig.makePolygonFeatures(voronoiArray)
   
    // // *** *** *** *** *** *** *** *** *** *** *** ***

    function getCellMembers(arr, val) {
        var out = [], i;
        for(i = 0; i < arr.length; i++)
            if (parseFloat(arr[i].neighbour) === val)
                out.push(arr[i]);
        return out;
    }

    // //push the features of the cells to polygons
    console.log(voronoiPolygons.features.length)
    console.log(cellFeatures.length)
    for (i = 0; i < cellFeatures.length; ++i) {
        voronoiPolygons.features[i].properties = cellDots.features[i].properties;
        voronoiPolygons.features[i].properties.generator = cellDots.features[i].geometry.coordinates;
    }

    var voronoiLayer = L.geoJSON(voronoiPolygons, {
        style: function (feature) {
            return {
                weight: 0.0, // Voronoi not visible, useful only for navigation purposes
                color: 'tomato',
                opacity: 0.5,
                fill: false,
                dashArray: "4 1",
                renderer: dapiConfig.myRenderer,
            };
        },
        onEachFeature: function (feature, layer) {
            layer.on(
                {
                    'mouseover': VoronoiMouseover,
                    'mouseout': VoronoiMouseout,
                    'click': clickHandler,
                    // 'add': function(e){console.log('add pressed')},
                    // 'remove': function(e){console.log('remove pressed')},
                }
            );//close bracket
        }
    }).addTo(map);


    var lineStrings,
        pinnedLineStrings;
    function clickHandler(e) {
        console.log('Voronoi was clicked');
        map.fitBounds(e.target.getBounds());
        pinnedLineStrings = toggleLineStrings(e)
        updateDashboard(e.target.feature.properties)
    }

    function toggleLineStrings(e){
        var cn = e.target.feature.properties.Cell_Num;
        if(pinnedLineStrings){
            map.removeLayer(pinnedLineStrings)
        }
        else{
            pinnedLineStrings = drawPinnedLines(e)
            return pinnedLineStrings
        }
    }

    function drawLines(e){
        console.log('in drawLines')
        var center = e.target.feature.properties;
        var spots = getCellMembers(geneData, center.Cell_Num);
        var lineFeatureCollection = dapiConfig.makeLineStringFeatures(spots, center);

        lineStrings = L.geoJSON(lineFeatureCollection, {
            onEachFeature: onEachLineFeature
        }).addTo(map);
        return lineStrings
    }

    function drawPinnedLines(e){
        console.log('in drawLines')
        var center = e.target.feature.properties;
        var spots = getCellMembers(geneData, center.Cell_Num);
        var lineFeatureCollection = dapiConfig.makeLineStringFeatures(spots, center);

        pinnedLineStrings = L.geoJSON(lineFeatureCollection, {
            onEachFeature: onEachLineFeature
        }).addTo(map);
        return pinnedLineStrings
    }

    map.createPane("lineStringPane").style.zIndex = 200
    function onEachLineFeature(feature, layer) {
        if (layer instanceof L.Polyline) {
            layer.setStyle({
                'color': feature.properties.color,
                'weight': 1.5,
                'pane': 'lineStringPane',
                //'opacity':0.5,
            });
        }
        // // This is where it loop through your features
        // if (feature.properties) {
        //     console.log('in features')
        //     // If there is a properties document we bind a tooltip with your property : name
        //     //layer.bindTooltip(feature.properties.name);
        // }
    }


    function VoronoiMouseover(e) {
        var point;
        // 1. Highlight the voronoi generator
        point = voronoiHighlight(e);
        // 2. Update the info control
        dapiConfig.info.update(point.properties);
        console.log("updating info control");
        // 3. Highlight the rect on the section chart
        rectHighlight(e)
        // 4. Draw the lines connecting the cell to the spots
        drawLines(e)

        // 5. Show the coordinates control
        $('.uiElement.label').show()
    }

    function voronoiHighlight(e) {
        var myMouseCoords = dapiData.t.untransform(L.point([e.latlng.lng, e.latlng.lat]))
        // console.log("Current position: x: " + e.latlng.lng + ", y: " + e.latlng.lat);
        console.log("Current_position: x: " + myMouseCoords.x + ", y: " + myMouseCoords.y);
        var idx = delaunay.find(e.latlng.lng, e.latlng.lat);
        point = cellFeatures[idx];

        console.log("do voronoiHighlight");
        if(this.voronoiMarker){
            // that removes the voronoi marker but also the tooltip from the section chart.
            // Both are created when page first loads
            this.voronoiMarker.remove();
            tooltip.style.opacity = 0.0;
        }
        styleVoronoiMarkers(point);

        return point
    }

    function rectHighlight(e){
        // Look up and interact with section chart
        // var cn = point.properties.Cell_Num ;
        if ( sectionFeatures.scale ){
            var xVal = sectionFeatures.scale.x(point.properties.x)
            var yVal = sectionFeatures.scale.y(point.properties.y)
            // var xVal = +d3.select('#Cell_Num_' + cn).attr('cx');
            // var yVal = +d3.select('#Cell_Num_' + cn).attr('cy');

            console.log("Styling rect on section chart");
            styleSectionRect(xVal, yVal)
        }
        else{
            console.log('Cannot find coordinates on the section chart')
        }
    };

    var voronoiMarker
    var styleVoronoiMarkers = function (point) {
        var p = point.geometry.coordinates
        voronoiMarker = L.circleMarker([p[1], p[0]], {
            radius: 15,
            fillColor: "orange",
            color: "red",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5,
            interactive: false,
        }).addTo(map);

    }

    function VoronoiMouseout(e){
        console.log('exiting voronoi...')

        // remove the voronoi marker as well
        if (voronoiMarker) {
            // 1. remove the voronoi generator
            map.removeLayer(voronoiMarker)
            console.log('Voronoi marker removed')

            // 2. clear now the info control
            console.log('resetting info...')
            dapiConfig.info.update()

            // 3. reset the rect on the section chart
            // resetSectionRect(e)

            // 4. remove lineStrings
            if (lineStrings){
                map.removeLayer(lineStrings);
            }

            // 5. hide the coordinates control
            $('.uiElement.label').hide()

            //just a blank line
            console.log('')

        }
    }

    // Add now the polylines
    // var spots = dapiConfig.makeLineStringFeatures(geneData);

    // L.geoJSON(spots, {
    //     //onEachFeature: onEachLineFeature
    // }).addTo(map);






    // Toggle button to turn layers on and off
    var customControl = L.Control.extend({
        options: {
            position: 'topright'
        },

        onAdd: function (map) {
            var container = L.DomUtil.create('input');
            container.type = "button";
            container.title = "Toggle genes on/off";
            container.value = "Hide genes";

            container.style.backgroundColor = 'white';
            container.style.backgroundSize = "80px 30px";
            container.style.width = '80px';
            container.style.height = '30px';


            function toggle(button) {
                if (button.value == "Hide genes") {
                    button.value = "Show genes"
                    button.innerHTML = "Show genes"
                    removeLayers();
                } else if (button.value == "Show genes") {
                    button.value = "Hide genes"
                    button.innerHTML = "Hide genes"
                    addLayers();
                }
            }

            container.onmouseover = function () {
                container.style.backgroundColor = 'pink';
            }
            container.onmouseout = function () {
                container.style.backgroundColor = 'white';
            }

            container.onclick = function () {
                toggle(this);
                console.log('buttonClicked');
            }


            return container;
        }
    });
    //map.addControl(new customControl());


    // toggle button (again)
    // Toggle button to turn layers on and off
    // you may also want to try this one: http://www.bootstraptoggle.com/
    var switchControl = L.Control.extend({
        options: {
            position: 'topright'
        },

        onAdd: function (map) {
            var container = L.DomUtil.create('div');
            container.setAttribute('rel', 'tooltip');
            container.setAttribute('data-placement', 'bottom');
            container.title = "Show genes?";
            //container.style = "width: 100px";

            // Use a child input.
            var input = L.DomUtil.create('input');
            input.type = "checkbox";
            input.title = "Some title";
            input.value = "On";
            // Insert the input as child of container.
            container.appendChild(input);


            function toggle(event) {
                if (event.target.checked === false) {
//                    button.value="Show genes"
//                    button.innerHTML="Show genes"
                    removeLayers();
                } else if (event.target.checked === true) {
//                    button.value="Hide genes"
//                    button.innerHTML="Hide genes"
                    addLayers();
                }
            }

            jQuery(input).bootstrapSwitch({
                size: 'mini',
                state: true,
                onText: 'Yes',
                offText: 'No',
                // http://bootstrapswitch.site/options.html
                onSwitchChange: function (event) {
                    console.log('buttonClicked', event.target.checked);
                    toggle(event);
                }
            });

            return container;
        }
    });
    map.addControl(new switchControl());


    // make placeholder for the spinner gif
    function addControlPlaceholders(map) {
        var corners = map._controlCorners,
            l = 'leaflet-',
            container = map._controlContainer;

        function createCorner(vSide, hSide) {
            var className = l + vSide + ' ' + l + hSide;
            corners[vSide + hSide] = L.DomUtil.create('div', className, container);
        }

        createCorner('verticalcenter', 'left');
        createCorner('verticalcenter', 'right');
        createCorner('verticalcenter', 'horizontalcenter');
        createCorner('bottom', 'horizontalcenter');

    }

    addControlPlaceholders(map);


    // Do the spinner control
    var spinnerControl = L.Control.extend({
        options: {position: 'verticalcenterhorizontalcenter'},

        onAdd: function (map) {

            var container = L.DomUtil.create('div');
            container.id = "pleasewait";
            container.style = "display: none";

            var img = L.DomUtil.create('img');
            img.src = "./dashboard/data/img/spinner.gif";

            container.appendChild(img);

            return container;
        }
    });
    map.addControl(new spinnerControl());


    // Patch first to avoid longitude wrapping.
    L.Control.Coordinates.include({
        _update: function (evt) {
            var pos = evt.latlng,
                opts = this.options;
            if (pos) {
                //pos = pos.wrap(); // Remove that instruction.
                // Get the mouse location in actual coordinates and then express it as a latLng object
                var coords = dapiData.t.untransform(L.point([pos.lng, pos.lat])),
                    pos = L.latLng(coords.y, coords.x)
                this._currentPos = pos;
                this._inputY.value = L.NumberFormatter.round(pos.lng, opts.decimals, opts.decimalSeperator);
                this._inputX.value = L.NumberFormatter.round(pos.lat, opts.decimals, opts.decimalSeperator);
                this._label.innerHTML = this._createCoordinateLabel(pos);
            }
        }
    });

    L.control.coordinates({
	position:"bottomhorizontalcenter", //optional default "bootomright"
	decimals:0, //optional default 4
	decimalSeperator:".", //optional default "."
	labelTemplateLat:"y: {y}", //optional default "Lat: {y}"
	labelTemplateLng:"x: {x}", //optional default "Lng: {x}"
	enableUserInput:true, //optional default true
	useDMS:false, //optional default false
	useLatLngOrder: false, //ordering of labels, default false-> lng-lat
	markerType: L.marker, //optional default L.marker
	markerProps: {}, //optional default {},
	// labelFormatterLng : function(lng){return lng+" lng"}, //optional default none,
	// labelFormatterLat : function(lat){return lat+" lat"}, //optional default none
	// customLabelFcn: function(latLonObj, opts) { "Geohash: " + encodeGeoHash(latLonObj.lat, latLonObj.lng)} //optional default none
    }).addTo(map);

    // Hide the coordinates control when the chart first loads up
    $('.uiElement.label').hide()
}

