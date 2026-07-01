document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Custom Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    const links = document.querySelectorAll('a, button, .project-card');

    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });

        links.forEach(link => {
            link.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            link.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // --- 2. Scroll Progress Bar & Sticky Header ---
    const progressBar = document.getElementById('progressBar');
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        // Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';

        // Sticky Header Blur
        if (winScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 3. Scroll Reveal Animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Only animate once
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 4. FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-question');

    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answer = this.nextElementSibling;
            
            // Close all others (optional)
            faqItems.forEach(faq => {
                faq.setAttribute('aria-expanded', 'false');
                faq.nextElementSibling.style.maxHeight = null;
            });

            if (!isExpanded) {
                this.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // --- 5. Project Modal (Lightbox) Logic ---
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('projectModal');
    const closeModal = document.querySelector('.close-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const body = document.body;

    // DOM Elements inside modal
    const mVideoContainer = document.querySelector('.modal-video');
    const mCategory = document.getElementById('modalCategory');
    const mTitle = document.getElementById('modalTitle');
    const mDuration = document.getElementById('modalDuration');
    const mSoftware = document.getElementById('modalSoftware');
    const mDescText = document.getElementById('modalDescText');
    const mChallengesText = document.getElementById('modalChallengesText');

    const openModal = (card) => {
        // Retrieve data attributes
        const videoSrc = card.dataset.video;
        
        // Populate Data
        mCategory.textContent = card.dataset.category;
        mTitle.textContent = card.dataset.title;
        mDuration.textContent = card.dataset.duration;
        mSoftware.textContent = card.dataset.software;
        mDescText.textContent = card.dataset.desc;
        mChallengesText.textContent = card.dataset.challenges;

        // Inject Video
        mVideoContainer.innerHTML = `
            <video autoplay controls controlsList="nodownload">
                <source src="${videoSrc}" type="video/mp4">
            </video>
        `;

        modal.classList.add('active');
        body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeLightbox = () => {
        modal.classList.remove('active');
        body.style.overflow = '';
        // Remove video element to stop playback
        setTimeout(() => mVideoContainer.innerHTML = '', 300);
    };

    projectCards.forEach(card => {
        card.addEventListener('click', () => openModal(card));
    });

    closeModal.addEventListener('click', closeLightbox);
    modalOverlay.addEventListener('click', closeLightbox);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeLightbox();
        }
    });

    // --- 6. Back to Top ---
    document.getElementById('backToTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
