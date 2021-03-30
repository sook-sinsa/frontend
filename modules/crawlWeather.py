from bs4 import BeautifulSoup
import requests

def crawlWeather():
    html = requests.get('https://search.naver.com/search.naver?query=날씨')
    soup = BeautifulSoup(html.text, 'html.parser')

    container = soup.find('div', {'class': 'weather_box'})

    address = container.find('span', {'class':'btn_select'}).text
    print('현재 위치: '+address)

    temp = container.find('span',{'class': 'todaytemp'}).text
    print('현재 온도: '+temp+'℃')
    
    return (address, temp)
