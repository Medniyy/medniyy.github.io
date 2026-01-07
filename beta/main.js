// GLOBAL STATE
let globalMuted = true; // Start muted by default
let currentPlayingVideo = null; // Track currently playing video

// LOADING SCREEN
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loadingOverlay').classList.add('hide');
    }, 1000);
});

// INTERSECTION OBSERVER FOR AUTO PLAY (FIXED - Only one video plays at a time)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.7 // Play when 70% visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const container = entry.target.querySelector('.video-container');
        if (!container) return;
        const video = container.querySelector('video');
        const playIcon = container.querySelector('.play-icon-overlay');
        const muteBtnIcon = container.querySelector('.mute-btn i');

        if (entry.isIntersecting) {
            // CRITICAL FIX: Stop any currently playing video first
            if (currentPlayingVideo && currentPlayingVideo !== video) {
                currentPlayingVideo.pause();
                const oldContainer = currentPlayingVideo.closest('.video-container');
                oldContainer.classList.add('paused');
                const oldPlayIcon = oldContainer.querySelector('.play-icon-overlay');
                if (oldPlayIcon) oldPlayIcon.style.opacity = '1';
            }

            // Now play this video
            video.muted = globalMuted;
            updateMuteIcon(muteBtnIcon, globalMuted);
            
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    container.classList.remove('paused');
                    currentPlayingVideo = video;
                }).catch(error => {
                    if (error.name !== 'AbortError') {
                        console.log("Autoplay blocked, muting...");
                        video.muted = true;
                        globalMuted = true;
                        updateMuteIcon(muteBtnIcon, true);
                        video.play().catch(e => console.log("Secondary play failed", e));
                    }
                });
            }
        } else {
            // Pause when out of view
            video.pause();
            container.classList.add('paused');
            if (currentPlayingVideo === video) {
                currentPlayingVideo = null;
            }
        }
    });
}, observerOptions);

// Start observing all articles
document.querySelectorAll('article').forEach(article => observer.observe(article));

// SCRUBBING LOGIC
let isScrubbing = false;
let scrubVideo = null;
let scrubBar = null;
let wasPlaying = false;

function updateProgress(video) {
    if (isScrubbing && scrubVideo === video) return;
    if (!video.duration) return;
    
    const container = video.closest('.video-container');
    const barFill = container.querySelector('.video-progress-fill');
    const percent = (video.currentTime / video.duration) * 100;
    barFill.style.width = `${percent}%`;
}

function startScrub(event, progressBar) {
    event.stopPropagation();
    
    isScrubbing = true;
    scrubBar = progressBar;
    const container = progressBar.closest('.video-container');
    scrubVideo = container.querySelector('video');
    wasPlaying = !scrubVideo.paused;
    
    scrubVideo.pause();
    handleScrubMove(event);
    
    document.addEventListener('mousemove', handleScrubMove);
    document.addEventListener('touchmove', handleScrubMove, { passive: false });
    document.addEventListener('mouseup', stopScrub);
    document.addEventListener('touchend', stopScrub);
}

function handleScrubMove(event) {
    if (!isScrubbing) return;
    
    if (event.cancelable) event.preventDefault();

    let clientX;
    if (event.type.startsWith('touch')) {
        clientX = event.touches[0].clientX;
    } else {
        clientX = event.clientX;
    }

    const rect = scrubBar.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;
    
    const percentage = offsetX / rect.width;
    
    const barFill = scrubBar.querySelector('.video-progress-fill');
    barFill.style.width = `${percentage * 100}%`;
    
    if (scrubVideo.duration) {
        scrubVideo.currentTime = percentage * scrubVideo.duration;
    }
}

function stopScrub() {
    if (!isScrubbing) return;
    isScrubbing = false;
    
    document.removeEventListener('mousemove', handleScrubMove);
    document.removeEventListener('touchmove', handleScrubMove);
    document.removeEventListener('mouseup', stopScrub);
    document.removeEventListener('touchend', stopScrub);
    
    if (wasPlaying) {
        scrubVideo.play().catch(e => console.log("Play interrupted", e));
    }
    
    scrubVideo = null;
    scrubBar = null;
}

// MANUAL PLAY/PAUSE
function toggleManualPlay(container) {
    const video = container.querySelector('video');
    
    if (video.paused) {
        // Pause any other playing video
        if (currentPlayingVideo && currentPlayingVideo !== video) {
            currentPlayingVideo.pause();
            const oldContainer = currentPlayingVideo.closest('.video-container');
            oldContainer.classList.add('paused');
        }

        video.muted = globalMuted;
        
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                container.classList.remove('paused');
                currentPlayingVideo = video;
            }).catch(e => {
                console.log("Manual play interrupted", e);
            });
        }
    } else {
        video.pause();
        container.classList.add('paused');
        if (currentPlayingVideo === video) {
            currentPlayingVideo = null;
        }
    }
}

// MUTE/UNMUTE
function toggleMute(event, btn) {
    event.stopPropagation();
    const container = btn.closest('.video-container');
    const video = container.querySelector('video');
    const icon = btn.querySelector('i');

    const newMuteState = !video.muted;
    video.muted = newMuteState;
    globalMuted = newMuteState;

    updateMuteIcon(icon, newMuteState);
}

function updateMuteIcon(icon, isMuted) {
    if (isMuted) {
        icon.classList.remove('fa-volume-high');
        icon.classList.add('fa-volume-xmark');
    } else {
        icon.classList.remove('fa-volume-xmark');
        icon.classList.add('fa-volume-high');
    }
}

// MODAL SWIPE LOGIC
const modalPanel = document.getElementById('modalPanel');
let startY = 0;
let currentY = 0;
let isDragging = false;

modalPanel.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
    isDragging = true;
}, { passive: true });

modalPanel.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;

    if (deltaY > 0) {
        modalPanel.style.transform = `translateY(${deltaY}px)`;
    }
}, { passive: true });

modalPanel.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const deltaY = currentY - startY;

    if (deltaY > 100) {
        closeModal();
    } else {
        modalPanel.style.transform = '';
    }
    startY = 0;
    currentY = 0;
});

// LIKE BUTTON
function handleLike(btn) {
    const icon = btn.querySelector('i');
    icon.classList.remove('far'); 
    icon.classList.add('fas'); 
    btn.classList.add('liked');

    setTimeout(() => {
        openModal();
    }, 800);
}

// SHARE FUNCTIONALITY
function shareVideo(btn, title) {
    const article = btn.closest('article');
    const videoId = article.dataset.videoId;
    const url = `${window.location.origin}${window.location.pathname}#video-${videoId}`;
    
    if (navigator.share) {
        navigator.share({
            title: `ATH Production - ${title}`,
            text: `Check out this video from ATH Production!`,
            url: url
        }).catch(err => console.log('Share failed', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            // Visual feedback
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
            }, 2000);
        });
    }
}

// FULLSCREEN FUNCTIONALITY
function openFullscreen(btn) {
    const article = btn.closest('article');
    const video = article.querySelector('video');
    const fullscreenContainer = document.getElementById('fullscreenContainer');
    const fullscreenVideo = document.getElementById('fullscreenVideo');
    
    // Copy video source
    fullscreenVideo.src = video.querySelector('source').src;
    fullscreenVideo.currentTime = video.currentTime;
    fullscreenVideo.muted = video.muted;
    
    // Pause original video
    video.pause();
    
    // Show fullscreen
    fullscreenContainer.classList.add('active');
    fullscreenVideo.play();
    
    document.body.style.overflow = 'hidden';
}

function closeFullscreen() {
    const fullscreenContainer = document.getElementById('fullscreenContainer');
    const fullscreenVideo = document.getElementById('fullscreenVideo');
    
    fullscreenVideo.pause();
    fullscreenContainer.classList.remove('active');
    
    document.body.style.overflow = '';
}

// CATEGORY FILTERING
const categoryBtns = document.querySelectorAll('.category-btn');
const articles = document.querySelectorAll('article');

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active state
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.dataset.category;
        
        // Filter articles
        articles.forEach(article => {
            if (category === 'all' || article.dataset.category === category) {
                article.style.display = 'block';
                // Re-trigger animation
                article.style.animation = 'none';
                setTimeout(() => {
                    article.style.animation = '';
                }, 10);
            } else {
                article.style.display = 'none';
            }
        });
    });
});

// INFINITE SCROLL (disabled for now to prevent DOM bloat)
// Can be re-enabled if needed
/*
window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        addMoreContent();
    }
});

function addMoreContent() {
    const feedContainer = document.getElementById('articles-wrapper');
    const originalArticles = document.querySelectorAll('.video-article');
    
    for (let i = 0; i < 3; i++) {
        if (originalArticles[i]) {
            const clone = originalArticles[i].cloneNode(true);
            feedContainer.appendChild(clone);
            observer.observe(clone);
        }
    }
}
*/

// SCROLL TO TOP
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

// MODAL LOGIC
const modal = document.getElementById('contactModal');

function openModal() {
    modal.classList.remove('hidden');
    modalPanel.style.transform = ''; 
    setTimeout(() => { modalPanel.classList.remove('translate-y-full'); }, 10);
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

document.addEventListener('keydown', (e) => { 
    if (e.key === "Escape") {
        closeModal();
        closeFullscreen();
    }
});

// DEEP LINK TO SPECIFIC VIDEO
window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash.startsWith('#video-')) {
        const videoId = hash.replace('#video-', '');
        const article = document.querySelector(`[data-video-id="${videoId}"]`);
        if (article) {
            setTimeout(() => {
                article.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1500);
        }
    }
});
