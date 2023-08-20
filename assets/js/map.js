const firebaseConfig = {
  apiKey: "AIzaSyA9OJf8_t3cQ6cnX-GCEZX5kpDxcq3us2A",
  authDomain: "model-craft-391306.firebaseapp.com",
  databaseURL: "https://model-craft-391306-default-rtdb.firebaseio.com",
  projectId: "model-craft-391306",
  storageBucket: "model-craft-391306.appspot.com",
  messagingSenderId: "54080375203",
  appId: "1:54080375203:web:2c7553ce4a44a6e96cb216",
  measurementId: "G-GN648GFCTK"
};

// Firebaseを初期化します
firebase.initializeApp(firebaseConfig);

function autoFocus(data) {
  // 1. dataが存在しない場合、何もせずに関数を終了します。
  if (!data) {
      return;
  }

  // 2. dataを整形してJSON形式の文字列に変換します。
  const content = JSON.stringify(data, null, 2);

  // 3. dataをIDが"data"のHTML要素に挿入します。
  document.getElementById("data").innerText = content;

  // 4. ゲージチャートとパイチャートを描画します。これらの関数は別途定義されている必要があります。
  drawGaugeChart(data);
  drawPieChart(data);
}

function fetchAllCoordinates(callback) {
  // IDごとに座標を取得するローカル関数
  const fetchCoordinate = (id) => {
      // 指定されたIDのデータベース参照を取得
      const dbRef = firebase.database().ref(id);
      // 値が変更されたときのイベントリスナーを設定
      dbRef.on("value", (snapshot) => {
          const coordinates = [];// 座標の配列を初期化
          snapshot.forEach((childSnapshot) => {
              // 子スナップショットからデータを取得
              const data = childSnapshot.val();
              // 座標オブジェクトの作成
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
              // 座標が有効な場合、配列に追加
              if (!isNaN(coordinate.lat) && !isNaN(coordinate.lng)) {
                  coordinates.push(coordinate);
              }
          });
          // コールバック関数を呼び出し、座標の配列を渡す
          callback(coordinates);
      });
  };
  // 50個のID（"A-01" から "A-50"）に対して座標を取得
  for (let i = 1; i <= 50; i++) {
      const id = "A-" + String(i).padStart(2, "0");
      fetchCoordinate(id);
  }
}

function getBounds(coordinate, zoomLevel) {
  // 1. zoomLevelに基づいてデルタ値を計算します。zoomLevelが高いほどデルタは小さくなります。
  const delta = 5 / Math.pow(2, zoomLevel);

  // 2. 渡された座標を中心に、計算されたデルタを使って境界を定義します。
  return {
      north: coordinate.lat + delta, // 北の境界
      south: coordinate.lat - delta, // 南の境界
      east: coordinate.lng + delta,  // 東の境界
      west: coordinate.lng - delta,  // 西の境界
  };
}

function generateRandomPoints(coordinate, count) {
  const points = [];
  for (let i = 0; i < count; i++) {
      const lat = coordinate.lat + (Math.random() - 0.5) * 0.1;
      const lng = coordinate.lng + (Math.random() - 0.5) * 0.1;
      const radius = Math.random() * 195 + 5; // 5から200までのランダムな半径
      points.push({ type: "Feature", geometry: { type: "Point", coordinates: [lng, lat] }, properties: { radius } });
  }
  return { type: "FeatureCollection", features: points };
}



// deck.glのGeoJsonLayerとGoogleMapsOverlayをインポート
const GeoJsonLayer = deck.GeoJsonLayer;
const GoogleMapsOverlay = deck.GoogleMapsOverlay;

const rectangles = [];
let isGeoJsonLayerVisible = true; // 初期状態は表示

let geoJsonLayers = [];
function initMap() {
  // 地図を指定されたオプションで初期化
  const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 7,
      center: { lat: 35.9078, lng: 127.7669 }, // 中心をSouth Koreaに設定
      mapTypeId: "terrain",
      disableDefaultUI: true,
  });
  const placesDictionary = {
      "황해": { lat: 36.180065, lng: 123.033483, zoom: 7 },
      "동해": { lat: 39.82878758630755, lng: 134.2263995949388, zoom: 7 },
      "남해": { lat: 33.826896, lng: 128.127185, zoom: 7 },
      // 他の座標を追加
  };
  const customSearchInput = document.getElementById("search-input");
  const customSearchButton = document.getElementById("search-button");
  const messageDiv = document.getElementById("message");
  customSearchButton.addEventListener("click", () => {
      const query = customSearchInput.value;
      const place = placesDictionary[query];
      if (place) {
          // 座標とズームレベルに基づいてマップを更新
          map.setCenter({ lat: place.lat, lng: place.lng });
          map.setZoom(place.zoom);
      } else {
          messageDiv.textContent = "지역 등록기 안돼있는 지역입니다.\n지역 등록해주시면 감사합니다."; // メッセージをクリア
          // 5秒後にメッセージをクリア
          setTimeout(() => {
              messageDiv.textContent = "";
          }, 3000);
          console.log("該当する場所がありません");
      }
  });

  // 地図の中心が変更されたときのイベントリスナーを追加
  map.addListener('center_changed', function () {
      currentCenter = map.getCenter(); // 現在の中心を取得
  });

  // 地図のズームが変更されたときのイベントリスナーを追加
  map.addListener('zoom_changed', function () {
      currentZoom = map.getZoom(); // 現在のズームレベルを取得
  });


  // 4. 値に基づいて色を取得する関数
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
              return "#00000000";
      }
  }
  // deck.glのオーバーレイを作成
  const deckOverlay = new GoogleMapsOverlay({
      layers: [],
  });
  deckOverlay.setMap(map);

  // 좌표 찍는 함수
  fetchAllCoordinates((coordinates) => {
      // 1. 全ての座標を取得します。
      coordinates.forEach((coordinate, index) => {
          // 2. それぞれの座標に対して長方形を作成します。
          const rectangle = new google.maps.Rectangle({
              // 長方形の属性を設定します。
              strokeColor: getColorByValue(coordinate.value),
              strokeOpacity: 0,
              strokeWeight: 1,
              fillColor: getColorByValue(coordinate.value),
              fillOpacity: 0.6,
              map,
              zIndex: coordinate.value,
              bounds: getBounds(coordinate, map.getZoom()),
          });

          // 3. 長方形と座標を配列に保存します。
          rectangles.push({ rectangle: rectangle, coordinate: coordinate });

          // 4. 指定された座標周辺にランダムで10個の点を配置するためのデータを生成します。
          const randomCount = Math.floor(Math.random() * 10) + 1; // 1から10までのランダムな整数
          const randomPoints = generateRandomPoints(coordinate, randomCount);
          // 新しいレイヤーのID
          const newLayerId = `points-${coordinate.lat}-${coordinate.lng}-${index}`;

          // 既存のレイヤーの中から同じIDのレイヤーを探す
          const existingLayerIndex = deckOverlay.props.layers.findIndex(
              layer => layer.id === newLayerId
          );

          // 新しいレイヤーのオブジェクトを作成
          const geoJsonLayer = new GeoJsonLayer({
              id: newLayerId,
              data: randomPoints,
              filled: true,
              getPointRadius: d => d.properties.radius, // データポイントのradiusプロパティを使用
              getFillColor: [255, 70, 30, 180],
          });

          geoJsonLayers.push(geoJsonLayer); // ここでgeoJsonLayersに追加
          const newLayers = [...deckOverlay.props.layers]; // 既存のレイヤーをコピー
          if (existingLayerIndex !== -1) {
              newLayers[existingLayerIndex] = geoJsonLayer; // 同じIDのレイヤーを置き換える
          } else {
              newLayers.push(geoJsonLayer); // 新しいレイヤーを追加する
          }

          // レイヤーの表示状態に基づいて、deckOverlayのプロパティを更新します。
          deckOverlay.setProps({
              layers: isGeoJsonLayerVisible ? newLayers : [],
          });
      });

      google.maps.event.addListener(map, "zoom_changed", function () {
          // 6. 地図のズームが変更された場合の処理を追加します。
          const currentCenter = map.getCenter();
          rectangles.forEach((rect) => {
              rect.rectangle.setBounds(getBounds(rect.coordinate, map.getZoom()));
              // 7. 各長方形の境界を更新します。
          });
          map.setCenter(currentCenter);
          // 8. 地図の中心を現在の中心に設定します。
      });
  });

}

function fetchCoordinateDataByPosition(coordinate, callback) {
  // 1. グローバル変数から指定された座標に一致するデータを検索します。
  const foundCoordinate = window.coordinatesData.find(
      (coord) => coord.lat === coordinate.lat && coord.lng === coordinate.lng
  );

  // 2. 見つかったデータをコールバック関数に渡します。見つからなかった場合はnullを渡します。
  if (foundCoordinate) {
      callback(foundCoordinate); // 3. データが見つかった場合、コールバックでそれを返します。
  } else {
      callback(null); // 4. データが見つからない場合、コールバックでnullを返します。
  }
}

window.coordinatesData = null; // 座標データの初期値をnullに設定