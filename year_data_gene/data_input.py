# 우에노고홍_0804_완성
# 기능 :다른 연도의 해양 데이터 CSV를 읽고 각 연도에 해당하는
#       MySQL 테이블에 데이터를 삽입합니다.

import pandas as pd
import pymysql
from sqlalchemy import create_engine

# MySQLデータベースに接続する
username = 'root'
password = ''
hostname = 'localhost'
database_name = 'super_data'

engine = create_engine(f'mysql+pymysql://{username}:{password}@{hostname}/{database_name}')

# 各年のCSVファイルを読み込む
years = ['2018', '2019', '2020', '2021', '2022']

for year in years:
    # CSVファイルを読み込む
    df = pd.read_csv(f'{year}_Ocean.csv')

    # IDカラムを追加する (0から始まる連番)
    df.insert(0, 'id', range(len(df))) # 0の位置に'id'カラムを追加

    # テーブル名を生成する
    table_name = f'ocean_data_{year}'

    # データフレームをMySQLテーブルに挿入する
    df.to_sql(table_name, con=engine, index=False, if_exists='replace')

    # プライマリキーとしてのIDカラムを設定する
    with engine.connect() as conn:
        conn.execute(f'ALTER TABLE {table_name} ADD PRIMARY KEY (id);')

# 新しいデータを追加したい場合は、if_exists='append' を使用



# 데이터 베이스 주소
"""
host='localhost',
user='root',
password='',
db='Quiz',
charset='utf8mb4',
"""

# 데이터 베이스 만들 때 쓰는 코드 (SQL)
"""
CREATE DATABASE super_data
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
CREATE TABLE ocean_data_2018 (
    id INT PRIMARY KEY AUTO_INCREMENT,
    times INT NOT NULL,
    area VARCHAR(50),
    coastal_name VARCHAR(50),
    layer_name VARCHAR(50),
    temperature DOUBLE,
    salinity DOUBLE,
    pH DOUBLE,
    dissolved_oxygen DOUBLE,
    COD DOUBLE,
    chlorophyll DOUBLE,
    TN DOUBLE,
    DIP DOUBLE,
    TP DOUBLE,
    Si_OH4 DOUBLE,
    SPM DOUBLE,
    DIN DOUBLE
);
"""
"""
ALTER TABLE ocean_data_2018
DROP COLUMN times;

ALTER TABLE ocean_data_2018
ADD COLUMN times INT NOT NULL AFTER id;
"""