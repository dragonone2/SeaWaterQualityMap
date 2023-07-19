<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        .arc text {
            font: 15px sans-serif;
            text-anchor: middle;
        }

        .arc path {
            stroke: #fff;
            stroke-width: 2px;
            opacity: 0.7;
        }
    </style>
    <script src="https://d3js.org/d3.v7.min.js"></script>
</head>

<body>
    <svg id="chart"></svg>
    <script>
        var width = 450;
        var height = 450;
        var margin = 40;

        var color = d3.scaleOrdinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        var radius = Math.min(width, height) / 2 - margin;

        var svg = d3.select("#chart")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        d3.csv("Ocean_Quailty2.csv").then(function(data) {
            var keys = Object.keys(data[0]);
            keys.shift(); // remove the first key

            var pie = d3.pie().value(function (d) { return d; });
            var data_ready = pie(Object.values(data[0]).slice(1));

            var arcGenerator = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);

            var arcs = svg.selectAll('whatever')
                .data(data_ready)
                .enter()
                .append('path')
                .attr('d', arcGenerator)
                .attr('fill', function (d, i) { return (color(keys[i])); })
                .attr("class", "arc");

            // Add labels
            svg.selectAll('whatever')
                .data(data_ready)
                .enter()
                .append('text')
                .text(function (d, i) { return keys[i]; })  // the text
                .attr("transform", function (d) { 
                    var c = arcGenerator.centroid(d);
                    var x = c[0];
                    var y = c[1];
                    // Calculate the angle of the centroid coordinates
                    var angle = Math.atan2(y, x);
                    // Push the text out by another 50 pixels
                    var labelX = Math.cos(angle) * (radius + 50);
                    var labelY = Math.sin(angle) * (radius + 50);
                    return "translate(" + labelX + "," + labelY + ")";
                })
                .attr("class", "arc");
        });
    </script>
</body>
</html>
