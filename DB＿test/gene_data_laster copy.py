

# 우에노고홍
# 기능 :データベースを１～から５０まで作り、その中のデータを１からコードが止まるまで続く
# 修正必要：中の２からのデータもランダムである部分。またコードの性質上一気にかけない部分
# 추가 예정 : 탁도 데이터
# 저장 주소 :데이터베이스>>A-1~A-50

# random year_data generate python code
import pandas as pd
import numpy as np
import datetime
import random
import os
from firebase_admin import initialize_app, credentials, db

min_values = {
    "temperature": 12.92,
    "salinity": 29.06,
    "pH": 8.05,
    "dissolved_oxygen": 7.6,
    "COD": 1.03,
    "chlorophyll": 0.43,
    "TN": 121.6,
    "DIP": 4.1,
    "TP": 13.6,
    "Si_OH4": 100.9,
    "SPM": 4.4,
    "DIN": 30.2
}
max_values = {
    "temperature": 18.95,
    "salinity": 33.87,
    "pH": 8.26,
    "dissolved_oxygen": 10.04,
    "COD": 2.21,
    "chlorophyll": 4.2,
    "TN": 389.0,
    "DIP": 25.9,
    "TP": 39.3,
    "Si_OH4": 476.5,
    "SPM": 50.4,
    "DIN": 237.1
}
ranges = {
    '제주도 ': {'lat': (31.0, 34.50), 'lon': (121.8, 129.3), 'value_probs': np.array([0.7, 0, 0, 0, 0.05])},
    '동종국해(제주도 아래)': {'lat': (28.0, 31.0), 'lon': (122.0, 130.0)},
    '황해 1': {'lat': (34.5, 35.8), 'lon': (120.1, 126.20), 'value_probs': np.array([0.6, 0.1, 0.1, 0.1, 0.1])},
    '황해 2': {'lat': (35.8, 36.8), 'lon': (121.1, 126.50)},
    '동해 아래 1': {'lat': (37.3, 41.5), 'lon': (128.8, 138.5)},
    '동해 아래 2': {'lat': (35.4, 41.5), 'lon': (130.5, 135.5)},
    '동해 위': {'lat': (41.5, 42.5), 'lon': (130.2, 139.5)},
    '후쿠오카 한국': {'lat': (33.58, 34.84), 'lon': (127.78, 130.26)},
}

num_rows = 1
random_columns = list(min_values.keys())

current_dir = os.path.dirname(os.path.abspath(__file__))
cred_path = os.path.join(
    current_dir, 'model-craft-391306-firebase-adminsdk-v8jx8-8b0ef4e372.json')
cred = credentials.Certificate(cred_path)
app = initialize_app(
    cred, {'databaseURL': 'https://model-craft-391306-default-rtdb.firebaseio.com/'})

# テーブル名リストを生成 / 테이블 이름 리스트 생성
table_names = [f"A-{i}" for i in range(1, 2)]  # A-1からA-50までのテーブル名をリスト化

# 各テーブルごとのカウンタを持つ辞書
table_counters = {name: 1 for name in table_names}

while True:
    for table_name in table_names:  # 各テーブル名に対してループ





        # DataFrameのindexを1から始まるようにリセット / DataFrameのindexを1から始めるようにリセット
        df_random.reset_index(drop=True, inplace=True)
        df_random.index += 1

        # SDの範囲と増分を設定します / SD의 범위와 증분을 설정
        start, end, step = 1, 6, 1
        df_random['SD'] = np.round(np.random.choice(
            np.arange(start, end + step, step), num_rows), 1)







        # 保存したい順序で列名を並び替え / 保存したい順序で列名を並べ替えます
        columns_order = ['times', 'latitude', 'longitude', 'Grade', 'area', 'layer_name', 'temperature', 'salinity',
                        'pH', 'dissolved_oxygen', 'COD', 'chlorophyll', 'TN', 'DIP', 'TP', 'Si_OH4', 'SPM', 'DIN', 'SD']

        # 新しい順序で列を並び替え / 新しい順序で列を並べ替えます
        df_random = df_random[columns_order]

        ref = db.reference(table_name)  # 参照するテーブル名を指定

        i = table_counters[table_name] # このテーブルのカウンタを取得

        # データベースへの保存処理
        ref.child(str(i)).set(df_random.to_dict(orient='records')[0])

        print(f"{table_name}: {df_random}")

        table_counters[table_name] += 1  # このテーブルのカウンタをインクリメント

        # 1番目のランダムデータを取得
        first_data = df_random

        # 範囲からランダムにキーを選ぶ
        chosen_range_key = np.random.choice(list(ranges.keys()))

        # 選択した範囲から座標を取得
        chosen_range = ranges[chosen_range_key]
        lat_range = chosen_range['lat']
        lon_range = chosen_range['lon']

        # 現在の座標を取得
        current_lat = first_data['latitude']
        current_lon = first_data['longitude']

        # 移動速度の制限（例: km/h）
        speed_limit = 10

        # 移動方向をランダムに選ぶ（例: 角度をラジアンで）
        direction = np.random.uniform(0, 2 * np.pi)

        # 移動距離を計算（例: km）
        distance = np.random.uniform(0, speed_limit)

        # 緯度経度を距離に変換（大まかな換算、地球を球体と仮定）
        earth_radius = 6371  # 地球の半径（km）
        delta_lat = (distance / earth_radius) * (180 / np.pi)
        delta_lon = delta_lat / np.cos(current_lat * np.pi / 180)

        # 新しい座標を計算
        new_lat = current_lat + delta_lat * np.sin(direction)
        new_lon = current_lon + delta_lon * np.cos(direction)

        # 新しい座標をデータに適用
        first_data['latitude'] = new_lat
        first_data['longitude'] = new_lon


        # 他の値も同様に変換
        for key, min_val in min_values.items():
            max_val = max_values[key]
            first_data[key] = np.random.uniform(min_val, max_val)

        # データベースへの保存処理
        ref.child(str(i)).set(first_data.to_dict(orient='records')[0])