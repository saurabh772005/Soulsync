// SoulSync App JavaScript - Fixed Navigation
// In-memory database simulation
let appData = {
  users: [],
  currentUser: null,
  moods: [],
  posts: [],
  chats: [],
  matches: [],
  achievements: [
    {name: "First Step", description: "Logged your first mood", icon: "🎯", earned: false},
    {name: "Week Warrior", description: "7-day mood tracking streak", icon: "🔥", earned: false},
    {name: "Community Helper", description: "Helped 5 people in community", icon: "🤝", earned: false},
    {name: "Mindful Month", description: "30-day streak", icon: "🧘", earned: false}
  ],
  leaderboard: [
    {name: "MindfulSoul", activity: "Helped 15 people this week", points: 1250},
    {name: "CalmSeeker", activity: "30-day streak achieved", points: 980},
    {name: "HopefulHeart", activity: "Posted 12 supportive messages", points: 850},
    {name: "PeaceFinder", activity: "Completed 20 breathing exercises", points: 720},
    {name: "WellnessWarrior", activity: "Maintained perfect week streak", points: 650}
  ],
  supportGroups: [
    {name: "Anxiety Support", members: 1247, description: "Safe space for those dealing with anxiety"},
    {name: "Work Stress Relief", members: 892, description: "Coping with workplace pressures"},
    {name: "Student Mental Health", members: 1568, description: "Support for academic stress and student life"},
    {name: "Depression Support", members: 2103, description: "Understanding and overcoming depression together"}
  ]
};

// Global state
let selectedMood = null;
let selectedTriggers = [];
let selectedPreferences = [];
let currentChatId = null;

// Initialize app on DOM load
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing SoulSync app...');
  
  initializeSampleData();
  setupEventListeners();
  updateNavigation();
  showPage('landing');
});

// Setup all event listeners properly
function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Navigation links
  document.querySelectorAll('[data-page]').forEach(element => {
    element.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      console.log('Navigation clicked:', page);
      showPage(page);
    });
  });
  
  // CTA buttons for registration
  document.querySelectorAll('.cta-register').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('CTA register clicked');
      showPage('register');
    });
  });
  
  // Logout functionality
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', function(e) {
      e.preventDefault();
      logout();
    });
  }
  
  // Form submissions
  setupFormListeners();
  
  // Dashboard mood selection
  setupMoodListeners();
  
  // Mood tracking page
  setupMoodTrackingListeners();
  
  // Community functionality
  setupCommunityListeners();
  
  // Resources functionality
  setupResourcesListeners();
  
  // Modal functionality
  setupModalListeners();
  
  // Leaderboard tabs
  setupLeaderboardListeners();
  
  console.log('Event listeners setup complete');
}

// Page navigation - FIXED
function showPage(pageId) {
  console.log('Navigating to page:', pageId);
  
  try {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
      page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
      targetPage.classList.add('active');
      console.log('Successfully showed page:', pageId);
    } else {
      console.error('Page not found:', pageId + '-page');
      return;
    }
    
    // Update navigation
    updateNavigation();
    
    // Handle navbar title positioning
    const navTitle = document.getElementById('nav-title');
    if (navTitle) {
      if (pageId === 'landing') {
        navTitle.classList.add('shifted');
      } else {
        navTitle.classList.remove('shifted');
      }
    }
    
    // Page-specific initialization
    switch(pageId) {
      case 'dashboard':
        if (appData.currentUser) {
          setTimeout(() => updateDashboard(), 100);
        }
        break;
      case 'mood-tracking':
        setTimeout(() => loadMoodHistory(), 100);
        break;
      case 'analytics':
        if (appData.currentUser) {
          setTimeout(() => updateAnalytics(), 100);
        }
        break;
      case 'community':
        setTimeout(() => loadCommunityContent(), 100);
        break;
      case 'chat':
        setTimeout(() => loadChatList(), 100);
        break;
      case 'leaderboard':
        setTimeout(() => updateLeaderboard(), 100);
        break;
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
  } catch (error) {
    console.error('Error in showPage:', error);
  }
}

// Form event listeners
function setupFormListeners() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
  
  const createPostForm = document.getElementById('create-post-form');
  if (createPostForm) {
    createPostForm.addEventListener('submit', handleCreatePost);
  }
}

// Mood tracking listeners
function setupMoodListeners() {
  // Dashboard mood options
  document.querySelectorAll('#dashboard-page .mood-option').forEach(option => {
    option.addEventListener('click', function() {
      const mood = this.getAttribute('data-mood');
      const label = this.getAttribute('data-label');
      selectMood(mood, label, this);
    });
  });
  
  // Mood intensity slider
  const moodIntensity = document.getElementById('mood-intensity');
  if (moodIntensity) {
    moodIntensity.addEventListener('input', function() {
      const intensityValue = document.getElementById('intensity-value');
      if (intensityValue) {
        intensityValue.textContent = this.value;
      }
    });
  }
  
  // Log mood button
  const logMoodBtn = document.getElementById('log-mood-btn');
  if (logMoodBtn) {
    logMoodBtn.addEventListener('click', logMood);
  }
}

// Mood tracking page listeners
function setupMoodTrackingListeners() {
  // Detailed mood options
  document.querySelectorAll('.mood-option-large').forEach(option => {
    option.addEventListener('click', function() {
      const mood = this.getAttribute('data-mood');
      const label = this.getAttribute('data-label');
      selectDetailedMood(mood, label, this);
    });
  });
  
  // Trigger tags
  document.querySelectorAll('.trigger-tag').forEach(tag => {
    tag.addEventListener('click', function() {
      const trigger = this.getAttribute('data-trigger');
      toggleTrigger(this, trigger);
    });
  });
  
  // Journal character counter
  const journalTextarea = document.getElementById('journal-text');
  if (journalTextarea) {
    journalTextarea.addEventListener('input', updateCharCount);
  }
  
  // Form buttons
  const clearBtn = document.getElementById('clear-mood-entry');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearMoodEntry);
  }
  
  const saveBtn = document.getElementById('save-mood-entry');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveMoodEntry);
  }
}

// Community listeners
function setupCommunityListeners() {
  // Community tabs
  document.querySelectorAll('.community-tabs .tab-btn').forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      switchCommunityTab(tabName, this);
    });
  });
  
  // Preference tags for matching
  document.querySelectorAll('.preference-tag').forEach(tag => {
    tag.addEventListener('click', function() {
      const preference = this.getAttribute('data-preference');
      togglePreference(this, preference);
    });
  });
  
  // Find matches button
  const findMatchesBtn = document.getElementById('find-matches-btn');
  if (findMatchesBtn) {
    findMatchesBtn.addEventListener('click', findMatches);
  }
}

// Resources listeners
function setupResourcesListeners() {
  document.querySelectorAll('.breathing-exercise-btn').forEach(btn => {
    btn.addEventListener('click', () => showModal('breathing-modal'));
  });
  
  document.querySelectorAll('.meditation-btn').forEach(btn => {
    btn.addEventListener('click', () => showModal('meditation-modal'));
  });
  
  document.querySelectorAll('.crisis-support-btn').forEach(btn => {
    btn.addEventListener('click', () => showModal('crisis-modal'));
  });
}

// Modal listeners
function setupModalListeners() {
  // Close modal buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    });
  });
  
  // Close modal on backdrop click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.add('hidden');
      }
    });
  });
  
  // Breathing exercise button
  const breathingStartBtn = document.getElementById('breathing-start-btn');
  if (breathingStartBtn) {
    breathingStartBtn.addEventListener('click', startBreathingExercise);
  }
  
  // Meditation options
  document.querySelectorAll('.meditation-option').forEach(btn => {
    btn.addEventListener('click', function() {
      const type = this.getAttribute('data-type');
      startMeditationType(type);
    });
  });
}

// Leaderboard listeners
function setupLeaderboardListeners() {
  document.querySelectorAll('.leaderboard-tabs .tab-btn').forEach(tab => {
    tab.addEventListener('click', function() {
      const period = this.getAttribute('data-period');
      switchLeaderboardTab(period, this);
    });
  });
}

// Authentication functions
function handleRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm').value;
  
  if (!name || !email || !password) {
    alert('Please fill in all fields!');
    return;
  }
  
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }
  
  // Create new user
  const newUser = {
    id: Date.now(),
    name: name,
    email: email,
    password: password,
    avatar: generateAvatar(name),
    createdAt: new Date(),
    streak: 0,
    totalPoints: 100,
    achievements: []
  };
  
  appData.users.push(newUser);
  appData.currentUser = newUser;
  appData.moods = generateSampleMoodData();
  
  alert('Registration successful! Welcome to SoulSync!');
  showPage('dashboard');
}

function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  if (!email || !password) {
    alert('Please fill in all fields!');
    return;
  }
  
  // For demo purposes, create a user
  const demoUser = {
    id: Date.now(),
    name: "Demo User",
    email: email,
    password: password,
    avatar: "DU",
    createdAt: new Date(),
    streak: 5,
    totalPoints: 250,
    achievements: []
  };
  
  appData.users.push(demoUser);
  appData.currentUser = demoUser;
  appData.moods = generateSampleMoodData();
  
  alert('Welcome back to SoulSync!');
  showPage('dashboard');
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    appData.currentUser = null;
    appData.moods = [];
    showPage('landing');
  }
}

// Navigation management
function updateNavigation() {
  const loginLink = document.getElementById('login-link');
  const logoutLink = document.getElementById('logout-link');
  const dashboardLink = document.getElementById('dashboard-link');
  const communityLink = document.getElementById('community-link');
  const resourcesLink = document.getElementById('resources-link');
  
  if (appData.currentUser) {
    if (loginLink) loginLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'block';
    if (dashboardLink) dashboardLink.style.display = 'block';
    if (communityLink) communityLink.style.display = 'block';
    if (resourcesLink) resourcesLink.style.display = 'block';
  } else {
    if (loginLink) loginLink.style.display = 'block';
    if (logoutLink) logoutLink.style.display = 'none';
    if (dashboardLink) dashboardLink.style.display = 'none';
    if (communityLink) communityLink.style.display = 'none';
    if (resourcesLink) resourcesLink.style.display = 'none';
  }
}

// Mood tracking functions
function selectMood(emoji, label, element) {
  selectedMood = {emoji, label};
  
  // Update UI
  document.querySelectorAll('#dashboard-page .mood-option').forEach(option => {
    option.classList.remove('selected');
  });
  element.classList.add('selected');
  
  // Show intensity slider
  const intensityContainer = document.getElementById('intensity-container');
  const logMoodBtn = document.getElementById('log-mood-btn');
  
  if (intensityContainer && logMoodBtn) {
    intensityContainer.style.display = 'block';
    logMoodBtn.style.display = 'block';
  }
}

function selectDetailedMood(emoji, label, element) {
  selectedMood = {emoji, label};
  
  // Update UI
  document.querySelectorAll('.mood-option-large').forEach(option => {
    option.classList.remove('selected');
  });
  element.classList.add('selected');
}

function toggleTrigger(element, trigger) {
  element.classList.toggle('selected');
  
  if (selectedTriggers.includes(trigger)) {
    selectedTriggers = selectedTriggers.filter(t => t !== trigger);
  } else {
    selectedTriggers.push(trigger);
  }
}

function logMood() {
  if (!selectedMood || !appData.currentUser) {
    alert('Please select a mood first!');
    return;
  }
  
  const intensity = document.getElementById('mood-intensity').value;
  
  const moodEntry = {
    id: Date.now(),
    userId: appData.currentUser.id,
    emoji: selectedMood.emoji,
    label: selectedMood.label,
    intensity: parseInt(intensity),
    triggers: [...selectedTriggers],
    journal: "",
    timestamp: new Date()
  };
  
  appData.moods.push(moodEntry);
  updateStreak();
  awardAchievement("First Step");
  
  alert('Mood logged successfully!');
  
  // Reset form
  resetMoodForm();
}

function saveMoodEntry() {
  if (!selectedMood || !appData.currentUser) {
    alert('Please select a mood first!');
    return;
  }
  
  const intensity = document.getElementById('detailed-intensity').value;
  const journalText = document.getElementById('journal-text').value;
  
  const moodEntry = {
    id: Date.now(),
    userId: appData.currentUser.id,
    emoji: selectedMood.emoji,
    label: selectedMood.label,
    intensity: parseInt(intensity),
    triggers: [...selectedTriggers],
    journal: journalText,
    timestamp: new Date()
  };
  
  appData.moods.push(moodEntry);
  updateStreak();
  awardAchievement("First Step");
  
  alert('Mood entry saved successfully!');
  clearMoodEntry();
  loadMoodHistory();
}

function clearMoodEntry() {
  selectedMood = null;
  selectedTriggers = [];
  
  // Reset UI
  document.querySelectorAll('.mood-option-large').forEach(option => {
    option.classList.remove('selected');
  });
  document.querySelectorAll('.trigger-tag').forEach(tag => {
    tag.classList.remove('selected');
  });
  
  const intensitySlider = document.getElementById('detailed-intensity');
  if (intensitySlider) intensitySlider.value = 3;
  
  const journalText = document.getElementById('journal-text');
  if (journalText) journalText.value = '';
  
  updateCharCount();
}

function resetMoodForm() {
  selectedMood = null;
  selectedTriggers = [];
  
  document.querySelectorAll('#dashboard-page .mood-option').forEach(option => {
    option.classList.remove('selected');
  });
  
  const intensityContainer = document.getElementById('intensity-container');
  const logMoodBtn = document.getElementById('log-mood-btn');
  
  if (intensityContainer && logMoodBtn) {
    intensityContainer.style.display = 'none';
    logMoodBtn.style.display = 'none';
  }
}

function updateCharCount() {
  const textArea = document.getElementById('journal-text');
  const counter = document.getElementById('char-count');
  
  if (textArea && counter) {
    counter.textContent = textArea.value.length;
    
    if (textArea.value.length > 500) {
      counter.style.color = 'var(--color-error)';
    } else {
      counter.style.color = 'var(--color-text-secondary)';
    }
  }
}

// Dashboard functions
function updateDashboard() {
  const userNameSpan = document.getElementById('user-name');
  if (userNameSpan && appData.currentUser) {
    userNameSpan.textContent = appData.currentUser.name;
  }
  
  // Update streak
  const streakCount = document.getElementById('streak-count');
  if (streakCount) {
    streakCount.textContent = appData.currentUser?.streak || 0;
  }
  
  // Update charts and activity
  updateWeeklyMoodChart();
  updateRecentActivity();
}

function updateWeeklyMoodChart() {
  const ctx = document.getElementById('week-mood-chart');
  if (!ctx || !appData.currentUser || !appData.moods) return;
  
  try {
    // Clear previous chart
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }
    
    const last7Days = appData.moods.slice(-7);
    const labels = last7Days.map(mood => mood.timestamp.toLocaleDateString('en', {weekday: 'short'}));
    const data = last7Days.map(mood => mood.intensity);
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Mood Level',
          data: data,
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 5,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  } catch (error) {
    console.error('Error updating weekly mood chart:', error);
  }
}

// Community functions
function switchCommunityTab(tabName, element) {
  // Update tab buttons
  document.querySelectorAll('.community-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');
  
  // Show/hide tab content
  document.querySelectorAll('.community-tab').forEach(tab => tab.classList.remove('active'));
  const targetTab = document.getElementById(`community-${tabName === 'feed' ? 'feed' : tabName === 'groups' ? 'support-groups' : 'find-match'}`);
  if (targetTab) {
    targetTab.classList.add('active');
  }
  
  // Load content based on tab
  switch(tabName) {
    case 'feed':
      loadCommunityPosts();
      break;
    case 'groups':
      loadSupportGroups();
      break;
  }
}

function loadCommunityContent() {
  loadCommunityPosts();
  loadSupportGroups();
}

function loadCommunityPosts() {
  const postsContainer = document.getElementById('posts-container');
  if (!postsContainer) return;
  
  postsContainer.innerHTML = appData.posts.map(post => `
    <div class="post-card">
      <div class="post-header">
        <div class="post-author">
          <div class="author-avatar">${post.anonymous_id.charAt(0)}</div>
          <div class="author-name">${post.anonymous_id}</div>
        </div>
        <div class="post-meta">
          <span class="emotion-tag">${post.emotion}</span>
          <span class="post-time">${formatTimeAgo(post.timestamp)}</span>
        </div>
      </div>
      <div class="post-content">${post.content}</div>
      <div class="post-actions">
        <button class="post-action ${post.liked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
          <i class="fas fa-heart"></i>
          <span>${post.likes}</span>
        </button>
        <button class="post-action" onclick="supportPost(${post.id})">
          <i class="fas fa-handshake"></i>
          Support
        </button>
      </div>
    </div>
  `).join('');
}

function handleCreatePost(e) {
  e.preventDefault();
  
  if (!appData.currentUser) {
    alert('Please log in to create posts!');
    return;
  }
  
  const content = document.getElementById('post-content').value;
  const emotion = document.getElementById('emotion-tag').value;
  
  if (!content.trim()) {
    alert('Please write something to share!');
    return;
  }
  
  const newPost = {
    id: Date.now(),
    content: content,
    emotion: emotion,
    likes: 0,
    liked: false,
    anonymous_id: `Anonymous${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date(),
    comments: []
  };
  
  appData.posts.unshift(newPost);
  
  // Award points
  if (appData.currentUser) {
    appData.currentUser.totalPoints = (appData.currentUser.totalPoints || 0) + 10;
  }
  
  // Clear form
  document.getElementById('post-content').value = '';
  document.getElementById('emotion-tag').value = 'general';
  
  // Reload posts
  loadCommunityPosts();
  
  alert('Post shared successfully! You earned 10 points.');
}

// Matching system
function togglePreference(element, preference) {
  element.classList.toggle('selected');
  
  if (selectedPreferences.includes(preference)) {
    selectedPreferences = selectedPreferences.filter(p => p !== preference);
  } else {
    selectedPreferences.push(preference);
  }
}

function findMatches() {
  if (selectedPreferences.length === 0) {
    alert('Please select at least one area where you need support!');
    return;
  }
  
  const matches = [
    {
      id: 1,
      name: "SupportiveSoul",
      commonTags: selectedPreferences.slice(0, 2),
      score: "95% match"
    },
    {
      id: 2,
      name: "CalmMind", 
      commonTags: selectedPreferences.slice(0, 1),
      score: "87% match"
    }
  ];
  
  const matchesContainer = document.getElementById('matches-container');
  const matchesList = document.getElementById('matches-list');
  
  if (matchesContainer && matchesList) {
    matchesList.innerHTML = matches.map(match => `
      <div class="match-card-item">
        <div class="match-info">
          <h4>${match.name}</h4>
          <div class="match-tags">
            ${match.commonTags.map(tag => `<span class="match-tag">${tag}</span>`).join('')}
          </div>
          <div class="match-score">${match.score}</div>
        </div>
        <button class="btn btn--primary" onclick="startChatWithMatch(${match.id}, '${match.name}')">Start Chat</button>
      </div>
    `).join('');
    
    matchesContainer.style.display = 'block';
  }
}

// Leaderboard functions
function switchLeaderboardTab(period, element) {
  document.querySelectorAll('.leaderboard-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');
  updateLeaderboard();
}

function updateLeaderboard() {
  const leaderboardList = document.getElementById('leaderboard-list');
  const achievementsGrid = document.getElementById('achievements-grid');
  
  if (leaderboardList) {
    leaderboardList.innerHTML = appData.leaderboard.map((user, index) => {
      let rankClass = '';
      if (index === 0) rankClass = 'gold';
      else if (index === 1) rankClass = 'silver'; 
      else if (index === 2) rankClass = 'bronze';
      
      return `
        <div class="leaderboard-item">
          <div class="leaderboard-rank ${rankClass}">${index + 1}</div>
          <div class="leaderboard-user">
            <div class="leaderboard-name">${user.name}</div>
            <div class="leaderboard-activity">${user.activity}</div>
          </div>
          <div class="leaderboard-points">${user.points}</div>
        </div>
      `;
    }).join('');
  }
  
  if (achievementsGrid) {
    achievementsGrid.innerHTML = appData.achievements.map(achievement => `
      <div class="achievement-badge ${achievement.earned ? 'earned' : ''}">
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-name">${achievement.name}</div>
        <div class="achievement-desc">${achievement.description}</div>
      </div>
    `).join('');
  }
}

// Modal functions
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function startBreathingExercise() {
  const circle = document.getElementById('breathing-circle');
  const text = document.getElementById('breathing-text');
  const btn = document.getElementById('breathing-start-btn');
  
  if (!circle || !text || !btn) return;
  
  btn.style.display = 'none';
  
  let phase = 'inhale';
  let count = 0;
  
  const breathingInterval = setInterval(() => {
    if (phase === 'inhale') {
      text.textContent = 'Breathe in...';
      circle.classList.add('inhale');
      circle.classList.remove('exhale');
      phase = 'hold1';
    } else if (phase === 'hold1') {
      text.textContent = 'Hold...';
      phase = 'exhale';
    } else if (phase === 'exhale') {
      text.textContent = 'Breathe out...';
      circle.classList.add('exhale');
      circle.classList.remove('inhale');
      phase = 'hold2';
    } else {
      text.textContent = 'Hold...';
      phase = 'inhale';
      count++;
    }
    
    if (count >= 5) {
      clearInterval(breathingInterval);
      text.textContent = 'Great job! You completed the breathing exercise.';
      circle.classList.remove('inhale', 'exhale');
      btn.textContent = 'Start Again';
      btn.style.display = 'block';
    }
  }, 4000);
}

function startMeditationType(type) {
  alert(`Starting ${type} meditation... This feature will guide you through a peaceful ${type} meditation session.`);
}

// Utility functions
function generateAvatar(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function generateSampleMoodData() {
  if (!appData.currentUser) return [];
  
  const moods = [];
  const moodOptions = [
    {emoji: "😊", label: "Happy", value: 5},
    {emoji: "😐", label: "Neutral", value: 3},
    {emoji: "😔", label: "Sad", value: 2},
    {emoji: "😢", label: "Very Sad", value: 1},
    {emoji: "😡", label: "Angry", value: 2},
    {emoji: "😴", label: "Tired", value: 3}
  ];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const mood = moodOptions[Math.floor(Math.random() * moodOptions.length)];
    moods.push({
      id: Date.now() + i,
      userId: appData.currentUser.id,
      emoji: mood.emoji,
      label: mood.label,
      intensity: mood.value,
      triggers: [['work', 'sleep', 'health', 'relationships'][Math.floor(Math.random() * 4)]],
      journal: i === 0 ? "Today was a good day overall!" : "",
      timestamp: date
    });
  }
  
  return moods;
}

function initializeSampleData() {
  appData.posts = [
    {
      id: 1,
      content: "Feeling overwhelmed with work lately. Anyone else dealing with burnout?",
      emotion: "stress",
      likes: 15,
      liked: false,
      anonymous_id: "AnonymousUser123",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      comments: []
    },
    {
      id: 2,
      content: "Had a great meditation session today. 10 minutes of mindfulness can really change your whole day!",
      emotion: "calm",
      likes: 23,
      liked: false,
      anonymous_id: "MindfulSoul88",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      comments: []
    }
  ];
}

function loadMoodHistory() {
  const historyContainer = document.getElementById('mood-history');
  if (!historyContainer || !appData.currentUser) return;
  
  const userMoods = appData.moods
    .filter(mood => mood.userId === appData.currentUser.id)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);
  
  if (userMoods.length === 0) {
    historyContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">No mood entries yet. Start tracking your mood above!</p>';
    return;
  }
  
  historyContainer.innerHTML = userMoods.map(mood => `
    <div class="mood-entry">
      <div class="mood-entry-header">
        <div class="mood-entry-emoji">${mood.emoji}</div>
        <div class="mood-entry-date">${formatDate(mood.timestamp)}</div>
      </div>
      ${mood.journal ? `<div class="mood-entry-content">${mood.journal}</div>` : ''}
      <div class="mood-entry-triggers">
        ${mood.triggers.map(trigger => `<span class="mood-entry-trigger">${trigger}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function loadSupportGroups() {
  const groupsGrid = document.getElementById('groups-grid');
  if (!groupsGrid) return;
  
  groupsGrid.innerHTML = appData.supportGroups.map(group => `
    <div class="group-card" onclick="joinGroup('${group.name}')">
      <div class="group-header">
        <div class="group-name">${group.name}</div>
        <div class="group-members">${group.members} members</div>
      </div>
      <div class="group-description">${group.description}</div>
      <button class="btn btn--outline">Join Group</button>
    </div>
  `).join('');
}

function loadChatList() {
  const chatList = document.getElementById('chat-list');
  if (!chatList) return;
  
  chatList.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--color-text-secondary);">No conversations yet. Start by finding matches in the Community section!</p>';
}

function updateAnalytics() {
  updateMoodTrendChart();
  updateMetrics();
}

function updateMoodTrendChart() {
  const ctx = document.getElementById('mood-trend-chart');
  if (!ctx || !appData.currentUser) return;
  
  try {
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }
    
    const userMoods = appData.moods.filter(mood => mood.userId === appData.currentUser.id);
    const labels = userMoods.slice(-14).map(mood => formatDate(mood.timestamp));
    const data = userMoods.slice(-14).map(mood => mood.intensity);
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Mood Trend',
          data: data,
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 5
          }
        }
      }
    });
  } catch (error) {
    console.error('Error updating mood trend chart:', error);
  }
}

function updateMetrics() {
  if (!appData.currentUser) return;
  
  const userMoods = appData.moods.filter(mood => mood.userId === appData.currentUser.id);
  
  const totalEntries = document.getElementById('total-entries');
  if (totalEntries) {
    totalEntries.textContent = userMoods.length;
  }
  
  const currentStreak = document.getElementById('current-streak');
  if (currentStreak) {
    currentStreak.textContent = appData.currentUser.streak || 0;
  }
  
  const avgMood = document.getElementById('avg-mood');
  if (avgMood && userMoods.length > 0) {
    const average = userMoods.reduce((sum, mood) => sum + mood.intensity, 0) / userMoods.length;
    avgMood.textContent = average.toFixed(1);
  }
  
  const totalPoints = document.getElementById('total-points');
  if (totalPoints) {
    totalPoints.textContent = appData.currentUser.totalPoints || 0;
  }
}

function updateRecentActivity() {
  const activityList = document.getElementById('recent-activity');
  if (!activityList) return;
  
  const recentPosts = appData.posts.slice(0, 3);
  activityList.innerHTML = recentPosts.map(post => `
    <div class="activity-item">
      <div class="activity-content">
        <p>"${post.content.substring(0, 50)}..."</p>
        <span class="activity-meta">${formatTimeAgo(post.timestamp)}</span>
      </div>
    </div>
  `).join('');
}

function updateStreak() {
  if (!appData.currentUser) return;
  
  const today = new Date().toDateString();
  const userMoods = appData.moods.filter(mood => mood.userId === appData.currentUser.id);
  const todayMoods = userMoods.filter(mood => mood.timestamp.toDateString() === today);
  
  if (todayMoods.length === 1) {
    appData.currentUser.streak = (appData.currentUser.streak || 0) + 1;
    
    if (appData.currentUser.streak >= 7) {
      awardAchievement("Week Warrior");
    }
    if (appData.currentUser.streak >= 30) {
      awardAchievement("Mindful Month");
    }
  }
}

function awardAchievement(achievementName) {
  const achievement = appData.achievements.find(a => a.name === achievementName);
  
  if (achievement && !achievement.earned) {
    achievement.earned = true;
    
    if (appData.currentUser) {
      appData.currentUser.totalPoints = (appData.currentUser.totalPoints || 0) + 50;
    }
    
    setTimeout(() => {
      alert(`🎉 Achievement Unlocked: ${achievement.name}\n${achievement.description}\n+50 points!`);
    }, 500);
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

function formatTimeAgo(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

// Legacy functions for compatibility (simplified)
function toggleLike(postId) {
  const post = appData.posts.find(p => p.id === postId);
  if (!post) return;
  
  if (post.liked) {
    post.likes--;
    post.liked = false;
  } else {
    post.likes++;
    post.liked = true;
    
    if (appData.currentUser) {
      appData.currentUser.totalPoints = (appData.currentUser.totalPoints || 0) + 5;
    }
  }
  
  loadCommunityPosts();
}

function supportPost(postId) {
  alert('Support sent! The poster will receive an encouraging notification. You earned 15 points.');
  
  if (appData.currentUser) {
    appData.currentUser.totalPoints = (appData.currentUser.totalPoints || 0) + 15;
    awardAchievement("Community Helper");
  }
}

function joinGroup(groupName) {
  alert(`You've joined the ${groupName} group! You'll receive notifications about new discussions.`);
}

function startChatWithMatch(matchId, matchName) {
  alert(`Chat started with ${matchName}! This feature will be available soon.`);
  showPage('chat');
}