function renderHeatmapTab(selected) {

    'hide the toolip raised by the section chart'
    d3.select('#tooltip').style('opacity', 0)

    var radioButton,
        checkBox0,
        checkBox1,
        checkBox2,
        json;

    radioButton = selected; // mean or median?
    json = "./notebooks/confusionMatrixData.json"

    if (document.getElementById('genes42').checked) {
        checkBox0 = '42genes'
    } else if (document.getElementById('genes62').checked) {
        checkBox0 = '62genes'
    } else {
        checkBox0 = '98genes'
    }

    if (document.getElementById('nonNeurons').checked) {
        checkBox1 = 'nonNeuronsOn'
    } else {
        checkBox1 = 'nonNeuronsOff'
    }


    if (document.getElementById('rangeDomain').checked) {
        checkBox2 = 'rangeDomainOn'
    } else {
        checkBox2 = 'rangeDomainOff'
    }

    var confMatrixjson = '.\\notebooks\\jsonFiles\\' + checkBox0 +
        '\\' + checkBox2 +
        '\\' + radioButton +
        '\\' + checkBox1 +
        '\\' + 'confusionMatrix.json';
    console.log('Pushing ' + confMatrixjson + ' in confusion matrix')
    d3.json(confMatrixjson, function (data) {
        dataset = []
        for (var i = 0; i < data.index.length; i++) {
            // console.log(' i: ', i)
            for (var j = 0; j < data.columns.length; j++) {
                // console.log('i: ' + i + ' j: ' + j + ' value: ' + data.data[i][j])
                dataset.push({
                    xKey: i + 1,
                    xLabel: data.index[i],
                    yKey: j + 1,
                    yLabel: data.columns[j],
                    val: +data.data[i][j],
                })
            }
        }
        console.log('json parsed!!');
        renderHeatmap(dataset);
    });
}


var sectionChartFilters = document.getElementById('section-chart-controls');
var checkItAll = sectionChartFilters.querySelector('input[name="cb:select-all"]');
var clearItAll = sectionChartFilters.querySelector('input[name="cb:clear-all"]');
var inputs = sectionChartFilters.querySelectorAll('tbody>tr>td>input:not([name="cb:select-all"]):not([name="cb:clear-all"])');
var other = sectionChartFilters.querySelector('input[name="cb:other"]');


inputs.forEach(function (input) {
    input.addEventListener('change', function () {
        // first of all, hide the existing tooltip
        d3.select('#tooltip').style('opacity', 0);

        if (!this.checked) {
            checkItAll.checked = false;
            checkItAll.disabled = false;
        }
        if (this.checked) {
            clearItAll.checked = false;
            clearItAll.disabled = false;
        }
        if (!checkItAll.checked) {
            var allChecked = true;
            for (var i = 0; i < inputs.length; i++) {
                if (!inputs[i].checked) {
                    allChecked = false;
                }
            }

            if (allChecked) {
                checkItAll.checked = true;
                checkItAll.disabled = true;
                clearItAll.disabled = false;
                clearItAll.checked = false;
            }
        }

        var selected = getSelected(inputs),
            filteredSectionData = cellData.filter(function (el) {
                var it = selected.includes(el.managedData.IdentifiedType);
                if (input.name === 'Other') {
                    return !it
                } else {
                    return it
                }
            });
        sectionChart(filteredSectionData)
    });

});


checkItAll.addEventListener('change', function () {
    // first of all, hide the existing tooltip
    d3.select('#tooltip').style('opacity', 0);

    inputs.forEach(function (input) {
        input.checked = checkItAll.checked;
    });
    checkItAll.disabled = true;
    clearItAll.disabled = false;
    clearItAll.checked = false;

    var selected = getSelected(inputs),
        filteredSectionData = cellData.filter(function (el) {
            return selected.includes(el.managedData.IdentifiedType);
        });
    sectionChart(filteredSectionData)
});


clearItAll.addEventListener('change', function () {
    // first of all, hide the existing tooltip
    d3.select('#tooltip').style('opacity', 0);

    inputs.forEach(function (input) {
        input.checked = !clearItAll.checked;
    });
    checkItAll.checked = false;
    checkItAll.disabled = false;
    clearItAll.disabled = true;

    var selected = getSelected(inputs),
        filteredSectionData = cellData.filter(function (el) {
            return selected.includes(el.managedData.IdentifiedType);
        });
    sectionChart(filteredSectionData)
});

function getSelected(inputs) {
    //Loop over all selected
    var selected = [];
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            if (inputs[i].name === 'Cck') {
                selected.push('Cck Calb1/Slc17a8*', 'Cck Cxcl14-', 'Cck Cxcl14+', 'Cck Vip Cxcl14-', 'Cck Vip Cxcl14+');
            } else if (inputs[i].name === 'PC') {
                selected.push('PC', 'PC Other1', 'PC Other2')
            } else if (inputs[i].name === 'IS') {
                selected.push('IS1', 'IS2', 'IS3')
            } else {
                selected.push(inputs[i].name);
            }
        }
    }
    return selected
}


// listener on the Confusion matrix tab
$('#layers-base input').change(function () {
    var selected = document.ConfusionMatrixRadioButton.norm.value;
    console.log('radio button: ' + selected + ' was selected');
    renderHeatmapTab(selected)
});

$('#layers-base-2 input').change(function () {
    var selected = document.ConfusionMatrixRadioButton.norm.value;
    console.log('check box clicked');
    renderHeatmapTab(selected)
});

$('#layers-base-3 input').change(function () {
    var selected = document.ConfusionMatrixRadioButton.norm.value;
    console.log('check box clicked');
    renderHeatmapTab(selected)
});

$('#layers-base-4 input').change(function () {
    // uncheck the other checkbox
    $("#genes62").prop("checked", false);
    var selected = document.ConfusionMatrixRadioButton.norm.value;
    console.log('check box clicked');
    renderHeatmapTab(selected)
});

$('#layers-base-5 input').change(function () {
    // uncheck the other checkbox
    $("#genes42").prop("checked", false);
    var selected = document.ConfusionMatrixRadioButton.norm.value;
    console.log('check box clicked');
    renderHeatmapTab(selected)
});

$('#confusion-table-tab').on('shown.bs.tab', function (e) {
    console.log('Confusion matrix tab was clicked.');
    $('#myDropdown').hide(); // hide the dropdown
    $('#dropdown-inefficiency').hide();
    var selected = document.ConfusionMatrixRadioButton.norm.value;
    console.log('Radio button ' + selected + ' is selected');
    renderHeatmapTab(selected);


    // hide the search forms
    $('#nav-table-search').hide();
    $('#nav-place-search').hide();
});

// listener on the Viewer tab
$('#map-tab').on('shown.bs.tab', function (e) {
    console.log('Viewer tab was clicked.');
    $('#myDropdown').show() // show the dropdown
});

// listener on the Worlflow tab
$('#workflow-tab').on('shown.bs.tab', function (e) {
    console.log('Workflow tab was clicked.');
    $('#myDropdown').hide(); // hide the dropdown
    $('#dropdown-inefficiency').hide();

    // hide the toolip raised by the section chart
    d3.select('#tooltip').style('opacity', 0)
});

// listener on the settings tab
$('#settings-tab').on('shown.bs.tab', function (e) {
    console.log('Settings tab was clicked.');

    // hide the toolip raised by the section chart
    d3.select('#tooltip').style('opacity', 0)

    //check if you have any cookies, if yes populate the input boxes
    if (localhostFolderCookie){
        $('#localhostPath').val(localhostFolderCookie);
    }

    if (portCookie){
        $('#portNumber').val(portCookie);
    }

    if (issFileCookie){
        $('#jsonPath').val(issFileCookie);
    }

    if (spotsFileCookie){
        $('#csvPath').val(spotsFileCookie);
    }

    if (roiCookie){
        $('#roi').val(roiCookie);
    }

    if (tilesCookie){
        $('#tilesPath').val(tilesCookie);
    }

    if (imageSizeCookie){
        $('#imageSize').val(imageSizeCookie);
    }
});

// listener on the help tab
$('#help-tab').on('shown.bs.tab', function (e) {
    console.log('Helps tab was clicked.');

    // hide the toolip raised by the section chart
    d3.select('#tooltip').style('opacity', 0)
});


