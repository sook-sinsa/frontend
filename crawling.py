from selenium import webdriver
from bs4 import BeautifulSoup
import requests
import lxml

def request_crawling(list):
    # options = webdriver.ChromeOptions()
    # options.add_argument("headless")
    # driver = webdriver.Chrome("/home/ubuntu/pyc/chromedriver")
    
    recList = []
    for l in list:
        # driver.get(l[6])
        # productImgSrc = driver.find_element_by_css_selector("div.product-img > img").get_attribute("src")
        # bannerImgSrc = driver.find_element_by_css_selector("p.brandBanner").get_attribute("src")
        # driver.close()
        
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'} 
        source = requests.get(l[6], headers=headers).text
        html = BeautifulSoup(source, 'html.parser')

        productImg = html.select("div.product-img")
        for p in productImg:
            productImgSrc = p.select_one("img").attrs["src"]
        recList.append(productImgSrc)

        bannerImg = html.select("p.brandBanner")
        for b in bannerImg:
            bannerImgSrc = b.select_one("img").attrs["src"]
    print(recList) 
    return recList
