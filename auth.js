// Authentication Management
class AuthManager {
    constructor() {
        this.currentUser = this.getStoredUser();
    }

    // Get stored user from localStorage
    getStoredUser() {
        const userStr = localStorage.getItem('zilaai_user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Login user
    login(email, password) {
        // Simulate login (in production, this would be an API call)
        const user = {
            email: email,
            id: Date.now().toString(),
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('zilaai_user', JSON.stringify(user));
        this.currentUser = user;
        return true;
    }

    // Sign up user
    signup(email, password) {
        // Simulate signup (in production, this would be an API call)
        return this.login(email, password);
    }

    // Logout user
    logout() {
        localStorage.removeItem('zilaai_user');
        this.currentUser = null;
        window.location.href = '/';
    }

    // Require authentication
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = '/';
            return false;
        }
        return true;
    }
}

// Export auth manager instance
const authManager = new AuthManager();
