-- NourishNet Sample Data
-- Run this AFTER importing schema.sql
-- mysql -u root -p nourishnet < database/sample-data.sql

USE nourishnet;

-- ============================================
-- USERS
-- ============================================

INSERT INTO users (user_id, email, password_hash, user_type, phone, is_active, is_verified) VALUES
(1,  'grandhotel@example.com',    '$2b$10$examplehash1', 'hotel',     '9876543210', TRUE, TRUE),
(2,  'sunriseinn@example.com',    '$2b$10$examplehash2', 'hotel',     '9876543211', TRUE, TRUE),
(3,  'bakeryhouse@example.com',   '$2b$10$examplehash3', 'hotel',     '9876543212', TRUE, FALSE),
(4,  'hopefoundation@example.com','$2b$10$examplehash4', 'ngo',       '9123456780', TRUE, TRUE),
(5,  'careforkids@example.com',   '$2b$10$examplehash5', 'ngo',       '9123456781', TRUE, TRUE),
(6,  'eldershome@example.com',    '$2b$10$examplehash6', 'ngo',       '9123456782', TRUE, FALSE),
(7,  'rahul.v@example.com',       '$2b$10$examplehash7', 'volunteer', '9000000001', TRUE, TRUE),
(8,  'priya.v@example.com',       '$2b$10$examplehash8', 'volunteer', '9000000002', TRUE, TRUE),
(9,  'amit.v@example.com',        '$2b$10$examplehash9', 'volunteer', '9000000003', TRUE, TRUE),
(10, 'sneha.d@example.com',       '$2b$10$examplehash10','donor',     '9111111001', TRUE, TRUE),
(11, 'vikram.d@example.com',      '$2b$10$examplehash11','donor',     '9111111002', TRUE, TRUE),
(12, 'meera.d@example.com',       '$2b$10$examplehash12','donor',     '9111111003', TRUE, TRUE);

-- ============================================
-- HOTELS
-- ============================================

INSERT INTO hotels (hotel_id, user_id, business_name, business_type, address, city, state, pincode, latitude, longitude, contact_person, registration_number, total_donations, total_people_fed, verified_contributor) VALUES
(1, 1, 'Grand Palace Hotel',   'hotel',      '12 MG Road, Bangalore',       'Bangalore', 'Karnataka', '560001', 12.9716, 77.5946, 'Rajan Mehta',  'REG-HTL-001', 45, 2250, TRUE),
(2, 2, 'Sunrise Inn',          'restaurant', '88 Anna Salai, Chennai',       'Chennai',   'Tamil Nadu','600002', 13.0827, 80.2707, 'Kavitha Nair', 'REG-HTL-002', 30, 1500, TRUE),
(3, 3, 'The Bakery House',     'bakery',     '5 Park Street, Kolkata',       'Kolkata',   'West Bengal','700016',22.5726, 88.3639, 'Suresh Das',   'REG-HTL-003', 10, 300,  FALSE);

-- ============================================
-- NGOS
-- ============================================

INSERT INTO ngos (ngo_id, user_id, organization_name, organization_type, registration_number, contact_person, address, city, state, pincode, latitude, longitude, verification_status, total_donations_received, total_people_helped, verified_partner) VALUES
(1, 4, 'Hope Foundation',    'ngo',       'NGO-REG-001', 'Anita Sharma',  '34 Residency Road, Bangalore', 'Bangalore', 'Karnataka',  '560025', 12.9784, 77.6408, 'verified', 40, 2000, TRUE),
(2, 5, 'Care for Kids',      'orphanage', 'NGO-REG-002', 'Thomas George', '22 Mount Road, Chennai',       'Chennai',   'Tamil Nadu', '600006', 13.0569, 80.2425, 'verified', 25, 1200, TRUE),
(3, 6, 'Elders Home Trust',  'oldage',    'NGO-REG-003', 'Sunita Rao',    '9 Lake View, Kolkata',         'Kolkata',   'West Bengal','700019', 22.5958, 88.3697, 'pending',  5,  150,  FALSE);

-- ============================================
-- VOLUNTEERS
-- ============================================

INSERT INTO volunteers (volunteer_id, user_id, full_name, city, address, latitude, longitude, vehicle_type, availability_status, total_tasks_completed, total_people_helped, total_distance_km, rating) VALUES
(1, 7, 'Rahul Verma',  'Bangalore', '10 Indiranagar, Bangalore', 12.9784, 77.6408, 'bike', 'available', 28, 1400, 312.50, 4.80),
(2, 8, 'Priya Menon',  'Chennai',   '5 T Nagar, Chennai',        13.0418, 80.2341, 'car',  'available', 15, 750,  198.00, 4.90),
(3, 9, 'Amit Joshi',   'Bangalore', '7 Koramangala, Bangalore',  12.9352, 77.6245, 'bike', 'busy',      10, 500,  120.00, 4.70);

-- ============================================
-- DONORS
-- ============================================

INSERT INTO donors (donor_id, user_id, full_name, city, total_donations, total_people_fed, total_amount_donated, compassionate_donor_badge, community_champion_badge) VALUES
(1, 10, 'Sneha Desai',   'Bangalore', 5, 250, 5000.00, TRUE,  FALSE),
(2, 11, 'Vikram Patel',  'Mumbai',    3, 150, 3000.00, FALSE, FALSE),
(3, 12, 'Meera Krishnan','Chennai',   8, 400, 8000.00, TRUE,  TRUE);

-- ============================================
-- DONATIONS (from hotels)
-- ============================================

INSERT INTO donations (donation_id, donor_id, donor_type, ngo_id, food_type, quantity, quantity_kg, estimated_servings, pickup_address, pickup_latitude, pickup_longitude, pickup_time, best_before_date, additional_notes, status, people_fed) VALUES
(1, 1, 'hotel', 1, 'Biryani & Curry',    '20 kg',  20.00, 80,  '12 MG Road, Bangalore',  12.9716, 77.5946, '18:00:00', '2026-04-29', 'Freshly cooked, still warm',    'delivered',  80),
(2, 1, 'hotel', 1, 'Bread & Pastries',   '15 kg',  15.00, 60,  '12 MG Road, Bangalore',  12.9716, 77.5946, '20:00:00', '2026-04-29', 'End of day bakery items',       'in_transit', 0),
(3, 2, 'hotel', 2, 'Rice & Sambar',      '25 kg',  25.00, 100, '88 Anna Salai, Chennai',  13.0827, 80.2707, '19:30:00', '2026-04-29', 'Vegetarian meal',               'accepted',   0),
(4, 2, 'hotel', 2, 'Mixed Veg Meals',    '10 kg',  10.00, 40,  '88 Anna Salai, Chennai',  13.0827, 80.2707, '21:00:00', '2026-04-30', NULL,                            'pending',    0),
(5, 3, 'hotel', 3, 'Bread & Cakes',      '8 kg',   8.00,  30,  '5 Park Street, Kolkata',  22.5726, 88.3639, '20:30:00', '2026-04-29', 'Day-old but good quality',      'pending',    0);

-- ============================================
-- DONOR DONATIONS (individual)
-- ============================================

INSERT INTO donor_donations (donor_donation_id, donor_id, occasion, donation_type, amount, ngo_id, personal_message, share_on_feed, people_fed, status) VALUES
(1, 1, 'birthday',    'money', 2000.00, 1, 'Celebrating my birthday by feeding 50 children!', TRUE,  50,  'completed'),
(2, 3, 'anniversary', 'money', 5000.00, 2, 'Our 10th anniversary gift to the community.',      TRUE,  100, 'completed'),
(3, 2, 'festival',    'food',  NULL,    1, 'Diwali blessings for everyone.',                   TRUE,  30,  'completed'),
(4, 1, 'graduation',  'money', 1500.00, 2, 'Graduated today, sharing the joy!',               TRUE,  0,   'pending');

-- ============================================
-- VOLUNTEER TASKS
-- ============================================

INSERT INTO volunteer_tasks (task_id, donation_id, volunteer_id, task_type, from_location, from_latitude, from_longitude, to_location, to_latitude, to_longitude, distance_km, scheduled_time, status, priority) VALUES
(1, 1, 1, 'pickup',   '12 MG Road, Bangalore',       12.9716, 77.5946, '34 Residency Road, Bangalore', 12.9784, 77.6408, 3.20, '18:00:00', 'completed', 'normal'),
(2, 2, 1, 'delivery', '12 MG Road, Bangalore',       12.9716, 77.5946, '34 Residency Road, Bangalore', 12.9784, 77.6408, 3.20, '20:00:00', 'in_progress','urgent'),
(3, 3, 2, 'pickup',   '88 Anna Salai, Chennai',      13.0827, 80.2707, '22 Mount Road, Chennai',       13.0569, 80.2425, 4.50, '19:30:00', 'accepted',  'normal'),
(4, 4, NULL,'pickup', '88 Anna Salai, Chennai',      13.0827, 80.2707, '22 Mount Road, Chennai',       13.0569, 80.2425, 4.50, '21:00:00', 'available', 'normal'),
(5, 5, NULL,'pickup', '5 Park Street, Kolkata',      22.5726, 88.3639, '9 Lake View, Kolkata',         22.5958, 88.3697, 5.10, '20:30:00', 'available', 'urgent');

-- ============================================
-- DISTRIBUTION MEDIA
-- ============================================

INSERT INTO distribution_media (media_id, donation_id, donor_donation_id, ngo_id, media_type, media_url, description, people_fed, is_published) VALUES
(1, 1, NULL, 1, 'photo', 'https://example.com/media/dist_001.jpg', '80 people received hot meals today at Hope Foundation', 80, TRUE),
(2, NULL, 1, 1, 'photo', 'https://example.com/media/dist_002.jpg', 'Birthday celebration — 50 children enjoyed a special meal', 50, TRUE),
(3, NULL, 2, 2, 'photo', 'https://example.com/media/dist_003.jpg', 'Anniversary donation fed 100 kids at Care for Kids', 100, TRUE);

-- ============================================
-- FEED POSTS
-- ============================================

INSERT INTO feed_posts (post_id, donation_id, donor_donation_id, donor_name, donor_type, ngo_name, location, food_description, people_fed, media_url, description, likes_count, comments_count) VALUES
(1, 1, NULL, 'Grand Palace Hotel', 'hotel',      'Hope Foundation', 'Bangalore', 'Biryani & Curry (20 kg)',  80,  'https://example.com/media/dist_001.jpg', '80 people enjoyed a warm meal thanks to Grand Palace Hotel!', 24, 5),
(2, NULL, 1, 'Sneha Desai',        'individual', 'Hope Foundation', 'Bangalore', 'Birthday meal donation',   50,  'https://example.com/media/dist_002.jpg', 'Sneha celebrated her birthday by feeding 50 children!',       31, 8),
(3, NULL, 2, 'Meera Krishnan',     'individual', 'Care for Kids',   'Chennai',   'Anniversary donation',     100, 'https://example.com/media/dist_003.jpg', 'Meera & family fed 100 kids on their 10th anniversary!',      47, 12);

-- ============================================
-- NOTIFICATIONS
-- ============================================

INSERT INTO notifications (user_id, notification_type, title, message, related_id, is_read) VALUES
(1,  'donation_accepted',  'Donation Accepted',       'Hope Foundation has accepted your donation of Biryani & Curry.',         1, TRUE),
(1,  'donation_delivered', 'Donation Delivered',      'Your donation has been successfully delivered. 80 people were fed!',     1, TRUE),
(4,  'new_donation',       'New Donation Available',  'Grand Palace Hotel has a new donation ready for pickup.',                2, FALSE),
(7,  'task_assigned',      'New Task Available',      'A pickup task is available near you in Bangalore.',                      2, FALSE),
(10, 'donation_completed', 'Your Donation Impacted!', 'Your birthday donation fed 50 children at Hope Foundation.',             1, TRUE),
(5,  'new_donation',       'New Donation Available',  'Sunrise Inn has a new donation of Rice & Sambar ready.',                 3, FALSE);

-- ============================================
-- BADGES
-- ============================================

INSERT INTO badges (badge_id, badge_name, badge_description, badge_icon, criteria_type, criteria_value) VALUES
(1, 'First Meal',           'Made your first donation',                    'badge_first_meal.png',    'donations_count',  1),
(2, 'Compassionate Donor',  'Donated on a personal occasion',              'badge_compassionate.png', 'occasions_count',  1),
(3, 'Community Champion',   'Fed over 300 people through donations',       'badge_champion.png',      'people_fed',       300),
(4, 'Verified Contributor', 'Hotel verified as a regular food contributor','badge_verified.png',      'donations_count',  20),
(5, 'Road Warrior',         'Volunteer completed 25+ delivery tasks',      'badge_road_warrior.png',  'tasks_completed',  25),
(6, 'Century Feeder',       'Helped feed 100+ people as a volunteer',      'badge_century.png',       'people_helped',    100);

-- ============================================
-- USER BADGES
-- ============================================

INSERT INTO user_badges (user_id, badge_id) VALUES
(1,  1), -- Grand Palace: First Meal
(1,  4), -- Grand Palace: Verified Contributor
(2,  1), -- Sunrise Inn: First Meal
(7,  5), -- Rahul: Road Warrior
(7,  6), -- Rahul: Century Feeder
(10, 1), -- Sneha: First Meal
(10, 2), -- Sneha: Compassionate Donor
(12, 1), -- Meera: First Meal
(12, 2), -- Meera: Compassionate Donor
(12, 3); -- Meera: Community Champion

-- ============================================
-- FEED LIKES & COMMENTS
-- ============================================

INSERT INTO feed_likes (post_id, user_id) VALUES
(1, 4),(1, 5),(1, 7),(1, 10),(1, 11),
(2, 4),(2, 7),(2, 8),(2, 11),(2, 12),
(3, 4),(3, 5),(3, 7),(3, 8),(3, 10);

INSERT INTO feed_comments (post_id, user_id, comment_text) VALUES
(1, 4,  'Thank you Grand Palace Hotel! The food was wonderful.'),
(1, 7,  'Happy to have delivered this one. Smiles all around!'),
(1, 10, 'Amazing initiative, keep it up!'),
(2, 4,  'What a beautiful way to celebrate a birthday!'),
(2, 7,  'Inspiring, Sneha!'),
(3, 5,  'Thank you Meera! The kids were so happy.'),
(3, 7,  'This is what community is all about.');
