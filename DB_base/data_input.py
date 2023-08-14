import pandas as pd
from sqlalchemy import create_engine

# 데이터베이스 연결 정보/データベース接続情報
HOSTNAME = 'localhost'
PORT = '3306'
DATABASE = 'super_data'
USERNAME = 'root'
PASSWORD = ''

# 데이터베이스에 연결/データベースに接続
engine = create_engine(f'mysql+pymysql://{USERNAME}:{PASSWORD}@{HOSTNAME}:{PORT}/{DATABASE}')

# cvs 파일에서 데이터 로드/cvsファイルからデータを読み込む
df_2018 = pd.read_csv('2018_Ocean.csv')
df_2019 = pd.read_csv('2019_Ocean.csv')
df_2020 = pd.read_csv('2020_Ocean.csv')
df_2021 = pd.read_csv('2021_Ocean.csv')
df_2022 = pd.read_csv('2022_Ocean.csv')

# 데이터를 데이터베이스에 삽입/データをデータベースに挿入する
df_2018.to_sql('ocean_data_2018', con=engine, if_exists='replace', index=False)
df_2019.to_sql('ocean_data_2019', con=engine, if_exists='replace', index=False)
df_2020.to_sql('ocean_data_2020', con=engine, if_exists='replace', index=False)
df_2021.to_sql('ocean_data_2021', con=engine, if_exists='replace', index=False)
df_2022.to_sql('ocean_data_2022', con=engine, if_exists='replace', index=False)

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