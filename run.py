from flask import Flask, render_template, request, json
from flask_socketio import SocketIO

import sys
import time
import PIL.Image
import PIL.ImageOps

import random
import numpy as np
import pandas as pd

from tensorflow.keras.models import load_model
import json
from flask import Flask, request, render_template
import urllib.request

from modules import dbModule
from modules import crawlClothesProfile
from modules import crawlWeather
from modules import detectColor
from modules import detectCategory


def modify_request(req):
    np.set_printoptions(suppress=True)
    data = np.ndarray(shape=(1, 125, 125, 3), dtype=np.float32)

    # request 내 이미지 크기 125X125 로 조정
    #urllib.request.urlretrieve(req, 'img')
    image = PIL.Image.open(req).convert('RGB')
    size = (125, 125)
    image = image.resize(size)
    # image = PIL.ImageOps.fit(image, size, Image.ANTIALIAS)

    # 이미지 -> numpy array
    image_array = np.asarray(image)
    normalized_image_array = (image_array.astype(np.float32) / 127.0) - 1
    data[0] = normalized_image_array

    return image, data


app = Flask(__name__)
socketio = SocketIO(app)


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/chat")
def sessions():
    return render_template('chat.html')


def messageReceived(methods=['GET', 'POST']):
    print('message was received!!!')


@app.route("/result", methods=['POST'])
def result():
    f = request.files.get('fileObj')
    req = f.filename
    if 'jpg' in req or 'jpeg' in req or 'png' in req or 'JPG' in req or 'JPEG' in req or 'PNG' in req or 'HEIC' in req:
        image, data = modify_request(f)

        # 이미지 색상 검출
        w, h = detectColor.get_wh(image)
        pixel = detectColor.pixel_list(image,w,h)
        getPixel = detectColor.n_most_common(pixel)
        colorName = detectColor.detect_color(getPixel[0], getPixel[1], getPixel[2])
        
        # 카테고리 예측
        categoryName = detectCategory.detect_category(data)
        print(categoryName, colorName)

        db = dbModule.Database()
        sql = "SELECT url, brand, price, name \
                FROM pyc.Clothes \
                WHERE category=%s AND color=%s"
        rows = db.executeAll(sql, (categoryName, colorName))
    
        if (len(rows) > 3):
            rows = random.sample(rows, 3)
        # print(rows)

        items = []
        for i in range(len(rows)):
            item = {
                "url": "'" + rows[i]["url"] + "'",
                "profile": crawlClothesProfile.crawlClothesProfile(rows[i]["url"]),
                "brand": rows[i]["brand"],
                "price": rows[i]["price"],
                "name": rows[i]["name"]
            }
            items.append(item)
        
        response = {
                "category" : categoryName,
                "color" : colorName,
                "recommendations" : items
        }
        
        print(response)
        return json.dumps(response)


@app.route("/price", methods=['POST'])
def price():
    categoryName = request.form["category"]
    colorName = request.form["color"]
    price = request.form["price"]

    db = dbModule.Database()
    sql = "SELECT url, brand, price, name \
            FROM pyc.Clothes \
            WHERE category=%s AND color=%s AND price<=%s"
    rows = db.executeAll(sql, (categoryName, colorName, price))

    if (len(rows) > 3):
        rows = random.sample(rows, 3)
    # print(rows)

    items = []
    for i in range(len(rows)):
        item = {
            "url": "'" + rows[i]["url"] + "'",
            "profile": crawlClothesProfile.crawlClothesProfile(rows[i]["url"]),
            "brand": rows[i]["brand"],
            "price": rows[i]["price"],
            "name": rows[i]["name"]
        }
        items.append(item)

    print(items)
    return json.dumps(items)


@app.route("/brand", methods=['POST'])
def brand():
    categoryName = request.form["category"]
    colorName = request.form["color"]
    brand = request.form["brand"]

    db = dbModule.Database()
    sql = "SELECT url, brand, price, name \
            FROM pyc.Clothes \
            WHERE category=%s AND color=%s AND brand=%s"
    rows = db.executeAll(sql, (categoryName, colorName, brand))

    if (len(rows) > 3):
        rows = random.sample(rows, 3)
    # print(rows)

    items = []
    for i in range(len(rows)):
        item = {
            "url": "'" + rows[i]["url"] + "'",
            "profile": crawlClothesProfile.crawlClothesProfile(rows[i]["url"]),
            "brand": rows[i]["brand"],
            "price": rows[i]["price"],
            "name": rows[i]["name"]
        }
        items.append(item)
    
    print(items)
    return json.dumps(items)


@app.route("/weather", methods=['POST'])
def weather():
   address, temp = crawlWeather.crawlWeather()
   return {
           "address" : address,
           "temp" : temp
   }

@socketio.on('my event')
def handle_my_custom_event(json, methods=['GET', 'POST']):
    print('received my event: ' + str(json))
    socketio.emit('my response', json, callback=messageReceived)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', debug=True)
