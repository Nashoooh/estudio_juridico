// JavaScript principal para PorSusDerechos

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling para los enlaces de navegación
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Cambiar estilo del header al hacer scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#ffffff';
            header.style.backdropFilter = 'none';
        }
    });

    // Animación de números en las tarjetas del dashboard (si están presentes)
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const aboutSection = document.querySelector('#nosotros');
    if (aboutSection) {
        observer.observe(aboutSection);
    }

    function animateNumbers() {
        const experienceNumber = document.querySelector('.text-gold');
        if (experienceNumber && experienceNumber.textContent.includes('10 años')) {
            let count = 0;
            const target = 10;
            const increment = target / 50;

            const timer = setInterval(() => {
                count += increment;
                if (count >= target) {
                    count = target;
                    clearInterval(timer);
                }
                // No modificamos el texto ya que incluye "años de experiencia"
            }, 20);
        }
    }

    // Mobile menu toggle (para futuras mejoras)
    const mobileMenuButton = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Formulario de contacto (simulado)
    const contactForms = document.querySelectorAll('form');
    contactForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Gracias por su mensaje. Nos pondremos en contacto pronto.');
        });
    });

    // Efecto de hover en las tarjetas de servicios
    const serviceCards = document.querySelectorAll('.card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 1rem 3rem rgba(0, 0, 0, 0.2)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = 'var(--shadow)';
        });
    });

    // Testimonials carousel (simple)
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial-item');

    if (testimonials.length > 0) {
        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.style.display = i === index ? 'block' : 'none';
            });
        }

        function nextTestimonial() {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }

        // Auto-rotate testimonials every 5 seconds
        setInterval(nextTestimonial, 5000);
        showTestimonial(0);
    }

    // Lazy loading para imágenes
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Validación de formularios
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        const re = /^[+]?[0-9\s-()]{8,}$/;
        return re.test(phone);
    }

    // Efecto parallax suave en el hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const speed = 0.5;
            hero.style.transform = `translateY(${scrolled * speed}px)`;
        }
    });

    // Preloader (opcional)
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    }

    // Contador de visitas (simulado)
    let visits = localStorage.getItem('siteVisits') || 0;
    visits++;
    localStorage.setItem('siteVisits', visits);

    // Console log para desarrollo
    console.log('PorSusDerechos - Sistema Legal cargado correctamente');
    console.log(`Visitas del sitio: ${visits}`);

    // Detectar si es móvil
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        // Ajustes específicos para móvil
        document.body.classList.add('mobile-view');
    }

    // Easter egg - Combinación de teclas para acceso rápido al admin
    let keySequence = [];
    const adminSequence = ['a', 'd', 'm', 'i', 'n'];

    document.addEventListener('keydown', function(e) {
        keySequence.push(e.key.toLowerCase());
        if (keySequence.length > adminSequence.length) {
            keySequence.shift();
        }

        if (keySequence.join('') === adminSequence.join('')) {
            window.location.href = 'admin.html';
        }
    });
});

// Funciones globales
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function showAlert(message, type = 'info') {
    // Crear un sistema de alertas simple
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: var(--primary-gold);
        color: white;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: var(--shadow-lg);
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(alert);

    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(alert);
        }, 300);
    }, 3000);
}

// Datos simulados para el sitio
const siteData = {
    stats: {
        experience: 10,
        cases: 150,
        clients: 200,
        satisfaction: 95
    },
    lawyers: [
        {
            name: "Claudia De Lapeyra",
            specialty: "Derecho Familia y Derecho de la Infancia",
            image: "https://ext.same-assets.com/2240718942/1216291255.png",
            linkedin: "#"
        },
        {
            name: "Leticia Lizama",
            specialty: "Ley Insolvencia y Emprendimiento",
            image: "https://ext.same-assets.com/2240718942/1248217820.png",
            linkedin: "#"
        }
    ],
    services: [
        {
            name: "Familia",
            icon: "fas fa-users",
            description: "Derecho de familia, matrimonio, divorcio, custodia"
        },
        {
            name: "Laboral",
            icon: "fas fa-briefcase",
            description: "Relaciones laborales, despidos, conflictos sindicales"
        },
        {
            name: "Penal",
            icon: "fas fa-gavel",
            description: "Defensa penal, delitos, representación judicial"
        },
        {
            name: "Civil",
            icon: "fas fa-file-contract",
            description: "Contratos, responsabilidad civil, disputas comerciales"
        }
    ]
};

// Exportar datos para uso en otras páginas
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { siteData };
}
