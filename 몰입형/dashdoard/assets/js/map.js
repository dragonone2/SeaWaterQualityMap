


let map, heatmap;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: { lat: 37.569, lng: 126.841 },
    mapTypeId: "satellite",
  });
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(),
    map: map,
  });

}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
  const gradient = [
    "rgba(0, 255, 255, 0)",
    "rgba(0, 255, 255, 1)",
    "rgba(0, 191, 255, 1)",
    "rgba(0, 127, 255, 1)",
    "rgba(0, 63, 255, 1)",
    "rgba(0, 0, 255, 1)",
    "rgba(0, 0, 223, 1)",
    "rgba(0, 0, 191, 1)",
    "rgba(0, 0, 159, 1)",
    "rgba(0, 0, 127, 1)",
    "rgba(63, 0, 91, 1)",
    "rgba(127, 0, 63, 1)",
    "rgba(191, 0, 31, 1)",
    "rgba(255, 0, 0, 1)",
  ];

  heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
}

function changeRadius() {
  heatmap.set("radius", heatmap.get("radius") ? null : 20);
}

function changeOpacity() {
  heatmap.set("opacity", heatmap.get("opacity") ? null : 0.2);
}


// グローバル変数pointsを定義します。この変数には、CSVファイルから読み込んだ座標データが格納されます。
let points = [];

// CSVファイルから座標データを非同期に読み込みます。
Papa.parse('superdata.csv', {
  download: true,
  header: true,
  dynamicTyping: true,
  complete: function (results) {
    // CSVデータがパースされると、このコールバック関数が呼び出されます。
    // パースされた各行に対して処理を行い、LatLngオブジェクトを作成します。
    points = results.data.map(row => {
      console.log(`Parsing row: ${JSON.stringify(row)}`);

      if (row.latitude !== null && row.longitude !== null) {
        return new google.maps.LatLng(row.latitude, row.longitude);
      } else {
        console.log(`Invalid data: ${JSON.stringify(row)}`);
        return null;
      }
    }).filter(point => point !== null);  // filter out any null points
    // CSVファイルの読み込みが完了したら、initMap関数を呼び出します。
    initMap();
  }
});

// LatLngオブジェクトの配列を返す関数を定義します。
function getPoints() {
  return points;
}

// window.initMap = initMap; の行は削除します。
