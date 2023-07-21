import pandas as pd

# 파일 불러오기
df = pd.read_csv('Ocean_Quality4.csv')

# '연안구분명(1)' 열에서 '속초연안'에 해당하는 행을 필터링합니다.
df_sokcho = df[df['연안구분명(1)'] == '속초연안']

# 출력을 위한 데이터 정리
data_sokcho = []
for year in range(2018, 2023):
    for month in range(12):
        col = f'{year}.{month}' if month != 0 else f'{year}'
        for idx, value in df_sokcho[col].items():
            data_type = df.iloc[idx, 2]  # 데이터 유형 정보
            if data_type != '표층':  # '표층'이 아닌 경우에만 데이터 저장
                data_sokcho.append((year, data_type, value))

# 결과 출력
for data in data_sokcho:
    print(f"{data[0]} {data[1]} : {data[2]}")
