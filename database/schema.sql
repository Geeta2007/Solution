-- NourishNet Database Schema
-- Database for food donation platform connecting hotels, NGOs, volunteers, and individual donors

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

-- Main Users Table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('hotel', 'ngo', 'volunteer', 'donor') NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL
);

-- ============================================
-- HOTEL/RESTAURANT PROFILES
-- ============================================

CREATE TABLE hotels (
    hotel_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_type ENUM('hotel', 'restaurant', 'bakery', 'cafe', 'catering') NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    pincode VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    contact_person VARCHAR(255),
    registration_number VARCHAR(100),
    total_donations INT DEFAULT 0,
    total_people_fed INT DEFAULT 0,
    verified_contributor BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================
-- NGO PROFILES
-- ============================================

CREATE TABLE ngos (
    ngo_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    organization_name VARCHAR(255) NOT NULL,
    organization_type ENUM('ngo', 'charity', 'shelter', 'oldage', 'orphanage', 'other') NOT NULL,
    registration_number VARCHAR(100) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    pincode VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    verification_date TIMESTAMP NULL,
    total_donations_received INT DEFAULT 0,
    total_people_helped INT DEFAULT 0,
    verified_partner BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================
-- VOLUNTEER PROFILES
-- ============================================

CREATE TABLE volunteers (
    volunteer_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    vehicle_type ENUM('bike', 'car', 'van', 'none') DEFAULT 'none',
    availability_status ENUM('available', 'busy', 'offline') DEFAULT 'available',
    total_tasks_completed INT DEFAULT 0,
    total_people_helped INT DEFAULT 0,
    total_distance_km DECIMAL(10, 2) DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 5.00,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================
-- INDIVIDUAL DONOR PROFILES
-- ============================================

CREATE TABLE donors (
    donor_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    total_donations INT DEFAULT 0,
    total_people_fed INT DEFAULT 0,
    total_amount_donated DECIMAL(10, 2) DEFAULT 0,
    compassionate_donor_badge BOOLEAN DEFAULT FALSE,
    community_champion_badge BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================
-- DONATIONS
-- ============================================

CREATE TABLE donations (
    donation_id INT PRIMARY KEY AUTO_INCREMENT,
    donor_id INT NOT NULL,
    donor_type ENUM('hotel', 'donor') NOT NULL,
    ngo_id INT,
    food_type VARCHAR(255),
    quantity VARCHAR(100),
    quantity_kg DECIMAL(10, 2),
    estimated_servings INT,
    pickup_address TEXT NOT NULL,
    pickup_latitude DECIMAL(10, 8),
    pickup_longitude DECIMAL(11, 8),
    pickup_time TIME,
    best_before_date DATE,
    additional_notes TEXT,
    status ENUM('pending', 'accepted', 'in_transit', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    people_fed INT DEFAULT 0,
    FOREIGN KEY (ngo_id) REFERENCES ngos(ngo_id) ON DELETE SET NULL
);

-- ============================================
-- INDIVIDUAL DONOR DONATIONS
-- ============================================

CREATE TABLE donor_donations (
    donor_donation_id INT PRIMARY KEY AUTO_INCREMENT,
    donor_id INT NOT NULL,
    occasion ENUM('birthday', 'anniversary', 'wedding', 'graduation', 'festival', 'other') NOT NULL,
    donation_type ENUM('money', 'food') NOT NULL,
    amount DECIMAL(10, 2),
    ngo_id INT NOT NULL,
    personal_message TEXT,
    share_on_feed BOOLEAN DEFAULT TRUE,
    people_fed INT DEFAULT 0,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (donor_id) REFERENCES donors(donor_id) ON DELETE CASCADE,
    FOREIGN KEY (ngo_id) REFERENCES ngos(ngo_id) ON DELETE CASCADE
);

-- ============================================
-- VOLUNTEER TASKS
-- ============================================

CREATE TABLE volunteer_tasks (
    task_id INT PRIMARY KEY AUTO_INCREMENT,
    donation_id INT NOT NULL,
    volunteer_id INT,
    task_type ENUM('pickup', 'delivery', 'distribution') NOT NULL,
    from_location TEXT NOT NULL,
    from_latitude DECIMAL(10, 8),
    from_longitude DECIMAL(11, 8),
    to_location TEXT NOT NULL,
    to_latitude DECIMAL(10, 8),
    to_longitude DECIMAL(11, 8),
    distance_km DECIMAL(10, 2),
    scheduled_time TIME,
    status ENUM('available', 'accepted', 'in_progress', 'completed', 'cancelled') DEFAULT 'available',
    priority ENUM('normal', 'urgent') DEFAULT 'normal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP NULL,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (donation_id) REFERENCES donations(donation_id) ON DELETE CASCADE,
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(volunteer_id) ON DELETE SET NULL
);

-- ============================================
-- DISTRIBUTION PHOTOS/VIDEOS
-- ============================================

CREATE TABLE distribution_media (
    media_id INT PRIMARY KEY AUTO_INCREMENT,
    donation_id INT,
    donor_donation_id INT,
    ngo_id INT NOT NULL,
    media_type ENUM('photo', 'video') NOT NULL,
    media_url VARCHAR(500) NOT NULL,
    description TEXT,
    people_fed INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_published BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (donation_id) REFERENCES donations(donation_id) ON DELETE CASCADE,
    FOREIGN KEY (donor_donation_id) REFERENCES donor_donations(donor_donation_id) ON DELETE CASCADE,
    FOREIGN KEY (ngo_id) REFERENCES ngos(ngo_id) ON DELETE CASCADE
);

-- ============================================
-- PUBLIC TRANSPARENCY FEED
-- ============================================

CREATE TABLE feed_posts (
    post_id INT PRIMARY KEY AUTO_INCREMENT,
    donation_id INT,
    donor_donation_id INT,
    donor_name VARCHAR(255) NOT NULL,
    donor_type ENUM('hotel', 'individual', 'event') NOT NULL,
    ngo_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    food_description TEXT,
    people_fed INT NOT NULL,
    media_url VARCHAR(500),
    description TEXT,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(donation_id) ON DELETE CASCADE,
    FOREIGN KEY (donor_donation_id) REFERENCES donor_donations(donor_donation_id) ON DELETE CASCADE
);

-- ============================================
-- FEED INTERACTIONS
-- ============================================

CREATE TABLE feed_likes (
    like_id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES feed_posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (post_id, user_id)
);

CREATE TABLE feed_comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES feed_posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================
-- BADGES & ACHIEVEMENTS
-- ============================================

CREATE TABLE badges (
    badge_id INT PRIMARY KEY AUTO_INCREMENT,
    badge_name VARCHAR(100) NOT NULL,
    badge_description TEXT,
    badge_icon VARCHAR(255),
    criteria_type VARCHAR(50),
    criteria_value INT
);

CREATE TABLE user_badges (
    user_badge_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    badge_id INT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(badge_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_badge (user_id, badge_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_created ON donations(created_at);
CREATE INDEX idx_tasks_status ON volunteer_tasks(status);
CREATE INDEX idx_tasks_volunteer ON volunteer_tasks(volunteer_id);
CREATE INDEX idx_feed_created ON feed_posts(created_at);
CREATE INDEX idx_hotels_city ON hotels(city);
CREATE INDEX idx_ngos_city ON ngos(city);
CREATE INDEX idx_volunteers_city ON volunteers(city);
CREATE INDEX idx_ngos_verification ON ngos(verification_status);
