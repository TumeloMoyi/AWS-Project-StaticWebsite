// js/api.js - Backend API Integration for Baía Seafood
// This connects our forms to AWS Lambda via API Gateway

// API Configuration (UPDATED with your deployed API Gateway URL)
const API_CONFIG = {
    baseUrl: 'https://dnjkmpel51.execute-api.us-east-1.amazonaws.com/prod',
    region: 'us-east-1'
};

// Helper: Show messages to user
function showMessage(elementId, message, isSuccess) {
    const msgDiv = document.getElementById(elementId);
    if (msgDiv) {
        msgDiv.innerHTML = `<div style="padding:10px; margin:10px 0; border-radius:8px; background:${isSuccess ? '#d4edda' : '#f8d7da'}; color:${isSuccess ? '#155724' : '#721c24'};">${message}</div>`;
        setTimeout(() => msgDiv.innerHTML = '', 5000);
    } else {
        // Fallback: show as alert
        alert(message);
    }
}

// BOOKING FORM SUBMISSION
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                fullName: document.getElementById('fullName')?.value,
                email: document.getElementById('email')?.value,
                phone: document.getElementById('phone')?.value,
                bookingDate: document.getElementById('bookingDate')?.value,
                bookingTime: document.getElementById('bookingTime')?.value,
                partySize: parseInt(document.getElementById('partySize')?.value),
                specialRequests: document.getElementById('specialRequests')?.value || '',
                userId: localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')).email : 'guest'
            };
            
            // Validate required fields
            if (!formData.fullName || !formData.email || !formData.bookingDate) {
                showMessage('bookingMessage', 'Please fill in all required fields', false);
                return;
            }
            
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Booking...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch(`${API_CONFIG.baseUrl}/bookings`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const result = await response.json();
                
                if (result.success) {
                    showMessage('bookingMessage', result.message, true);
                    bookingForm.reset();
                } else {
                    showMessage('bookingMessage', result.message, false);
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('bookingMessage', 'Network error. Please try again.', false);
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // ORDER FORM SUBMISSION
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const menuSelect = document.getElementById('menuItem');
            const selectedOption = menuSelect.options[menuSelect.selectedIndex];
            
            // Extract price from option text (e.g., "Seafood Platter — R850" -> 850)
            const priceMatch = selectedOption?.text.match(/R(\d+)/);
            const price = priceMatch ? parseInt(priceMatch[1]) : 0;
            
            const formData = {
                fullName: document.getElementById('fullName')?.value,
                email: document.getElementById('email')?.value,
                phone: document.getElementById('phone')?.value,
                menuItem: document.getElementById('menuItem')?.value,
                quantity: parseInt(document.getElementById('quantity')?.value) || 1,
                deliveryAddress: document.getElementById('deliveryAddress')?.value,
                specialInstructions: document.getElementById('specialInstructions')?.value || '',
                price: price,
                totalAmount: price * (parseInt(document.getElementById('quantity')?.value) || 1),
                userId: localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')).email : 'guest'
            };
            
            if (!formData.fullName || !formData.menuItem || !formData.deliveryAddress) {
                showMessage('orderMessage', 'Please fill in all required fields', false);
                return;
            }
            
            const submitBtn = orderForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Placing Order...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch(`${API_CONFIG.baseUrl}/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const result = await response.json();
                
                if (result.success) {
                    showMessage('orderMessage', result.message, true);
                    orderForm.reset();
                } else {
                    showMessage('orderMessage', result.message, false);
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('orderMessage', 'Network error. Please try again.', false);
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

// Optional: Check authentication status on all pages
function checkGlobalAuth() {
    const user = localStorage.getItem('currentUser');
    const navLinks = document.querySelector('nav ul');
    const signInLink = document.querySelector('nav ul li:last-child a');
    
    if (user && signInLink && signInLink.getAttribute('href') === 'signin.html') {
        const userData = JSON.parse(user);
        signInLink.textContent = `👤 ${userData.name}`;
        signInLink.setAttribute('href', '#');
        signInLink.setAttribute('onclick', 'logout(); return false;');
    }
}

// Run on page load
checkGlobalAuth();