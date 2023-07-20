window.onload = function () {
    // Pie Chart
    Papa.parse('2022_Ocean.csv', {
        download: true,
        complete: function (results) {
            var data = results.data;
            var headers = data[1].slice(3); // Headers row, skip first 3 columns
            var values = []; // Values for "속초연안"

            for (var i = 2; i < data.length; i++) {
                if (data[i][1] === "태안연안") {
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
            chartData.sort((a, b) => b.value - a.value);
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: chartData.map(x => x.label),
                    datasets: [{
                        data: chartData.map(x => x.value),
                        backgroundColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(205, 99, 132, 1)',
                            'rgba(54, 122, 235, 1)',
                            'rgba(255, 176, 86, 1)',
                            'rgba(75, 162, 192, 1)',
                            'rgba(123, 102, 255, 1)',
                            'rgba(255, 119, 64, 1)',
                        ]
                    }]
                }
            });
        }
    });

    // Line Chart
    var files = ['2018_Ocean.csv', '2019_Ocean.csv', '2020_Ocean.csv', '2021_Ocean.csv', '2022_Ocean.csv'];
            var dataByParameter = {};
            var labels = ["수소이온농도pH", "용존산소량DO (㎎/ℓ)", "총질소TN (㎍/ℓ)", "총인TP (㎍/ℓ)"];
            var canvasIds = ["chart-ph", "chart-do", "chart-tn", "chart-tp"];

            labels.forEach(label => dataByParameter[label] = []);

            files.forEach((file, index) => {
                Papa.parse(file, {
                    download: true,
                    complete: function(results) {
                        var data = results.data;

                        labels.forEach(label => {
                            var values = []; // Values for "속초연안"

                            for (var i = 2; i < data.length; i++) {
                                if (data[i][1] === "태안연안") {
                                    var columnIndex = data[1].indexOf(label);
                                    if (columnIndex !== -1) {
                                        values.push(parseFloat(data[i][columnIndex]));
                                    }
                                }
                            }

                            dataByParameter[label].push({
                                x: file.replace('.csv', ''),
                                y: values[0] // Assuming each file contains one row of data for "속초연안"
                            });
                        });

                        if (Object.values(dataByParameter)[0].length === files.length) {
                            labels.forEach((label, index) => {
                                drawChart(canvasIds[index], label, dataByParameter[label]);
                            });
                        }
                    }
                });
            });
            var files = ['2018_Ocean.csv', '2019_Ocean.csv', '2020_Ocean.csv', '2021_Ocean.csv', '2022_Ocean.csv'];
            var dataByYear = {};

            files.forEach((file, index) => {
                Papa.parse(file, {
                    download: true,
                    complete: function(results) {
                        var data = results.data;

                        for (var i = 2; i < data.length; i++) {
                            if (data[i][1] === "태안연안") {
                                var DOIndex = data[1].indexOf("용존산소량DO (㎎/ℓ)");
                                var ChlIndex = data[1].indexOf("클로로필Chl-a (㎍/ℓ)");
                                var DINIndex = data[1].indexOf("용존무기질소DIN (㎍/ℓ)");
                                var DIPIndex = data[1].indexOf("용존무기인DIP (㎍/ℓ)");

                                if (DOIndex !== -1 && ChlIndex !== -1 && DINIndex !== -1 && DIPIndex !== -1) {
                                    var DOValue = parseFloat(data[i][DOIndex]);
                                    var ChlValue = parseFloat(data[i][ChlIndex]);
                                    var DINValue = parseFloat(data[i][DINIndex]);
                                    var DIPValue = parseFloat(data[i][DIPIndex]);

                                    DOValue = (DOValue / 9.1) * 100;
                                    var DoValue_DO, ChlValue_Chl, DINValue_DIN, DIPValue_DIP;

                                    if (DOValue > 90) {   
                                        DoValue_DO = 1;
                                    } else if (DOValue > 81) {   
                                        DoValue_DO = 2;
                                    } else if (DOValue > 67.5) {   
                                        DoValue_DO = 3;
                                    } else if (DOValue > 45) {   
                                        DoValue_DO = 4;
                                    } else {   
                                        DoValue_DO = 5;
                                    }

                                    if (ChlValue < 6.3) {   
                                        ChlValue_Chl = 1;
                                    } else if (ChlValue < 6.93) {   
                                        ChlValue_Chl = 2;
                                    } else if (ChlValue < 7.88) {   
                                        ChlValue_Chl = 3;
                                    } else if (ChlValue < 9.45) {   
                                        ChlValue_Chl = 4;
                                    } else {   
                                        ChlValue_Chl = 5;
                                    }

                                    if (DINValue < 220) {   
                                        DINValue_DIN = 1;
                                    } else if (DINValue < 242) {   
                                        DINValue_DIN = 2;
                                    } else if (DINValue < 275) {   
                                        DINValue_DIN = 3;
                                    } else if (DINValue < 330) {   
                                        DINValue_DIN = 4;
                                    } else {   
                                        DINValue_DIN = 5;
                                    }

                                    if (DIPValue < 35) {   
                                        DIPValue_DIP = 1;
                                    } else if (DIPValue < 38.50) {   
                                        DIPValue_DIP = 2;
                                    } else if (DIPValue < 43.75) {   
                                        DIPValue_DIP = 3;
                                    } else if (DIPValue < 52.50) {   
                                        DIPValue_DIP = 4;
                                    } else {   
                                        DIPValue_DIP = 5;
                                    }

                                    var result = 10 * DoValue_DO + 6 * ((ChlValue_Chl + 5) / 2) + 4 * ((DINValue_DIN + DIPValue_DIP) / 2);
                                    var result_re = result;

                                    if (result_re <= 23) {
                                        result_re = 1;
                                    } else if (result_re <= 33) {
                                        result_re = 2;
                                    } else if (result_re <= 46) {
                                        result_re = 3;
                                    } else if (result_re <= 59) {
                                        result_re = 4;
                                    } else {
                                        result_re = 5;
                                    }
                                    
                                    dataByYear[file.replace('_Ocean.csv', '')] = result_re;
                                }
                                break;
                            }
                        }

                        if (Object.keys(dataByYear).length === files.length) {
                            lastdrawChart(dataByYear);
                        }
                    }
                });
            });
        };

        function lastdrawChart(dataByYear) {
            var ctx = document.getElementById('chart-equation').getContext('2d');
            var labels = Object.keys(dataByYear);
            var data = Object.values(dataByYear);

            var chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '수질 평가 지수',
                        data: data,
                        fill: false,
                        borderColor: 'rgba(0, 0, 0, 1)',
                        tension: 0.1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'category',
                            title: {
                                display: true,
                                text: '년도'
                            }
                        },
                        y: {
                            type: 'linear',
                            min: 0,
                            max: 5,
                            reverse: false,
                            ticks: {
                                stepSize: 1
                            },
                            title: {
                                display: true,
                                text: '등급'
                            }
                        }
                    },
                    plugins: {
                        filler: {
                            propagate: true
                        }
                    }
                },
                plugins: [{
                    afterDraw: chart => {
                        var ctx = chart.canvas.getContext('2d');
                        var yAxis = chart.scales['y'];
                        var chartArea = chart.chartArea;

                        ctx.save();

                        var gradientColor = [
                            'rgba(0, 0, 255, 0.3)',  // Blue
                            'rgba(144, 238, 144, 0.3)',  // Light green
                            'rgba(255, 255, 0, 0.3)',  // Yellow
                            'rgba(255, 165, 0, 0.3)',  // Orange
                            'rgba(255, 0, 0, 0.3)'  // Red
                        ];

                        for (let i = 0; i < 5; i++) {
                            ctx.fillStyle = gradientColor[i];
                            var y0 = yAxis.getPixelForValue(i);
                            var y1 = yAxis.getPixelForValue(i + 1);

                            ctx.fillRect(chartArea.left, Math.min(y0, y1), chartArea.width, Math.max(y0, y1) - Math.min(y0, y1));
                        }

                        ctx.restore();
                    }
                    
                }]
            });
        }

        function drawChart(canvasId, label, data) {
            var ctx = document.getElementById(canvasId).getContext('2d');

            new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [{
                        label: label,
                        data: data,
                        fill: false,
                        borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
                        tension: 0.1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'category',
                            title: {
                                display: true,
                                text: 'Year'
                            }
                        },
                        y: {
                            type: 'linear',
                            title: {
                                display: true,
                                text: 'Value'
                            }
                        }
                    }
                }
            });
        }