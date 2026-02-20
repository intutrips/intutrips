-- Seed data for Intu trips project
-- Insert sample destinations, guides, testimonials, and contact requests

-- Insert sample destinations
INSERT INTO destinations (name, description, location, price, duration, image_url, featured) VALUES
('Paris City Tour', 'Experience the magic of Paris with our comprehensive city tour. Visit the Eiffel Tower, Louvre Museum, and charming cafés.', 'Paris, France', 299.99, '3 days', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop', true),
('Tokyo Adventure', 'Discover the fascinating blend of traditional and modern Japan. From ancient temples to neon-lit streets.', 'Tokyo, Japan', 599.99, '5 days', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop', true),
('New York Explorer', 'The city that never sleeps awaits! Experience Broadway, Central Park, and iconic skyline views.', 'New York, USA', 449.99, '4 days', 'https://images.unsplash.com/photo-1496442226666-8d4d0b62fb13?w=800&h=600&fit=crop', false),
('Rome Historical Tour', 'Walk through history in the Eternal City. Visit the Colosseum, Vatican City, and ancient ruins.', 'Rome, Italy', 379.99, '4 days', 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop', false),
('Barcelona Beach & Culture', 'Perfect mix of beach relaxation and cultural exploration. Gaudí architecture and Mediterranean vibes.', 'Barcelona, Spain', 329.99, '3 days', 'https://images.unsplash.com/photo-1585476298754-7533e9b8b5c0?w=800&h=600&fit=crop', false);

-- Insert sample guides
INSERT INTO guides (name, bio, specialty, experience_years, image_url) VALUES
('Marie Dubois', 'Born and raised in Paris, Marie has been sharing her love for French culture for over 8 years. She speaks fluent French, English, and Spanish.', 'European History & Art', 8, 'https://images.unsplash.com/photo-1494790108755-2616b332c5cd?w=400&h=400&fit=crop'),
('Yuki Tanaka', 'Yuki is a certified Tokyo guide with deep knowledge of Japanese traditions and modern culture. She specializes in personalized experiences.', 'Asian Culture & Traditions', 6, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'),
('Mike Johnson', 'A true New Yorker, Mike has been guiding tours for 10 years. He knows every hidden corner of the city and loves sharing local secrets.', 'Urban Exploration & Food', 10, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'),
('Giulia Romano', 'Giulia is an art historian with a passion for Roman history. She makes ancient ruins come alive with her engaging storytelling.', 'Ancient History & Art', 7, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop'),
('Carlos Martinez', 'Carlos combines his expertise in Catalan culture with his love for the Mediterranean lifestyle. He''s also a certified sommelier.', 'Mediterranean Culture & Wine', 5, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop');

-- Insert sample testimonials
INSERT INTO testimonials (client_name, content, rating, destination_id) VALUES
('Sarah Johnson', 'Absolutely amazing experience! Our guide was knowledgeable and friendly. Paris was even more beautiful than I imagined.', 5, (SELECT id FROM destinations WHERE name = 'Paris City Tour')),
('David Chen', 'The Tokyo tour exceeded all expectations. Yuki showed us places we would never find on our own. Highly recommend!', 5, (SELECT id FROM destinations WHERE name = 'Tokyo Adventure')),
('Emma Wilson', 'Great tour of NYC! Mike knew all the best spots and gave us excellent restaurant recommendations. Will book again!', 4, (SELECT id FROM destinations WHERE name = 'New York Explorer')),
('Roberto Silva', 'Rome is incredible and our guide made history come alive. The Vatican tour was a highlight of our trip.', 5, (SELECT id FROM destinations WHERE name = 'Rome Historical Tour')),
('Lisa Anderson', 'Perfect balance of culture and beach time in Barcelona. Carlos was an amazing guide and the wine tasting was fantastic!', 4, (SELECT id FROM destinations WHERE name = 'Barcelona Beach & Culture'));

-- Insert sample contact requests
INSERT INTO contact_requests (name, email, phone, message, status) VALUES
('John Smith', 'john.smith@email.com', '+1-555-0101', 'I''m interested in the Paris tour for 2 people in June. What dates are available?', 'pending'),
('Maria Garcia', 'maria.g@email.com', '+34-600-123-456', 'We want to book the Tokyo adventure for our family of 4. Do you offer group discounts?', 'pending'),
('James Brown', 'j.brown@email.com', '+44-20-1234-5678', 'Looking for a customized Rome tour. Can you arrange private transportation?', 'read');