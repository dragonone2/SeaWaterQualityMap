window.onload = function() {
    Papa.parse('2022_Ocean.csv', {
        download: true,
        complete: function(results) {
            var data = results.data;
            var headers = data[1].slice(3); // Headers row, skip first 3 columns
            var values = []; // Values for "속초연안"

            for (var i = 2; i < data.length; i++) {
                if (data[i][1] === "속초연안") {
                    values = data[i].slice(3); // Starting from 4th column
                    break;
                }
            }

            var output = '';
            var chartData = [];
            for (var j = 0; j < headers.length; j++) {
                output += headers[j] + ' : ' + values[j] + '<br/>';
                chartData.push({
                    label: headers[j],
                    value: parseFloat(values[j])
                });
            }

            document.getElementById('data').innerHTML = output;

            // Draw the chart
            var ctx = document.getElementById('chart').getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: chartData.map(x => x.label),
                    datasets: [{
                        data: chartData.map(x => x.value),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 99, 132, 0.3)',
                            'rgba(54, 162, 235, 0.3)',
                            'rgba(255, 206, 86, 0.3)',
                            'rgba(75, 192, 192, 0.3)',
                            'rgba(153, 102, 255, 0.3)',
                            'rgba(255, 159, 64, 0.3)',
                        ]
                    }]
                }
            });
        }
    });
};
