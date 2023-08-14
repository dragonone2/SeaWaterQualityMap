
#원본
# 우에노고홍
# 기능 :データベースを１作り、その中のデータを０からコードが止まるまで続く
# 修正必要：中の２からのデータもランダムである部分。
# 추가 예정 : 탁도 데이터
# 저장 주소 :데이터베이스>>A-1

# random year_data generate python code
import pandas as pd
import numpy as np
import datetime
import time
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

num_rows = 1
random_columns = list(min_values.keys())

current_dir = os.path.dirname(os.path.abspath(__file__))
cred_path = os.path.join(
    current_dir, 'model-craft-391306-firebase-adminsdk-v8jx8-8b0ef4e372.json')
cred = credentials.Certificate(cred_path)
app = initialize_app(
    cred, {'databaseURL': 'https://model-craft-391306-default-rtdb.firebaseio.com/'})

ref = db.reference('A-2')

data = ref.get()
if data is not None:
    max_id = len(data)
else:
    max_id = 0

i = max_id

ranges = {
    '제주도 ': {'lat': (31.0, 34.50), 'lon': (121.8, 129.3), 'value_probs': np.array([0.7, 0, 0, 0, 0.05])},
    '동종국해(제주도 아래)': {'lat': (28.0, 31.0), 'lon': (122.0, 130.0)},
    '황해 1': {'lat': (34.5, 35.8), 'lon': (120.1, 126.20), 'value_probs': np.array([0.6, 0.1, 0.1, 0.1, 0.1])},
    '황해 2': {'lat': (35.8, 36.8), 'lon': (121.1, 126.50)},
    '동해 아래 1': {'lat': (37.3, 41.5), 'lon': (128.8, 138.5)},
    '동해 아래 2': {'lat': (35.4, 41.5), 'lon': (130.5, 135.5)},
    '동해 위': {'lat': (41.5, 42.5), 'lon': (130.2, 139.5)},
    '후쿠오카_한국': {'lat': (33.58, 34.84), 'lon': (127.78, 130.26)},
}
while True:
    # 고정 값 정의 / 固定値を定義
    fixed_values = {
        "times": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),  # 年-月-日 時:分:秒 形式で時間を表示
        "area": np.random.choice(["남해", "동해", "서해"], num_rows),
        "layer_name": "표층",
    }
    # 랜덤 데이터 생성 / ランダムデータの生成
    random_data = {}
    for column in random_columns:
        raw_data = np.random.uniform(
            min_values[column], max_values[column], num_rows)
        # 소수점 두 자리까지 반올림 / 小数点以下2桁まで四捨五入
        random_data[column] = np.around(raw_data, 2)

    # 고정값과 랜덤 데이터를 단일 DataFrame으로 결합 / 固定値とランダムデータを単一のDataFrameに結合
    df_random = pd.DataFrame({**fixed_values, **random_data})

    # DataFrameのindexを1から始まるようにリセット / DataFrameのindexを1から始めるようにリセット
    df_random.reset_index(drop=True, inplace=True)
    df_random.index += 1

    # SDの範囲と増分を設定します / SD의 범위와 증분을 설정
    start, end, step = 1, 6, 1
    df_random['SD'] = np.round(np.random.choice(
        np.arange(start, end + step, step), num_rows), 1)

    # 수질 평가 지수를 계산합니다 / 水質評価指数を計算

    DOValue = df_random['dissolved_oxygen']
    ChlValue = df_random['chlorophyll']
    DINValue = df_random['DIN']
    DIPValue = df_random['DIP']

    DOValue = (DOValue / 9.1) * 100

    if DOValue.item() > 90:
        DoValue_DO = 1
    elif DOValue.item() > 81:
        DoValue_DO = 2
    elif DOValue.item() > 67.5:
        DoValue_DO = 3
    elif DOValue.item() > 45:
        DoValue_DO = 4
    else:
        DoValue_DO = 5

    if ChlValue.item() < 6.3:
        ChlValue_Chl = 1
    elif ChlValue.item() < 6.93:
        ChlValue_Chl = 2
    elif ChlValue.item() < 7.88:
        ChlValue_Chl = 3
    elif ChlValue.item() < 9.45:
        ChlValue_Chl = 4
    else:
        ChlValue_Chl = 5

    if DINValue.item() < 220:
        DINValue_DIN = 1
    elif DINValue.item() < 242:
        DINValue_DIN = 2
    elif DINValue.item() < 275:
        DINValue_DIN = 3
    elif DINValue.item() < 330:
        DINValue_DIN = 4
    else:
        DINValue_DIN = 5

    if DIPValue.item() < 35:
        DIPValue_DIP = 1
    elif DIPValue.item() < 38.50:
        DIPValue_DIP = 2
    elif DIPValue.item() < 43.75:
        DIPValue_DIP = 3
    elif DIPValue.item() < 52.50:
        DIPValue_DIP = 4
    else:
        DIPValue_DIP = 5

    result = 10 * DoValue_DO + 6 * \
        ((ChlValue_Chl + df_random['SD']) / 2) + \
        4 * ((DINValue_DIN + DIPValue_DIP) / 2)
    result_re = result

    if result_re.item() <= 23:
        result_re = 1
    elif result_re.item() <= 33:
        result_re = 2
    elif result_re.item() <= 46:
        result_re = 3
    elif result_re.item() <= 59:
        result_re = 4
    else:
        result_re = 5

    Grade = result_re

    # 수질 평가 등급을 계산합니다 / 水質評価等級を計算

    df_random['Grade'] = result_re

    # 座標生成スクリプトから生成される座標データ / 좌표 생성 스크립트로부터 생성되는 좌표 데이터
    sea = random.choice(list(ranges.keys()))  # 海域をランダムに選択します / 해역을 랜덤으로 선택
    lat = round(random.uniform(*ranges[sea]['lat']), 4)
    lon = round(random.uniform(*ranges[sea]['lon']), 4)

    # 座標データ를 DataFrameに 추가합니다 / 좌표 데이터를 DataFrame에 추가
    df_random['latitude'] = lat
    df_random['longitude'] = lon

    # 保存したい順序で列名を並び替え / 保存したい順序で列名を並べ替えます
    columns_order = ['times', 'latitude', 'longitude', 'Grade', 'area', 'layer_name', 'temperature', 'salinity',
                     'pH', 'dissolved_oxygen', 'COD', 'chlorophyll', 'TN', 'DIP', 'TP', 'Si_OH4', 'SPM', 'DIN', 'SD']

    # 新しい順序で列を並び替え / 新しい順序で列を並べ替えます
    df_random = df_random[columns_order]

    # データベースへの保存処理 / データベースへの保存処理
    ref.child(str(i)).set(df_random.to_dict(orient='records')[0])
    i += 1

    print(f"{df_random}")
    time.sleep(5)  # 5秒間待つ / 5秒待機
