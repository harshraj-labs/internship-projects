import time
import requests
from bs4 import BeautifulSoup
from pydantic import BaseModel
from pydantic import ValidationError
HEADERS = {
    "User-Agent": "RajBookScraper/1.0 (educational project)"

}

class Book(BaseModel):
    title: str
    price: float
    availability: str

def parse_book(book):
    book_data = {
        "title": None,
        "price": None,
        "availability": None
    }
    link=book.select_one("h3 a")
    if not link:
        raise ValueError("Missing Title")
    book_data |= {"title":link.get("title")}
    link=book.select_one(".price_color")
    if not link:
            raise ValueError("Missing Price")
    price=link.get_text().replace("£","")
    book_data |= {"price":float(price)}
    link=book.select_one(".availability")
    if not link:
            raise ValueError("Missing Availability")
    book_data |= {"availability":link.get_text().strip()}
    return book_data

all_book = []
for page in range(1,4):
    try:
        URL = f"https://books.toscrape.com/catalogue/page-{page}.html"
        response = requests.get(URL,headers=HEADERS,timeout=10)
        response.raise_for_status()
        response.encoding = response.apparent_encoding
        soup = BeautifulSoup(response.text,"html.parser")
        books = soup.select("article.product_pod")
        for book in books:
            try:
                book_data = parse_book(book)
                valid_book = Book(**book_data)
                all_book.append(valid_book.model_dump())
            except ValueError as error:
                print(f"Book is {error}")
            except ValidationError as error:
                print("Schema not Valid")
        time.sleep(1)
    except requests.RequestException as error:
        print("Broken Page")

print(len(all_book))
print(type(all_book[0]))
print(all_book[0])
    