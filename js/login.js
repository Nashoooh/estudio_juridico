// Variables globales
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const togglePassword = document.getElementById('togglePassword');
const rememberMe = document.getElementById('rememberMe');
const spinner = document.getElementById('spinner');

// Credenciales de ejemplo (en un ambiente real, esto vendría del servidor)
const validCredentials = {
    'admin@porsusderechos.cl': 'admin123',
    'abogado@porsusderechos.cl': 'abogado123',
    'secretaria@porsusderechos.cl': 'secretaria123'
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeLogin();
    loadRememberedCredentials();
});

// Función de inicialización
function initializeLogin() {
    // Event listeners
    loginForm.addEventListener('submit', handleLogin);
    togglePassword.addEventListener('click', togglePasswordVisibility);
    emailInput.addEventListener('input', clearError);
    passwordInput.addEventListener('input', clearError);
    
    // Limpiar errores al hacer focus
    emailInput.addEventListener('focus', () => clearFieldError('emailError'));
    passwordInput.addEventListener('focus', () => clearFieldError('passwordError'));
    
    // Enter key para submitear
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin(e);
        }
    });
    
    console.log('Sistema de login inicializado');
}

// Función para manejar el login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Limpiar errores previos
    clearAllErrors();
    
    // Validaciones
    if (!validateForm(email, password)) {
        return;
    }
    
    // Mostrar loading
    setLoadingState(true);
    
    try {
        // Simular llamada a API (delay de 1.5 segundos)
        await simulateAuthRequest(email, password);
        
        // Verificar credenciales
        if (authenticateUser(email, password)) {
            // Guardar credenciales si se seleccionó "recordarme"
            if (rememberMe.checked) {
                saveCredentials(email, password);
            } else {
                clearSavedCredentials();
            }
            
            // Guardar sesión
            sessionStorage.setItem('userSession', JSON.stringify({
                email: email,
                loginTime: new Date().toISOString(),
                role: getUserRole(email)
            }));
            
            // Mostrar éxito y redirigir
            showSuccess();
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1500);
            
        } else {
            throw new Error('Credenciales inválidas');
        }
        
    } catch (error) {
        showError('mainError', error.message || 'Error de autenticación. Verifique sus credenciales.');
    } finally {
        setLoadingState(false);
    }
}

// Función para validar el formulario
function validateForm(email, password) {
    let isValid = true;
    
    // Validar email
    if (!email) {
        showError('emailError', 'El correo electrónico es requerido');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('emailError', 'Ingrese un correo electrónico válido');
        isValid = false;
    }
    
    // Validar password
    if (!password) {
        showError('passwordError', 'La contraseña es requerida');
        isValid = false;
    } else if (password.length < 6) {
        showError('passwordError', 'La contraseña debe tener al menos 6 caracteres');
        isValid = false;
    }
    
    return isValid;
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para autenticar usuario
function authenticateUser(email, password) {
    return validCredentials[email] === password;
}

// Función para obtener el rol del usuario
function getUserRole(email) {
    if (email.includes('admin')) return 'admin';
    if (email.includes('abogado')) return 'abogado';
    if (email.includes('secretaria')) return 'secretaria';
    return 'user';
}

// Función para simular request de autenticación
function simulateAuthRequest(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simular diferentes tipos de errores ocasionalmente
            const random = Math.random();
            if (random < 0.05) { // 5% chance de error de servidor
                reject(new Error('Error del servidor. Intente nuevamente.'));
            } else if (random < 0.1) { // 5% chance de error de red
                reject(new Error('Error de conexión. Verifique su internet.'));
            } else {
                resolve();
            }
        }, 1500);
    });
}

// Función para mostrar/ocultar contraseña
function togglePasswordVisibility() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    const icon = togglePassword.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
}

// Función para establecer estado de loading
function setLoadingState(loading) {
    if (loading) {
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
        spinner.style.display = 'block';
    } else {
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
        spinner.style.display = 'none';
    }
}

// Función para mostrar errores
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        
        // Añadir clase de error al input correspondiente
        if (elementId === 'emailError') {
            emailInput.style.borderColor = '#dc3545';
        } else if (elementId === 'passwordError') {
            passwordInput.style.borderColor = '#dc3545';
        }
    }
}

// Función para limpiar errores
function clearError() {
    clearAllErrors();
}

function clearFieldError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.classList.remove('show');
    }
    
    // Restaurar color del border
    if (elementId === 'emailError') {
        emailInput.style.borderColor = '';
    } else if (elementId === 'passwordError') {
        passwordInput.style.borderColor = '';
    }
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.classList.remove('show');
    });
    
    // Restaurar colores de los inputs
    emailInput.style.borderColor = '';
    passwordInput.style.borderColor = '';
}

// Función para mostrar éxito
function showSuccess() {
    // Cambiar el botón temporalmente para mostrar éxito
    const btnText = loginBtn.querySelector('.btn-text');
    const originalText = btnText.textContent;
    
    btnText.textContent = '¡Ingreso exitoso!';
    loginBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
    
    // Animar check icon
    setTimeout(() => {
        btnText.innerHTML = '<i class="fas fa-check"></i> ¡Redirigiendo...';
    }, 500);
}

// Función para guardar credenciales
function saveCredentials(email, password) {
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem('rememberedEmail', email);
        // En un ambiente real, no guardaríamos la contraseña en localStorage
        // Aquí es solo para demostración
        localStorage.setItem('rememberedPassword', btoa(password)); // Base64 encoding básico
    }
}

// Función para cargar credenciales guardadas
function loadRememberedCredentials() {
    if (typeof(Storage) !== "undefined") {
        const savedEmail = localStorage.getItem('rememberedEmail');
        const savedPassword = localStorage.getItem('rememberedPassword');
        
        if (savedEmail) {
            emailInput.value = savedEmail;
            rememberMe.checked = true;
            
            if (savedPassword) {
                passwordInput.value = atob(savedPassword); // Decodificar base64
            }
        }
    }
}

// Función para limpiar credenciales guardadas
function clearSavedCredentials() {
    if (typeof(Storage) !== "undefined") {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
    }
}

// Función para verificar si el usuario ya está logueado
function checkExistingSession() {
    const session = sessionStorage.getItem('userSession');
    if (session) {
        try {
            const sessionData = JSON.parse(session);
            const loginTime = new Date(sessionData.loginTime);
            const now = new Date();
            const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
            
            // Si la sesión es menor a 8 horas, redirigir al admin
            if (hoursDiff < 8) {
                window.location.href = 'admin.html';
                return;
            } else {
                // Limpiar sesión expirada
                sessionStorage.removeItem('userSession');
            }
        } catch (error) {
            console.error('Error al verificar sesión:', error);
            sessionStorage.removeItem('userSession');
        }
    }
}

// Verificar sesión existente al cargar la página
checkExistingSession();

// Función de utilidad para logging (solo en desarrollo)
function logDebug(message, data = null) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`[LOGIN DEBUG] ${message}`, data || '');
    }
}

// Añadir información de credenciales de prueba en la consola
logDebug('Credenciales de prueba disponibles:', validCredentials);

// Manejo de errores globales
window.addEventListener('error', function(e) {
    console.error('Error global capturado:', e.error);
    showError('mainError', 'Ha ocurrido un error inesperado. Recargue la página e intente nuevamente.');
});

// Prevenir ataques de fuerza bruta básicos
let loginAttempts = 0;
const maxAttempts = 5;
let lockoutTime = null;

function checkLoginAttempts() {
    if (lockoutTime && new Date() < lockoutTime) {
        const remainingTime = Math.ceil((lockoutTime - new Date()) / 1000 / 60);
        showError('mainError', `Demasiados intentos fallidos. Intente nuevamente en ${remainingTime} minutos.`);
        return false;
    }
    return true;
}

function handleFailedLogin() {
    loginAttempts++;
    if (loginAttempts >= maxAttempts) {
        lockoutTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos de bloqueo
        showError('mainError', 'Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.');
    }
}

function resetLoginAttempts() {
    loginAttempts = 0;
    lockoutTime = null;
}