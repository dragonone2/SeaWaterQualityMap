import pandas as pd
import random

# データの数を定義します。
num_data = 100

# ソウルの緯度経度範囲を定義します。
lat_range = (37.426, 37.701)
lng_range = (126.764, 127.183)

# 緯度経度をランダムに生成します。
data = {
    'latitude': [f"{round(random.uniform(*lat_range), 6):.6f}" for _ in range(num_data)],
    'longitude': [f"{round(random.uniform(*lng_range), 6):.6f}" for _ in range(num_data)]
}

# pandasのデータフレームを作成します。
df = pd.DataFrame(data)

# CSVファイルとして出力します。ファイル名は 'output.csv' です。
df.to_csv('output.csv', index=False)
