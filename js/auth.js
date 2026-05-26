// js/auth.js - Simple authentication for Baía Seafood
// Uses localStorage for demo (ready for Cognito integration)

// Helper: Show messages to user
function showAuthMessage(elementId, message, isError) {
    const msgDiv = document.getElementById(elementId);
    if (msgDiv) {
        msgDiv.innerHTML = `<div style="padding:10px; margin:10px 0; border-radius:8px; background:${isError ? '#f8d7da' : '#d4edda'}; color:${isError ? '#721c24' : '#155724'};">${message}</div>`;
        setTimeout(() => msgDiv.innerHTML = '', 5000);
    }
}

// LOGIN FUNCTION
async function login(email, password) {
    try {
        console.log('🔐 Login attempt:', email);
        
        // Store in localStorage
        localStorage.setItem('currentUser', JSON.stringify({
            email: email,
            name: email.split('@')[0],
            loggedIn: true,
            loginTime: new Date().toISOString()
        }));
        
        showAuthMessage('loginMessage', '✅ Login successful! Redirecting...', false);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
        return true;
    } catch (error) {
        console.error('Login error:', error);
        showAuthMessage('loginMessage', '❌ Login failed. Please check your credentials.', true);
        return false;
    }
}

// REGISTER FUNCTION
async function register(email, password, fullName, phone) {
    try {
        console.log('📝 Register attempt:', email, fullName, phone);
        
        localStorage.setItem('currentUser', JSON.stringify({
            email: email,
            name: fullName || email.split('@')[0],
            phone: phone,
            loggedIn: true,
            registeredAt: new Date().toISOString()
        }));
        
        showAuthMessage('registerMessage', '✅ Registration successful! Redirecting...', false);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
        return true;
    } catch (error) {
        console.error('Registration error:', error);
        showAuthMessage('registerMessage', '❌ Registration failed. Please try again.', true);
        return false;
    }
}

// LOGOUT FUNCTION
function logout() {
    localStorage.removeItem('currentUser');
    console.log('👋 User logged out');
    window.location.href = 'index.html';
}

// CHECK IF USER IS LOGGED IN
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// UPDATE NAVBAR WITH USER NAME
function updateNavForAuth() {
    const user = checkAuth();
    const navLinks = document.querySelector('nav ul');
    
    if (user && navLinks) {
        const existingLogout = document.querySelector('.logout-btn');
        if (!existingLogout) {
            const logoutLi = document.createElement('li');
            logoutLi.innerHTML = `<a href="#" onclick="logout()" class="logout-btn" style="color:#e67e22;">👤 ${user.name} | Logout</a>`;
            navLinks.appendChild(logoutLi);
        }
    } else if (navLinks) {
        const existingLogout = document.querySelector('.logout-btn');
        if (existingLogout) existingLogout.remove();
    }
}

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth.js loaded – DOM ready');
    updateNavForAuth();
    
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Login form found');
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Login form submitted');
            const email = document.getElementById('email')?.value;
            const password = document.getElementById('password')?.value;
            
            if (email && password) {
                await login(email, password);
            } else {
                showAuthMessage('loginMessage', 'Please enter email and password', true);
            }
        });
    } else {
        console.error('loginForm not found in DOM');
    }
    
    // Register form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log('Register form found');
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Register form submitted');
            const email = document.getElementById('registerEmail')?.value;
            const password = document.getElementById('registerPassword')?.value;
            const fullName = document.getElementById('registerName')?.value;
            const phone = document.getElementById('registerPhone')?.value;
            
            if (email && password) {
                await register(email, password, fullName, phone);
            } else {
                showAuthMessage('registerMessage', 'Please fill in all required fields', true);
            }
        });
    } else {
        console.error('registerForm not found in DOM');
    }
});

// Expose functions globally
window.logout = logout;
window.checkAuth = checkAuth;
window.showAuthMessage = showAuthMessage;