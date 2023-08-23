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
  drawSpmTurbidityChart(data);
  drawHistoricalGradesChart(data);
  drawBarChart(data["temp"], data["spm"], data["oxg"], data["ph"]);
  checkTemperature(
    data["temp"],
    data["sal"],
    data["ph"],
    data["oxg"],
    data["cod"],
    data["spm"]
  );
}

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
    const tableId = id;
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


function checkTemperature(temp, sal, ph, oxg, cod, spm) {
  var warningMessage = "";
  if (temp >= 25) {
    warningMessage += "수온이 25 이상입니다!\n ";
  } else if (temp <= 5) {
    warningMessage += "수온이 5 이하입니다!\n ";
  }
  if (sal >= 35) {
    warningMessage += "염도가 평균보다 높습니다.\n ";
  } else if (sal <= 30) {
    warningMessage += "염도가 평균보다 낮습니다.\n ";
  }
  if (ph >= 8.5) {
    warningMessage += "산성도가 평균보다 높습니다.\n ";
  } else if (ph <= 7.5) {
    warningMessage += "산성도가 평균보다 낮습니다.\n ";
  }
  if (oxg <= 5) {
    warningMessage += "용존 산소량이 낮습니다.\n ";
  }
  if (cod >= 10) {
    warningMessage += "화학적 산소 요구량이 높습니다.\n ";
  }
  if (spm >= 15) {
    warningMessage += "입자 물질의 농도가 높습니다.\n ";
  }

  var warningMessageElement = document.getElementById("warning_message");
  warningMessageElement.innerText = warningMessage;

  // 스타일 변경
  warningMessageElement.style.color = "white";
}

function drawBarChart(temp, spm, oxg, ph) {
  // temp
  var tempChart = echarts.init(document.getElementById("temp_chart"));
  var tempOption = {
    yAxis: {
      type: "category",
      data: ["수온"],
    },
    xAxis: {
      type: "value",
      max: 35,
    },
    series: [
      {
        data: [temp],
        type: "bar",
      },
    ],
  };
  tempChart.setOption(tempOption);

  // spm
  var spmChart = echarts.init(document.getElementById("spm_chart"));
  var spmOption = {
    yAxis: {
      type: "category",
      data: ["spm"],
    },
    xAxis: {
      type: "value",
      max: 35,
    },
    series: [
      {
        data: [spm],
        type: "bar",
      },
    ],
  };
  spmChart.setOption(spmOption);

  // oxg
  var oxgChart = echarts.init(document.getElementById("oxg_chart"));
  var oxgOption = {
    yAxis: {
      type: "category",
      data: ["oxg"],
    },
    xAxis: {
      type: "value",
      max: 35,
    },
    series: [
      {
        data: [oxg],
        type: "bar",
      },
    ],
  };
  oxgChart.setOption(oxgOption);

  // ph
  var phChart = echarts.init(document.getElementById("ph_chart"));
  var phOption = {
    yAxis: {
      type: "category",
      data: ["ph"],
    },
    xAxis: {
      type: "value",
      max: 35,
    },
    series: [
      {
        data: [ph],
        type: "bar",
      },
    ],
  };
  phChart.setOption(phOption);
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

  // 필터링된 데이터를 기반으로 정렬된 라벨 및 데이터 배열 생성
  var entries = Object.entries(filteredData);
  entries.sort(([_, aValue], [__, bValue]) => bValue - aValue);

  var labels = entries.map(([key, _]) => key);
  var values = entries.map(([_, value]) => value);

  var chartData = {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#d4eaf7", // 연한 살구색
          "#b6ccd8", // 스카이 블루
          "#3b3c3d", // 피치 퍼프
          "#D3D3D3", // 라이트 그레이
          "#71c4ef", // 카키색
          "#00668c", // 파우더 블루
          
          "#1d1c1c", // 라이트 블루
          "#313d44", // 라이트 시안
          "#90EE90", // 라이트 그린
          
          
        ],
      },
    ],
  };

  // Pie Chart를 생성하고 전역 변수에 할당합니다.
  myPieChart = new Chart(ctx, {
    type: "pie",
    data: chartData,
    options: {
      responsive: true, // 창 크기가 변경될 때 차트 크기를 동적으로 조절합니다.
      maintainAspectRatio: false, // 원래 비율 대신 지정한 크기에 맞게 차트를 그립니다.
      // (그 외의 옵션들, e.g., title, tooltips, legend 등이 필요하다면 여기 작성)
    },
  });
}

function drawHistoricalGradesChart(coordinate) {
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

    renderHistoricalGradesChart(historicalGrades);
  });
}

function renderHistoricalGradesChart(historicalGrades) {
  google.charts.load('current', { packages: ['corechart', 'line'] });
  google.charts.setOnLoadCallback(drawGradesChart);

  function drawGradesChart() {
    const data = new google.visualization.DataTable();
    data.addColumn('number', 'Move');
    data.addColumn('number', 'Grade');

    let maxMove = 0;
    for (let i = 0; i < historicalGrades.length; i++) {
      data.addRow([i + 1, historicalGrades[i]]);
      maxMove = Math.max(maxMove, i + 1);
    }
    
    const options = {
      hAxis: {
        title: 'Move',
        minValue: 1,
        maxValue: maxMove,
        textStyle: {
          fontName: 'Roboto',
          fontSize: 12,
          color: '#fff',
        },
        titleTextStyle: {
          fontName: 'Roboto',
          bold: true,
          fontSize: 14,
          color: '#fff',
        },
      },
      vAxis: {
        title: 'Grade',
        minValue: 1,
        maxValue: 5,
        textStyle: {
          fontName: 'Roboto',
          fontSize: 12,
          color: '#fff',
        },
        titleTextStyle: {
          fontName: 'Roboto',
          bold: true,
          fontSize: 14,
          color: '#fff',
        },
      },
      legend: 'none',
      chartArea: {
        backgroundColor: 'transparent',
        left: 50,
        top: 30,
        right: 30,
        bottom: 30,
      },
      backgroundColor: 'transparent',
      lineWidth: 3,
      colors: ['#6EB5FF'],
      pointSize: 6,
      curveType: 'function',
    };

    const chart = new google.visualization.LineChart(document.getElementById('historical_grades_chart'));
    chart.draw(data, options);
  }
}

function drawSpmTurbidityChart(coordinate) {
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
    const historicalData = relatedCoordinates
      .filter((c) => {
        const moveIndex = parseInt(c.moveKey.replace('move', ''), 10);
        return moveIndex < currentMoveIndex; // currentMoveKey보다 작은 MoveKey를 가진 데이터만 필터링
      });

    const historicalSpm = historicalData.map(c => c.spm);
    const historicalTurbidity = historicalData.map(c => c.turbidity);

    // 현재 SPM값과 Turbidity값을 포함
    historicalSpm.push(coordinate.spm);
    historicalTurbidity.push(coordinate.turbidity);

    renderSpmTurbidityChart(historicalSpm, historicalTurbidity);
  });
}

function renderSpmTurbidityChart(historicalSpm, historicalTurbidity) {
  google.charts.load('current', { packages: ['corechart', 'line'] });
  google.charts.setOnLoadCallback(drawSpmTurbidityChart);

  function drawSpmTurbidityChart() {
    const data = new google.visualization.DataTable();
    data.addColumn('number', 'Move');
    data.addColumn('number', 'SPM');
    data.addColumn('number', 'Turbidity');

    let maxMove = 0;
    for (let i = 0; i < historicalSpm.length; i++) {
      data.addRow([i + 1, historicalSpm[i], historicalTurbidity[i]]);
      maxMove = Math.max(maxMove, i + 1);
    }

    const options = {
      hAxis: {
        title: 'Move',
        minValue: 1,
        maxValue: maxMove,
        textStyle: {
          fontName: 'Roboto',
          fontSize: 12,
          color: '#fff',
        },
        titleTextStyle: {
          fontName: 'Roboto',
          bold: true,
          fontSize: 14,
          color: '#fff',
        },
        gridlines: { color: 'transparent' },
      },
      vAxis: {
        title: 'Value',
        minValue: 0, // You can adjust this based on your data
        textStyle: {
          fontName: 'Roboto',
          fontSize: 12,
          color: '#fff',
        },
        titleTextStyle: {
          fontName: 'Roboto',
          bold: true,
          fontSize: 14,
          color: '#fff',
        },
        
      },
      legend: { position: 'bottom' }, // Legend position at the bottom
      chartArea: {
        backgroundColor: 'transparent',
        left: 50,
        top: 30,
        right: 30,
        bottom: 50, // Increased to accommodate the legend
      },
      backgroundColor: 'transparent',
      lineWidth: 3,
      colors: ['#6EB5FF', '#FA726F'], // Color for SPM and Turbidity lines
      pointSize: 6,
      curveType: 'function',
    };

    const chart = new google.visualization.LineChart(document.getElementById('spm_turbidity_chart'));
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

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: { lat: 35.9078, lng: 127.7669 }, // Centered on South Korea
    mapTypeId: "terrain",styles: [
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

  map.addListener("center_changed", function () {
    currentCenter = map.getCenter(); // 現在の中心を取得
  });

  // 地図のズームが変更されたときのイベントリスナーを追加
  map.addListener("zoom_changed", function () {
    currentZoom = map.getZoom(); // 現在のズームレベルを取得
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
          console.log("클릭한 좌표:", coordinate.lat, coordinate.lng);
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
      map.setCenter(currentCenter);
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
// function updateClock() {
//   const now = new Date();
//   const hours = String(now.getHours()).padStart(2, "0");
//   const minutes = String(now.getMinutes()).padStart(2, "0");
//   const seconds = String(now.getSeconds()).padStart(2, "0");
//   const timeString = `${hours}:${minutes}:${seconds}`;
//   document.getElementById("clock").textContent = timeString;
//   setTimeout(updateClock, 1000);
// }
window.coordinatesData = null;

let isInitMapCalled = false;

function onAllCoordinatesDataFetched(coordinates) {
  window.coordinatesData = coordinates;

  if (coordinates.length > 0) {
    // 추가된 부분: 좌표가 하나라도 있는지 확인
    if (isInitMapCalled==false) {
      initMap();
      isInitMapCalled = true;
    }
    autoFocus(coordinates[0]); // 추가된 부분: 첫 번째 좌표로 autoFocus 함수 호출
    drawBulletChart(coordinates[0]["value"], "#bullet-chart"); // 추가된 부분: 첫 번째 좌표로 drawBulletChart 함수 호출
    checkTemperature(
      coordinates[0]["temp"],
      coordinates[0]["sal"],
      coordinates[0]["ph"],
      coordinates[1][oxg],
      coordiantes["cod"],
      coordiantes["spm"]
    ); //추가됐음 : 온도체크함수호출

    drawBarChart(
      coordinate["temp"],
      coordinate["spm"],
      coordinate["oxg"],
      cooridnate["ph"]
    ); ///추가됐음 : 바차트그리기함수호출

    drawPieChart(coordinate);

    renderHistoricalGradeschart(historicalGrades);

    renderSpmTempchart(historicalSpm, historicalTemp);

   
  }
}

// 데이터를 불러온 다음 onCoordinatesDataFetched 함수를 호출합니다.
fetchAllCoordinates(onAllCoordinatesDataFetched);
