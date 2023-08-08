# real_data_input.py
# 우에노고홍_0806_지행중
# 기능 :max,min를 정해서 random으로 생성하여,DB에 5초마다 저장
# 추가 예정 : 탁도 데이터
# 저장 주소 :table_name>>real_times_data
#           데이터베이스>>super_data

# random year_data generate python code
import pandas as pd
import numpy as np
from sqlalchemy import create_engine
import datetime
import time  # 시간 관련 패키지 추가 / 時間関連のパッケージを追加

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

# MySQLデータベースに接続する
username = 'root'
password = ''
hostname = 'localhost'
database_name = 'super_data'
table_name = 'real_tiems_data'
engine = create_engine(f'mysql+pymysql://{username}:{password}@{hostname}/{database_name}')

# 루프를 통해 5초마다 랜덤 데이터 생성 및 데이터베이스 추가 / ループを通じて5秒ごとにランダムデータ生成とデータベース追加
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

    df_random.to_sql(table_name, con=engine, index=False, if_exists='append')

    time.sleep(5)  # 5초 대기 / 5秒待機

'''



----------------------SQL문------------------------------------------
-- 현재 테이블을 삭제 / 現在のテーブルを削除
DROP TABLE IF EXISTS real_tiems_data;

-- 새 테이블을 생성 / 新しいテーブルを作成
CREATE TABLE real_tiems_data (
    id INT AUTO_INCREMENT,
    times DATETIME,
    area VARCHAR(255),
    coastal_name VARCHAR(255),
    layer_name VARCHAR(255),
    temperature FLOAT,
    salinity FLOAT,
    pH FLOAT,
    dissolved_oxygen FLOAT,
    COD FLOAT,
    chlorophyll FLOAT,
    TN FLOAT,
    DIP FLOAT,
    TP FLOAT,
    Si_OH4 FLOAT,
    SPM FLOAT,
    DIN FLOAT,
    PRIMARY KEY(id)
);
'''
