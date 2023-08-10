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
firebase.initializeApp(firebaseConfig);

function fetchDataById() {
  var inputId = document.getElementById('idInput').value;
  var dbRef = firebase.database().ref('A-1/' + inputId);
  dbRef.once("value").then(function (snapshot) {
      var data = snapshot.val();
      if (data) {
          var content = JSON.stringify(data, null, 2);
          document.getElementById('data').innerText = content;
          drawGaugeChart(data['Grade']);
      } else {
          document.getElementById('data').innerText = '해당 ID의 데이터를 찾을 수 없습니다.';
      }
  }).catch(function (error) {
      console.log("데이터 읽기 실패: ", error);
  });
}

function drawGaugeChart(grade) {
  var chart = echarts.init(document.getElementById('gauge_chart'));
  var option = {
      series: [{
          type: 'gauge',
          min: 0,
          max: 6,
          splitNumber: 6, // 축을 분할할 선의 수
          axisLabel: {
              formatter: function (value) {
                  return value === 0 || value === 6 ? '' : value; // 0과 6은 표시하지 않음
              }
          },
          axisLine: {
              lineStyle: {
                  width: 10,
                  color: [
                      [0.5 / 6, '#ffffff'],
                      [1.5 / 6, '#00ffff'],
                      [2.5 / 6, '#00ff00'],
                      [3.5 / 6, '#ffff00'],
                      [4.5 / 6, '#ffcc00'],
                      [5.5 / 6, '#ff0000'],
                      [6, '#ffffff']
                  ]
              }
          },
          detail: {
              valueAnimation: true,
              fontSize: 20,
              formatter: 'Grade: {value}'
          },
          data: [{ value: grade }]
      }]
  };
  chart.setOption(option);
}