// Variables globales
let currentUser = null;
let notifications = [];
let dashboardData = {
    stats: {
        casosActivos: 45,
        clientes: 128,
        ingresosMensuales: 2450000,
        plazosPendientes: 7
    },
    proximasAudiencias: [
        {
            id: 1,
            fecha: new Date('2024-12-15'),
            tipo: 'Audiencia Preparatoria',
            caso: 'González vs. Empresa ABC',
            hora: '14:30',
            urgente: true
        },
        {
            id: 2,
            fecha: new Date('2024-12-18'),
            tipo: 'Juicio Oral',
            caso: 'Divorcio Martínez',
            hora: '10:00',
            urgente: false
        },
        {
            id: 3,
            fecha: new Date('2024-12-22'),
            tipo: 'Conciliación',
            caso: 'Laboral Rodríguez',
            hora: '16:00',
            urgente: false
        }
    ],
    documentosPendientes: [
        {
            id: 1,
            titulo: 'Contestación Demanda',
            caso: 'Civil López',
            vencimiento: new Date('2024-12-16'),
            urgente: true
        },
        {
            id: 2,
            titulo: 'Escrito Alegatos',
            caso: 'Penal Sánchez',
            vencimiento: new Date('2024-12-20'),
            urgente: false
        },
        {
            id: 3,
            titulo: 'Apelación',
            caso: 'Laboral García',
            vencimiento: new Date('2024-12-28'),
            urgente: false
        }
    ],
    clientesMorosos: [
        {
            id: 1,
            nombre: 'María González',
            caso: 'Divorcio',
            monto: 120000,
            diasMora: 45
        },
        {
            id: 2,
            nombre: 'Carlos Pérez',
            caso: 'Laboral',
            monto: 95000,
            diasMora: 30
        },
        {
            id: 3,
            nombre: 'Ana Martínez',
            caso: 'Civil',
            monto: 200000,
            diasMora: 60
        }
    ]
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
    checkAuthentication();
    loadUserData();
    setupEventListeners();
    initializeDashboard();
});

// Función de inicialización principal
function initializeAdmin() {
    console.log('Inicializando panel de administración...');
    
    // Verificar autenticación
    const session = sessionStorage.getItem('userSession');
    if (!session) {
        redirectToLogin();
        return;
    }
    
    try {
        currentUser = JSON.parse(session);
        updateUserInterface();
    } catch (error) {
        console.error('Error al cargar sesión:', error);
        redirectToLogin();
    }
}

// Verificar autenticación
function checkAuthentication() {
    const session = sessionStorage.getItem('userSession');
    if (!session) {
        redirectToLogin();
        return false;
    }
    
    try {
        const sessionData = JSON.parse(session);
        const loginTime = new Date(sessionData.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
        
        // Verificar si la sesión ha expirado (8 horas)
        if (hoursDiff > 8) {
            sessionStorage.removeItem('userSession');
            redirectToLogin();
            return false;
        }
        
        currentUser = sessionData;
        return true;
    } catch (error) {
        console.error('Error al verificar autenticación:', error);
        redirectToLogin();
        return false;
    }
}

// Redirigir al login
function redirectToLogin() {
    window.location.href = 'login.html';
}

// Cargar datos del usuario
function loadUserData() {
    if (!currentUser) return;
    
    // Actualizar elementos de usuario en la interfaz
    const userNameElements = document.querySelectorAll('.user-name');
    const userRoleElements = document.querySelectorAll('.user-role');
    
    userNameElements.forEach(element => {
        element.textContent = getUserDisplayName(currentUser.email);
    });
    
    userRoleElements.forEach(element => {
        element.textContent = getRoleDisplayName(currentUser.role);
    });
}

// Obtener nombre de usuario para mostrar
function getUserDisplayName(email) {
    if (email.includes('admin')) return 'Administrador';
    if (email.includes('abogado')) return 'Abogado';
    if (email.includes('secretaria')) return 'Secretaria';
    return 'Usuario';
}

// Obtener nombre del rol para mostrar
function getRoleDisplayName(role) {
    const roles = {
        'admin': 'Administrador del Sistema',
        'abogado': 'Abogado',
        'secretaria': 'Secretaria',
        'user': 'Usuario'
    };
    return roles[role] || 'Usuario';
}

// Actualizar interfaz de usuario
function updateUserInterface() {
    // Configurar permisos basados en el rol
    const userRole = currentUser.role;
    
    // Aquí se pueden ocultar/mostrar elementos según el rol
    if (userRole !== 'admin') {
        // Ejemplo: ocultar ciertas funciones para usuarios no admin
        const adminOnlyElements = document.querySelectorAll('[data-admin-only]');
        adminOnlyElements.forEach(element => {
            element.style.display = 'none';
        });
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    if (mobileSidebarToggle) {
        mobileSidebarToggle.addEventListener('click', toggleMobileSidebar);
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMobileSidebar);
    }
    
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', handleNavigation);
    });
    
    // User menu
    const userMenuToggle = document.getElementById('userMenuToggle');
    if (userMenuToggle) {
        userMenuToggle.addEventListener('click', toggleUserMenu);
    }
    
    // Logout buttons
    const logoutBtn = document.getElementById('logoutBtn');
    const headerLogout = document.getElementById('headerLogout');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    if (headerLogout) {
        headerLogout.addEventListener('click', handleLogout);
    }
    
    // Notifications
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', toggleNotifications);
    }
    
    // Close menus when clicking outside
    document.addEventListener('click', closeOpenMenus);
    
    // Responsive handling
    window.addEventListener('resize', handleResize);
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
    
    // Guardar estado en localStorage
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed);
}

// Toggle mobile sidebar
function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.toggle('mobile-active');
    overlay.classList.toggle('active');
}

// Close mobile sidebar
function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.remove('mobile-active');
    overlay.classList.remove('active');
}

// Handle navigation
function handleNavigation(e) {
    e.preventDefault();
    
    const navItem = e.currentTarget;
    const section = navItem.dataset.section;
    
    if (!section) return;
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    navItem.classList.add('active');
    
    // Show corresponding section
    showSection(section);
    
    // Update page title
    updatePageTitle(section);
    
    // Close mobile sidebar if open
    if (window.innerWidth <= 768) {
        closeMobileSidebar();
    }
}

// Show section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Update page title
function updatePageTitle(section) {
    const titles = {
        'dashboard': 'Dashboard',
        'causas': 'Gestión de Causas',
        'clientes': 'Gestión de Clientes',
        'calendario': 'Calendario',
        'documentos': 'Gestión de Documentos',
        'pagos': 'Pagos y Facturación',
        'personal': 'Gestión de Personal',
        'configuracion': 'Configuración',
        'reportes': 'Reportes y Estadísticas'
    };
    
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle && titles[section]) {
        pageTitle.textContent = titles[section];
    }
}

// Toggle user menu
function toggleUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    userMenu.classList.toggle('active');
}

// Toggle notifications
function toggleNotifications() {
    // Implementar lógica de notificaciones
    console.log('Mostrando notificaciones...');
    // Aquí se puede abrir un modal o dropdown con las notificaciones
}

// Close open menus
function closeOpenMenus(e) {
    // Close user menu if clicking outside
    const userMenu = document.querySelector('.user-menu');
    if (userMenu && !userMenu.contains(e.target)) {
        userMenu.classList.remove('active');
    }
}

// Handle logout
function handleLogout(e) {
    e.preventDefault();
    
    // Mostrar confirmación
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        // Limpiar sesión
        sessionStorage.removeItem('userSession');
        
        // Limpiar datos locales si es necesario
        // localStorage.removeItem('someData');
        
        // Redirigir al login
        window.location.href = 'login.html';
    }
}

// Handle window resize
function handleResize() {
    if (window.innerWidth > 768) {
        // Close mobile sidebar on desktop
        closeMobileSidebar();
        
        // Restore sidebar state
        const sidebar = document.getElementById('sidebar');
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
        }
    }
}

// Initialize dashboard
function initializeDashboard() {
    // Cargar estado del sidebar
    const sidebar = document.getElementById('sidebar');
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
    }
    
    // Inicializar componentes del dashboard
    updateStatsCards();
    renderProximasAudiencias();
    renderDocumentosPendientes();
    renderClientesMorosos();
    initializeMiniCalendar();
    
    // Simular carga de datos
    setTimeout(() => {
        loadNotifications();
    }, 1000);
}

// Update stats cards
function updateStatsCards() {
    const stats = dashboardData.stats;
    
    // Actualizar casos activos
    const casosElement = document.querySelector('.stat-card .stat-content h3');
    if (casosElement) {
        animateNumber(casosElement, 0, stats.casosActivos, 1000);
    }
    
    // Actualizar otros stats con animación
    setTimeout(() => {
        const allStats = document.querySelectorAll('.stat-card .stat-content h3');
        if (allStats.length >= 4) {
            animateNumber(allStats[1], 0, stats.clientes, 1200);
            animateNumber(allStats[3], 0, stats.plazosPendientes, 800);
        }
        
        // Actualizar ingresos con formato de moneda
        if (allStats.length >= 3) {
            animateCurrency(allStats[2], 0, stats.ingresosMensuales, 1500);
        }
    }, 200);
}

// Animate number
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * easeOutCubic(progress));
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Animate currency
function animateCurrency(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * easeOutCubic(progress));
        element.textContent = formatCurrency(current);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Easing function
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(amount);
}

// Render próximas audiencias
function renderProximasAudiencias() {
    const container = document.querySelector('.dashboard-card .card-content');
    if (!container) return;
    
    // Aquí se renderizarían las audiencias dinámicamente
    // Por ahora el HTML ya está cargado estáticamente
}

// Render documentos pendientes
function renderDocumentosPendientes() {
    // Similar a audiencias, aquí se cargarían dinámicamente
}

// Render clientes morosos
function renderClientesMorosos() {
    const morosos = dashboardData.clientesMorosos;
    const totalAdeudado = morosos.reduce((sum, cliente) => sum + cliente.monto, 0);
    
    // Actualizar totales
    const totalElement = document.querySelector('.moroso-total h4');
    const countElement = document.querySelector('.moroso-count h4');
    
    if (totalElement) {
        animateCurrency(totalElement, 0, totalAdeudado, 1500);
    }
    
    if (countElement) {
        animateNumber(countElement, 0, morosos.length, 1000);
    }
}

// Initialize mini calendar
function initializeMiniCalendar() {
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            console.log('Mes anterior');
            // Implementar navegación de calendario
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            console.log('Mes siguiente');
            // Implementar navegación de calendario
        });
    }
    
    // Marcar día actual
    const today = new Date().getDate();
    const todayElement = document.querySelector('.dia.today');
    if (todayElement) {
        todayElement.textContent = today;
    }
}

// Load notifications
function loadNotifications() {
    notifications = [
        {
            id: 1,
            type: 'urgente',
            title: 'Audiencia en 2 días',
            message: 'González vs. Empresa ABC',
            time: new Date()
        },
        {
            id: 2,
            type: 'documento',
            title: 'Documento por vencer',
            message: 'Contestación demanda - 2 días',
            time: new Date()
        },
        {
            id: 3,
            type: 'pago',
            title: 'Pago recibido',
            message: 'Cliente María González - $120.000',
            time: new Date()
        }
    ];
    
    updateNotificationBadge();
}

// Update notification badge
function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.textContent = notifications.length;
        badge.style.display = notifications.length > 0 ? 'block' : 'none';
    }
}

// Utility functions
function formatDate(date) {
    return new Intl.DateTimeFormat('es-CL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(date);
}

function formatTime(date) {
    return new Intl.DateTimeFormat('es-CL', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function getDaysUntil(date) {
    const now = new Date();
    const target = new Date(date);
    const diffTime = target - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Error global en admin:', e.error);
    
    // Mostrar notificación de error al usuario si es crítico
    if (e.error && e.error.name === 'ChunkLoadError') {
        alert('Error al cargar la aplicación. Por favor, recargue la página.');
    }
});

// Auto-refresh data (cada 5 minutos)
setInterval(() => {
    if (document.visibilityState === 'visible') {
        // Verificar si la sesión sigue válida
        if (checkAuthentication()) {
            // Refrescar datos si es necesario
            console.log('Verificando actualizaciones...');
        }
    }
}, 5 * 60 * 1000);

// Performance monitoring
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.name === 'measure-dashboard-load') {
            console.log(`Dashboard cargado en: ${entry.duration}ms`);
        }
    }
});

observer.observe({ entryTypes: ['measure'] });

// Marcar inicio de carga
performance.mark('dashboard-start');

// Al finalizar la carga inicial
document.addEventListener('DOMContentLoaded', () => {
    performance.mark('dashboard-end');
    performance.measure('measure-dashboard-load', 'dashboard-start', 'dashboard-end');
});

// Funciones para futuras implementaciones
function exportData(type) {
    console.log(`Exportando datos de tipo: ${type}`);
    // Implementar exportación
}

function printReport(reportType) {
    console.log(`Imprimiendo reporte: ${reportType}`);
    // Implementar impresión
}

function sendNotification(user, message) {
    console.log(`Enviando notificación a ${user}: ${message}`);
    // Implementar sistema de notificaciones
}

// API functions (para futuras integraciones)
async function fetchDashboardData() {
    try {
        // Simulación de llamada a API
        await new Promise(resolve => setTimeout(resolve, 1000));
        return dashboardData;
    } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        throw error;
    }
}

async function updateCase(caseId, data) {
    try {
        // Simulación de actualización
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(`Caso ${caseId} actualizado:`, data);
        return { success: true };
    } catch (error) {
        console.error('Error al actualizar caso:', error);
        throw error;
    }
}

async function saveDocument(document) {
    try {
        // Simulación de guardado
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log('Documento guardado:', document);
        return { success: true, id: Math.random().toString(36).substr(2, 9) };
    } catch (error) {
        console.error('Error al guardar documento:', error);
        throw error;
    }
}

// Logging system
function logActivity(action, details = null) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        user: currentUser?.email || 'anonymous',
        action: action,
        details: details
    };
    
    console.log('Activity Log:', logEntry);
    
    // En un ambiente real, esto se enviaría al servidor
    const activityLog = JSON.parse(localStorage.getItem('activityLog') || '[]');
    activityLog.push(logEntry);
    
    // Mantener solo los últimos 100 registros
    if (activityLog.length > 100) {
        activityLog.splice(0, activityLog.length - 100);
    }
    
    localStorage.setItem('activityLog', JSON.stringify(activityLog));
}

function initializeMiniCalendar() {
    var calendarEl = document.getElementById('mini-calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'es',
      height: 'auto', // Adjust as needed
      headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: ''
      },
      events: [
        // Example events
        { title: 'Audiencia', start: '2024-12-15', color: '#bfa46d' },
        { title: 'Documento', start: '2024-12-18', color: '#bfa46d' }
      ],
      dayMaxEventRows: 2,
      fixedWeekCount: false
    });
    calendar.render();
  }

document.addEventListener('DOMContentLoaded', function() {
    initializeMiniCalendar();
});