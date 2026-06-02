/**
 * Service API pour communiquer avec le backend Django
 * Gère l'authentification JWT et les requêtes HTTP
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'patient' | 'medecin' | 'chercheur' | 'admin';
  tenant_id: string;
  telephone?: string;
  adresse?: string;
  date_naissance?: string;
  is_verified: boolean;
  // Champs spécifiques
  specialite?: string;
  inpe?: string;
  groupe_sanguin?: string;
  allergies?: string;
  maladies_chroniques?: string;
  institution?: string;
  domaine_recherche?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  message: string;
}

export interface RegisterData {
  username: string;
  password: string;
  password2: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'patient' | 'medecin' | 'chercheur' | 'admin';
  tenant_id: string;
  telephone?: string;
  adresse?: string;
  date_naissance?: string;
  // Champs spécifiques selon le rôle
  specialite?: string;
  inpe?: string;
  groupe_sanguin?: string;
  allergies?: string;
  maladies_chroniques?: string;
  institution?: string;
  domaine_recherche?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Récupère le token d'accès depuis le localStorage
   */
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  /**
   * Récupère le refresh token depuis le localStorage
   */
  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  }

  /**
   * Récupère le tenant_id depuis le localStorage
   */
  private getTenantId(): string {
    if (typeof window === 'undefined') return 'chu-casablanca';
    return localStorage.getItem('tenant_id') || 'chu-casablanca';
  }

  /**
   * Stocke les tokens dans le localStorage
   */
  private setTokens(tokens: AuthTokens): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  }

  /**
   * Supprime les tokens du localStorage
   */
  private clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('tenant_id');
    localStorage.removeItem('user');
  }

  /**
   * Effectue une requête HTTP avec gestion des erreurs
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAccessToken();
    const tenantId = this.getTenantId();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Ajouter le token d'authentification si disponible
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['X-Tenant-Id'] = tenantId;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      // Si le token est expiré, essayer de le rafraîchir
      if (response.status === 401 && token) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Réessayer la requête avec le nouveau token
          headers['Authorization'] = `Bearer ${this.getAccessToken()}`;
          const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, {
            ...config,
            headers,
          });
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }
          return await retryResponse.json();
        } else {
          // Impossible de rafraîchir, déconnecter l'utilisateur
          this.clearTokens();
          window.location.href = '/login';
          throw new Error('Session expirée');
        }
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * Connexion utilisateur
   */
  async login(username: string, password: string, tenant_id: string = 'chu-casablanca'): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/api/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password, tenant_id }),
    });

    // Stocker les tokens et les infos utilisateur
    this.setTokens(response.tokens);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tenant_id', response.user.tenant_id);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  /**
   * Inscription utilisateur
   */
  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/api/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Stocker les tokens et les infos utilisateur
    this.setTokens(response.tokens);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tenant_id', response.user.tenant_id);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  /**
   * Déconnexion utilisateur
   */
  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    
    if (refreshToken) {
      try {
        await this.request('/api/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    this.clearTokens();
  }

  /**
   * Rafraîchir le token d'accès
   */
  async refreshToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      this.setTokens(data);
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  /**
   * Récupérer le profil de l'utilisateur connecté
   */
  async getProfile(): Promise<{ user: User }> {
    return await this.request<{ user: User }>('/api/auth/me/');
  }

  /**
   * Mettre à jour le profil de l'utilisateur
   */
  async updateProfile(data: Partial<User>): Promise<{ user: User; message: string }> {
    return await this.request<{ user: User; message: string }>('/api/auth/me/', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Changer le mot de passe
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
    return await this.request<{ message: string }>('/api/auth/change-password/', {
      method: 'POST',
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
        new_password2: newPassword,
      }),
    });
  }

  /**
   * Vérifier si le token est valide
   */
  async verifyToken(): Promise<{ valid: boolean; user: User }> {
    return await this.request<{ valid: boolean; user: User }>('/api/auth/verify/');
  }

  /**
   * Récupérer l'utilisateur depuis le localStorage
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// Export singleton
export const api = new ApiService();
export default api;
