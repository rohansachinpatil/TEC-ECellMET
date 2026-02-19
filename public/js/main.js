// ================================================================
// Main JavaScript — TEC Animation & Motion System
// Vanilla JS · No dependencies · Production-ready
// ================================================================

document.addEventListener('DOMContentLoaded', function () {

    // ────────────────────────────────────────────────────────
    // 1. REVEAL-ON-SCROLL  (IntersectionObserver)
    //
    //    - Watches all elements with class .reveal
    //    - Adds .active when element enters viewport → CSS
    //      transition kicks in (opacity + transform)
    //    - Un-observes after reveal to free resources
    //    - Also picks up legacy .fade-in / .slide-in-* classes
    // ────────────────────────────────────────────────────────

    const REVEAL_SELECTOR = '.reveal, .fade-in, .slide-in-left, .slide-in-right';

    const revealObserver = new IntersectionObserver(
        function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // one-shot — save CPU
                }
            });
        },
        {
            threshold: 0.12,            // trigger when 12% visible
            rootMargin: '0px 0px -60px 0px' // slight offset from bottom
        }
    );

    // Observe all reveal targets
    document.querySelectorAll(REVEAL_SELECTOR).forEach(function (el) {
        revealObserver.observe(el);
    });

    // ────────────────────────────────────────────────────────
    // 2. GLASS-CARD GLOW TRACKING
    //
    //    Updates CSS custom properties --glow-x / --glow-y
    //    so the radial-gradient in ::after follows the cursor.
    //    Creates a tactile spotlight hover effect.
    // ────────────────────────────────────────────────────────

    document.querySelectorAll('.glass-card').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
            var y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
            card.style.setProperty('--glow-x', x + '%');
            card.style.setProperty('--glow-y', y + '%');
        });

        card.addEventListener('mouseleave', function () {
            card.style.setProperty('--glow-x', '50%');
            card.style.setProperty('--glow-y', '50%');
        });
    });

    // Form validation helper
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');

        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.classList.add('form-error');
                } else {
                    this.classList.remove('form-error');
                }

                // Email validation
                if (this.type === 'email' && this.value.trim()) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(this.value)) {
                        this.classList.add('form-error');
                    } else {
                        this.classList.remove('form-error');
                    }
                }
            });

            input.addEventListener('input', function () {
                this.classList.remove('form-error');
            });
        });
    });

    // Countdown timer for deadlines (if any)
    function updateCountdowns() {
        const countdownElements = document.querySelectorAll('[data-deadline]');

        countdownElements.forEach(element => {
            const deadline = new Date(element.getAttribute('data-deadline'));
            const now = new Date();
            const diff = deadline - now;

            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

                if (days > 0) {
                    element.textContent = `${days} day${days > 1 ? 's' : ''} left`;
                } else if (hours > 0) {
                    element.textContent = `${hours} hour${hours > 1 ? 's' : ''} left`;
                } else {
                    element.textContent = `${minutes} minute${minutes > 1 ? 's' : ''} left`;
                }
            } else {
                element.textContent = 'Expired';
                element.classList.add('badge-error');
            }
        });
    }

    // Update countdowns every minute
    updateCountdowns();
    setInterval(updateCountdowns, 60000);

    // Table search functionality (if search input exists)
    const searchInput = document.getElementById('searchTeam');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            const tableRows = document.querySelectorAll('.table tbody tr');

            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // Phase filter functionality
    const phaseFilter = document.getElementById('phaseFilter');
    if (phaseFilter) {
        phaseFilter.addEventListener('change', function () {
            const selectedPhase = this.value.toLowerCase();
            const tableRows = document.querySelectorAll('.table tbody tr');

            tableRows.forEach(row => {
                if (selectedPhase === 'all') {
                    row.style.display = '';
                } else {
                    const phaseCell = row.cells[1]; // Assuming phase is in second column
                    if (phaseCell && phaseCell.textContent.toLowerCase().includes(selectedPhase)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    }

    // Auto-hide messages after 5 seconds
    const messages = document.querySelectorAll('.alert, .message');
    messages.forEach(message => {
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 300);
        }, 5000);
    });

    // Print button functionality (if exists)
    const printButtons = document.querySelectorAll('[data-print]');
    printButtons.forEach(button => {
        button.addEventListener('click', function () {
            window.print();
        });
    });

    // Copy to clipboard functionality
    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('Copied to clipboard!', 'success');
            });
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showNotification('Copied to clipboard!', 'success');
        }
    }

    // Simple notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: var(--f1-red);
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ── Glass Nav: scroll-aware background ──
    // (Strip toggle removed — strip no longer exists)

    // Add to window for global access
    window.showNotification = showNotification;
    window.copyToClipboard = copyToClipboard;
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
