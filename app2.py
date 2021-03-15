from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = '비밀번호 설정'
socketio = SocketIO(app)

@app.route("/")
def index():
    return render_template('index.html')

    
@app.route("/chat")
def sessions():
    return render_template('chat2.html')
    

def messageReceived(methods=['GET', 'POST']):
    print('message was received!!!')

@socketio.on('my event')
def handle_my_custom_event(json, methods=['GET', 'POST']):
    print('received my event: ' + str(json))
    socketio.emit('my response', json, callback=messageReceived)
    

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', debug=True)