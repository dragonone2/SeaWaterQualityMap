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

window.coordinatesData = null;

function onAllCoordinatesDataFetched(coordinates) {
  window.coordinatesData = coordinates;
  // updateClock();
  autoFocus(); // Pie 차트 관련 함수 호출
  initMap(); // 지도 관련 함수 호출
}

// 데이터를 불러온 다음 onCoordinatesDataFetched 함수를 호출합니다.
fetchAllCoordinates(onAllCoordinatesDataFetched);
