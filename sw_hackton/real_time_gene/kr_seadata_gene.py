# 우에노고홍_0804_지행중
# 기능 :좌표를 4개 정하고, 그범위에 그리드 출현빈도 설정후, 범위 안에 random죄표를 만들어 csv에 자장
# 추가 예정: 좌표 그리드에 그라데이션을 추가
#           좌표 추가
# 저장 CSV :kr_sea_data.csv
import csv
import random
import numpy as np
# 좌표 범위와 값의 출현 빈도 설정
# 座標範囲と値の出現頻度を設定
ranges = {
    '제주도 ': {'lat': (31.0, 34.50), 'lon': (121.8, 129.3), 'value_probs': np.array([0.7, 0, 0, 0, 0.05])},
    '동종국해(제주도 아래)': {'lat': (28.0, 31.0), 'lon': (122.0, 130.0)},
    '황해 1': {'lat': (34.5, 35.8), 'lon': (120.1, 126.20), 'value_probs': np.array([0.6, 0.1, 0.1, 0.1, 0.1])},
    '황해 2': {'lat': (35.8, 36.8), 'lon': (121.1, 126.50)},
    '동해 아래 1': {'lat': (37.3, 41.5), 'lon': (128.8, 138.5)},
    '동해 아래 2' : {'lat': (35.4, 41.5), 'lon': ( 130.5, 135.5)},
    '동해 위': {'lat': (41.5, 42.5), 'lon': (130.2, 139.5)},
    '후크오카_한국': {'lat': (33.58,34.84), 'lon': (127.78, 130.26)},
    '서해': {'lat': (34.5, 35.8), 'lon': (127.78, 130.26)},
}

results = []
# default_value_probs = np.array([0.7, 0.2, 0.10, 0.08, 0.04])  # 기본 출현 빈도/デフォルトの出現頻度
default_value_probs = np.array([0.7, 0.2, 0.0, 0.0, 0.0])

# 각 해역에 대해
# 各海域について
for sea in ranges.keys():
    value_probs = ranges[sea].get('value_probs', default_value_probs)
    value_probs = value_probs / value_probs.sum()  # 정규화/正規化

    lat_range = ranges[sea]['lat'][1] - ranges[sea]['lat'][0]
    lon_range = ranges[sea]['lon'][1] - ranges[sea]['lon'][0]
    area = lat_range * lon_range  # 面積を計算/면적을 계산

    num_coordinates = int(area * 2)  # 面積に応じた座標の数/면적에 따른 좌표 수

    # 指定された数の座標を生成
    # 지정된 수의 좌표 생성
    for _ in range(num_coordinates):
        lat = round(random.uniform(*ranges[sea]['lat']), 4)
        lon = round(random.uniform(*ranges[sea]['lon']), 4)
        value = np.random.choice(np.arange(1, 6), p=value_probs)
        results.append((lat, lon, value))

# CSVファイルに保存
# CSVファイルに保存
with open('./real_time_gene/kr_sea_data.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['latitude', 'longitude', 'value'])

    for i, result in enumerate(results):
        line = ','.join(map(str, result))
        if i != len(results) - 1:
            line += '\n'
        file.write(line)

# DataFrameの最初の数行を表示
# DataFrame의 처음 몇 행을 보여주기
print(results[:5])
