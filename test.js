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
  
  function fetchDataById() {
    
    
    // 해당 ID 값에 대한 데이터를 가져옵니다.
    var dbRef = firebase.database().ref("/" + inputId);
  
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
  function fetchAllCoordinates(callback) {
    const coordinates = [];
  
    for (let i = 1; i <= 50; i++) {
      const id = "A-" + String(i).padStart(2, "0");
      const dbRef = firebase.database().ref(id);
      const tableId = id
      dbRef.on("value", (snapshot) => {
        const coordinateList = [];
        snapshot.forEach((childSnapshot) => {
          const moveKey = childSnapshot.key; // move01, move02, ...
          const data = childSnapshot.val();
          const coordinate = {
            tableId,
            moveKey, // move 키 추가
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
            coordinateList.push(coordinate);
          }
        });
        coordinates[i - 1] = coordinateList;
        if (i === 50) {
          callback(coordinates.flat());
        }
      });
    }
  }
  
  function autoFocus(data) {
    if (!data) {
      return;
    }
  
    const content = JSON.stringify(data, null, 2);
    document.getElementById("data").innerText = content;
    drawLineChart(data);
    drawPieChart(data);
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
  
  
  
  function drawLineChart(coordinate) {
    if (!coordinate) {
      console.error('Data is not defined');
      return;
    }
  
    const currentTableId = coordinate.tableId;
    const currentMoveKey = coordinate.moveKey;
    const currentMoveIndex = parseInt(currentMoveKey.replace('move', ''), 10);
  
    // 현재 테이블 ID와 일치하는 데이터를 찾아 그립니다.
    fetchAllCoordinates((allCoordinates) => {
      const relatedCoordinates = allCoordinates.filter(c => c.tableId === currentTableId); // currentTableId와 일치하는 데이터 필터링
      const historicalGrades = relatedCoordinates
        .filter((c) => {
          const moveIndex = parseInt(c.moveKey.replace('move', ''), 10);
          return moveIndex < currentMoveIndex; // currentMoveKey보다 작은 MoveKey를 가진 데이터만 필터링
        })
        .map(c => c.value);
  
      // 현재 Grade값을 포함
      historicalGrades.push(coordinate.value);
  
      renderLineChart(historicalGrades);
    });
  }
  
  function renderLineChart(historicalGrades) {
    google.charts.load('current', { packages: ['corechart', 'line'] });
    google.charts.setOnLoadCallback(drawChart);
  
    function drawChart() {
      const data = new google.visualization.DataTable();
      data.addColumn('number', 'Move');
      data.addColumn('number', 'Grade');
  
      for (let i = 0; i < historicalGrades.length; i++) {
        data.addRow([i + 1, historicalGrades[i]]);
      }
  
      const options = {
        hAxis: {
          title: 'Move',
          minValue: 1,
          maxValue: 5
        },
        vAxis: {
          title: 'Grade',
          minValue: 1,
          maxValue: 5
        },
        legend: 'none'
      };
  
      const chart = new google.visualization.LineChart(document.getElementById("line_chart"));
      chart.draw(data, options);
    }
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
  
  let currentCenter = { lat: 35.9078, lng: 127.7669 };
  let currentZoom = 7;
  
  function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: currentZoom,
      center: currentCenter,
      mapTypeId: "terrain", styles: [
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
  
    google.maps.event.addListener(map, "zoom_changed", function () {
      const zoomLevel = map.getZoom();
      currentZoom = zoomLevel; // 현재 확대 레벨 저장
      rectangles.forEach((rect) => {
        rect.rectangle.setBounds(getBounds(rect.coordinate, zoomLevel));
      });
    });
  
    // 중앙 좌표 변경 이벤트
    google.maps.event.addListener(map, "center_changed", function () {
      currentCenter = map.getCenter().toJSON(); // 현재 중앙 좌표 저장
    });
  
    fetchAllCoordinates((coordinates) => {
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
            console.log("클릭한 좌표:", coordinate);
            console.log("찾은 좌표 데이터:", foundCoordinate);
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
  
  function onAllCoordinatesDataFetched(coordinates) {
    window.coordinatesData = coordinates;
    updateClock();
    autoFocus(); // Pie 차트 관련 함수 호출
    initMap(); // 지도 관련 함수 호출
  }
  
  // 데이터를 불러온 다음 onCoordinatesDataFetched 함수를 호출합니다.
  fetchAllCoordinates(onAllCoordinatesDataFetched);