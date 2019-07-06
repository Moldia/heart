

function config(){
    var ini = [
        {
            name: 'week 4.5',
            roi: {x0: 0, x1: 12358, y0: 0, y1: 13178},
            imageSize: [15365, 16384],
            cellData: './dashboard/data/img/week4.5/json_subset/iss.json',
            geneData: './dashboard/data/img/week4.5/json_subset/Dapi_overlays.json',
            tiles: './dashboard/data/img/week4.5/week4.5_zoom7/{z}/{x}/{y}.png'
        },
        {
            name: 'week 6.5_1',
            roi: {x0: 0, x1: 18231, y0: 0, y1: 16876},
            imageSize: [16384, 15166],
            cellData: './dashboard/data/img/week6.5_1/iss.json',
            geneData: './dashboard/data/img/week6.5_1/Dapi_overlays.json',
            tiles: './dashboard/data/img/week6.5_1/week6.5_1_zoom7/{z}/{x}/{y}.png'
        },        {
            name: 'week 6.5_2',
            roi: {x0: 0, x1: 16510, y0: 0, y1: 18819},
            imageSize: [14374, 16384],
            cellData: './dashboard/data/img/week6.5_2/iss.json',
            geneData: './dashboard/data/img/week6.5_2/Dapi_overlays.json',
            tiles: './dashboard/data/img/week6.5_2/week6.5_2_zoom7/{z}/{x}/{y}.png'
        },

    //    {
    //         name: 'User defined',
    //         roi: roiCookie? JSON.parse(roiCookie):'', // roiCookie has to be a string of this form: {"x0": 6150, "x1": 13751, "y0": 12987, "y1": 18457}. Note the inner double quotes!!!
    //         imageSize: imageSizeCookie? JSON.parse(imageSizeCookie):'', //[16384, 11791],
    //         cellData: issFileCookie,   // read that from a cookie
    //         geneData: spotsFileCookie, // and this one, comes from a cookie too
    //         tiles: tilesCookie + '/{z}/{x}/{y}.png' // and that one as well!
    //     },
    ];
    var out = d3.map(ini, function (d) {return d.name;});
    return out
}
