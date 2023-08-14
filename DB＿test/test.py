import pandas as pd
import numpy as np
import datetime
import random
import os
from firebase_admin import initialize_app, credentials, db

# ランダムデータ生成
def generate_random_data(min_values, max_values, num_rows):
    random_data = {}
    for column in list(min_values.keys()):
        raw_data = np.random.uniform(min_values[column], max_values[column], num_rows)
        random_data[column] = np.around(raw_data, 2)
    return random_data

# 水質評価指数を計算
def calculate_water_quality_index(df_random):
    # 各種計算ロジックをここで実行
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

    df_random['Grade'] = result_re
    return df_random

# 座標データを生成
def generate_coordinates(ranges):
    sea = random.choice(list(ranges.keys()))
    lat = round(random.uniform(*ranges[sea]['lat']), 4)
    lon = round(random.uniform(*ranges[sea]['lon']), 4)
    return lat, lon

# データフレーム整形
def prepare_dataframe(random_data, lat, lon):
    fixed_values = {
        "times": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),  # 年-月-日 時:分:秒 形式で時間を表示
        "area": np.random.choice(['제주도 ','동종국해(제주도 아래)', '황해 1','황해 2','동해 아래 1','동해 아래 2','동해 위','후쿠오카 한국'], num_rows),
        "layer_name": "표층",
    }
    df_random = pd.DataFrame({**fixed_values, **random_data})
    # DataFrameの整形処理
    # ...
    df_random['latitude'] = lat
    df_random['longitude'] = lon
    return df_random

# データベースへ保存
def save_to_database(table_name, df_random, table_counters):
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

# メインのロジック
def main():
    # 変数定義
    # ...
    while True:
        for table_name in table_names:
            random_data = generate_random_data(min_values, max_values, num_rows)
            lat, lon = generate_coordinates(ranges)
            df_random = prepare_dataframe(random_data, lat, lon)
            df_random = calculate_water_quality_index(df_random)
            save_to_database(table_name, df_random, table_counters)

if __name__ == "__main__":
    main()
