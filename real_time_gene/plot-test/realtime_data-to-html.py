
import plotly.graph_objects as go
import pandas as pd
from sqlalchemy import create_engine
import os

def get_data_from_db(query, db_url):
    """
    Execute query and return resulting data as dataframe.
    """
    engine = create_engine(db_url)
    df = pd.read_sql(query, engine)
    return df

def create_plot(df):
    """
    Create a plotly plot from a dataframe.
    """
    fig = go.Figure()

    for column in df.columns:
        fig.add_trace(go.Scatter(x=df.index, y=df[column], mode='lines', name=column))

    fig_html = fig.to_html(full_html=False)
    return fig_html

def write_html(fig_html, filename):
    """
    Write plotly figure to an HTML file.
    """
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>My Plot</title>
    </head>
    <body>
    <h1>My Plot</h1>
    <!-- Plotly chart will be inserted here -->
    <div>
        {fig_html}
    </div>
    </body>
    </html>
    """

    with open(filename, 'w') as f:
        f.write(html_content)

def main():
    # Get data from database
    db_url = 'mysql+pymysql://username:password@localhost/database_name'
    query = 'SELECT * FROM table_name'
    df = get_data_from_db(query, db_url)

    # Create plot
    fig_html = create_plot(df)

    # Write to HTML
    write_html(fig_html, './plot.html')

if __name__ == '__main__':
    main()



# import plotly.graph_objects as go
# import numpy as np
# import os

# # ランダムデータ生成
# N = 100
# random_x = np.linspace(0, 1, N)
# random_y0 = np.random.randn(N) + 5
# random_y1 = np.random.randn(N)
# random_y2 = np.random.randn(N) - 5

# # グラフ作成
# fig = go.Figure()
# fig.add_trace(go.Scatter(x=random_x, y=random_y0, mode='lines', name='lines'))
# fig.add_trace(go.Scatter(x=random_x, y=random_y1, mode='lines+markers', name='lines+markers'))
# fig.add_trace(go.Scatter(x=random_x, y=random_y2, mode='markers', name='markers'))

# # グラフをHTML形式で出力
# fig_html = fig.to_html(full_html=False)

# # HTMLファイル生成
# html_content = f"""
# <!DOCTYPE html>
# <html>
# <head>
#     <title>My Plot</title>
# </head>
# <body>
# <h1>My Plot</h1>
# <!-- Plotly chart will be inserted here -->
# <div>
#     {fig_html}
# </div>
# </body>
# </html>
# """

# # HTMLファイルを書き込み
# with open('./plot.html', 'w') as f:
#     f.write(html_content)
