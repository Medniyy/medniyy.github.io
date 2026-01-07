// ========================================
// ATH PRODUCTION - MAIN SCRIPT V2
// With Instagram Focus Mode & Bug Fixes
// ========================================

// VIDEO DATA
const videosData = [
    {
        id: 1,
        title: "Creative Agency",
        subtitle: "ATH Creative Agency",
        videoFile: "ATHCreativeAgency.mp4",
        category: "agency",
        orientation: "vertical",
        views: "2.4K",
        description: "Agency promo visuals. #BetterCallATH"
    },
    {
        id: 2,
        title: "Global Competition",
        subtitle: "ATH Creative Agency",
        videoFile: "ATHGlobalCompetition.mp4",
        category: "event",
        orientation: "horizontal",
        views: "3.1K",
        description: "Global event highlights. #BetterCallATH"
    },
    {
        id: 3,
        title: "Jupiter",
        subtitle: "ATH Creative Agency",
        videoFile: "ATHJupiter.mp4",
        category: "campaign",
        orientation: "horizontal",
        views: "1.8K",
        description: "Jupiter project visuals. #BetterCallATH"
    },
    {
        id: 4,
        title: "ATH Series",
        subtitle: "ATH Creative Agency",
        videoFile: "ATHSeries.mp4",
        category: "creative",
        orientation: "horizontal",
        views: "4.2K",
        description: "Exclusive series production. #BetterCallATH"
    },
    {
        id: 5,
        title: "Solana Summit",
        subtitle: "ATH Creative Agency",
        videoFile: "ATHSolanaSummit.mp4",
        category: "event",
        orientation: "horizontal",
        views: "5.7K",
        description: "Summit event coverage. #BetterCallATH"
    },
    {
        id: 6,
        title: "Solflare Sink",
        subtitle: "ATH Creative Agency",
        videoFile: "Solflaresink.mp4",
        category: "campaign",
        orientation: "vertical",
        views: "2.9K",
        description: "Creative production. #BetterCallATH"
    },
    {
        id: 7,
        title: "Solflare Viral",
        subtitle: "ATH Creative Agency",
        videoFile: "Solflareviral.mp4",
        category: "campaign",
        orientation: "vertical",
        views: "8.3K",
        description: "Viral campaign. #BetterCallATH"
    },
    {
        id: 8,
        title: "Better Call ATH",
        subtitle: "ATH Creative Agency",
        videoFile: "bettercallath.mp4",
        category: "creative",
        orientation: "vertical",
        views: "6.1K",
        description: "Narrative content. #BetterCallATH"
    },
    {
        id: 9,
        title: "Polaris",
        subtitle: "ATH Creative Agency",
        videoFile: "polaris.mp4",
        category: "creative",
        orientation: "horizontal",
        views: "3.5K",
        description: "Cinematic production. #BetterCallATH"
    },
    {
        id: 10,
        title: "Solflare Shield",
        subtitle: "ATH Creative Agency",
        videoFile: "solflareshield.mp4",
        category: "campaign",
        orientation: "horizontal",
        views: "4.7K",
        description: "Product visual shield. #BetterCallATH"
    }
];

// GLOBAL STATE
let currentPlayingVideo = null;
let currentCategory = 'all';
let focusModeActive = false;
let currentFocusVideoId = null;

// ========================================
// INITIALIZATION
// ========================================

// Stop all videos on page load (FIX FOR RELOAD BUG)
window.addEventListener('DOMContentLoaded', () => {
    // Force stop any playing videos
    document.querySelectorAll('video').forEach(video => {
        video.pause();
        video.currentTime = 0;
        video.muted = true;
    });
    
    // Render feed
    renderFeed();
    
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loadingOverlay').classList.add('hide');
    }, 800);
});

// ========================================
// FEED RENDERING
// ========================================

function renderFeed() {
    const wrapper = document.getElementById('articles-wrapper');
    wrapper.innerHTML = '';
    
    const filteredVideos = currentCategory === 'all' 
        ? videosData 
        : videosData.filter(v => v.category === currentCategory);
    
    filteredVideos.forEach(video => {
        const article = createVideoArticle(video);
        wrapper.appendChild(article);
    });
    
    // Setup observers
    setupIntersectionObserver();
}

function createVideoArticle(video) {
    const article = document.createElement('article');
    article.className = 'mb-12 border-b border-neutral-900 pb-8 video-article';
    article.dataset.category = video.category;
    article.dataset.videoId = video.id;
    
    article.innerHTML = `
        <div class="flex items-center justify-between px-4 py-3">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full overflow-hidden bg-neutral-800">
                    <img src="logo.png" onerror="this.src='https://via.placeholder.com/150'" class="w-full h-full object-cover">
                </div>
                <div>
                    <p class="text-sm font-semibold">${video.title}</p>
                    <p class="text-xs text-neutral-500">${video.subtitle}</p>
                </div>
            </div>
        </div>
        <div class="video-container ${video.orientation === 'vertical' ? 'vertical' : ''} is-paused" data-video-id="${video.id}">
            <video loop muted playsinline webkit-playsinline preload="none" disableRemotePlayback>
                <source src="${video.videoFile}" type="video/mp4">
            </video>
            <div class="muted-indicator">
                <i class="fas fa-volume-xmark"></i>
                <span class="text-xs">Tap to view</span>
            </div>
            <div class="play-icon-overlay"><i class="fas fa-play text-2xl"></i></div>
            <div class="mute-btn" onclick="toggleMute(event, this)"><i class="fas fa-volume-xmark"></i></div>
            <div class="video-progress">
                <div class="video-progress-fill"></div>
            </div>
        </div>
        <div class="px-4 py-3 flex justify-between items-center">
            <div class="flex gap-5 text-2xl text-neutral-300">
                <button class="hover:text-red-500 transition like-btn" onclick="handleLike(this)"><i class="far fa-heart"></i></button>
                <a href="https://x.com/intent/follow?screen_name=athcamera" target="_blank" class="hover:text-blue-500 transition"><i class="far fa-comment"></i></a>
                <button class="share-btn" onclick="shareVideo(${video.id})"><i class="fas fa-share-nodes"></i></button>
            </div>
            <div class="flex items-center gap-4">
                <div class="view-counter">
                    <i class="fas fa-eye"></i>
                    <span class="view-count">${video.views}</span>
                </div>
                <a href="https://calendly.com/athcamera" target="_blank" class="md:hidden bg-white text-black text-xs px-4 py-1.5 rounded-full font-bold">BOOK</a>
            </div>
        </div>
        <div class="px-4"><p class="text-sm"><span class="font-bold mr-1">ath.camera</span> ${video.description}</p></div>
    `;
    
    // Add click handler to open focus mode
    const videoContainer = article.querySelector('.video-container');
    videoContainer.addEventListener('click', (e) => {
        // Don't open focus mode if clicking mute button or progress bar
        if (e.target.closest('.mute-btn') || e.target.closest('.video-progress')) {
            return;
        }
        openFocusMode(video.id);
    });
    
    return article;
}

// ========================================
// INTERSECTION OBSERVER (IMPROVED)
// ========================================

function setupIntersectionObserver() {
    // Different thresholds for different orientations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: [0, 0.5, 0.75, 0.85]
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const container = entry.target;
            const video = container.querySelector('video');
            
            if (!video) return;
            
            const isVertical = container.classList.contains('vertical');
            const requiredThreshold = isVertical ? 0.75 : 0.85;
            
            // Additional check: video should occupy significant screen height
            const rect = container.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
            const percentOfViewport = visibleHeight / viewportHeight;
            
            if (entry.isIntersecting && 
                entry.intersectionRatio >= requiredThreshold && 
                percentOfViewport > 0.4) {
                
                // CRITICAL: Stop any other playing video first
                if (currentPlayingVideo && currentPlayingVideo !== video) {
                    pauseVideo(currentPlayingVideo);
                }
                
                // Play this video
                playVideo(video, container);
            } else {
                // Pause when not in view
                pauseVideo(video);
            }
        });
    }, observerOptions);

    // Observe all video containers
    document.querySelectorAll('.video-container').forEach(container => {
        observer.observe(container);
    });
}

function playVideo(video, container) {
    if (!video || focusModeActive) return;
    
    video.muted = true; // Always muted in feed
    
    const playPromise = video.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            container.classList.remove('is-paused');
            currentPlayingVideo = video;
        }).catch(error => {
            if (error.name !== 'AbortError') {
                console.log('Autoplay prevented:', error);
            }
        });
    }
}

function pauseVideo(video) {
    if (!video) return;
    
    video.pause();
    const container = video.closest('.video-container');
    if (container) {
        container.classList.add('is-paused');
    }
    
    if (currentPlayingVideo === video) {
        currentPlayingVideo = null;
    }
}

// ========================================
// VIDEO PROGRESS BAR
// ========================================

// Update progress bar for feed videos
document.addEventListener('timeupdate', (e) => {
    if (e.target.tagName === 'VIDEO' && !focusModeActive) {
        updateVideoProgress(e.target);
    }
}, true);

function updateVideoProgress(video) {
    if (!video.duration) return;
    
    const container = video.closest('.video-container');
    if (!container) return;
    
    const progressFill = container.querySelector('.video-progress-fill');
    if (progressFill) {
        const percent = (video.currentTime / video.duration) * 100;
        progressFill.style.width = `${percent}%`;
    }
}

// ========================================
// MUTE/UNMUTE IN FEED
// ========================================

function toggleMute(event, btn) {
    event.stopPropagation();
    
    const container = btn.closest('.video-container');
    const video = container.querySelector('video');
    const icon = btn.querySelector('i');
    const mutedIndicator = container.querySelector('.muted-indicator');
    
    video.muted = !video.muted;
    
    if (video.muted) {
        icon.classList.remove('fa-volume-high');
        icon.classList.add('fa-volume-xmark');
        if (mutedIndicator) mutedIndicator.style.display = 'flex';
    } else {
        icon.classList.remove('fa-volume-xmark');
        icon.classList.add('fa-volume-high');
        if (mutedIndicator) mutedIndicator.style.display = 'none';
    }
}

// ========================================
// INSTAGRAM FOCUS MODE
// ========================================

function openFocusMode(videoId) {
    const video = videosData.find(v => v.id === videoId);
    if (!video) return;
    
    focusModeActive = true;
    currentFocusVideoId = videoId;
    
    // Pause feed video
    if (currentPlayingVideo) {
        pauseVideo(currentPlayingVideo);
    }
    
    // Setup focus mode
    const overlay = document.getElementById('focusOverlay');
    const focusVideo = document.getElementById('focusVideo');
    const focusVideoContainer = document.getElementById('focusVideoContainer');
    
    // Update content
    document.getElementById('focusTitle').textContent = video.title;
    document.getElementById('focusSubtitle').textContent = video.subtitle;
    document.getElementById('focusDescription').textContent = video.description;
    document.getElementById('focusViews').textContent = video.views;
    
    // Set video source
    focusVideo.querySelector('source').src = video.videoFile;
    focusVideo.load();
    
    // Set orientation class
    if (video.orientation === 'vertical') {
        focusVideoContainer.classList.add('vertical');
    } else {
        focusVideoContainer.classList.remove('vertical');
    }
    
    // Show overlay with animation
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Play with sound after a brief delay
    setTimeout(() => {
        focusVideo.muted = false;
        focusVideo.play().catch(e => console.log('Focus play error:', e));
    }, 300);
    
    // Setup progress tracking
    setupFocusProgress();
    setupFocusSwipe();
}

function closeFocusMode() {
    const overlay = document.getElementById('focusOverlay');
    const focusVideo = document.getElementById('focusVideo');
    const container = document.getElementById('focusContainer');
    
    // Pause video
    focusVideo.pause();
    focusVideo.currentTime = 0;
    
    // Hide with animation
    container.style.transform = 'translateY(100%)';
    
    setTimeout(() => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        focusModeActive = false;
        currentFocusVideoId = null;
        container.style.transform = '';
    }, 300);
}

function setupFocusProgress() {
    const focusVideo = document.getElementById('focusVideo');
    const progressFill = document.getElementById('focusProgressFill');
    
    focusVideo.addEventListener('timeupdate', () => {
        if (focusVideo.duration) {
            const percent = (focusVideo.currentTime / focusVideo.duration) * 100;
            progressFill.style.width = `${percent}%`;
        }
    });
    
    // Click to seek
    const progressBar = document.getElementById('focusProgress');
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        focusVideo.currentTime = percent * focusVideo.duration;
    });
}

// ========================================
// SWIPE TO CLOSE FOCUS MODE
// ========================================

function setupFocusSwipe() {
    const container = document.getElementById('focusContainer');
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    
    container.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        isDragging = true;
    }, { passive: true });
    
    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;
        
        // Only allow swipe down
        if (deltaY > 0) {
            container.style.transform = `translateY(${deltaY}px)`;
            // Fade overlay based on swipe distance
            const overlay = document.getElementById('focusOverlay');
            const opacity = Math.max(0.3, 1 - (deltaY / 500));
            overlay.style.background = `rgba(0, 0, 0, ${opacity * 0.95})`;
        }
    }, { passive: true });
    
    container.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const deltaY = currentY - startY;
        
        // If swiped down more than 150px, close
        if (deltaY > 150) {
            closeFocusMode();
        } else {
            // Bounce back
            container.style.transform = '';
            const overlay = document.getElementById('focusOverlay');
            overlay.style.background = 'rgba(0, 0, 0, 0.95)';
        }
        
        startY = 0;
        currentY = 0;
    });
}

// Focus mode like button
document.getElementById('focusLikeBtn').addEventListener('click', function() {
    const icon = this.querySelector('i');
    icon.classList.remove('far');
    icon.classList.add('fas');
    this.classList.add('liked');
    
    setTimeout(() => {
        openModal();
    }, 800);
});

// Focus mode share button
document.getElementById('focusShareBtn').addEventListener('click', function() {
    if (currentFocusVideoId) {
        shareVideo(currentFocusVideoId);
    }
});

// ========================================
// CATEGORY FILTERING
// ========================================

document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active state
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update category and re-render
        currentCategory = btn.dataset.category;
        
        // Stop current video
        if (currentPlayingVideo) {
            pauseVideo(currentPlayingVideo);
        }
        
        // Re-render feed
        renderFeed();
    });
});

// ========================================
// SHARE FUNCTIONALITY
// ========================================

function shareVideo(videoId) {
    const video = videosData.find(v => v.id === videoId);
    if (!video) return;
    
    const url = `${window.location.origin}${window.location.pathname}#video-${videoId}`;
    
    if (navigator.share) {
        navigator.share({
            title: `ATH Production - ${video.title}`,
            text: `Check out this video from ATH Production!`,
            url: url
        }).catch(err => console.log('Share cancelled'));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            // Show toast or feedback
            alert('Link copied to clipboard!');
        });
    }
}

// ========================================
// LIKE BUTTON
// ========================================

function handleLike(btn) {
    const icon = btn.querySelector('i');
    icon.classList.remove('far');
    icon.classList.add('fas');
    btn.classList.add('liked');
    
    setTimeout(() => {
        openModal();
    }, 800);
}

// ========================================
// SCROLL TO TOP
// ========================================

const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ========================================
// MODAL (LIKE)
// ========================================

const modal = document.getElementById('contactModal');
const modalPanel = document.getElementById('modalPanel');

function openModal() {
    modal.classList.remove('hidden');
    modalPanel.style.transform = '';
    setTimeout(() => {
        modalPanel.classList.remove('translate-y-full');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalPanel.classList.add('translate-y-full');
    setTimeout(() => {
        modal.classList.add('hidden');
        modalPanel.style.transform = '';
    }, 300);
    document.body.style.overflow = '';
}

// Modal swipe down
let modalStartY = 0;
let modalCurrentY = 0;
let modalDragging = false;

modalPanel.addEventListener('touchstart', (e) => {
    modalStartY = e.touches[0].clientY;
    modalDragging = true;
}, { passive: true });

modalPanel.addEventListener('touchmove', (e) => {
    if (!modalDragging) return;
    modalCurrentY = e.touches[0].clientY;
    const deltaY = modalCurrentY - modalStartY;
    
    if (deltaY > 0) {
        modalPanel.style.transform = `translateY(${deltaY}px)`;
    }
}, { passive: true });

modalPanel.addEventListener('touchend', () => {
    if (!modalDragging) return;
    modalDragging = false;
    const deltaY = modalCurrentY - modalStartY;
    
    if (deltaY > 100) {
        closeModal();
    } else {
        modalPanel.style.transform = '';
    }
    
    modalStartY = 0;
    modalCurrentY = 0;
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (focusModeActive) {
            closeFocusMode();
        } else {
            closeModal();
        }
    }
});

// ========================================
// DEEP LINKING
// ========================================

window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash.startsWith('#video-')) {
        const videoId = parseInt(hash.replace('#video-', ''));
        setTimeout(() => {
            openFocusMode(videoId);
        }, 1000);
    }
});

// ========================================
// SAFARI FIX - Force stop playback on visibility change
// ========================================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause all videos when tab is hidden
        document.querySelectorAll('video').forEach(video => {
            video.pause();
        });
        
        if (currentPlayingVideo) {
            pauseVideo(currentPlayingVideo);
        }
    }
});

// Additional Safari fix - stop on page unload
window.addEventListener('beforeunload', () => {
    document.querySelectorAll('video').forEach(video => {
        video.pause();
        video.currentTime = 0;
    });
});
