// Vanilla JS

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // Tooltip Logic
    // ==========================================
    setTimeout(() => {
        const tClock = document.getElementById('tooltip-clock');
        const tNavbar = document.getElementById('tooltip-navbar');
        const tUpload = document.getElementById('tooltip-upload');
        const dismissBtn = document.getElementById('dismiss-all-tooltips');

        let anyVisible = false;
        if (tClock) { tClock.classList.add('is-visible'); anyVisible = true; }
        if (tNavbar) { tNavbar.classList.add('is-visible'); anyVisible = true; }
        if (tUpload) { tUpload.classList.add('is-visible'); anyVisible = true; }
        if (anyVisible && dismissBtn) {
            dismissBtn.classList.remove('hidden');
            // Small delay to allow display:block to apply before fading in
            setTimeout(() => dismissBtn.classList.remove('opacity-0'), 50);
        }

        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                document.querySelectorAll('.tour-tooltip').forEach(el => el.style.display = 'none');
                dismissBtn.classList.add('opacity-0');
                setTimeout(() => dismissBtn.classList.add('hidden'), 300);
            });
        }
    }, 1000);

    // ==========================================
    // Hero Background Upload Logic
    // ==========================================
    const heroSection = document.getElementById('hero-section');
    const bgUploadInput = document.getElementById('hero-bg-upload');
    const uploadBtnLabel = document.getElementById('upload-bg-btn');
    const bgActions = document.getElementById('hero-bg-actions');
    const applyBgBtn = document.getElementById('apply-bg-btn');
    const cancelBgBtn = document.getElementById('cancel-bg-btn');

    // Store original background to revert if cancelled
    const originalBackground = heroSection.style.backgroundImage || '';
    let uploadedImageUrl = '';

    bgUploadInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                uploadedImageUrl = event.target.result;
                // Temporarily apply background
                heroSection.style.backgroundImage = `url(${uploadedImageUrl})`;
                heroSection.classList.remove('animated-gradient-bg'); // remove gradient to see image clearly

                // Show Apply/Cancel buttons, hide Upload button
                uploadBtnLabel.classList.add('hidden');
                bgActions.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    applyBgBtn.addEventListener('click', () => {
        // Logically applied! The background stays as is.
        // Hide actions, bring back upload button (optional, or just leave it)
        bgActions.classList.add('hidden');
        uploadBtnLabel.classList.remove('hidden');
    });

    cancelBgBtn.addEventListener('click', () => {
        // Revert background to original
        heroSection.style.backgroundImage = originalBackground;
        heroSection.classList.add('animated-gradient-bg'); // bring back gradient

        // Hide actions, bring back upload button
        bgActions.classList.add('hidden');
        uploadBtnLabel.classList.remove('hidden');
        bgUploadInput.value = ''; // Reset input
    });

    // ==========================================
    // Live Clock Logic
    // ==========================================
    const clockTime = document.getElementById('clock-time');
    const clockDate = document.getElementById('clock-date');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    function updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        const d = days[now.getDay()];
        const dd = String(now.getDate()).padStart(2, '0');
        const mo = months[now.getMonth()];
        clockTime.textContent = `${h}:${m}:${s}`;
        clockDate.textContent = `${d}, ${dd} ${mo}`;
    }
    updateClock();
    setInterval(updateClock, 1000);

    // Draggable Clock
    const clock = document.getElementById('hero-clock');
    let cDragging = false, cSX, cSY, cSL, cST;

    clock.addEventListener('mousedown', (e) => {
        if (e.target.closest('.tour-tooltip')) return;
        cDragging = true;
        const rect = clock.getBoundingClientRect();
        clock.style.right = 'auto';
        clock.style.transform = 'none';
        clock.style.left = rect.left + 'px';
        clock.style.top = rect.top + 'px';
        cSX = e.clientX; cSY = e.clientY;
        cSL = parseFloat(clock.style.left);
        cST = parseFloat(clock.style.top);
        e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
        if (!cDragging) return;
        let nl = cSL + (e.clientX - cSX);
        let nt = cST + (e.clientY - cSY);
        nl = Math.max(0, Math.min(nl, window.innerWidth - clock.offsetWidth));
        nt = Math.max(0, Math.min(nt, window.innerHeight - clock.offsetHeight));
        clock.style.left = nl + 'px';
        clock.style.top = nt + 'px';
    });
    document.addEventListener('mouseup', () => { cDragging = false; });

    // Touch support for clock
    clock.addEventListener('touchstart', (e) => {
        if (e.target.closest('.tour-tooltip')) return;
        const rect = clock.getBoundingClientRect();
        clock.style.right = 'auto'; clock.style.transform = 'none';
        clock.style.left = rect.left + 'px'; clock.style.top = rect.top + 'px';
        const t = e.touches[0];
        cSX = t.clientX; cSY = t.clientY;
        cSL = parseFloat(clock.style.left); cST = parseFloat(clock.style.top);
        cDragging = true;
    }, { passive: true });
    document.addEventListener('touchmove', (e) => {
        if (!cDragging) return;
        const t = e.touches[0];
        let nl = cSL + (t.clientX - cSX);
        let nt = cST + (t.clientY - cSY);
        nl = Math.max(0, Math.min(nl, window.innerWidth - clock.offsetWidth));
        nt = Math.max(0, Math.min(nt, window.innerHeight - clock.offsetHeight));
        clock.style.left = nl + 'px'; clock.style.top = nt + 'px';
    }, { passive: true });
    document.addEventListener('touchend', () => { cDragging = false; });

    // ==========================================
    // Draggable Navbar Logic
    // ==========================================
    const navbar = document.getElementById('draggable-navbar');
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    function initPos() {
        const rect = navbar.getBoundingClientRect();
        navbar.style.left = rect.left + 'px';
        navbar.style.top = rect.top + 'px';
        navbar.style.bottom = 'auto';
        navbar.style.transform = 'none';
    }

    navbar.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('.tour-tooltip')) return;
        isDragging = true;
        initPos();
        startX = e.clientX;
        startY = e.clientY;
        startLeft = parseFloat(navbar.style.left);
        startTop = parseFloat(navbar.style.top);
        navbar.style.cursor = 'grabbing';
        navbar.style.transition = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        let newLeft = startLeft + dx;
        let newTop = startTop + dy;
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - navbar.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - navbar.offsetHeight));
        navbar.style.left = newLeft + 'px';
        navbar.style.top = newTop + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        navbar.style.cursor = 'grab';
    });

    navbar.addEventListener('touchstart', (e) => {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('.tour-tooltip')) return;
        initPos();
        const t = e.touches[0];
        startX = t.clientX;
        startY = t.clientY;
        startLeft = parseFloat(navbar.style.left);
        startTop = parseFloat(navbar.style.top);
        isDragging = true;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const t = e.touches[0];
        let newLeft = startLeft + (t.clientX - startX);
        let newTop = startTop + (t.clientY - startY);
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - navbar.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - navbar.offsetHeight));
        navbar.style.left = newLeft + 'px';
        navbar.style.top = newTop + 'px';
    }, { passive: true });

    document.addEventListener('touchend', () => { isDragging = false; });

    // ==========================================
    // Contact Modal Logic
    // ==========================================
    const openBtn = document.getElementById('open-contact-btn');
    const closeBtn = document.getElementById('close-contact-btn');
    const modal = document.getElementById('contact-modal');

    function openModal() {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    // Close on backdrop click (outside content box)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // ==========================================
    // Project Details Popup Logic
    // ==========================================
    const projectPopup = document.getElementById('project-popup');
    const projectPopupContent = document.getElementById('project-popup-content');
    const closeProjectPopupBtn = document.getElementById('close-project-popup');

    const popupTitle = document.getElementById('popup-title');
    const popupDesc = document.getElementById('popup-desc');
    const popupTag = document.getElementById('popup-tag');
    const popupLive = document.getElementById('popup-link-live');
    const popupGithub = document.getElementById('popup-link-github');

    const projectData = {
        1: {
            title: "Portfolio Website",
            tag: "HTML / CSS / JS",
            desc: "A modern, animated personal portfolio featuring a glassmorphic hero section, draggable navigation bar, full-page animated modals, and CSS marquee banners. Built entirely with Vanilla JS, HTML, and custom CSS without relying on heavy frameworks.",
            live: "#",
            github: "https://github.com/"
        },
        2: {
            title: "E-Commerce Dashboard",
            tag: "React JS",
            desc: "A fully responsive admin dashboard designed for managing products, tracking orders, and viewing analytics. Features real-time data visualization through interactive charts, intuitive UI components, and state management using React Context API.",
            live: "#",
            github: "https://github.com/"
        },
        3: {
            title: "UI Component Library",
            tag: "Tailwind CSS",
            desc: "A reusable, open-source collection of highly accessible and responsive UI components. Includes advanced form elements, dynamic tables, interactive modals, and animated buttons, all meticulously styled with Tailwind CSS utility classes.",
            live: "#",
            github: "https://github.com/"
        }
    };

    window.openProjectPopup = function (id) {
        const data = projectData[id];
        if (!data) return;

        popupTitle.textContent = data.title;
        popupTag.textContent = data.tag;
        popupDesc.textContent = data.desc;
        popupLive.href = data.live;
        popupGithub.href = data.github;

        projectPopup.classList.remove('opacity-0', 'pointer-events-none');
        projectPopupContent.classList.remove('scale-95');
        projectPopupContent.classList.add('scale-100');

        // Re-initialize icons for the new content
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };

    function closeProjectPopup() {
        projectPopup.classList.add('opacity-0', 'pointer-events-none');
        projectPopupContent.classList.remove('scale-100');
        projectPopupContent.classList.add('scale-95');
    }

    closeProjectPopupBtn.addEventListener('click', closeProjectPopup);

    projectPopup.addEventListener('click', (e) => {
        if (e.target === projectPopup) closeProjectPopup();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProjectPopup();
            closeModal();
            closeAboutModal();
        }
    });

    // ==========================================
    // About Modal Logic
    // ==========================================
    const openAboutBtn = document.getElementById('open-about-btn');
    const closeAboutBtn = document.getElementById('close-about-btn');
    const aboutModal = document.getElementById('about-modal');

    function openAboutModal() {
        aboutModal.classList.add('is-open');
        aboutModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeAboutModal() {
        aboutModal.classList.remove('is-open');
        aboutModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    openAboutBtn.addEventListener('click', openAboutModal);
    closeAboutBtn.addEventListener('click', closeAboutModal);

    aboutModal.addEventListener('click', (e) => {
        if (e.target === aboutModal) closeAboutModal();
    });

    // ==========================================
    // Work Modal Logic
    // ==========================================
    const openWorkBtn = document.getElementById('open-work-btn');
    const closeWorkBtn = document.getElementById('close-work-btn');
    const workModal = document.getElementById('work-modal');

    function openWorkModal() {
        workModal.classList.add('is-open');
        workModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeWorkModal() {
        workModal.classList.remove('is-open');
        workModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    openWorkBtn.addEventListener('click', openWorkModal);
    closeWorkBtn.addEventListener('click', closeWorkModal);

    workModal.addEventListener('click', (e) => {
        if (e.target === workModal) closeWorkModal();
    });

    // Escape closes all modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { closeModal(); closeAboutModal(); closeWorkModal(); }
    });

    // Initialize Lucide Icons on page load
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});