import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AuthContextType = {
  token: string | null;
  tenantId: string;
  setToken: (t: string | null) => void;
  setTenantId: (id: string) => void;
  apiFetch: (path: string, init?: RequestInit) => Promise<Response>;
  ready: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [tenantId, setTenantIdState] = useState<string>('chu-casablanca');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('access_token');
    const tenant = localStorage.getItem('tenant_id');
    if (t) setTokenState(t);
    if (tenant) setTenantIdState(tenant);
    setReady(true);
  }, []);

  const setToken = (t: string | null) => {
    setTokenState(t);
    if (t) localStorage.setItem('access_token', t);
    else localStorage.removeItem('access_token');
  };

  const setTenantId = (id: string) => {
    setTenantIdState(id);
    if (id) localStorage.setItem('tenant_id', id);
  };

  const apiFetch = useMemo(() => {
    return async (path: string, init: RequestInit = {}) => {
      const headers = new Headers(init.headers || {});
      if (token) headers.set('Authorization', `Bearer ${token}`);
      headers.set('X-Tenant-Id', tenantId);
      if (!headers.has('Content-Type') && init.body) headers.set('Content-Type', 'application/json');
      const res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
      return res;
    };
  }, [token, tenantId]);

  const value: AuthContextType = { token, tenantId, setToken, setTenantId, apiFetch, ready };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
