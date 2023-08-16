const firebaseConfig = {
    apiKey: "AIzaSyA9OJf8_t3cQ6cnX-GCEZX5kpDxcq3us2A",
    authDomain: "model-craft-391306.firebaseapp.com",
    databaseURL: "https://model-craft-391306-default-rtdb.firebaseio.com",
    projectId: "model-craft-391306",
    storageBucket: "model-craft-391306.appspot.com",
    messagingSenderId: "54080375203",
    appId: "1:54080375203:web:2c7553ce4a44a6e96cb216",
    measurementId: "G-GN648GFCTK",
  };
  
  firebase.initializeApp(firebaseConfig);
  
  function autoFocus(data) {
    if (!data) {
      return;
    }
    
      const content = JSON.stringify(data, null, 2);
    document.getElementById("data").innerText = content;
    drawPieChart(data);
    drawGaugeChart(data['Grade']);
  }
  
  function fetchDataById() {
    
    
    // 해당 ID 값에 대한 데이터를 가져옵니다.
    var dbRef = firebase.database().ref("A-1/" + inputId);
  
    dbRef
      .once("value")
      .then(function (snapshot) {
        var data = snapshot.val();
        if (data) {
          var content = JSON.stringify(data, null, 2);
          document.getElementById("data").innerText = content;
           autoFocus(); // Pie Chart 그리기 함수 호출
           
        } else {
          document.getElementById("data").innerText =
            "해당 ID의 데이터를 찾을 수 없습니다.";
        }
      })
      .catch(function (error) {
        console.log("데이터 읽기 실패: ", error);
      });
  }
  
  let myPieChart; // 전역 변수로 Pie Chart 인스턴스 선언
  
  function drawPieChart(data) {
    var ctx = document.getElementById("myPieChart").getContext("2d");
  
    // 기존 Pie Chart 인스턴스가 존재한다면 제거합니다.
    if (myPieChart) {
      myPieChart.destroy();
    }
  
    // 제외하고 싶은 키 목록
    const excludeKeys = [
      "value",
      "coastal_name",
      "layer_name",
      "times",
      "area",
      "lat",
      "lng",
    ];
  
    // 데이터에서 제외하고 싶은 키를 필터링
    var filteredData = {};
    Object.keys(data).forEach(function (key) {
      if (!excludeKeys.includes(key)) {
        filteredData[key] = data[key];
      }
    });
  
    // 필터링된 데이터를 기반으로 라벨 및 데이터 배열 생성
    var labels = Object.keys(filteredData);
    var values = Object.values(filteredData);
  
    var chartData = {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#FF9F40",
          ],
        },
      ],
    };
  
    // Pie Chart를 생성하고 전역 변수에 할당합니다.
    myPieChart = new Chart(ctx, {
      type: "pie",
      data: chartData,
    });
  }
  
  autoFocus();
  
  
  function drawGaugeChart(value) {
    var chart = echarts.init(document.getElementById("gaugeChart")); // 변경된 부분
    var option = {
      series: [
        {
          type: "gauge",
          min: 0,
          max: 6,
          splitNumber: 6, // 축을 분할할 선의 수
          axisLabel: {
            formatter: function (value) {
              return value === 0 || value === 6 ? "" : value; // 0과 6은 표시하지 않음
            },
          },
          axisLine: {
            lineStyle: {
              width: 10,
              color: [
                [0.5 / 6, "#ffffff"],
                [1.5 / 6, "#00ffff"],
                [2.5 / 6, "#00ff00"],
                [3.5 / 6, "#ffff00"],
                [4.5 / 6, "#ffcc00"],
                [5.5 / 6, "#ff0000"],
                [6, "#ffffff"],
              ],
            },
          },
          detail: {
            valueAnimation: true,
            fontSize: 20,
            formatter: "Grade: {value}",
          },
          data: [{ value: value }],
        },
      ],
    };
    chart.setOption(option);
  }
  
  function fetchCoordinates(callback) {
    const dbRef = firebase.database().ref("A-1");
    dbRef
      .once("value")
      .then((snapshot) => {
        const coordinates = [];
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          const coordinate = {
            lat: parseFloat(data.latitude),
            lng: parseFloat(data.longitude),
            value: data.Grade,
            cod: data.COD,
            dip: data.DIP,
            sd: data.SD,
            spm: data.SPM,
            si: data.Si_OH4,
            tn: data.TN,
            tp: data.TP,
            ch: data.chlorophyll,
            oxg: data.dissolved_oxygen,
            ph: data.pH,
            sal: data.salinity,
            temp: data.temperature,
             
          };
  
          if (!isNaN(coordinate.lat) && !isNaN(coordinate.lng)) {
            coordinates.push(coordinate);
          }
        });
        callback(coordinates);
      })
      .catch((error) => {
        console.log("데이터 읽기 실패:", error);
      });
  }
  
  function getBounds(coordinate, zoomLevel) {
    const delta = 5 / Math.pow(2, zoomLevel);
    return {
      north: coordinate.lat + delta,
      south: coordinate.lat - delta,
      east: coordinate.lng + delta,
      west: coordinate.lng - delta,
    };
  }
  
  const rectangles = [];
  
  function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 7,
      center: { lat: 35.9078, lng: 127.7669 }, // Centered on South Korea
      mapTypeId: "terrain",
      styles: [
        {
          elementType: "geometry",
          stylers: [
            {
              color: "#f5f5f5",
            },
          ],
        },
        {
          elementType: "labels.icon",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
        {
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#616161",
            },
          ],
        },
        {
          elementType: "labels.text.stroke",
          stylers: [
            {
              color: "#f5f5f5",
            },
          ],
        },
        {
          featureType: "administrative.land_parcel",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#bdbdbd",
            },
          ],
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [
            {
              color: "#eeeeee",
            },
          ],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#757575",
            },
          ],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [
            {
              color: "#e5e5e5",
            },
          ],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#9e9e9e",
            },
          ],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [
            {
              color: "#ffffff",
            },
          ],
        },
        {
          featureType: "road.arterial",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#757575",
            },
          ],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [
            {
              color: "#dadada",
            },
          ],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#616161",
            },
          ],
        },
        {
          featureType: "road.local",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#9e9e9e",
            },
          ],
        },
        {
          featureType: "transit.line",
          elementType: "geometry",
          stylers: [
            {
              color: "#e5e5e5",
            },
          ],
        },
        {
          featureType: "transit.station",
          elementType: "geometry",
          stylers: [
            {
              color: "#eeeeee",
            },
          ],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [
            {
              color: "#0B2161",
            },
          ],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#9e9e9e",
            },
          ],
        },
      ],
      disableDefaultUI: true,
    });
  
    function getColorByValue(value) {
      switch (value) {
        case 1:
          return "#9fc5e8";
        case 2:
          return "#a4d39c";
        case 3:
          return "#ffec94";
        case 4:
          return "#ffd29a";
        case 5:
          return "#ff9c9c";
        default:
          return "#eaeaea";
      }
    }
  
    fetchCoordinates((coordinates) => {
      coordinates.forEach((coordinate) => {
        const rectangle = new google.maps.Rectangle({
          strokeColor: getColorByValue(coordinate.value),
          strokeOpacity: 0,
          strokeWeight: 1,
          fillColor: getColorByValue(coordinate.value),
          fillOpacity: 0.6,
          map,
          zIndex: coordinate.value,
          bounds: getBounds(coordinate, map.getZoom()),
        });
  
        rectangles.push({ rectangle: rectangle, coordinate: coordinate });
  
        rectangle.addListener("click", () => {
          fetchCoordinateDataByPosition(coordinate, (foundCoordinate) => {
            if (foundCoordinate) {
              updateDataDisplay(foundCoordinate);
              autoFocus(foundCoordinate);
            }
          });
        });
        
      });
      
  
      google.maps.event.addListener(map, "zoom_changed", function () {
        const zoomLevel = map.getZoom();
        rectangles.forEach((rect) => {
          rect.rectangle.setBounds(getBounds(rect.coordinate, zoomLevel));
        });
      });
    });
  }
  
  function fetchCoordinateDataByPosition(coordinate, callback) {
    // 좌표 데이터에서 해당 위치에 맞는 데이터를 찾습니다.
    const foundCoordinate = window.coordinatesData.find(
      (coord) => coord.lat === coordinate.lat && coord.lng === coordinate.lng
    );
  
    // 찾은 데이터를 콜백 함수로 반환합니다.
    if (foundCoordinate) {
      callback(foundCoordinate);
    } else {
      callback(null);
    }
  }
  
  
  function updateDataDisplay(coordinateData) {
    const dataContainer = document.getElementById("data");
    dataContainer.innerHTML = ""; // 기존 내용을 초기화합니다.
    
    if (!coordinateData) {
      dataContainer.style.display = "none";
      return;
    }
  
    const excludedKeys = ["latitude", "longitude", "Grade"];
    for (const [key, value] of Object.entries(coordinateData)) {
      if (!excludedKeys.includes(key)) {
        const item = document.createElement("p");
        item.innerHTML = `${key}: ${value}`;
        dataContainer.appendChild(item);
      }
    }
  
    dataContainer.style.display = "none";
  }
  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById("clock").textContent = timeString;
    setTimeout(updateClock, 1000);
  }
  window.coordinatesData = null;
  
  function onCoordinatesDataFetched(coordinates) {
    window.coordinatesData = coordinates;
    updateClock();
    autoFocus(); // Pie 차트 관련 함수 호출
    initMap(); // 지도 관련 함수 호출
    drawGaugeChart();
  }
  
  // 데이터를 불러온 다음 onCoordinatesDataFetched 함수를 호출합니다.
  fetchCoordinates(onCoordinatesDataFetched);