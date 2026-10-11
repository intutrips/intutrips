import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext();

const ADMIN_EMAILS = ['intutrips@gmail.com', 'contato@intutrips.com'];
const COMERCIAL_EMAILS = ['comercial@intutrips.com'];

function getRoleFromEmail(email) {
  if (!email) return null;
  if (ADMIN_EMAILS.includes(email)) return 'admin';
  if (COMERCIAL_EMAILS.includes(email)) return 'comercial';
  return null;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        setIsLoadingAuth(true);
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          setUser(session.user);
          setIsAuthenticated(true);
          setUserRole(getRoleFromEmail(session.user?.email));
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        setAuthError(error);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      setUserRole(getRoleFromEmail(session?.user?.email));
      setIsLoadingAuth(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setIsLoadingAuth(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error);
      setIsLoadingAuth(false);
      throw error;
    }

    setUser(data.user);
    setIsAuthenticated(true);
    setUserRole(getRoleFromEmail(data.user?.email));
    setIsLoadingAuth(false);
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Erro ao fazer logout:', error);
    setUser(null);
    setIsAuthenticated(false);
    setUserRole(null);
  };

  const navigateToLogin = () => {
    // Para Supabase, redirecionamos para a nossa própria rota de login
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      userRole,
      isAdmin: userRole === 'admin',
      isComercial: userRole === 'comercial',
      // Mantendo compatibilidade com campos antigos da Base44 para não quebrar o layout
      isLoadingPublicSettings: false,
      appPublicSettings: { id: 'supabase' },
      authError,
      login,
      logout,
      navigateToLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
