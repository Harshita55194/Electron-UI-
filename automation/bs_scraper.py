import requests
from bs4 import BeautifulSoup
import json
import os

def scrape_books():
    try:
        response = requests.get('https://books.toscrape.com/')
        soup = BeautifulSoup(response.content, 'html.parser')

        books = []
        book_elements = soup.select('article.product_pod')
        
        for book in book_elements:
            title = book.select_one('h3 a')['title']
            url = book.select_one('h3 a')['href']
            image = book.select_one('div.image_container img')['src']
            price = book.select_one('p.price_color').text
            availability = book.select_one('p.availability').text.strip()
            rating = book.select_one('p.star-rating')['class'][-1]
            
            books.append({
                "title": title,
                "url": url,
                "image": image,
                "rating": rating,
                "price": price,
                "availability": availability
            })

        output_path = os.path.join(os.path.dirname(__file__), 'scraped_books.json')
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(books,f,indent=2)
            
        print(f"Scraped")
        return True
        
    except Exception as e:
        print(f"Error during scraping: {e}")
        return False

if __name__ == "__main__":
    scrape_books()
