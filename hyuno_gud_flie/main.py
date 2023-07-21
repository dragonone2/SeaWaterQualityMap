import csv
import random
import numpy as np

# 座標範囲と値の出現頻度を設定
ranges = {
    'coordinate1': {'lat': (31.33, 33.71), 'lon': (123.1, 128.3), 'value_probs': np.array([0.7, 0, 0, 0, 0.05])},
    'coordinate2': {'lat': (33.9, 37.8), 'lon': (123.1, 126.20), 'value_probs': np.array([0.6, 0.1, 0.1, 0.1, 0.1])},
    'coordinate3': {'lat': (37.3, 40.0), 'lon': (129.2, 132.0)},
    'coordinate4': {'lat': (28.0, 34.0), 'lon': (126.0, 130.0)},
    'coordinate5': {'lat': (35.99,41.99), 'lon': (130.0, 135.42), 'value_probs': np.array([0.5, 0.09, 0.06, 0.02, 0.01])},
    'coordinate6': {'lat': (33.55,36.75), 'lon': (130.0, 131.34)},
    '후크오카_한국': {'lat': (33.58,34.84), 'lon': (127.78, 130.26)},
    '중국쪽01': {'lat': (31.12,37.08), 'lon': (121.30, 123.79), 'value_probs': np.array([0.1, 0.2, 0.3, 0.2, 0.2])},
}

results = []
default_value_probs = np.array([0.7, 0.2, 0.10, 0.08, 0.04])  # デフォルトの出現頻度

# 各海域について
for sea in ranges.keys():
    value_probs = ranges[sea].get('value_probs', default_value_probs)
    value_probs = value_probs / value_probs.sum()  # 正規化

    # 100個の座標を生成
    for _ in range(100):
        lat = round(random.uniform(*ranges[sea]['lat']), 4)
        lon = round(random.uniform(*ranges[sea]['lon']), 4)
        value = np.random.choice(np.arange(1, 6), p=value_probs)
        results.append((lat, lon, value))

# CSVファイルに保存
with open('./hyuno_gud_flie/kr_sea_data.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['latitude', 'longitude', 'value'])
    writer.writerows(results)
