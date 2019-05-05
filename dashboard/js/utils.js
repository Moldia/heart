
function partitioner(d){

    // For small values assign it to a separate class labeled 'Other'
    var datapoint = [];
    var ClassName;
    if (!Array.isArray(d.Prob)){
        //d.Prob can possibly be just a float. Make sure it is an array
        d.Prob = [d.Prob]
    }
    for (var i = 0; i < d.Prob.length; i++) {
        d.Prob[i] < 0.02? ClassName = 'Other': ClassName = d.ClassName[i]
        datapoint.push({
            Prob: d.Prob[i],
            labels: ClassName,
        })
    }

    // group by class name. This will eventually sum all the values that fall in the same class.
    //Hence if there is a class 'Other' then is will be assigned with the grand total
    datapoint =  d3.nest().key(function(d){
        return d.labels; })
        .rollup(function(leaves){
            return d3.sum(leaves, function(d){
                return d.Prob;})
        }).entries(datapoint)
        .map(function(d){
            return { labels: d.key, Prob: d.value};
        });

    // sort in decreasing order
    datapoint.sort(function(x, y){
        return d3.ascending(y.Prob, x.Prob);
    })

    return datapoint;
}



function dispachClick(layer) {
    var evtxClick = new CustomEvent('clickMouse');
    var evtyClick = new CustomEvent('clickMouse');

    document.getElementById("xxValue").value = layer.feature.properties.cx,
        document.getElementById("yyValue").value = layer.feature.properties.cy,
        document.getElementById('xxValue').dispatchEvent(evtxClick),
        document.getElementById('yyValue').dispatchEvent(evtxClick)
    // I think there is a reason in the line above I used evtxClick and NOT evtyClick
    // Something with convenience but there is a potential bug here
    // Why did you do that?? Remember and fix!
}


function dispachCustomEvent(layer) {
    var evtxx = new CustomEvent('moveMouse');
    var evtyy = new CustomEvent('moveMouse');

    //Thats a temp solution to make the scatter chart responsive.
    document.getElementById("xxValue").value = layer.feature.properties.cx,
        document.getElementById("yyValue").value = layer.feature.properties.cy,
        document.getElementById('xxValue').dispatchEvent(evtxx),
        document.getElementById('yyValue').dispatchEvent(evtyy)

}


/**
 * Retrieve the array key corresponding to the largest element in the array.
 *
 * @param {Array.<number>} array Input array
 * @return {number} Index of array element with largest value
 *
 * From https://gist.github.com/engelen/fbce4476c9e68c52ff7e5c2da5c24a28
 */
function argMax(array) {
  return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

/**
 * Removes starting and ending (double) quotes from a string
 * Taken from https://www.webdeveloper.com/d/77256-strip-double-quotes-of-beginning-and-end-of-string
 * @returns {string}
 *
 * Example
 * var str='"hello"'
 * console.log(str.unquoted()));
 */
String.prototype.unquoted = function (){return this.replace (/(^")|("$)/g, '')}