import numpy as np
from tensorflow.keras.models import load_model

def getCatName(classes, predict):
    print(predict)
    np.set_printoptions(formatter={'float': lambda x: "{0:0.3f}".format(x)})
    catName = classes[predict[0].argmax()]
    print("**"+catName+"**")
    return catName


def third_detection(categoryName, x_test):
    if categoryName == 'sleeve':
        classNames = ['lsleeve', 'hood', 'cardigan']
    elif categoryName == 'haveCollar':
        classNames = ['coat', 'jacket', 'collar']
    else:
        classNames = ['lpadding', 'spadding']
    model = load_model('model/model_lsleeve_'+categoryName+'.h5')
    prediction = model.predict(x_test)
    return getCatName(classNames, prediction)


def second_detection(categoryName, x_test):
    if categoryName == 'nsleeve':
        classNames = ['nsleeve', 'vest']
    elif categoryName == 'ssleeve':
        classNames = ['ssleeve', 'collar']
    elif categoryName == 'lsleeve':
        classNames = ['sleeve', 'haveCollar', 'padding']
    elif categoryName == 'pants':
        classNames = ['lpants', 'spants']
    elif categoryName == 'dress':
        classNames = ['dress', 'jsuit']
    model = load_model('model/model_'+categoryName+'.h5')
    prediction = model.predict(x_test)
    return getCatName(classNames, prediction)


def first_detection(x_test):
    classNames = ['nsleeve', 'ssleeve', 'lsleeve', 'pants', 'skirt', 'dress']
    model = load_model('model/model.h5')
    prediction = model.predict(x_test)
    return getCatName(classNames, prediction)


def detect_category(x_test):
    catName = first_detection(x_test)
    if catName != 'skirt':
        catName = second_detection(catName, x_test)
        if catName == 'sleeve' or catName == 'haveCollar' or catName == 'padding':
            catName = third_detection(catName, x_test)
    return catName
