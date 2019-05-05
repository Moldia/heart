function renderDataTable(d) {

        
    var mydata = [];
    var mydata2 = [];

    var str = "<strong>Cell Num: </strong>" + d.Cell_Num +
        ",  (<strong>x, y</strong>): (" + d.x.toFixed(2) + ", " + d.y.toFixed(2) + ")";
    document.getElementById('dtTitle').innerHTML = str;
    var n = d3.max([d.CellGeneCount.length, d.Genenames.length]);
    for (i = 0; i < n; i++) {
        mydata.push({
            "Genenames": (d.Genenames[i] === undefined) ? "" : d.Genenames[i],
            "CellGeneCount": (d.CellGeneCount[i] === undefined) ? "" : d.CellGeneCount[i],
        })
    }

    var n = d3.max([d.ClassName.length, d.Prob.length]);
    for (i = 0; i < n; i++) {
        mydata2.push({
            "ClassName": (d.ClassName[i] === undefined) ? "" : d.ClassName[i],
            "Prob": (d.ClassName[i] === undefined) ? "" : (!Array.isArray(d.Prob)) ? [d.Prob] : d.Prob[i], // d.Prob can be just a float, make sure it is an array
        })
    }


    // check if a there is a reference to a datatable.
    // If yes, refresh with the new data
    // Otherwise create and populate a datatable
    if ($.fn.dataTable.isDataTable('#dtTable')) {
        table = $('#dtTable').DataTable();
        table.clear().rows.add(mydata).draw();
    } else {
        table = $('#dtTable').DataTable({
            //bFilter: false,
            "lengthChange": false,
            searching: false,
            //"scrollY":        "200px",
            //"scrollCollapse": true,
            "paging": true,
            //dom: 't',

            "data": mydata,
            "columns": [
                    {
                        title: "Gene Names",
                        data: "Genenames"
                    },
                    {
                        title: "Cell Gene Count",
                        data: "CellGeneCount"
                    },
                ],
        });

    }


    if ($.fn.dataTable.isDataTable('#dtTable2')) {
        table2 = $('#dtTable2').DataTable();
        table2.clear().rows.add(mydata2).draw();
    } else {
        table2 = $('#dtTable2').DataTable({
            //bFilter: false,
            "lengthChange": false,
            searching: false,
            //"scrollY":        "200px",
            //"scrollCollapse": true,
            "paging": true,
            //dom: 't',
            "data": mydata2,
            "columns": [
                {
                    title: "Class Name",
                    data: "ClassName"
                            },
                {
                    title: "Prob",
                    data: "Prob"
                            },
                          ]
        });
    }

    // Sort by column 1 and then re-draw
    table
        .order([1, 'desc'])
        .draw();

    table2
        .order([1, 'desc'])
        .draw();


}
