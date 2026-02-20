UPDATE destinations
SET hotels = '[
  {"name": "Huen Hug Hotel", "location": "Chiang Mai", "rating": 3, "image": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/563175365.jpg"},
  {"name": "Seekers Finders Rama IV Hotel", "location": "Bangkok", "rating": 4, "image": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/613789630.jpg"},
  {"name": "Phi Phi Anita Resort", "location": "Phi Phi", "rating": 3, "image": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/281257565.jpg"},
  {"name": "Vacation Village", "location": "Krabi", "rating": 3, "image": "https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/66589630.jpg"}
]'::jsonb
WHERE name = 'Tailândia Festival das Lanternas';
