import serial

# COMポートとボーレートを設定
ser = serial.Serial('COM3', 9600)

while True:
    line = ser.readline().decode('utf-8').strip() # データを読み取る
    print(line) # 受信したデータを表示

    # 必要に応じて、受信したデータから温度と湿度を解析し、さらなる処理を行うことができます。
    # 例:
    # if "Humidity:" in line:
    #     humidity, temperature = line.replace("Humidity:", "").replace("Celsius", "").replace("%, Temp:", "").strip().split()
    #     humidity = float(humidity)
    #     temperature = float(temperature)
    #     print("Humidity:", humidity, "%, Temperature:", temperature, "Celsius")
