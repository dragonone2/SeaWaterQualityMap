# 용도 : 위치정보 추가후 맵에 이용
# 투명도 SD>>> random
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

""" 투명도 데이터 있을때
import pandas as pd
from sqlalchemy import create_engine

# 데이터베이스 연결 생성 / データベース接続を作成します
engine = create_engine('mysql+pymysql://<username>:<password>@<host>:<port>/<dbname>')

# 테이블 데이터를 읽어옵니다 / テーブルデータを読み込みます
df = pd.read_sql('SELECT * FROM real_tiems_data', con=engine)

# 수질평가지수를 계산합니다 / 水質評価指数を計算します
df['WQI'] = 10 * df['dissolved_oxygen'] + 6 * ((df['chlorophyll'] + df['SPM']) / 2) + 4 * ((df['DIN'] + df['DIP']) / 2)

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
df.to_csv('water_quality.csv', index=False)
"""