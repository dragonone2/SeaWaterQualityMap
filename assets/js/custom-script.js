window.onload = function() {
    const CSV_FILE_NAME = 'Ocean_Quailty3.csv';
    const TARGET_LOCATION = '속초연안';

    function generateChartData(headers, values) {
        return headers.map((header, index) => ({
            label: header,
            value: parseFloat(values[index])
        }));
    }

    Papa.parse(CSV_FILE_NAME, {
        download: true,
        complete: function(results) {
            var data = results.data;
            var headers = data[1].slice(3); // Headers row, skip first 3 columns
            var sokchoCoastalValues;

            for (var i = 2; i < data.length; i++) {
                if (data[i][1] === TARGET_LOCATION) {
                    sokchoCoastalValues = data[i].slice(3); // Starting from 4th column
                    break;
                }
            }

            var output = '';
            var chartData = generateChartData(headers, sokchoCoastalValues);
            for (var j = 0; j < chartData.length; j++) {
                output += chartData[j].label + ' : ' + chartData[j].value + '<br/>';
            }

            document.getElementById('data').innerHTML = output;

            // Draw the chart
            var ctx = document.getElementById('chart').getContext('2d');
            chartData.sort((a, b) => b.value - a.value);
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: chartData.map(x => x.label),
                    datasets: [{
                        data: chartData.map(x => x.value),
                        // ... rest of the settings ...
                    }]
                }
            });
        },
        error: function(err) {
            console.error('Failed to parse CSV file:', err);
        }
    });
};
