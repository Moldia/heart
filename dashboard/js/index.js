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
            selected.push(inputs[i].name);
        }
    }
    return selected
}



