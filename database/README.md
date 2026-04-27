# NourishNet Database Documentation

## Overview
This database schema supports the NourishNet food donation platform, connecting hotels/restaurants, NGOs, volunteers, and individual donors.

## Database Structure

### 1. Users & Authentication

#### `users` Table
Main authentication table for all user types.
- **Primary Key**: `user_id`
- **User Types**: hotel, ngo, volunteer, donor
- **Key Fields**: email, password_hash, user_type, is_verified

### 2. Profile Tables

#### `hotels` Table
Stores hotel and restaurant information.
- Links to `users` table via `user_id`
- Tracks: business details, location, total donations, people fed
- **Verification**: `verified_contributor` badge

#### `ngos` Table
Stores NGO and charity organization information.
- Links to `users` table via `user_id`
- **Verification Status**: pending, verified, rejected
- Tracks: organization details, donations received, people helped

#### `volunteers` Table
Stores volunteer information.
- Links to `users` table via `user_id`
- Tracks: location, vehicle type, availability, tasks completed
- **Rating System**: 0-5 stars

#### `donors` Table
Stores individual donor information.
- Links to `users` table via `user_id`
- Tracks: donations made, people fed, total amount donated
- **Badges**: Compassionate Donor, Community Champion

### 3. Donation Management

#### `donations` Table
Main table for hotel/restaurant food donations.
- **Status Flow**: pending → accepted → in_transit → delivered
- Links to: hotels (via donor_id), NGOs, volunteers
- Tracks: food details, pickup info, delivery status

#### `donor_donations` Table
Individual donor donations (birthdays, weddings, etc.).
- **Occasions**: birthday, anniversary, wedding, graduation, festival, other
- **Types**: money or food items
- Links to: donors, NGOs

#### `volunteer_tasks` Table
Tasks assigned to volunteers for pickup/delivery.
- **Task Types**: pickup, delivery, distribution
- **Status**: available → accepted → in_progress → completed
- **Priority**: normal, urgent
- Tracks: locations, distance, timing

### 4. Transparency & Media

#### `distribution_media` Table
Photos and videos of food distribution.
- Links to: donations, NGOs
- **Media Types**: photo, video
- Used for transparency and donor feedback

#### `feed_posts` Table
Public transparency feed showing all donations.
- Displays on homepage
- Includes: donor info, NGO info, people fed, media
- Supports likes and comments

#### `feed_likes` & `feed_comments` Tables
User interactions with feed posts.
- Tracks engagement
- Links to users and posts

### 5. Notifications & Achievements

#### `notifications` Table
System notifications for all users.
- **Types**: donation updates, task assignments, verification status
- Tracks read/unread status

#### `badges` & `user_badges` Tables
Achievement system for gamification.
- Predefined badges with criteria
- Tracks when users earn badges

## Key Relationships

```
users (1) ─── (1) hotels
users (1) ─── (1) ngos
users (1) ─── (1) volunteers
users (1) ─── (1) donors

hotels (1) ─── (many) donations
ngos (1) ─── (many) donations
volunteers (1) ─── (many) volunteer_tasks

donations (1) ─── (many) volunteer_tasks
donations (1) ─── (many) distribution_media
donations (1) ─── (1) feed_posts

donor_donations (1) ─── (many) distribution_media
donor_donations (1) ─── (1) feed_posts
```

## Sample Queries

### Get Hotel Dashboard Data
```sql
SELECT 
    h.business_name,
    h.total_donations,
    h.total_people_fed,
    h.verified_contributor,
    COUNT(d.donation_id) as pending_donations
FROM hotels h
LEFT JOIN donations d ON h.hotel_id = d.donor_id AND d.status = 'pending'
WHERE h.user_id = ?
GROUP BY h.hotel_id;
```

### Get NGO Incoming Donations
```sql
SELECT 
    d.donation_id,
    h.business_name as donor_name,
    d.food_type,
    d.quantity,
    d.pickup_address,
    d.pickup_time,
    d.status
FROM donations d
JOIN hotels h ON d.donor_id = h.hotel_id
WHERE d.ngo_id = ? AND d.status IN ('pending', 'accepted')
ORDER BY d.created_at DESC;
```

### Get Volunteer Available Tasks
```sql
SELECT 
    vt.task_id,
    vt.task_type,
    vt.from_location,
    vt.to_location,
    vt.distance_km,
    vt.scheduled_time,
    vt.priority,
    d.food_type,
    d.quantity
FROM volunteer_tasks vt
JOIN donations d ON vt.donation_id = d.donation_id
WHERE vt.status = 'available'
ORDER BY vt.priority DESC, vt.created_at ASC;
```

### Get Public Transparency Feed
```sql
SELECT 
    fp.post_id,
    fp.donor_name,
    fp.donor_type,
    fp.ngo_name,
    fp.location,
    fp.people_fed,
    fp.media_url,
    fp.description,
    fp.likes_count,
    fp.comments_count,
    fp.created_at
FROM feed_posts fp
ORDER BY fp.created_at DESC
LIMIT 20;
```

### Get Donor Impact Stats
```sql
SELECT 
    d.full_name,
    d.total_donations,
    d.total_people_fed,
    d.total_amount_donated,
    d.compassionate_donor_badge,
    d.community_champion_badge
FROM donors d
WHERE d.user_id = ?;
```

## Database Setup Instructions

### MySQL/MariaDB
```bash
# Create database
mysql -u root -p
CREATE DATABASE nourishnet;
USE nourishnet;

# Import schema
mysql -u root -p nourishnet < database/schema.sql
```

### PostgreSQL
```bash
# Create database
psql -U postgres
CREATE DATABASE nourishnet;
\c nourishnet

# Import schema (after converting to PostgreSQL syntax)
psql -U postgres -d nourishnet -f database/schema.sql
```

### MongoDB (Alternative NoSQL Structure)
For MongoDB, you would need to convert to document-based collections. See `mongodb-schema.js` for details.

## Security Considerations

1. **Password Storage**: Always hash passwords using bcrypt or Argon2
2. **SQL Injection**: Use parameterized queries/prepared statements
3. **Data Validation**: Validate all inputs on server-side
4. **Access Control**: Implement role-based access control (RBAC)
5. **Sensitive Data**: Encrypt sensitive fields like phone numbers
6. **Audit Logs**: Consider adding audit trail tables for compliance

## Backup Strategy

1. **Daily Backups**: Automated daily full backups
2. **Transaction Logs**: Enable transaction logging for point-in-time recovery
3. **Retention**: Keep backups for 30 days minimum
4. **Testing**: Regularly test backup restoration

## Performance Optimization

1. **Indexes**: Already included in schema for common queries
2. **Caching**: Use Redis for frequently accessed data (feed posts, stats)
3. **Partitioning**: Consider partitioning large tables by date
4. **Read Replicas**: Use read replicas for reporting queries

## Future Enhancements

1. **Ratings & Reviews**: Add rating system for NGOs and volunteers
2. **Chat System**: Real-time messaging between users
3. **Analytics**: Detailed analytics and reporting tables
4. **Payment Gateway**: Integration for monetary donations
5. **Geofencing**: Location-based task assignment
6. **API Logs**: Track API usage and performance
