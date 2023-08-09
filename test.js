const csvFilePath = './kr_sea_data.csv';
const gridSize = 0.005;
const rectangles = [];

function getBounds(coordinate, zoom) {
  const southWest = new google.maps.LatLng(
    parseFloat((Math.round(coordinate.lat / gridSize) * gridSize).toFixed(4)),
    parseFloat((Math.round(coordinate.lng / gridSize) * gridSize).toFixed(4))
  );

  const northEast = new google.maps.LatLng(
    parseFloat((southWest.lat() + gridSize).toFixed(4)),
    parseFloat((southWest.lng() + gridSize).toFixed(4))
  );

  return new google.maps.LatLngBounds(southWest, northEast);
}

function getColorByValue(value) {
  if (value <= 10) {
    return '#00FF00';
  } else if (value > 10 && value <= 20) {
    return '#FFFF00';
  } else {
    return '#FF0000';
  }
}

function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 37.7749, lng: -122.4194},
    mapTypeId: 'terrain'
  });

  readCSVFile(csvFilePath, (coordinates) => {
    coordinates.forEach((coordinate) => {
      const rectangle = new google.maps.Rectangle({
        strokeColor: getColorByValue(coordinate.value),
        strokeOpacity: 0,
        strokeWeight: 1,
        fillColor: getColorByValue(coordinate.value),
        fillOpacity: 0.9,
        map,
        zIndex: coordinate.value,
        bounds: getBounds(coordinate, map.getZoom()),
      });

      rectangles.push({rectangle: rectangle, coordinate: coordinate});

      rectangle.addListener("click", () => {
        updateDataDisplay(coordinate.lat, coordinate.lng, coordinate.value);
        document.getElementById("data-display").style.display = "block";
      });
    });

    google.maps.event.addListener(map, 'zoom_changed', () => {
      rectangles.forEach((rect) => {
        rect.rectangle.setBounds(getBounds(rect.coordinate, map.getZoom()));
      });
    });
  });
}

function readCSVFile(filePath, callback) {
  fetch(filePath)
    .then(response => response.text())
    .then(data => {
      data = data.split('\n');
      const coordinates = [];

      data.forEach((line) => {
        const splitLine = line.split(',');

        if (splitLine.length === 3) {
          const coordinate = {
            lat: parseFloat(splitLine[0]),
            lng: parseFloat(splitLine[1]),
            value: parseFloat(splitLine[2])
          };

          coordinates.push(coordinate);
        }
      });

      callback(coordinates);
    });
}

function updateDataDisplay(latitude, longitude, value) {
  document.getElementById("data-lat").innerText = `Latitude: ${latitude}`;
  document.getElementById("data-lng").innerText = `Longitude: ${longitude}`;
  document.getElementById("data-value").innerText = `Value: ${value}`;
}
