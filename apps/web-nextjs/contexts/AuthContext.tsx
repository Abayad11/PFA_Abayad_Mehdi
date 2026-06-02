/**
 * Context d'authentification pour gérer l'état global de l'utilisateur
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import api, { User, LoginResponse, RegisterData } from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string, tenant_id?: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Charger l'utilisateur au démarrage (uniquement côté client)
  useEffect(() => {
    // Ne s'exécute que côté client
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        if (api.isAuthenticated()) {
          // Vérifier si le token est toujours valide
          const response = await api.verifyToken();
          if (response.valid) {
            setUser(response.user);
          } else {
            // Token invalide, nettoyer
            await api.logout();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // En cas d'erreur, nettoyer
        await api.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (username: string, password: string, tenant_id: string = 'chu-casablanca') => {
    try {
      setLoading(true);
      const response: LoginResponse = await api.login(username, password, tenant_id);
      setUser(response.user);
      
      // Rediriger vers le dashboard approprié selon le rôle
      const dashboardRoutes: Record<string, string> = {
        patient: '/patient/dashboard',
        medecin: '/medecin/dashboard',
        chercheur: '/chercheur/dashboard',
        admin: '/admin/dashboard',
      };
      
      const redirectTo = dashboardRoutes[response.user.role] || '/';
      router.push(redirectTo);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      const response: LoginResponse = await api.register(data);
      setUser(response.user);
      
      // Rediriger vers le dashboard approprié selon le rôle
      const dashboardRoutes: Record<string, string> = {
        patient: '/patient/dashboard',
        medecin: '/medecin/dashboard',
        chercheur: '/chercheur/dashboard',
        admin: '/admin/dashboard',
      };
      
      const redirectTo = dashboardRoutes[response.user.role] || '/';
      router.push(redirectTo);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await api.logout();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  // Pendant le SSR ou si pas de Provider, retourner des valeurs par défaut
  if (context === undefined) {
    if (typeof window === 'undefined') {
      // SSR: retourner des valeurs par défaut
      return {
        user: null,
        loading: false,
        login: async () => {},
        register: async () => {},
        logout: async () => {},
        isAuthenticated: false,
        updateUser: () => {},
      };
    }
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthContext;
