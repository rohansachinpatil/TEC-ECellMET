// Navigation functionality
document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navbarMenu = document.getElementById('navbarMenu');

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            navbarMenu.classList.toggle('active');

            // Animate hamburger
            const spans = menuToggle.querySelectorAll('span');
            if (navbarMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.navbar')) {
            if (navbarMenu && navbarMenu.classList.contains('active')) {
                navbarMenu.classList.remove('active');
                if (menuToggle) {
                    const spans = menuToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Close mobile menu if open
                    if (navbarMenu && navbarMenu.classList.contains('active')) {
                        navbarMenu.classList.remove('active');
                    }
                }
            }
        });
    });

    // Check login status and update navbar
    const updateNavbar = async () => {
        let isLoggedIn = API.isLoggedIn();

        if (!isLoggedIn) {
            // Try server session
            const session = await API.checkSession();
            if (session.success) {
                isLoggedIn = true;
            }
        }

        const loginLink = document.querySelector('a[href="/login"]');
        const registerLink = document.querySelector('a[href="/register"]');
        const navbarMenu = document.getElementById('navbarMenu');

        if (isLoggedIn) {
            if (loginLink) loginLink.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';

            // Add Dashboard link if not present
            if (!document.querySelector('a[href="/dashboard"]')) {
                const dashboardLink = document.createElement('a');
                dashboardLink.href = '/dashboard';
                dashboardLink.className = 'navbar-link';
                dashboardLink.textContent = 'Dashboard';
                navbarMenu.appendChild(dashboardLink);
            }

            // Add Logout link
            if (!document.querySelector('#logoutBtn')) {
                const logoutLink = document.createElement('a');
                logoutLink.href = '#';
                logoutLink.className = 'navbar-link';
                logoutLink.id = 'logoutBtn';
                logoutLink.textContent = 'Logout';
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    API.logout();
                    window.location.href = '/login';
                });
                navbarMenu.appendChild(logoutLink);
            }
        }
    };

    updateNavbar();

    // Highlight active page in navbar
    const currentPath = window.location.pathname;
    document.querySelectorAll('.navbar-link').forEach(link => {
        const linkPath = new URL(link.href).pathname;
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });

    // Highlight active page in sidebar
    document.querySelectorAll('.sidebar-link').forEach(link => {
        const linkPath = new URL(link.href).pathname;
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });

    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.background = 'rgba(5, 5, 5, 0.98)';
            navbar.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(5, 5, 5, 0.95)';
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
});
