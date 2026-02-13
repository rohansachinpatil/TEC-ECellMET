// API Base URL
const API_URL = 'http://localhost:8080/api';

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
                localStorage.setItem('token', resData.token);
                localStorage.setItem('user', JSON.stringify(resData.user));
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
                localStorage.setItem('token', resData.token);
                localStorage.setItem('user', JSON.stringify(resData.user));
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
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('team', JSON.stringify(data.team));
            }

            return { success: true, data };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    // Get current user
    getCurrentUser: async () => {
        try {
            const token = localStorage.getItem('token');
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
            const token = localStorage.getItem('token');
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
            const token = localStorage.getItem('token');
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
            const token = localStorage.getItem('token');
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
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('team');
        return { success: true };
    },

    // Check if logged in
    isLoggedIn: () => {
        return !!localStorage.getItem('token');
    },

    // Get stored team data
    getStoredTeam: () => {
        const team = localStorage.getItem('team');
        return team ? JSON.parse(team) : null;
    },

    // Get stored user data
    getStoredUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

// Make API available globally
window.API = API;
