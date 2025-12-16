document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileMenu(); 
    
    if (document.body.id === 'index-body') {
        initSwiper();
    }
    
    if (document.body.id === 'catalog-body') {
        if (typeof products !== 'undefined') {
            renderProducts();
        }
        initCatalogModal();
    }

    initScrollAnimations();
});

// === ЛОГИКА МОБИЛЬНОГО МЕНЮ (ИСПРАВЛЕНО) ===
function initMobileMenu() {
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (!menuToggleBtn || !mainNav) return;

    // Иконка гамбургера/закрытия
    const menuIcon = menuToggleBtn.querySelector('i');

    menuToggleBtn.addEventListener('click', () => {
        // Используем classList.toggle('active') для переключения состояния и запуска анимации
        const isMenuOpen = mainNav.classList.toggle('active');
        
        // Переключаем иконку (fa-bars <-> fa-times)
        menuIcon.classList.remove(isMenuOpen ? 'fa-bars' : 'fa-times');
        menuIcon.classList.add(isMenuOpen ? 'fa-times' : 'fa-bars');
        menuToggleBtn.setAttribute('aria-expanded', isMenuOpen);
    });
    
    // Закрытие меню при клике на ссылку
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Если меню открыто, закрываем его
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
                menuToggleBtn.setAttribute('aria-expanded', false);
            }
        });
    });
}
// ------------------------------------------

// === ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ТЕМЫ ===
function initThemeToggle() {
    const targetBody = document.getElementById('index-body') || document.getElementById('catalog-body') || document.body;
    const toggleButton = document.getElementById('themeToggle');
    const icon = toggleButton ? toggleButton.querySelector('i') : null;

    if (!targetBody || !toggleButton || !icon) return; 

    const currentTheme = localStorage.getItem('theme');

    const updateIcon = (isDark) => {
        icon.classList.remove('fa-sun', 'fa-moon');
        icon.classList.add(isDark ? 'fa-moon' : 'fa-sun');
    };

    if (currentTheme === 'dark') {
        targetBody.classList.add('dark-mode');
        updateIcon(true);
    } else {
        targetBody.classList.remove('dark-mode');
        updateIcon(false);
    }

    toggleButton.addEventListener('click', () => {
        const isDark = targetBody.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateIcon(isDark);
    });
}


// === ЛОГИКА АНИМАЦИИ ПРИ ПРОКРУТКЕ ===
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    if (!('IntersectionObserver' in window)) return;

    scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1 
    });

    elements.forEach(el => scrollObserver.observe(el));
}

// === ЛОГИКА SWIPER SLIDER (только для index.html) ===
function initSwiper() {
    // eslint-disable-next-line no-unused-vars
    const swiper = new Swiper('.swiper-container', {
        loop: true,
        spaceBetween: 0,
        centeredSlides: true,
        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        // Адаптивные брейкпоинты
        breakpoints: {
            640: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 1,
            },
            1024: {
                slidesPerView: 1,
            },
        }
    });
}

// ===================================
// === ЛОГИКА КАТАЛОГА (catalog.html) ===
// ===================================

// ГЕНЕРАЦИЯ КАРТОЧЕК ТОВАРОВ
function createProductCard(product) {
    return `
        <div class="product-card animate-on-scroll" data-product-id="${product.id}">
            <img src="${product.img}" alt="${product.name}">
            <div class="card-info">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <div class="card-footer">
                    <strong>${product.price} ₽</strong>
                    <button class="price-btn" onclick="openModal(${product.id})">Подробнее</button>
                </div>
            </div>
        </div>
    `;
}

function renderProducts() {
    const outerwearGrid = document.getElementById('outerwear-grid');
    const regularWearGrid = document.getElementById('regular-wear-grid');

    if (!outerwearGrid || !regularWearGrid) return;
    
    // Очистка перед рендерингом
    outerwearGrid.innerHTML = '';
    regularWearGrid.innerHTML = '';

    const outerwearProducts = products.filter(p => p.group === 'outerwear');
    const regularWearProducts = products.filter(p => p.group === 'regular-wear');

    outerwearProducts.forEach(product => {
        outerwearGrid.innerHTML += createProductCard(product);
    });

    regularWearProducts.forEach(product => {
        regularWearGrid.innerHTML += createProductCard(product);
    });
}

// ЛОГИКА МОДАЛЬНОГО ОКНА
function initCatalogModal() {
    const modal = document.getElementById('productModal');
    const closeModalBtn = document.querySelector('.close-btn');

    if (!modal || !closeModalBtn || typeof products === 'undefined') return;

    // Открытие модального окна и заполнение данными
    window.openModal = function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        document.getElementById('modalProductName').textContent = product.name;
        document.getElementById('modalProductChars').textContent = product.characteristics;

        const sizesContainer = document.getElementById('modalProductSizes');
        sizesContainer.innerHTML = '';
        
        // Рендерим размеры как некликабельные span'ы
        product.sizes.forEach(size => {
            const sizeItem = document.createElement('span'); 
            sizeItem.className = 'size-item'; // Используем класс для статического отображения
            sizeItem.textContent = size;
            sizesContainer.appendChild(sizeItem);
        });

        modal.style.display = 'block';
    }

    // Закрытие модального окна
    closeModalBtn.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}
