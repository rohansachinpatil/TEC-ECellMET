// API Base URL
// API Base URL
const API_URL = '/api';

// API Helper Functions
// Safe Storage Helper
// Safe Storage Helper (localStorage -> sessionStorage -> Cookie Fallback)
const safeStorage = {
    setItem: (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn('LocalStorage failed, trying cookie...', e);
            setCookie(key, value, 7); // Fallback to cookie (7 days)
        }
    },
    getItem: (key) => {
        try {
            const item = localStorage.getItem(key);
            if (item) return item;
            throw new Error('NotFound');
        } catch (e) {
            return getCookie(key); // Fallback to cookie
        }
    },
    removeItem: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            deleteCookie(key);
        }
    }
};

// Cookie Helpers
function setCookie(name, value, days) {
    try {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (encodeURIComponent(value) || "") + expires + "; path=/";
    } catch (e) {
        console.error("Cookie set failed", e);
    }
}

function getCookie(name) {
    try {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    } catch (e) {
        return null;
    }
}

function deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// API Helper Functions
const API = {
    // Register Team Leader
    registerLeader: async (data) => {
        try {
            const response = await fetch(`${API_URL}/auth/register-leader`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const resData = await response.json();

            if (!response.ok) {
                throw new Error(resData.message || 'Registration failed');
            }

            // Store token in localStorage
            if (resData.token) {
                safeStorage.setItem('token', resData.token);
                safeStorage.setItem('user', JSON.stringify(resData.user));
            }

            return { success: true, teamCode: resData.teamCode };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    // Register Member
    registerMember: async (data) => {
        try {
            const response = await fetch(`${API_URL}/auth/register-member`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const resData = await response.json();

            if (!response.ok) {
                throw new Error(resData.message || 'Registration failed');
            }

            // Store token in localStorage
            if (resData.token) {
                safeStorage.setItem('token', resData.token);
                safeStorage.setItem('user', JSON.stringify(resData.user));
            }

            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    // Login user (Phone + Password)
    login: async (phone, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phone, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store token in localStorage
            if (data.token) {
                safeStorage.setItem('token', data.token);
                safeStorage.setItem('user', JSON.stringify(data.user));
                safeStorage.setItem('team', JSON.stringify(data.team));
            }

            return { success: true, data };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    // Get current user
    getCurrentUser: async () => {
        try {
            const token = safeStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to get user');
            }

            return { success: true, data };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    // Get all tasks
    getTasks: async () => {
        try {
            const token = safeStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await fetch(`${API_URL}/tasks`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to get tasks');
            }

            return { success: true, tasks: data.tasks };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    // Submit task
    submitTask: async (taskId, file) => {
        try {
            const token = safeStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_URL}/submissions/${taskId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Content-Type header not set manually for FormData
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Submission failed');
            }

            return { success: true, data };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    // Get my submissions (all or specific)
    getMySubmissions: async () => {
        try {
            const token = safeStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await fetch(`${API_URL}/submissions`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to get submissions');
            }

            return { success: true, submissions: data.submissions };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    // Get leaderboard
    getLeaderboard: async () => {
        try {
            const response = await fetch(`${API_URL}/submissions/leaderboard`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to get leaderboard');
            }

            return { success: true, leaderboard: data.leaderboard };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    // Logout
    logout: () => {
        safeStorage.removeItem('token');
        safeStorage.removeItem('user');
        safeStorage.removeItem('team');
        return { success: true };
    },

    // Check if logged in
    isLoggedIn: () => {
        return !!safeStorage.getItem('token');
    },

    // Get stored team data
    getStoredTeam: () => {
        const team = safeStorage.getItem('team');
        return team ? JSON.parse(team) : null;
    },

    // Get stored user data
    getStoredUser: () => {
        const user = safeStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Check session with server (Cookie Auth)
    checkSession: async () => {
        try {
            const response = await fetch(`${API_URL}/auth/me`);
            const data = await response.json();

            if (response.ok && data.success) {
                // Session is valid (cookie worked), try to sync local storage if possible
                if (window.safeStorage) {
                    safeStorage.setItem('user', JSON.stringify(data.user));
                    if (data.team) safeStorage.setItem('team', JSON.stringify(data.team));
                    // We don't have the token string here (httpOnly), but we don't need it if cookies work
                }
                return { success: true, user: data.user, team: data.team };
            }
            return { success: false };
        } catch (error) {
            return { success: false };
        }
    }
};

// Make API available globally
window.API = API;
