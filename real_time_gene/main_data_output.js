// Firebaseの設定と初期化
var firebase = require("firebase/app");
require("firebase/database");

var firebaseConfig = {
    apiKey: "AIzaSyA9OJf8_t3cQ6cnX-GCEZX5kpDxcq3us2A",
    authDomain: "model-craft-391306.firebaseapp.com",
    databaseURL: "https://model-craft-391306-default-rtdb.firebaseio.com",
    projectId: "model-craft-391306",
    storageBucket: "model-craft-391306.appspot.com",
    messagingSenderId: "54080375203",
    appId: "1:54080375203:web:2c7553ce4a44a6e96cb216",
    measurementId: "G-GN648GFCTK"
};

// Firebaseアプリの初期化
firebase.initializeApp(firebaseConfig);

// Realtime Databaseの参照を取得
var dbRef = firebase.database().ref("あなたのパス");

// データを取得してターミナルに表示
dbRef.on("value", function(snapshot) {
    console.log(snapshot.val());
}, function (errorObject) {
    console.log("データの読み取りに失敗しました: " + errorObject.code);
});

// "한국어": Firebase 설정 및 초기화
// "日本語": Firebaseの設定と初期化
