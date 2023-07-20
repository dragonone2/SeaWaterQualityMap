import random
import csv

input_file = 'shipdata.csv'  # 원본 csv 파일 이름
output_file = 'output.csv'  # 생성할 csv 파일 이름

# 원본 텍스트에서 데이터 읽기
with open(input_file, 'r') as f:
    reader = csv.reader(f)
    data = [row for row in reader]

# 새 csv 파일 생성
with open(output_file, 'w', newline='') as f:
    writer = csv.writer(f)
    
    # 헤더 작성 (value 추가)
    writer.writerow(data[0] + ['value'])
    
    # 좌표 데이터에 무작위 값 추가
    for row in data[1:]:
        random_value = random.randint(1, 5)
        writer.writerow(row + [random_value])

print(f"CSV 파일이 '{output_file}' 파일로 저장되었습니다.")
