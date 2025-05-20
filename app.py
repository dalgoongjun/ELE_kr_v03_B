from flask import Flask, render_template, abort
from jinja2 import TemplateNotFound

app = Flask(__name__, static_folder='static')

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/page<int:page_number>.html')
@app.route('/page<int:page_number>_<int:sub_number>.html')
def page(page_number, sub_number=None):
    # 기본 페이지 번호 검증
    if not 1 <= page_number <= 100:
        abort(404)
        
    # 하위 페이지 번호가 있는 경우 검증
    if sub_number is not None and not 1 <= sub_number <= 10:
        abort(404)
    
    try:
        if sub_number is None:
            template_name = f'page{page_number}.html'
        else:
            template_name = f'page{page_number}_{sub_number}.html'
            
        return render_template(template_name)
    except TemplateNotFound:
        abort(404)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)