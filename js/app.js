document.addEventListener('DOMContentLoaded', () => {
    // --- Sticky Header ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Intersection Observer for Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const numberElements = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const animateOnScrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If it's a number, start the counter animation
                if (entry.target.classList.contains('stat-card')) {
                    const numberElement = entry.target.querySelector('.stat-number');
                    if (numberElement && !numberElement.classList.contains('counted')) {
                        animateValue(numberElement, 0, parseInt(numberElement.getAttribute('data-target')), 2000);
                        numberElement.classList.add('counted');
                    }
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => animateOnScrollObserver.observe(el));

    // --- Number Counter Animation ---
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Easing function for smoother counting
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            let currentNum = Math.floor(easeOutQuart * (end - start) + start);
            obj.innerHTML = currentNum.toLocaleString();
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end.toLocaleString(); // Ensure it ends exactly on the target
            }
        };
        window.requestAnimationFrame(step);
    }

    // --- How It Works Tab Switching ---
    document.querySelectorAll('.hiw-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.hiw-tab').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.hiw-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('hiw-' + btn.dataset.hiw).classList.add('active');
        });
    });

    // --- Tab Switching Logic (legacy, kept for safety) ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding content
            const targetId = btn.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- Public Transparency Feed ---
    const feedGrid = document.getElementById('feedGrid');

    const mockFeedData = [
        {
            name: "Grand Hotel Mumbai",
            type: "Hotel",
            ngo: "Hope Foundation",
            sub: "Hope Foundation",
            category: "hotels",
            location: "Mumbai Central Shelter",
            time: "2 hours ago",
            image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=768&h=384&fit=crop",
            peopleFed: 120,
            description: "Surplus food from tonight's banquet donated to feed the homeless. Thank you to our amazing kitchen team!",
            likes: 214,
            comments: 8
        },
        {
            name: "Priya & Rahul Wedding",
            type: "Individual",
            ngo: "Akshaya Patra Foundation",
            sub: "Akshaya Patra Foundation",
            category: "individual",
            location: "Bangalore, Karnataka",
            time: "5 hours ago",
            image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=768&h=384&fit=crop",
            peopleFed: 92,
            description: "Celebrating our special day by feeding 200 children. Our wedding became even more memorable! 🎉",
            likes: 456,
            comments: 32
        },
        {
            name: "Spice Kitchen Restaurant",
            type: "Restaurant",
            ngo: "Seva Ashram",
            sub: "Seva Ashram",
            category: "hotels",
            location: "Delhi, NCR",
            time: "1 day ago",
            image: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=768&h=384&fit=crop",
            peopleFed: 80,
            description: "Daily surplus from our buffet going to elderly care home. Small steps towards zero waste!",
            likes: 189,
            comments: 12
        },
        {
            name: "Tech Corp Annual Day",
            type: "Event",
            ngo: "Annamrita Foundation",
            sub: "Annamrita Foundation",
            category: "ngo",
            location: "Hyderabad, Telangana",
            time: "1 day ago",
            image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=768&h=384&fit=crop",
            peopleFed: 300,
            description: "Our annual day celebration extended to feeding 300 underprivileged families. Corporate responsibility in action! 👍",
            likes: 567,
            comments: 45
        },
        {
            name: "Sunrise Bakehouse",
            type: "Bakery",
            ngo: "Robin Hood Army",
            sub: "Robin Hood Army",
            category: "hotels",
            location: "Pune, Maharashtra",
            time: "3 hours ago",
            image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=768&h=384&fit=crop",
            peopleFed: 60,
            description: "End-of-day bread and pastries rescued before closing. Fresh baked goods reaching those who need it most!",
            likes: 143,
            comments: 9
        },
        {
            name: "Sharma Family Reunion",
            type: "Individual",
            ngo: "Goonj Foundation",
            sub: "Goonj Foundation",
            category: "individual",
            location: "Jaipur, Rajasthan",
            time: "6 hours ago",
            image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=768&h=384&fit=crop",
            peopleFed: 120,
            description: "Our family reunion had so much food left over. Happy it's going to feed 120 people tonight! 🙏",
            likes: 312,
            comments: 27
        },
        {
            name: "The Curry House",
            type: "Restaurant",
            ngo: "No Food Waste NGO",
            sub: "No Food Waste NGO",
            category: "hotels",
            location: "Chennai, Tamil Nadu",
            time: "8 hours ago",
            image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?w=768&h=384&fit=crop",
            peopleFed: 95,
            description: "Weekly surplus from our lunch buffet. We've partnered with No Food Waste to make this a regular thing!",
            likes: 278,
            comments: 21
        },
        {
            name: "IIT Alumni Meet",
            type: "Event",
            ngo: "Feeding India",
            sub: "Feeding India",
            category: "ngo",
            location: "Chennai, Tamil Nadu",
            time: "10 hours ago",
            image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=768&h=384&fit=crop",
            peopleFed: 175,
            description: "Alumni gathering surplus redirected to nearby shelter homes. Engineers solving hunger, one meal at a time! 💡",
            likes: 389,
            comments: 34
        },
        {
            name: "Green Bowl Cafe",
            type: "Cafe",
            ngo: "Meal for Two",
            sub: "Meal for Two",
            category: "hotels",
            location: "Kolkata, West Bengal",
            time: "12 hours ago",
            image: "https://images.unsplash.com/photo-1593113833032-7e8c0eb6a0b8?w=768&h=384&fit=crop",
            peopleFed: 45,
            description: "Healthy salads and grain bowls donated daily. Nutritious food for those who deserve it the most.",
            likes: 201,
            comments: 15
        }
    ];

    function renderFeedCards(filter) {
        feedGrid.innerHTML = '';
        const filtered = filter === 'all' ? mockFeedData : mockFeedData.filter(d => d.category === filter);
        filtered.forEach((item, index) => {
            const delay = index * 0.08;
            const cardHTML = `
                <div class="feed-card animate-on-scroll" style="transition-delay: ${delay}s" data-category="${item.category}">
                    <div class="feed-card-header">
                        <div class="feed-card-header-left">
                            <img class="feed-avatar-img" src="https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=e8f5e9&color=2E8B57&bold=true&size=42" alt="${item.name}">
                            <div class="feed-meta">
                                <div class="feed-name-row">
                                    <span class="feed-name">${item.name}</span>
                                    <span class="feed-verified-dot" title="Verified"></span>
                                </div>
                                <div class="feed-sub-row">
                                    <span class="feed-type-badge">${item.type}</span>
                                    <span class="feed-sub">– ${item.ngo}</span>
                                </div>
                                <div class="feed-sub-row" style="margin-top:0.1rem">
                                    <span class="feed-sub"><i class="fa-solid fa-location-dot" style="font-size:0.65rem"></i> ${item.location}</span>
                                    <span class="feed-sub">· ${item.time}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="feed-image-wrap">
                        <img class="feed-evidence-img" src="${item.image}" alt="${item.name} donation">
                        <div class="feed-meal-badge"><i class="fa-solid fa-utensils"></i> ${item.peopleFed} Meals</div>
                    </div>
                    <div class="feed-card-body">
                        <p class="feed-description">${item.description}</p>
                        <div class="feed-info-row">
                            <div class="feed-info-item">
                                <span class="feed-info-label"><i class="fa-solid fa-person"></i> People Fed</span>
                                <span class="feed-info-value">${item.peopleFed}</span>
                            </div>
                            <div class="feed-info-item">
                                <span class="feed-info-label"><i class="fa-solid fa-location-dot"></i> Location</span>
                                <span class="feed-info-value">${item.location}</span>
                            </div>
                        </div>
                    </div>
                    <div class="feed-footer">
                        <div class="feed-reactions">
                            <span class="feed-reaction"><i class="fa-solid fa-heart"></i> ${item.likes}</span>
                            <span class="feed-reaction feed-reaction-comment"><i class="fa-regular fa-comment"></i> ${item.comments}</span>
                        </div>
                        <button class="btn-share"><i class="fa-solid fa-share-nodes"></i> Share</button>
                    </div>
                </div>
            `;
            feedGrid.insertAdjacentHTML('beforeend', cardHTML);
        });
        feedGrid.querySelectorAll('.animate-on-scroll').forEach(el => animateOnScrollObserver.observe(el));
    }

    if (feedGrid) {
        renderFeedCards('all');

        // Filter buttons
        document.querySelectorAll('.feed-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.feed-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderFeedCards(btn.dataset.filter);
            });
        });
    }

    // Feed stat counters
    const feedStatNumbers = document.querySelectorAll('.feed-stat-number');
    const feedStatObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (!el.classList.contains('counted')) {
                    animateValue(el, 0, parseInt(el.getAttribute('data-target')), 1800);
                    el.classList.add('counted');
                }
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.3 });
    feedStatNumbers.forEach(el => feedStatObserver.observe(el));
});


