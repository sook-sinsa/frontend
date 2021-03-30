import json
from bs4 import BeautifulSoup
import requests

def crawlClothesProfile(url):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'} 
    source = requests.get(url, headers=headers).text
    html = BeautifulSoup(source, 'html.parser')

    productImg = html.select("div.product-img")
    for p in productImg:
        productImgSrc = p.select_one("img").attrs["src"]
    url = productImgSrc

    # bannerImg = html.select("p.brandBanner")
    # for b in bannerImg:
    #     bannerImgSrc = b.select_one("img").attrs["src"]

    return url
