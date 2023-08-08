# data_gene_year.py
# 우에노고홍_0804_완성
# DB없어도 자동 생성
# 기능 :max,min를 정해서 random으로 소수점 두 번째까지의 숫자 생성하여,DB로 저장/機能：maxとminを設定して、ランダムに小数点以下二桁の数を生成し、DBに保存
# 추가 예정 : 없음
# 저장 CSV :table_name>>year_data_random
#           데이터베이스>>super_data

# random year_dara generate python code
import pandas as pd
import numpy as np
from sqlalchemy import create_engine


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
num_rows = 100

# 고정 값 정의 / 固定値を定義
fixed_values = {
    "times": 2018,
    "area": np.random.choice(["남해", "동해", "서해"], num_rows),
    "coastal_name": np.random.choice(unique_coastal_names, num_rows),
    "layer_name": "표층",
}

# 랜덤 데이터를 생성할 컬럼 정의 / ランダムデータを生成する列を定義
random_columns = list(min_values.keys())

# 랜덤 데이터 생성 / ランダムデータの生成
random_data = {}
for column in random_columns:
    raw_data = np.random.uniform(min_values[column], max_values[column], num_rows)
    random_data[column] = np.around(raw_data, 2)  # Round to 2 decimal places


# 고정값과 랜덤 데이터를 단일 DataFrame으로 결합 / 固定値とランダムデータを単一のDataFrameに結合
df_random = pd.DataFrame({**fixed_values, **random_data})

# MySQLデータベースに接続する
username = 'qubit3'
password = 'unicon77@'
hostname = 'uws7-016.cafe24.com'
database_name = 'qubit3'
table_name = ''
port = 3306
engine = create_engine(f'mysql+pymysql://{username}:{password}{hostname}:{port}/{database_name}')


df_random.to_sql(table_name, con=engine, index=True, index_label='id', if_exists='append')


# DataFrame을 CSV 파일에 쓰기 / DataFrameをCSVファイルに書き込む
# df_random.to_csv("year_data_gene/random_ocean_data.csv", index=False)

# DataFrame의 처음 몇 행을 보여주기 / DataFrameの最初の数行を表示
# print(df_random.head())





"""2018_Ocean.csvを基準として生成
import pandas as pd
import numpy as np

# Load the original data to get the min and max values for each column
original_df = pd.read_csv('<path_to_your_file>/2018_Ocean.csv')

# Get the min and max values for each column
min_values = original_df.min()
max_values = original_df.max()

# Get the number of rows in the original data
num_rows = len(original_df)

# Define the fixed values with a random choice for coastal_name
fixed_values = {
    "times": 2018,
    "area": np.random.choice(["남해", "동해", "서해"], num_rows),
    "coastal_name": np.random.choice(original_df["coastal_name"].unique(), num_rows),
    "layer_name": np.random.choice(original_df["layer_name"].unique(), num_rows),
}

# Define the columns to generate random data for
random_columns = ["temperature", "salinity", "pH", "dissolved_oxygen", "COD", "chlorophyll", "TN", "DIP", "TP", "Si_OH4", "SPM", "DIN"]

# Generate the random data
random_data = {}
for column in random_columns:
    random_data[column] = np.random.uniform(min_values[column], max_values[column], num_rows)

# Combine the fixed values and random data into a single DataFrame
df_random = pd.DataFrame({**fixed_values, **random_data})

# Write the DataFrame to a CSV file
df_random.to_csv("<path_to_your_file>/random_ocean_data.csv", index=False)

# Show the first few rows of the DataFrame
print(df_random.head())

    """