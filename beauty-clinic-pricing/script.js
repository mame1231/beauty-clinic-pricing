document.addEventListener('DOMContentLoaded', function() {
    const categoryLinks = document.querySelectorAll('.category-link');
    const sections = document.querySelectorAll('.price-section');
    const navbar = document.querySelector('.category-nav');
    const navbarHeight = navbar.offsetHeight;

    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    function updateActiveLink() {
        const scrollPosition = window.scrollY + navbarHeight + 50;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                categoryLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    const tables = document.querySelectorAll('.price-table');
    tables.forEach(table => {
        if (window.innerWidth <= 768) {
            const wrapper = table.closest('.price-table-wrapper');
            let isScrollable = table.scrollWidth > wrapper.clientWidth;
            
            if (isScrollable && !wrapper.querySelector('.scroll-hint')) {
                const scrollHint = document.createElement('div');
                scrollHint.className = 'scroll-hint';
                scrollHint.textContent = '← スクロールできます →';
                scrollHint.style.cssText = `
                    text-align: center;
                    color: #6c757d;
                    font-size: 12px;
                    padding: 5px;
                    background: linear-gradient(to right, transparent, #f8f9fa, transparent);
                `;
                wrapper.appendChild(scrollHint);
            }
        }
    });

    const priceSections = document.querySelectorAll('.price-section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    priceSections.forEach(section => {
        observer.observe(section);
    });

    const rows = document.querySelectorAll('.price-table tbody tr');
    rows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            this.style.transition = 'all 0.3s ease';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });

    if ('IntersectionObserver' in window) {
        const lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const table = entry.target;
                    table.style.opacity = '0';
                    setTimeout(() => {
                        table.style.transition = 'opacity 0.5s ease';
                        table.style.opacity = '1';
                    }, 100);
                    lazyLoadObserver.unobserve(table);
                }
            });
        });

        document.querySelectorAll('.price-table').forEach(table => {
            lazyLoadObserver.observe(table);
        });
    }

    // ハンバーガーメニューの機能
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const categoryNav = document.getElementById('category-nav');

    hamburgerMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        categoryNav.classList.toggle('show');
    });

    // カテゴリーリンククリック時にメニューを閉じる
    categoryLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                hamburgerMenu.classList.remove('active');
                categoryNav.classList.remove('show');
            }
        });
    });

    // 画面外クリックでメニューを閉じる
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            !hamburgerMenu.contains(e.target) && 
            !categoryNav.contains(e.target) &&
            categoryNav.classList.contains('show')) {
            hamburgerMenu.classList.remove('active');
            categoryNav.classList.remove('show');
        }
    });
});