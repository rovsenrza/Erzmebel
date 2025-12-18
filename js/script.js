// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const body = document.body;

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        mobileMenuToggle.classList.add('active');
        body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        body.style.overflow = '';
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', openMobileMenu);
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking outside
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                closeMobileMenu();
            }
        });
    }

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close menu when clicking on a link
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
});

// Hero Swiper Functionality
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.hero-slide');
    const paginationNumbers = document.querySelectorAll('.pagination-number');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const heroCircles = document.querySelector('.hero-circles');
    let currentSlide = 0;
    let autoplayInterval;
    let isTransitioning = false;

    // Initialize first slide
    if (slides.length > 0) {
        slides[0].classList.add('active');
        paginationNumbers[0].classList.add('active');
        if (heroCircles) {
            heroCircles.classList.add('active');
        }
    }

    // Function to show slide with animations
    function showSlide(index) {
        if (isTransitioning || index === currentSlide) return;
        
        isTransitioning = true;
        const previousSlide = currentSlide;
        currentSlide = index;

        // Mark current slide as exiting
        if (slides[previousSlide]) {
            slides[previousSlide].classList.remove('active');
            slides[previousSlide].classList.add('exiting');
        }

        // Remove active class from pagination
        paginationNumbers.forEach(num => num.classList.remove('active'));

        // Close circles and open new ones simultaneously
        if (heroCircles) {
            heroCircles.classList.remove('active');
            
            // Immediately open new circles (same time as closing)
            requestAnimationFrame(() => {
                heroCircles.classList.add('active');
            });
        }

        // Show new slide immediately
        setTimeout(() => {
            // Remove exiting class from previous slide and hide it
            slides.forEach(slide => {
                slide.classList.remove('active', 'exiting', 'entering');
            });

            // Add entering and active class to new slide
            if (slides[currentSlide]) {
                slides[currentSlide].classList.add('entering', 'active');
            }

            // Update pagination
            if (paginationNumbers[currentSlide]) {
                paginationNumbers[currentSlide].classList.add('active');
            }

            // Remove entering class after animation completes
            setTimeout(() => {
                if (slides[currentSlide]) {
                    slides[currentSlide].classList.remove('entering');
                }
                isTransitioning = false;
            }, 900);
        }, 10);
    }

    // Function to go to next slide
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    // Function to go to previous slide
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }

    // Pagination click handlers
    paginationNumbers.forEach((num, index) => {
        num.addEventListener('click', () => {
            showSlide(index);
            resetAutoplay();
        });
    });

    // Navigation button handlers
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });
    }

    // Autoplay functionality
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            nextSlide();
        }, 3000); // Change slide every 3 seconds
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    // Start autoplay
    startAutoplay();

    // Pause autoplay on hover
    const heroSwiper = document.querySelector('.hero-swiper');
    if (heroSwiper) {
        heroSwiper.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });

        heroSwiper.addEventListener('mouseleave', () => {
            startAutoplay();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoplay();
        }
    });

    // Touch/swipe support for mobile and mouse drag for desktop
    let touchStartX = 0;
    let touchEndX = 0;
    let mouseStartX = 0;
    let isDragging = false;

    if (heroSwiper) {
        // Touch events
        heroSwiper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        heroSwiper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        // Mouse drag events
        const heroMouseMoveHandler = (e) => {
            if (isDragging && heroSwiper) {
                const mouseEndX = e.clientX;
                const diff = mouseStartX - mouseEndX;
                
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        // Dragged left - next slide
                        nextSlide();
                        resetAutoplay();
                    } else {
                        // Dragged right - previous slide
                        prevSlide();
                        resetAutoplay();
                    }
                    isDragging = false;
                    heroSwiper.style.cursor = 'grab';
                    document.removeEventListener('mousemove', heroMouseMoveHandler);
                }
            }
        };

        const heroMouseUpHandler = () => {
            if (isDragging) {
                isDragging = false;
                if (heroSwiper) {
                    heroSwiper.style.cursor = 'grab';
                }
                document.removeEventListener('mousemove', heroMouseMoveHandler);
                document.removeEventListener('mouseup', heroMouseUpHandler);
            }
        };

        heroSwiper.addEventListener('mousedown', (e) => {
            isDragging = true;
            mouseStartX = e.clientX;
            heroSwiper.style.cursor = 'grabbing';
            e.preventDefault();
            document.addEventListener('mousemove', heroMouseMoveHandler);
            document.addEventListener('mouseup', heroMouseUpHandler);
        });

        // Set initial cursor
        heroSwiper.style.cursor = 'grab';
    }

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left - next slide
            nextSlide();
            resetAutoplay();
        }
        if (touchEndX > touchStartX + 50) {
            // Swipe right - previous slide
            prevSlide();
            resetAutoplay();
        }
    }
});

// Bestsellers Swiper - Initialize all bestsellers sections
document.addEventListener('DOMContentLoaded', function() {
    const bestsellersSections = document.querySelectorAll('.bestsellers-section');
    
    bestsellersSections.forEach((section, sectionIndex) => {
        const bestsellersSwiper = section.querySelector('.bestsellers-swiper');
        if (!bestsellersSwiper) return;
        
        const wrapper = bestsellersSwiper.querySelector('.swiper-wrapper');
        const slides = bestsellersSwiper.querySelectorAll('.swiper-slide');
        
        // Find nav buttons within this section
        const bestsellersControls = section.querySelector('.bestsellers-controls');
        const bestsellersNav = bestsellersControls ? bestsellersControls.querySelector('.bestsellers-nav') : null;
        const prevBtn = bestsellersNav ? bestsellersNav.querySelector('.prev-bestsellers') : null;
        const nextBtn = bestsellersNav ? bestsellersNav.querySelector('.next-bestsellers') : null;
        
        const progressbar = bestsellersSwiper.querySelector('.swiper-progressbar');
        let currentIndex = 0;
        const slidesPerView = window.innerWidth > 1200 ? 4 : window.innerWidth > 660 ? 2 : 1;
        const maxIndex = Math.max(0, slides.length - slidesPerView);

        // Create progressbar fill if it doesn't exist
        let progressFill = progressbar?.querySelector('.swiper-progressbar-fill');
        if (progressbar && !progressFill) {
            progressFill = document.createElement('div');
            progressFill.className = 'swiper-progressbar-fill';
            progressbar.appendChild(progressFill);
        }

        function updateBestsellerPosition() {
            if (wrapper && slides.length > 0) {
                const slideWidth = slides[0]?.offsetWidth || 0;
                const gap = 20;
                const translateX = -(currentIndex * (slideWidth + gap));
                wrapper.style.transform = `translateX(${translateX}px)`;
                wrapper.style.transition = 'transform 0.3s ease';
            }
            updateBestsellerProgress();
        }

        function updateBestsellerProgress() {
            if (progressFill && slides.length > 0) {
                // For loop mode, show continuous progress
                if (slides.length > slidesPerView) {
                    const progress = ((currentIndex + slidesPerView) / slides.length) * 100;
                    progressFill.style.width = Math.min(progress, 100) + '%';
                } else {
                    progressFill.style.width = '100%';
                }
            }
        }

        function nextBestseller() {
            if (slides.length <= slidesPerView) return;
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                // Loop to start
                currentIndex = 0;
            }
            updateBestsellerPosition();
        }

        function prevBestseller() {
            if (slides.length <= slidesPerView) return;
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                // Loop to end
                currentIndex = maxIndex;
            }
            updateBestsellerPosition();
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                prevBestseller();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                nextBestseller();
            });
        }

        // Touch/swipe support and mouse drag
        let bestsellersTouchStartX = 0;
        let bestsellersTouchEndX = 0;
        let bestsellersMouseStartX = 0;
        let bestsellersIsDragging = false;

        bestsellersSwiper.addEventListener('touchstart', (e) => {
            bestsellersTouchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        bestsellersSwiper.addEventListener('touchend', (e) => {
            bestsellersTouchEndX = e.changedTouches[0].screenX;
            if (bestsellersTouchEndX < bestsellersTouchStartX - 50) {
                nextBestseller();
            }
            if (bestsellersTouchEndX > bestsellersTouchStartX + 50) {
                prevBestseller();
            }
        }, { passive: true });

        // Mouse drag support
        const bestsellersMouseMoveHandler = (e) => {
            if (bestsellersIsDragging && bestsellersSwiper) {
                const mouseEndX = e.clientX;
                const diff = bestsellersMouseStartX - mouseEndX;
                const slideWidth = slides[0]?.offsetWidth || 0;
                
                if (Math.abs(diff) > slideWidth * 0.3) {
                    if (diff > 0) {
                        // Dragged left - next
                        nextBestseller();
                    } else {
                        // Dragged right - previous
                        prevBestseller();
                    }
                    bestsellersIsDragging = false;
                    bestsellersSwiper.style.cursor = 'grab';
                    document.removeEventListener('mousemove', bestsellersMouseMoveHandler);
                }
            }
        };

        const bestsellersMouseUpHandler = () => {
            if (bestsellersIsDragging) {
                bestsellersIsDragging = false;
                if (bestsellersSwiper) {
                    bestsellersSwiper.style.cursor = 'grab';
                }
                document.removeEventListener('mousemove', bestsellersMouseMoveHandler);
                document.removeEventListener('mouseup', bestsellersMouseUpHandler);
            }
        };

        bestsellersSwiper.addEventListener('mousedown', (e) => {
            bestsellersIsDragging = true;
            bestsellersMouseStartX = e.clientX;
            bestsellersSwiper.style.cursor = 'grabbing';
            e.preventDefault();
            document.addEventListener('mousemove', bestsellersMouseMoveHandler);
            document.addEventListener('mouseup', bestsellersMouseUpHandler);
        });

        // Set initial cursor
        bestsellersSwiper.style.cursor = 'grab';

        // Update on resize
        let resizeTimer;
        const resizeHandler = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                currentIndex = 0;
                updateBestsellerPosition();
            }, 250);
        };
        window.addEventListener('resize', resizeHandler);

        // Initialize
        updateBestsellerPosition();
    });

    // News Swiper - Initialize all news sections
    const newsSections = document.querySelectorAll('.news-section');
    
    newsSections.forEach((section) => {
        const newsSwiper = section.querySelector('.news-swiper');
        if (!newsSwiper) return;
        
        const wrapper = newsSwiper.querySelector('.swiper-wrapper');
        const slides = newsSwiper.querySelectorAll('.swiper-slide');
        
        // Find nav buttons within this section
        const newsControls = section.querySelector('.news-controls');
        const newsNav = newsControls ? newsControls.querySelector('.news-nav') : null;
        const prevBtn = newsNav ? newsNav.querySelector('.prev-news') : null;
        const nextBtn = newsNav ? newsNav.querySelector('.next-news') : null;
        
        const progressbar = newsSwiper.querySelector('.swiper-progressbar');
        let currentIndex = 0;
        const slidesPerView = window.innerWidth > 1200 ? 4 : window.innerWidth > 660 ? 2 : 1;
        const maxIndex = Math.max(0, slides.length - slidesPerView);

        // Create progressbar fill if it doesn't exist
        let progressFill = progressbar?.querySelector('.swiper-progressbar-fill');
        if (progressbar && !progressFill) {
            progressFill = document.createElement('div');
            progressFill.className = 'swiper-progressbar-fill';
            progressbar.appendChild(progressFill);
        }

        function updateNewsPosition() {
            if (wrapper && slides.length > 0) {
                const slideWidth = slides[0]?.offsetWidth || 0;
                const gap = 20;
                const translateX = -(currentIndex * (slideWidth + gap));
                wrapper.style.transform = `translateX(${translateX}px)`;
                wrapper.style.transition = 'transform 0.3s ease';
            }
            updateNewsProgress();
        }

        function updateNewsProgress() {
            if (progressFill && slides.length > 0) {
                // For loop mode, show continuous progress
                if (slides.length > slidesPerView) {
                    const progress = ((currentIndex + slidesPerView) / slides.length) * 100;
                    progressFill.style.width = Math.min(progress, 100) + '%';
                } else {
                    progressFill.style.width = '100%';
                }
            }
        }

        function nextNews() {
            if (slides.length <= slidesPerView) return;
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                // Loop to start
                currentIndex = 0;
            }
            updateNewsPosition();
        }

        function prevNews() {
            if (slides.length <= slidesPerView) return;
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                // Loop to end
                currentIndex = maxIndex;
            }
            updateNewsPosition();
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                prevNews();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                nextNews();
            });
        }

        // Touch/swipe support and mouse drag
        let newsTouchStartX = 0;
        let newsTouchEndX = 0;
        let newsMouseStartX = 0;
        let newsIsDragging = false;

        newsSwiper.addEventListener('touchstart', (e) => {
            newsTouchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        newsSwiper.addEventListener('touchend', (e) => {
            newsTouchEndX = e.changedTouches[0].screenX;
            if (newsTouchEndX < newsTouchStartX - 50) {
                nextNews();
            }
            if (newsTouchEndX > newsTouchStartX + 50) {
                prevNews();
            }
        }, { passive: true });

        // Mouse drag support
        const newsMouseMoveHandler = (e) => {
            if (newsIsDragging && newsSwiper) {
                const mouseEndX = e.clientX;
                const diff = newsMouseStartX - mouseEndX;
                const slideWidth = slides[0]?.offsetWidth || 0;
                
                if (Math.abs(diff) > slideWidth * 0.3) {
                    if (diff > 0) {
                        // Dragged left - next
                        nextNews();
                    } else {
                        // Dragged right - previous
                        prevNews();
                    }
                    newsIsDragging = false;
                    newsSwiper.style.cursor = 'grab';
                    document.removeEventListener('mousemove', newsMouseMoveHandler);
                }
            }
        };

        const newsMouseUpHandler = () => {
            if (newsIsDragging) {
                newsIsDragging = false;
                if (newsSwiper) {
                    newsSwiper.style.cursor = 'grab';
                }
                document.removeEventListener('mousemove', newsMouseMoveHandler);
                document.removeEventListener('mouseup', newsMouseUpHandler);
            }
        };

        newsSwiper.addEventListener('mousedown', (e) => {
            newsIsDragging = true;
            newsMouseStartX = e.clientX;
            newsSwiper.style.cursor = 'grabbing';
            e.preventDefault();
            document.addEventListener('mousemove', newsMouseMoveHandler);
            document.addEventListener('mouseup', newsMouseUpHandler);
        });

        // Set initial cursor
        newsSwiper.style.cursor = 'grab';

        // Update on resize
        let resizeTimer;
        const resizeHandler = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                currentIndex = 0;
                updateNewsPosition();
            }, 250);
        };
        window.addEventListener('resize', resizeHandler);

        // Initialize
        updateNewsPosition();
    });

    // Collections Swiper
    const collectionsSwiper = document.querySelector('.collections-swiper');
    if (collectionsSwiper) {
        const wrapper = collectionsSwiper.querySelector('.swiper-wrapper');
        const slides = collectionsSwiper.querySelectorAll('.swiper-slide');
        const nextBtn = collectionsSwiper.querySelector('.collections-next');
        const prevBtn = collectionsSwiper.querySelector('.collections-prev');
        const progressbar = document.querySelector('.collections-progressbar');
        let progressFill = progressbar?.querySelector('.collections-progressbar-fill');
        let currentIndex = 0;
        const maxIndex = Math.max(0, slides.length - 1);
        let isDragging = false;
        let startX = 0;
        let currentX = 0;
        let initialTranslate = 0;
        let animationId = null;

        if (progressbar && !progressFill) {
            progressFill = document.createElement('div');
            progressFill.className = 'collections-progressbar-fill';
            progressbar.appendChild(progressFill);
        }

        function updateCollectionsProgress() {
            if (progressFill && slides.length > 0) {
                const progress = ((currentIndex + 1) / slides.length) * 100;
                progressFill.style.width = Math.min(progress, 100) + '%';
            }
        }

        function getSlideWidth() {
            if (slides.length === 0) return 0;
            const slide = slides[0];
            const style = window.getComputedStyle(slide);
            const marginRight = parseFloat(style.marginRight) || 0;
            return slide.offsetWidth + marginRight;
        }

        function updateCollectionsPosition(immediate = false) {
            if (!wrapper || slides.length === 0) return;
            
            const slideWidth = getSlideWidth();
            const translateX = -(currentIndex * slideWidth);
            
            if (immediate) {
                wrapper.style.transition = 'none';
            } else {
                wrapper.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            }
            
            wrapper.style.transform = `translateX(${translateX}px)`;
            updateCollectionsProgress();
        }

        function nextCollection() {
            if (slides.length <= 1) return;
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop back to start
            }
            updateCollectionsPosition();
        }

        function prevCollection() {
            if (slides.length <= 1) return;
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = maxIndex; // Loop to end
            }
            updateCollectionsPosition();
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                nextCollection();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                prevCollection();
            });
        }

        // Touch/swipe support
        collectionsSwiper.addEventListener('touchstart', (e) => {
            if (slides.length <= 1) return;
            startX = e.touches[0].clientX;
            initialTranslate = -(currentIndex * getSlideWidth());
            isDragging = true;
            collectionsSwiper.classList.add('dragging');
            wrapper.style.transition = 'none';
        }, { passive: true });

        collectionsSwiper.addEventListener('touchmove', (e) => {
            if (!isDragging || slides.length <= 1) return;
            currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            const newTranslate = initialTranslate - diff;
            wrapper.style.transform = `translateX(${newTranslate}px)`;
        }, { passive: true });

        collectionsSwiper.addEventListener('touchend', (e) => {
            if (!isDragging || slides.length <= 1) return;
            isDragging = false;
            collectionsSwiper.classList.remove('dragging');
            
            const diff = startX - currentX;
            const slideWidth = getSlideWidth();
            const threshold = slideWidth * 0.25; // 25% of slide width
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // Swiped left - next
                    nextCollection();
                } else {
                    // Swiped right - previous
                    prevCollection();
                }
            } else {
                // Snap back to current position
                updateCollectionsPosition();
            }
        }, { passive: true });

        // Mouse drag support with smooth animation
        const handleMouseMove = (e) => {
            if (!isDragging || slides.length <= 1) return;
            currentX = e.clientX;
            const diff = startX - currentX;
            const newTranslate = initialTranslate - diff;
            wrapper.style.transform = `translateX(${newTranslate}px)`;
        };

        const handleMouseUp = () => {
            if (!isDragging || slides.length <= 1) return;
            isDragging = false;
            collectionsSwiper.style.cursor = 'grab';
            collectionsSwiper.classList.remove('dragging');
            
            const diff = startX - currentX;
            const slideWidth = getSlideWidth();
            const threshold = slideWidth * 0.25; // 25% of slide width
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // Dragged left - next
                    nextCollection();
                } else {
                    // Dragged right - previous
                    prevCollection();
                }
            } else {
                // Snap back to current position
                updateCollectionsPosition();
            }
            
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        collectionsSwiper.addEventListener('mousedown', (e) => {
            if (slides.length <= 1) return;
            isDragging = true;
            startX = e.clientX;
            initialTranslate = -(currentIndex * getSlideWidth());
            collectionsSwiper.style.cursor = 'grabbing';
            collectionsSwiper.classList.add('dragging');
            wrapper.style.transition = 'none';
            e.preventDefault();
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });

        // Set initial cursor
        collectionsSwiper.style.cursor = 'grab';

        // Filter buttons functionality
        const filterButtons = document.querySelectorAll('.collection-filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons in the same group
                const parent = this.closest('.collections-filters-top, .collections-filters-bottom');
                if (parent) {
                    parent.querySelectorAll('.collection-filter-btn').forEach(b => {
                        b.classList.remove('active');
                    });
                }
                // Add active class to clicked button
                this.classList.add('active');
            });
        });

        // Initialize
        updateCollectionsPosition();
    }
});

// Existing Swiper code (if needed for other sections)
window.addEventListener("DOMContentLoaded", () => {
    // Check if swiper-firstscreen exists before initializing
    if (document.querySelector(".swiper-firstscreen")) {
        const swiper = new Swiper(".swiper-firstscreen",{
            loop: true,
            autoplay: {
                delay: 7900,
                disableOnInteraction: false
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
                renderBullet: function(index, className) {
                    return `<span class="${className}" data-num="${String(index + 1).padStart(2, "0")}"></span>`
                }
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            },
            allowTouchMove: true,
            grabCursor: true,
            on: {
                init: function() {
                    this.emit("slideChange")
                }
            }
        });
        document.querySelectorAll(".swiper-pagination-bullet")[0].classList.remove("swiper-pagination-bullet-active");
        setTimeout( () => {
            document.querySelectorAll(".swiper-pagination-bullet")[0].classList.add("swiper-pagination-bullet-active")
        }, 0);
    }
});

document.querySelectorAll("use").forEach(item => {
    item.setAttribute("href", item.getAttribute("href"));
});
