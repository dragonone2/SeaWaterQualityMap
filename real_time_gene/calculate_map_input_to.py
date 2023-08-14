# 용도 : 위치정보 추가후 맵에 이용
# 기능 :  DB에서 가지고 온 데이터를 계산하여 등급을 매긴다
# 투명도 SD>>> random
import pandas as pd
import numpy as np
import random
from sqlalchemy import create_engine

# 데이터베이스 연결 생성 / データベース接続を作成します
username = 'root'
password = ''
hostname = 'localhost'
database_name = 'super_data'
table_name = 'real_tiems_data'
engine = create_engine(f'mysql+pymysql://{username}:{password}@{hostname}/{database_name}')

# 테이블 데이터를 읽어옵니다 / テーブルデータを読み込みます
df = pd.read_sql(f'SELECT * FROM {table_name}', con=engine)

# SDの範囲と増分を設定します / SDの範囲と増分を設定します
start, end, step = 2.5, 8.5, 0.5

# SD(투명度)のデータがないのでランダムな値を生成します
np.random.seed(0)  # 同じランダム結果を再現するためのシード値 / 같은 랜덤 결과를 재현하기 위한 시드값
df['SD'] = np.round(np.random.choice(np.arange(start, end + step, step), df.shape[0]), 1)


# 수질 평가 지수를 계산합니다 / 水質評価指数を計算します
df['WQI'] = (10 * df['dissolved_oxygen'] + 6 * ((df['chlorophyll'] + df['SD']) / 2) + 4 * ((df['DIN'] + df['DIP']) / 2)).astype(int)


# 수질 평가 등급을 계산합니다 / 水質評価等級を計算します
grades = ['I (매우 좋음)', 'II (좋음)', 'III (보통)', 'IV (나쁨)', 'V (아주 나쁨)']
df['Grade'] = pd.cut(df['WQI'], bins=[0, 23, 33, 46, 59, float('inf')], labels=grades, include_lowest=True)

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
results = []

num_rows = df.shape[0]  # データベースから読み取った行数

for _ in range(num_rows):
    sea = random.choice(list(ranges.keys()))  # 海域をランダムに選択します
    lat = round(random.uniform(*ranges[sea]['lat']), 4)
    lon = round(random.uniform(*ranges[sea]['lon']), 4)
    results.append((lat, lon))

# 座標データ를 DataFrame에 변환합니다 / 座標データをDataFrameに変換します
coordinate_df = pd.DataFrame(results, columns=['latitude', 'longitude'])

# 座標 데이터와 수질 데이터를 합칩니다 / 座標データと水質データを結合します
combined_df = pd.concat([df, coordinate_df], axis=1)

# 결과를 CSV 파일에 저장합니다 / 結果をCSVファイルに保存します
combined_df.to_csv('./real_time_gene/water_quality.csv', index=False)



"""
Impact_DO,Impact_Chloro_SD,Impact_DIN_DIP
20.736165171771876,5.131832797427653,74.24640379082757
---------------WQI추가 후 배컵(로직 실패)--------------------------------
import pandas as pd
import numpy as np
import random
from sqlalchemy import create_engine
import csv

# 데이터베이스 연결 생성 / データベース接続を作成します
username = 'root'
password = ''
hostname = 'localhost'
database_name = 'super_data'
table_name = 'real_tiems_data'
engine = create_engine(f'mysql+pymysql://{username}:{password}@{hostname}/{database_name}')

# 테이블 데이터를 읽어옵니다 / テーブルデータを読み込みます
df = pd.read_sql(f'SELECT * FROM {table_name}', con=engine)

# SDの範囲と増分を設定します / SDの範囲と増分を設定します
start, end, step = 2.5, 8.5, 0.5

# SD(투명度)のデータがないのでランダムな値を生成します
np.random.seed(0)  # 同じランダム結果を再現するためのシード値 / 같은 랜덤 결과를 재현하기 위한 시드값
df['SD'] = np.round(np.random.choice(np.arange(start, end + step, step), df.shape[0]), 1)


# 수질 평가 지수를 계산합니다 / 水質評価指数を計算します
df['WQI'] = (10 * df['dissolved_oxygen'] + 6 * ((df['chlorophyll'] + df['SD']) / 2) + 4 * ((df['DIN'] + df['DIP']) / 2)).astype(int)

# 수질 평가 등급을 계산합니다 / 水質評価等級を計算します
grades = ['I (매우 좋음)', 'II (좋음)', 'III (보통)', 'IV (나쁨)', 'V (아주 나쁨)']
df['Grade'] = pd.cut(df['WQI'], bins=[0, 23, 33, 46, 59, float('inf')], labels=grades, include_lowest=True)

# 座標生成スクリプトから生成される座標データ
ranges = {
    'coordinate1': {'lat': (31.33, 33.71), 'lon': (123.1, 128.3), 'value_probs': np.array([0.7, 0, 0, 0, 0.05])},
    'coordinate2': {'lat': (33.9, 37.8), 'lon': (123.1, 126.20), 'value_probs': np.array([0.6, 0.1, 0.1, 0.1, 0.1])},
    'coordinate3': {'lat': (37.3, 40.0), 'lon': (129.2, 132.0)},
    'coordinate4': {'lat': (28.0, 34.0), 'lon': (126.0, 130.0)},
    'coordinate5': {'lat': (35.99,41.99), 'lon': (130.0, 135.42), 'value_probs': np.array([0.5, 0.09, 0.06, 0.02, 0.01])},
    'coordinate6': {'lat': (33.55,36.75), 'lon': (130.0, 131.34)},
    '후크오카_한국': {'lat': (33.58,34.84), 'lon': (127.78, 130.26)},
    '중국쪽01': {'lat': (31.12,37.08), 'lon': (121.30, 123.79), 'value_probs': np.array([0.1, 0.2, 0.3, 0.2, 0.2])},
}  # 座標範囲と値の出現頻度を設定します
results = []

num_rows = df.shape[0]  # データベースから読み取った行数

for _ in range(num_rows):
    sea = random.choice(list(ranges.keys()))  # 海域をランダムに選択します
    lat = round(random.uniform(*ranges[sea]['lat']), 4)
    lon = round(random.uniform(*ranges[sea]['lon']), 4)
    results.append((lat, lon))

# 座標データ를 DataFrame에 변환합니다 / 座標データをDataFrameに変換します
coordinate_df = pd.DataFrame(results, columns=['latitude', 'longitude'])

# 座標データと水質データを結合します / 座標データ와 수질 데이터를 합칩니다
combined_df = pd.concat([df, coordinate_df], axis=1)

# WQI를 계산 / WQIを計算する
combined_df['WQI_calculated'] = (10 * combined_df['dissolved_oxygen'] + 6 * ((combined_df['chlorophyll'] + combined_df['SD']) / 2) + 4 * ((combined_df['DIN'] + combined_df['DIP']) / 2)).astype(int)

# 각 항목의 평균을 계산 / 各項目の平均値を計算する
avg_dissolved_oxygen = combined_df['dissolved_oxygen'].mean()
avg_chlorophyll_SD = ((combined_df['chlorophyll'] + combined_df['SD']) / 2).mean()
avg_DIN_DIP = ((combined_df['DIN'] + combined_df['DIP']) / 2).mean()

# 각 항목이 WQI에 미치는 영향을 계산 / 各項目のWQIへの影響を計算する
impact_dissolved_oxygen = 10 * avg_dissolved_oxygen / combined_df['WQI_calculated'].mean() * 100
impact_chlorophyll_SD = 6 * avg_chlorophyll_SD / combined_df['WQI_calculated'].mean() * 100
impact_DIN_DIP = 4 * avg_DIN_DIP / combined_df['WQI_calculated'].mean() * 100

# 影響を新しい列として追加 / 영향을 새로운 열로 추가
combined_df['Impact_DO'] = impact_dissolved_oxygen
combined_df['Impact_Chloro_SD'] = impact_chlorophyll_SD
combined_df['Impact_DIN_DIP'] = impact_DIN_DIP

# 結果をCSVファイル에 저장します / 결과를 CSV 파일에 저장합니다
combined_df.to_csv('./real_time_gene/water_quality.csv', index=False)


---------------座標を追加前バックアップ--------------------------------
import pandas as pd
import numpy as np
from sqlalchemy import create_engine

# 데이터베이스 연결 생성 / データベース接続を作成します
# MySQLデータベースに接続する
username = 'root'
password = ''
hostname = 'localhost'
database_name = 'super_data'
table_name = 'real_tiems_data'
engine = create_engine(f'mysql+pymysql://{username}:{password}@{hostname}/{database_name}')

# 테이블 데이터를 읽어옵니다 / テーブルデータを読み込みます
df = pd.read_sql('SELECT * FROM real_tiems_data', con=engine)

# SD(투명도) 데이터가 없으므로 무작위 값을 생성합니다 / SD(透明度)のデータがないのでランダムな値を生成します
# ここでは0から10の範囲でランダムな浮動小数点数を生成します / 여기서는 0에서 10까지의 범위에서 무작위 부동소수점 수를 생성합니다
df['SD'] = np.random.uniform(0, 10, df.shape[0])

# 수질평가지수를 계산합니다 / 水質評価指数を計算します
df['WQI'] = 10 * df['dissolved_oxygen'] + 6 * ((df['chlorophyll'] + df['SD']) / 2) + 4 * ((df['DIN'] + df['DIP']) / 2)

# 수질평가 등급을 계산합니다 / 水質評価等級を計算します
conditions = [
    (df['WQI'] <= 23),
    (df['WQI'] > 23) & (df['WQI'] <= 33),
    (df['WQI'] > 33) & (df['WQI'] <= 46),
    (df['WQI'] > 46) & (df['WQI'] <= 59),
    (df['WQI'] > 59),
]
grades = ['I (매우 좋음)', 'II (좋음)', 'III (보통)', 'IV (나쁨)', 'V (아주 나쁨)']
df['Grade'] = pd.cut(df['WQI'], bins=[0, 23, 33, 46, 59, float('inf')], labels=grades, include_lowest=True)

# 결과를 csv 파일로 저장합니다 / 結果をCSVファイルに保存します
df.to_csv('./real_time_gene/water_quality.csv', index=False)

---------------WQIの影響度ロジック--------------------------------
# WQI 계산
# WQIを計算する
data['WQI_calculated'] = 10 * data['dissolved_oxygen'] + 6 * ((data['chlorophyll'] + data['SD']) / 2) + 4 * ((data['DIN'] + data['DIP']) / 2)

# 각 항목의 평균을 계산
# 各項目の平均値を計算する
avg_dissolved_oxygen = data['dissolved_oxygen'].mean()
avg_chlorophyll_SD = ((data['chlorophyll'] + data['SD']) / 2).mean()
avg_DIN_DIP = ((data['DIN'] + data['DIP']) / 2).mean()

# 각 항목이 WQI에 미치는 영향을 계산
# 各項目のWQIへの影響を計算する
impact_dissolved_oxygen = 10 * avg_dissolved_oxygen / data['WQI_calculated'].mean() * 100
impact_chlorophyll_SD = 6 * avg_chlorophyll_SD / data['WQI_calculated'].mean() * 100
impact_DIN_DIP = 4 * avg_DIN_DIP / data['WQI_calculated'].mean() * 100

# 결과 출력
# 結果を表示する
impact_dissolved_oxygen, impact_chlorophyll_SD, impact_DIN_DIP
"""