function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: { lat: 35.9078, lng: 127.7669 }, // Centered on South Korea
    mapTypeId: "terrain",
    styles: [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f5f5"
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#f5f5f5"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#bdbdbd"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dadada"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#c9c9c9"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      }
    ]

  });

  function readCSVFile(fileURL, callback) {
    fetch(fileURL)
      .then((response) => response.text())
      .then((data) => {
        const rows = data.split("\n").slice(1);
        const coordinates = rows.map((row) => {
          const [lat, lng, value] = row.split(",");
          return {
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            value: parseInt(value),
          };
        });
        callback(coordinates);
      })
      .catch((error) => console.log("Error reading CSV file:", error));
  }

  const csvFilePath = "./shipdata.csv";

  function getColorByValue(value) {
    switch (value) {
      case 1:
        return "#9fc5e8"; // 연한 파란색
      case 2:
        return "#a4d39c"; // 연한 초록색
      case 3:
        return "#ffec94"; // 연한 노란색
      case 4:
        return "#ffd29a"; // 연한 주황색
      case 5:
        return "#ff9c9c"; // 연한 빨간색
      default:
        return "#eaeaea"; // 기본값: 연한 회색
    }
  }

  readCSVFile(csvFilePath, (coordinates) => {
    coordinates.forEach((coordinate) => {
      const rectangle = new google.maps.Rectangle({
        strokeColor: getColorByValue(coordinate.value),
        strokeOpacity: 0,
        strokeWeight: 1,
        fillColor: getColorByValue(coordinate.value),
        fillOpacity: 0.9,
        map,
        zIndex: coordinate.value, // zIndex 속성 추가
        bounds: {
          north: coordinate.lat + 0.25,
          south: coordinate.lat - 0.25,
          east: coordinate.lng + 0.25,
          west: coordinate.lng - 0.25,
        },
      });
    });
  });
}