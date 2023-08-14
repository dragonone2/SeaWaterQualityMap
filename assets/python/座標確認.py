import numpy as np

ranges = {
    '제주도 ': {'lat': (31.0, 34.50), 'lon': (121.8, 129.3), 'value_probs': np.array([0.7, 0, 0, 0, 0.05])},
    '동중국해(제주도 아래)': {'lat': (28.0, 31.0), 'lon': (122.0, 130.0)},
    '황해 1': {'lat': (34.5, 35.8), 'lon': (120.1, 126.20), 'value_probs': np.array([0.6, 0.1, 0.1, 0.1, 0.1])},
    '황해 2': {'lat': (35.8, 36.8), 'lon': (121.1, 126.50)},
    '동해 아래 1': {'lat': (37.3, 41.5), 'lon': (128.8, 138.5)},
    '동해 아래 2': {'lat': (35.4, 41.5), 'lon': (130.5, 135.5)},
    '동해 위': {'lat': (41.5, 42.5), 'lon': (130.2, 139.5)},
    '후쿠오카 한국': {'lat': (33.58, 34.84), 'lon': (127.78, 130.26)},
}

def classify_location(lat, lon):
    for region, coordinates in ranges.items():
        lat_range = coordinates['lat']
        lon_range = coordinates['lon']
        if lat_range[0] <= lat <= lat_range[1] and lon_range[0] <= lon <= lon_range[1]:
            return region
    return "座標が範囲外"

while True:
    lat = float(input("緯度を入力してください: "))
    lon = float(input("経度を入力してください: "))
    region = classify_location(lat, lon)
    print("入力された座標は", region, "に分類されます。")
    continue_query = input("続けますか？ (y/n): ").lower()
    if continue_query != 'y':
        break