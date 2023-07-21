window.onload = function() {
    var files = ['2018_Ocean.csv', '2019_Ocean.csv', '2020_Ocean.csv', '2021_Ocean.csv', '2022_Ocean.csv'];
    var datasets = [];
    var labels = ["수소이온농도pH", "용존산소량DO (㎎/ℓ)", "총질소TN (㎍/ℓ)", "총인TP (㎍/ℓ)"];
    
    // Sort the files array in ascending order based on year
    files.sort((a, b) => {
        var yearA = parseInt(a.split('_')[0]);
        var yearB = parseInt(b.split('_')[0]);
        return yearA - yearB;
    });

    files.forEach((file, index) => {
        Papa.parse(file, {
            download: true,
            complete: function(results) {
                var data = results.data;
                var values = []; // Values for "속초연안"

                for (var i = 2; i < data.length; i++) {
                    if (data[i][1] === "속초연안") {
                        labels.forEach(label => {
                            var columnIndex = data[1].indexOf(label);
                            if (columnIndex !== -1) {
                                var value = parseFloat(data[i][columnIndex]);
                                values.push(Math.log10(value + 1)); // Applying log scale to the value
                            }
                        });
                        break;
                    }
                }

                datasets.push({
                    label: file.replace('_Ocean.csv', ''), // Remove '_Ocean.csv' from the label
                    data: values,
                    fill: false,
                    borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
                    tension: 0.1
                });

                if (datasets.length === files.length) {
                    drawChart(labels, datasets);
                }
            }
        });
    });
};

function drawChart(labels, datasets) {
    var ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            scales: {
                y: {
                    type: 'linear',
                    ticks: {
                        callback: function(value, index, values) {
                            return Math.pow(10, value).toFixed(2); // Convert back from log scale
                        }
                    }
                }
            }
        }
    });
}
