


dispatchSearch("blah", "asdf")

function dispatchSearch(type, place){


    d3.json('./dashboard/data/iss.json', function (data) {
        data.forEach(function (d) {
            d.Cell_Num = +d.Cell_Num
            d.y = +d.Y
            d.x = +d.X
            console.log(d.Prob)
        });

        data = sectionChart(data)
        initChart(data);
        console.log("Done!!")
    });


};

