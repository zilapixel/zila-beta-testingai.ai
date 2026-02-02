// Landing Page Script
document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const continueBtn = document.getElementById('continueBtn');
    const authModal = document.getElementById('authModal');
    const closeModal = document.getElementById('closeModal');
    const authForm = document.getElementById('authForm');
    const toggleAuth = document.getElementById('toggleAuth');
    const modalTitle = document.getElementById('modalTitle');
    const toggleText = document.getElementById('toggleText');

    let isLoginMode = true;

    // Check if already logged in
    if (authManager.isLoggedIn()) {
        // User is already logged in, show different state
        loginBtn.textContent = 'Go to Chat';
        signupBtn.style.display = 'none';
    }

    // Open login modal
    loginBtn.addEventListener('click', function() {
        if (authManager.isLoggedIn()) {
            window.location.href = '/chat.html';
        } else {
            isLoginMode = true;
            updateModalMode();
            authModal.classList.add('active');
        }
    });

    // Open signup modal
    signupBtn.addEventListener('click', function() {
        isLoginMode = false;
        updateModalMode();
        authModal.classList.add('active');
    });

    // Continue button
    continueBtn.addEventListener('click', function() {
        if (authManager.isLoggedIn()) {
            window.location.href = '/chat.html';
        } else {
            isLoginMode = true;
            updateModalMode();
            authModal.classList.add('active');
        }
    });

    // Close modal
    closeModal.addEventListener('click', function() {
        authModal.classList.remove('active');
    });

    // Close modal on outside click
    authModal.addEventListener('click', function(e) {
        if (e.target === authModal) {
            authModal.classList.remove('active');
        }
    });

    // Toggle between login and signup
    toggleAuth.addEventListener('click', function(e) {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        updateModalMode();
    });

    // Update modal mode
    function updateModalMode() {
        if (isLoginMode) {
            modalTitle.textContent = 'Login';
            toggleText.textContent = "Don't have an account?";
            toggleAuth.textContent = 'Sign Up';
        } else {
            modalTitle.textContent = 'Sign Up';
            toggleText.textContent = 'Already have an account?';
            toggleAuth.textContent = 'Login';
        }
    }

    // Handle form submission
    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email && password) {
            if (isLoginMode) {
                authManager.login(email, password);
            } else {
                authManager.signup(email, password);
            }
            
            // Redirect to chat
            window.location.href = '/chat.html';
        }
    });
});
