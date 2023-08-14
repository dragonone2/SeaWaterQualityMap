
# real_data_input.py
# 우에노고홍_0806_지행중
# 기능 :max,min를 정해서 random으로 생성하여,DB에 5초마다 저장
# 추가 예정 : 탁도 데이터
# 저장 주소 :table_name>>real_times_data
#           데이터베이스>>super_data

# random year_data generate python code
import pandas as pd
import numpy as np
import datetime
import time
import random
from firebase_admin import initialize_app, credentials, db

# 각 컬럼에 대한 값 범위 정의 / 各列の値の範囲を定義
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

# 고유 해안 이름 정의 / 固有の海岸名を定義
unique_coastal_names = ['진해만', '거제도동안', '거제도남안', '통영연안', '통영외안', '고성자란만', '사천연안', '진주만',
'남해도남안', '여수연안', '여자만', '고흥연안', '제주연안', '조천연안', '성산연안', '표선연안',
'서귀포연안', '대정연안', '한림연안', '진도연안', '해남만', '기장연안', '거진연안', '속초연안',
'양양연안', '주문진연안', '강릉연안', '동해연안', '삼척연안', '죽변연안', '후포연안', '축산연안',
'강구연안', '월포연안', '영일만', '구룡포연안', '감포연안', '신안연안', '무안연안', '고창연안',
'전주포연안', '군산연안', '보령연안', '태안연안', '가로림연안', '대산연안', '아산연안', '천수만',
'목포연안']

# 생성할 행 수 정의 / 生成する行数を定義
num_rows = 1  # 한 번에 생성되는 행 수를 1로 변경 / 一度に生成される行数を1に変更

# 랜덤 데이터를 생성할 컬럼 정의 / ランダムデータを生成する列を定義
random_columns = list(min_values.keys())

cred = credentials.Certificate(r'G:\내 드라이브\sw_hackton\real_time_gene\model-craft-391306-firebase-adminsdk-v8jx8-8b0ef4e372.json')
app = initialize_app(cred, {'databaseURL': 'https://model-craft-391306-default-rtdb.firebaseio.com/'})
# 루프를 통해 5초마다 랜덤 데이터 생성 및 데이터베이스 추가 / ループを通じて5秒ごとにランダムデータ生成とデータベース追加

ref = db.reference('realtime_data')

data = ref.get()
if data is not None:
    max_id = len(data)
else:
    max_id = 0

i = max_id
# 座標生成スクリプトから生成される座標データ
ranges = {
    '제주도 ': {'lat': (31.0, 34.50), 'lon': (121.8, 129.3), 'value_probs': np.array([0.7, 0, 0, 0, 0.05])},
    '동종국해(제주도 아래)': {'lat': (28.0, 31.0), 'lon': (122.0, 130.0)},
    '황해 1': {'lat': (34.5, 35.8), 'lon': (120.1, 126.20), 'value_probs': np.array([0.6, 0.1, 0.1, 0.1, 0.1])},
    '황해 2': {'lat': (35.8, 36.8), 'lon': (121.1, 126.50)},
    '동해 아래 1': {'lat': (37.3, 41.5), 'lon': (128.8, 138.5)},
    '동해 아래 2' : {'lat': (35.4, 41.5), 'lon': ( 130.5, 135.5)},
    '동해 위': {'lat': (41.5, 42.5), 'lon': (130.2, 139.5)},
    '후크오카_한국': {'lat': (33.58,34.84), 'lon': (127.78, 130.26)},
}  # 座標範囲と値の出現頻度を設定します
while True:
    # 고정 값 정의 / 固定値を定義
    fixed_values = {
        "times": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),  # 年-月-日 時:分:秒 形式で時間を表示
        "area": np.random.choice(["남해", "동해", "서해"], num_rows),
        "coastal_name": np.random.choice(unique_coastal_names, num_rows),
        "layer_name": "표층",
    }

    # 랜덤 데이터 생성 / ランダムデータの生成
    random_data = {}
    for column in random_columns:
        raw_data = np.random.uniform(min_values[column], max_values[column], num_rows)
        random_data[column] = np.around(raw_data, 2)  # 소수점 두 자리까지 반올림 / 小数点以下2桁まで四捨五入

    # 고정값과 랜덤 데이터를 단일 DataFrame으로 결합 / 固定値とランダムデータを単一のDataFrameに結合
    df_random = pd.DataFrame({**fixed_values, **random_data})

    # DataFrameのindexを1から始まるようにリセット / DataFrameのindexを1から始めるようにリセット
    df_random.reset_index(drop=True, inplace=True)
    df_random.index += 1

        # SDの範囲と増分を設定します / SD의 범위와 증분을 설정
    start, end, step = 2.5, 8.5, 0.5
    df_random['SD'] = np.round(np.random.choice(np.arange(start, end + step, step), num_rows), 1)

    # 수질 평가 지수를 계산합니다 / 水質評価指数を計算
    df_random['WQI'] = (10 * df_random['dissolved_oxygen'] + 6 * ((df_random['chlorophyll'] + df_random['SD']) / 2) + 4 * ((df_random['DIN'] + df_random['DIP']) / 2)).astype(int)

    # 수질 평가 등급을 계산합니다 / 水質評価等級を計算
    grades = ['I (매우 좋음)', 'II (좋음)', 'III (보통)', 'IV (나쁨)', 'V (아주 나쁨)']
    df_random['Grade'] = pd.cut(df_random['WQI'], bins=[0, 23, 33, 46, 59, float('inf')], labels=grades, include_lowest=True)

    # 座標生成スクリプトから生成される座標データ / 좌표 생성 스크립트로부터 생성되는 좌표 데이터
    sea = random.choice(list(ranges.keys()))  # 海域をランダムに選択します / 해역을 랜덤으로 선택
    lat = round(random.uniform(*ranges[sea]['lat']), 4)
    lon = round(random.uniform(*ranges[sea]['lon']), 4)

    # 座標データ를 DataFrameに 추가합니다 / 좌표 데이터를 DataFrame에 추가
    df_random['latitude'] = lat
    df_random['longitude'] = lon

    # 保存したい順序で列名を並び替え / 保存したい順序で列名を並べ替えます
    columns_order = ['times', 'latitude', 'longitude','WQI', 'Grade','area', 'coastal_name', 'layer_name', 'temperature', 'salinity', 'pH', 'dissolved_oxygen', 'COD', 'chlorophyll', 'TN', 'DIP', 'TP', 'Si_OH4', 'SPM', 'DIN', 'SD']

    # 新しい順序で列を並び替え / 新しい順序で列を並べ替えます
    df_random = df_random[columns_order]

    # データベースへの保存処理 / データベースへの保存処理
    ref.child(str(i)).set(df_random.to_dict(orient='records')[0])
    i += 1

    print(f"{df_random}")
    time.sleep(5)  # 5秒間待つ / 5秒待機



