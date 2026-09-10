import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Local fallback mode: check localStorage for saved user
      const savedUser = localStorage.getItem('ai_resume_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Unauthenticated guest user
        setUser(null);
      }
      setLoading(false);
    }
  }, []);

  const getToken = async () => {
    const jwtToken = localStorage.getItem('ai_jwt_token');
    if (jwtToken) return jwtToken;

    if (isSupabaseConfigured && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || 'demo-token';
    } else {
      return 'demo-token';
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('ai_jwt_token', data.token);
        localStorage.setItem('ai_resume_user', JSON.stringify(data.user));
        setUser(data.user);
        return data;
      }
    } catch (e) {}

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } else {
      const mockUser = {
        id: `user_${Date.now()}`,
        email,
        user_metadata: { full_name: email.split('@')[0] || 'User' }
      };
      setUser(mockUser);
      localStorage.setItem('ai_resume_user', JSON.stringify(mockUser));
      return { user: mockUser };
    }
  };

  const register = async (email, password, fullName) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('ai_jwt_token', data.token);
        localStorage.setItem('ai_resume_user', JSON.stringify(data.user));
        setUser(data.user);
        return data;
      }
    } catch (e) {}

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });
      if (error) throw error;
      return data;
    } else {
      const mockUser = {
        id: `user_${Date.now()}`,
        email,
        user_metadata: { full_name: fullName }
      };
      setUser(mockUser);
      localStorage.setItem('ai_resume_user', JSON.stringify(mockUser));
      return { user: mockUser };
    }
  };

  const loginWithGoogle = async () => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/builder`,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline'
          }
        }
      });
      if (error) throw error;
      return data;
    } else {
      // Local dev mode fallback for Google Sign-In with Gmail
      const userEmail = "user@gmail.com";
      const userName = "User";
      const mockUser = {
        id: `google_user_${Date.now()}`,
        email: userEmail,
        user_metadata: {
          full_name: userName,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`
        }
      };
      setUser(mockUser);
      localStorage.setItem('ai_resume_user', JSON.stringify(mockUser));
      return { user: mockUser };
    }
  };

  const loginWithSelectedGoogleAccount = async (account) => {
    const userEmail = account.email || 'user@gmail.com';
    const userName = account.name || userEmail.split('@')[0];
    const mockUser = {
      id: `google_user_${Date.now()}`,
      email: userEmail,
      user_metadata: {
        full_name: userName,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${account.avatarSeed || userName}`
      }
    };
    setUser(mockUser);
    localStorage.setItem('ai_resume_user', JSON.stringify(mockUser));
    return { user: mockUser };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('ai_resume_user');
      setUser(null);
    }
  };

  const resetPassword = async (email) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, register, loginWithGoogle, loginWithSelectedGoogleAccount, logout, resetPassword, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
