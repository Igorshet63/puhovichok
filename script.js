// Глобальный наблюдатель для анимаций
let scrollObserver;

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    
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
        const isDarkMode = targetBody.classList.toggle('dark-mode');
        
        if (isDarkMode) {
            localStorage.setItem('theme', 'dark');
            updateIcon(true);
        } else {
            localStorage.setItem('theme', 'light');
            updateIcon(false);
        }
    });
}


// === ЛОГИКА АНИМАЦИИ ПРИ ПРОКРУТКЕ ===
function initScrollAnimations() {
    if (scrollObserver) {
        scrollObserver.disconnect();
    }
    
    const elements = document.querySelectorAll('.animate-on-scroll');
    if (elements.length === 0) return;

    scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const delay = parseFloat(target.getAttribute('data-delay')) || 0;
                
                setTimeout(() => {
                    target.classList.add('visible');
                    target.classList.add('animate__animated', 'animate__fadeInUp'); 
                    observer.unobserve(target);
                }, delay * 1000);
            }
        });
    }, {
        threshold: 0.1 
    });

    elements.forEach(el => {
        if (!el.classList.contains('animate__animated')) {
             el.classList.add('animate__animated');
        }
        scrollObserver.observe(el);
    });
}

// === ЛОГИКА SWIPER SLIDER (только для index.html) ===
function initSwiper() {
    const swiperContainer = document.querySelector('.swiper-container');
    if (!swiperContainer || typeof Swiper === 'undefined') return;

    new Swiper(swiperContainer, {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        autoplay: {
            delay: 5000,
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
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        }
    });
}

// ===================================
// === ЛОГИКА КАТАЛОГА (catalog.html) ===
// ===================================

// ГЕНЕРАЦИЯ КАРТОЧЕК ТОВАРОВ (Без изменений)
function renderProducts() {
    const outerwearGrid = document.getElementById('outerwear-grid');
    const regularWearGrid = document.getElementById('regular-wear-grid');
    
    if (!outerwearGrid || !regularWearGrid || typeof products === 'undefined') return;

    outerwearGrid.innerHTML = '';
    regularWearGrid.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card animate-on-scroll';
        card.setAttribute('data-id', product.id);

        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <div class="card-info">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <div class="card-footer">
                    <span style="font-size: 18px; font-weight: 700; color: var(--color-accent);">${product.price} ₽</span>
                    <button class="price-btn" onclick="window.openModal(${product.id})">Подробнее</button>
                </div>
            </div>
        `;
        
        if (product.group === 'outerwear') {
            outerwearGrid.appendChild(card);
        } else if (product.group === 'regular-wear') {
            regularWearGrid.appendChild(card);
        }
    });
}

// ЛОГИКА МОДАЛЬНОГО ОКНА (Обновлена)
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
            sizeItem.className = 'size-item'; // Используем новый класс для статического отображения
            sizeItem.textContent = size;
            // Логика выбора размера и кликов удалена
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