// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Create cosmic background with particles
    createCosmicBackground();
    
    // Initialize mood selector
    initMoodSelector();
    
    // Initialize dream entries
    initDreamEntries();
    
    // Initialize charts
    initCharts();
    
    // Initialize theme toggle
    initThemeToggle();
    
    // Initialize search and filter
    initSearchFilter();
    
    // Initialize form submission
    initFormSubmission();
    
    // Initialize filter panel
    initFilterPanel();
});

// Create cosmic background with particles
function createCosmicBackground() {
    const cosmicBg = document.getElementById('cosmicBg');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size and position
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random animation duration and delay
        particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        cosmicBg.appendChild(particle);
    }
}

// Initialize mood selector
function initMoodSelector() {
    const moodOptions = document.querySelectorAll('.mood-option');
    let selectedMood = 3; // Default to positive
    
    moodOptions.forEach(option => {
        option.addEventListener('click', () => {
            moodOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedMood = parseInt(option.getAttribute('data-value'));
        });
    });
    
    return selectedMood;
}

// Sample dream entries - empty by default
let dreamEntries = [];

// Function to show notification
function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    const icon = notification.querySelector('i');
    
    notification.querySelector('span').textContent = message;
    
    if (isError) {
        icon.className = 'fas fa-exclamation-circle error';
    } else {
        icon.className = 'fas fa-check-circle success';
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Function to render dream entries
function renderDreamEntries(entries = dreamEntries) {
    const dreamList = document.getElementById('dreamList');
    dreamList.innerHTML = '';
    
    if (entries.length === 0) {
        dreamList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-cloud"></i>
                <p>No dreams recorded yet. Add your first dream!</p>
            </div>
        `;
        return;
    }
    
    entries.forEach(dream => {
        const moodIcons = {
            1: 'frown',
            2: 'meh',
            3: 'smile',
            4: 'grin-stars',
            5: 'tired'
        };
        
        const moodText = {
            1: 'Negative',
            2: 'Neutral',
            3: 'Positive',
            4: 'Exciting',
            5: 'Tiring'
        };
        
        const dreamEl = document.createElement('div');
        dreamEl.className = 'dream-entry new-dream';
        dreamEl.innerHTML = `
            <div class="dream-header">
                <div class="dream-title">${dream.title}</div>
                <div class="dream-date">${dream.date}</div>
            </div>
            <div class="dream-content">${dream.content}</div>
            <div class="dream-footer">
                <div class="dream-tags">
                    ${dream.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    ${dream.lucid ? '<span class="tag" style="background: rgba(76, 201, 240, 0.2);">lucid</span>' : ''}
                </div>
                <div class="dream-actions">
                    <div class="dream-mood">
                        <i class="fas fa-${moodIcons[dream.mood]}"></i>
                        <span>${moodText[dream.mood]}</span>
                    </div>
                    <button class="action-btn edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        dreamList.appendChild(dreamEl);
        
        // Add event listeners to action buttons
        dreamEl.querySelector('.edit-btn').addEventListener('click', () => {
            editDream(dream.id);
        });
        
        dreamEl.querySelector('.delete-btn').addEventListener('click', () => {
            deleteDream(dream.id);
        });
    });
    
    // Update stats
    updateStats();
}

// Function to create particle effect
function createParticles(x, y, count) {
    const particles = document.createElement('div');
    particles.className = 'particles';
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle-effect';
        
        // Random direction and distance
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        // Random size
        const size = Math.random() * 8 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Position
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Random color
        const colors = ['#ff6b6b', '#9d4edd', '#4895ef', '#4cc9f0'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        particles.appendChild(particle);
    }
    
    document.body.appendChild(particles);
    
    // Remove particles after animation completes
    setTimeout(() => {
        particles.remove();
    }, 1500);
}

// Function to handle form submission
function initFormSubmission() {
    document.getElementById('dreamForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('dreamTitle').value;
        const content = document.getElementById('dreamContent').value;
        const tags = document.getElementById('dreamTags').value.split(',').map(tag => tag.trim());
        const lucid = document.getElementById('lucidCheckbox').checked;
        
        if (!title || !content) {
            showNotification('Please fill in both title and content fields', true);
            return;
        }
        
        // Get selected mood
        const selectedMood = document.querySelector('.mood-option.active')?.getAttribute('data-value') || 3;
        
        // Create new dream object
        const newDream = {
            id: Date.now(), // Unique ID based on timestamp
            title,
            content,
            date: new Date().toISOString().split('T')[0],
            tags,
            mood: parseInt(selectedMood),
            lucid
        };
        
        // Add to entries
        dreamEntries.unshift(newDream);
        
        // Render entries
        renderDreamEntries();
        
        // Simulate dream analysis
        simulateAnalysis(content);
        
        // Reset form
        this.reset();
        document.getElementById('lucidCheckbox').checked = false;
        
        // Create particle effect
        const saveBtn = document.getElementById('saveBtn');
        const rect = saveBtn.getBoundingClientRect();
        const x = rect.left + rect.width/2;
        const y = rect.top + rect.height/2;
        createParticles(x, y, 20);
        
        // Show success notification
        showNotification('Dream saved successfully!');
    });
}

// Function to simulate dream analysis
function simulateAnalysis(content) {
    const analysisEl = document.getElementById('dreamAnalysis');
    analysisEl.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    
    // Simulate processing delay
    setTimeout(() => {
        // Simple keyword analysis
        const keywords = {
            water: "water symbolizes emotions and the unconscious mind",
            flying: "flying suggests feelings of freedom or a desire to escape",
            ocean: "oceans represent deep emotions and the vastness of the unconscious",
            forest: "forests indicate growth, exploration, or feeling lost",
            home: "homes represent the self, security, and identity",
            childhood: "childhood elements often point to unresolved issues or nostalgia",
            animals: "animals represent instincts and natural drives",
            searching: "searching reflects a quest for meaning or answers in life",
            school: "school dreams relate to learning, performance anxiety, or life lessons",
            future: "futuristic elements suggest aspirations or anxieties about what's to come",
            city: "cities represent society, complexity, and social interactions",
            technology: "technology in dreams often relates to communication and problem-solving",
            books: "books symbolize knowledge, wisdom, and life lessons",
            knowledge: "knowledge represents personal growth and understanding",
            time: "time references may indicate concerns about deadlines or life progression",
            treasure: "treasure symbolizes self-discovery or valuable insights",
            crystals: "crystals represent clarity, energy, and spiritual growth"
        };
        
        // Find matching keywords
        const foundInsights = [];
        const foundKeywords = [];
        
        for (const [key, insight] of Object.entries(keywords)) {
            if (content.toLowerCase().includes(key)) {
                foundInsights.push(`<li>Your dream contained references to <strong>${key}</strong>, which ${insight}.</li>`);
                foundKeywords.push(key);
            }
        }
        
        // Generate analysis text
        let analysisHTML = '<p>After analyzing your dream, we discovered:</p>';
        
        if (foundInsights.length > 0) {
            analysisHTML += `<ul>${foundInsights.join('')}</ul>`;
        } else {
            analysisHTML += '<p>This dream shows unique patterns that suggest personal growth and self-discovery.</p>';
        }
        
        // Get selected mood
        const selectedMood = document.querySelector('.mood-option.active')?.getAttribute('data-value') || 3;
        
        // Add emotional assessment based on mood
        const moodAssessment = {
            1: "This dream appears to reflect negative emotions or unresolved conflicts.",
            2: "This dream seems neutral, possibly reflecting everyday thoughts and experiences.",
            3: "This dream reflects positive emotions and a sense of wellbeing.",
            4: "This dream suggests excitement and anticipation about future possibilities.",
            5: "This dream indicates emotional exhaustion or the need for rest and recovery."
        };
        
        analysisHTML += `<p>${moodAssessment[selectedMood]}</p>`;
        
        analysisEl.innerHTML = analysisHTML;
        
        // Update keywords
        const keywordsEl = document.getElementById('dreamKeywords');
        keywordsEl.innerHTML = '';
        
        const uniqueKeywords = [...new Set(foundKeywords)];
        if (uniqueKeywords.length === 0) {
            uniqueKeywords.push('unique', 'insightful', 'meaningful');
        }
        
        uniqueKeywords.forEach(keyword => {
            keywordsEl.innerHTML += `<span class="keyword">${keyword}</span>`;
        });
    }, 2000);
}

// Function to edit a dream
function editDream(id) {
    const dream = dreamEntries.find(d => d.id === id);
    if (dream) {
        document.getElementById('dreamTitle').value = dream.title;
        document.getElementById('dreamContent').value = dream.content;
        document.getElementById('dreamTags').value = dream.tags.join(', ');
        document.getElementById('lucidCheckbox').checked = dream.lucid;
        
        // Set mood
        const moodOptions = document.querySelectorAll('.mood-option');
        moodOptions.forEach(opt => opt.classList.remove('active'));
        const moodOption = document.querySelector(`.mood-option[data-value="${dream.mood}"]`);
        if (moodOption) {
            moodOption.classList.add('active');
        }
        
        // Remove dream from list
        dreamEntries = dreamEntries.filter(d => d.id !== id);
        renderDreamEntries();
        
        // Scroll to form
        document.getElementById('dreamForm').scrollIntoView({ behavior: 'smooth' });
        
        showNotification(`Dream "${dream.title}" loaded for editing.`);
    }
}

// Function to delete a dream
function deleteDream(id) {
    const dream = dreamEntries.find(d => d.id === id);
    if (dream) {
        dreamEntries = dreamEntries.filter(d => d.id !== id);
        renderDreamEntries();
        showNotification(`Dream "${dream.title}" has been deleted.`);
    }
}

// Function to update stats
function updateStats() {
    document.getElementById('dreamCount').textContent = dreamEntries.length;
    
    // Calculate average mood
    const totalMood = dreamEntries.reduce((sum, dream) => sum + dream.mood, 0);
    const avgMood = dreamEntries.length ? (totalMood / dreamEntries.length).toFixed(1) : '0.0';
    document.getElementById('avgMood').textContent = avgMood;
    
    // Calculate lucid dreams count
    const lucidCount = dreamEntries.filter(dream => dream.lucid).length;
    document.getElementById('lucidCount').textContent = lucidCount;
    
    // Calculate recall rate (just a simulation)
    const recallRate = dreamEntries.length > 10 ? '92%' : '86%';
    document.getElementById('recallRate').textContent = recallRate;
    
    // Update personalized insight based on dream count
    const personalizedInsight = document.getElementById('personalizedInsight');
    const insightAdvice = document.getElementById('insightAdvice');
    
    if (dreamEntries.length === 0) {
        personalizedInsight.textContent = 'Start recording your dreams to receive personalized insights about your subconscious mind.';
        insightAdvice.textContent = 'Dream journaling can help improve self-awareness and problem-solving skills.';
    } else if (dreamEntries.length < 5) {
        personalizedInsight.textContent = 'You\'re just getting started with dream journaling. Keep recording your dreams to discover patterns.';
        insightAdvice.textContent = 'Try to write down your dreams immediately after waking for better recall.';
    } else {
        personalizedInsight.textContent = 'Based on your dream patterns, you seem to be going through a period of emotional growth.';
        insightAdvice.textContent = 'Consider exploring creative outlets to express these emerging emotions and insights.';
    }
}

// Function to search dreams
function searchDreams(query) {
    if (!query.trim()) {
        renderDreamEntries();
        return;
    }
    
    const lowerQuery = query.toLowerCase();
    const results = dreamEntries.filter(dream => 
        dream.title.toLowerCase().includes(lowerQuery) ||
        dream.content.toLowerCase().includes(lowerQuery) ||
        dream.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
    
    renderDreamEntries(results);
}

// Function to filter dreams
function filterDreams() {
    const moodFilter = document.getElementById('moodFilter').value;
    const tagFilter = document.getElementById('tagFilter').value;
    const lucidFilter = document.getElementById('lucidFilter').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    let results = dreamEntries;
    
    // Apply mood filter
    if (moodFilter !== 'all') {
        results = results.filter(dream => dream.mood === parseInt(moodFilter));
    }
    
    // Apply tag filter
    if (tagFilter !== 'all') {
        results = results.filter(dream => dream.tags.includes(tagFilter));
    }
    
    // Apply lucid filter
    if (lucidFilter !== 'all') {
        results = results.filter(dream => dream.lucid === (lucidFilter === 'true'));
    }
    
    // Apply date filter
    if (startDate) {
        results = results.filter(dream => dream.date >= startDate);
    }
    
    if (endDate) {
        results = results.filter(dream => dream.date <= endDate);
    }
    
    renderDreamEntries(results);
}

// Initialize charts
function initCharts() {
    // Mood Chart
    const moodCtx = document.getElementById('moodChart').getContext('2d');
    const moodChart = new Chart(moodCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Mood Rating',
                data: [3.2, 3.5, 3.7, 4.0, 3.8, 4.2],
                borderColor: '#ffd166',
                backgroundColor: 'rgba(255, 209, 102, 0.1)',
                borderWidth: 3,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#ffd166',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: 'rgba(255, 255, 255, 0.8)'
                    }
                }
            },
            scales: {
                y: {
                    min: 1,
                    max: 5,
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
    
    // Theme Chart
    const themeCtx = document.getElementById('themeChart').getContext('2d');
    const themeChart = new Chart(themeCtx, {
        type: 'doughnut',
        data: {
            labels: ['Adventure', 'Emotions', 'People', 'Work', 'Fantasy'],
            datasets: [{
                data: [25, 30, 20, 15, 10],
                backgroundColor: [
                    '#4361ee',
                    '#f72585',
                    '#4cc9f0',
                    '#4895ef',
                    '#9d4edd'
                ],
                borderWidth: 0,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 2000
            }
        }
    });
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or respect OS preference
    const savedTheme = localStorage.getItem('dreamweaver-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
        document.body.classList.add('light-theme');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-theme');
        
        if (document.body.classList.contains('light-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('dreamweaver-theme', 'light');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('dreamweaver-theme', 'dark');
        }
    });
}

// Search and filter functionality
function initSearchFilter() {
    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', () => {
        const query = document.getElementById('searchInput').value;
        searchDreams(query);
    });
    
    document.getElementById('searchInput').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            const query = document.getElementById('searchInput').value;
            searchDreams(query);
        }
    });
    
    // Filter panel
    document.getElementById('filterBtn').addEventListener('click', () => {
        document.getElementById('filterPanel').classList.add('active');
    });
    
    document.getElementById('closeFilter').addEventListener('click', () => {
        document.getElementById('filterPanel').classList.remove('active');
    });
    
    document.getElementById('applyFilter').addEventListener('click', () => {
        filterDreams();
        document.getElementById('filterPanel').classList.remove('active');
    });
}

// Initialize dream entries
function initDreamEntries() {
    // Try to load from localStorage
    const savedEntries = localStorage.getItem('dreamEntries');
    if (savedEntries) {
        dreamEntries = JSON.parse(savedEntries);
    }
    
    renderDreamEntries();
    
    // Don't simulate analysis if there are no dreams
    if (dreamEntries.length > 0) {
        simulateAnalysis(dreamEntries[0].content);
    }
    
    // Save dreams to localStorage on page unload
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('dreamEntries', JSON.stringify(dreamEntries));
    });
}

// Initialize filter panel
function initFilterPanel() {
    // Set today's date as default for end date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('endDate').value = today;
    
    // Set start date to 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
    document.getElementById('startDate').value = thirtyDaysAgoStr;
}