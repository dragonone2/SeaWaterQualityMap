from flask import Flask, render_template, request, jsonify
import os
import cv2
import torch
from src.Models import Unet

# Flask 및 이미지 저장 할 정적 폴더
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'damage'

# 모델 구성 및 불러오기, 보시다시피 unet_models 라는 대신 models 사용
labels = ['Breakage_3', 'Crushed_2', 'Scratch_0', 'Seperated_1']
price_table = [100, 200, 50, 120]

def load_unet_models():
    n_classes = 2
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    models = []

    for label in labels:
        model_path = f'models/[DAMAGE][{label}]Unet.pt'
        model = Unet(encoder='resnet34', pre_weight='imagenet', num_classes=n_classes).to(device)
        model.model.load_state_dict(torch.load(model_path, map_location=torch.device(device)))
        model.eval()
        models.append(model)

    return models
# 모델을 메모리에 로드합니다.
unet_models = load_unet_models()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/estimate', methods=['POST'])
def estimate():
    file = request.files['file']
    img_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(img_path)

    img = cv2.imread(img_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (256, 256))

    img_input = img / 255.
    img_input = img_input.transpose([2, 0, 1])
    img_input = torch.tensor(img_input).float().to('cpu')
    img_input = img_input.unsqueeze(0)

    outputs = []
    for model in unet_models:
        output = model(img_input)
        img_output = torch.argmax(output, dim=1).detach().cpu().numpy()
        img_output = img_output.transpose([1, 2, 0])
        outputs.append(img_output)

    total = 0
    for i, price in enumerate(price_table):
        area = outputs[i].sum()
        total += area * price

    result = {
           'price_total': int(total),
        # 웹 클라이언트에서 사용할 수있는 추가 결과를 추가합니다.
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
