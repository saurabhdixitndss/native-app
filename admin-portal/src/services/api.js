const API_BASE_URL = 'http://localhost:4000/api/admin';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Dashboard
  async getDashboardStats() {
    return this.request('/dashboard');
  }

  // Users
  async getUsers(page = 1, limit = 10, search = '') {
    const params = new URLSearchParams({ page, limit, search });
    return this.request(`/users?${params}`);
  }

  async getUserDetails(walletAddress) {
    return this.request(`/users/${walletAddress}`);
  }

  // Mining Sessions
  async getMiningSessions(page = 1, limit = 10, status = '', wallet = '') {
    const params = new URLSearchParams({ page, limit });
    if (status) params.append('status', status);
    if (wallet) params.append('wallet', wallet);
    return this.request(`/sessions?${params}`);
  }

  // Analytics
  async getAnalytics(days = 30) {
    return this.request(`/analytics?days=${days}`);
  }

  // Config
  async getConfig() {
    return this.request('/config');
  }
}

export default new ApiService();
