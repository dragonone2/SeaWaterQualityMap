# real_data_fetch.py
# 우에노고홍_0806_지행중
# 기능: Firebase의 Realtime Database에서 실시간 데이터를 가져옴 / FirebaseのRealtime Databaseからリアルタイムデータを取得

import pandas as pd
import numpy as np
from firebase_admin import initialize_app, credentials, db

# Firebaseの認証情報を指定 / Firebaseの認証情報を指定
cred = credentials.Certificate(r'G:\내 드라이브\sw_hackton\real_time_gene\model-craft-391306-firebase-adminsdk-v8jx8-8b0ef4e372.json')
app = initialize_app(cred, {'databaseURL': 'https://model-craft-391306-default-rtdb.firebaseio.com/'})

# データベースからリアルタイムデータの参照を取得 / データベースからリアルタイムデータの参照を取得
ref = db.reference('realtime_data')
realtime_data = ref.get()

# データベースから取得したデータをDataFrameに変換 / データベースから取得したデータをDataFrameに変換
df_realtime_data = pd.DataFrame(realtime_data) # list 객체를 직접 DataFrame으로 변환 / リストオブジェクトを直接DataFrameに変換

# CSVファイルとして保存 / CSVファイルとして保存
csv_path = 'realtime_data.csv'
df_realtime_data.to_csv(csv_path, index=False, encoding='utf-8')  # 인덱스 없이 저장 / インデックスなしで保存

print(df_realtime_data.head())  # 최초 5행을 출력 / 最初の5行を出力
