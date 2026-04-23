import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to refresh the user profile (and their custom role)
  const refreshUserProfile = async (authUser) => {
    if (!authUser) return null;
    const { data, error } = await supabase.from('users').select('*').eq('id', authUser.id).single();
    if (error) {
      console.error('Error fetching user profile', error);
      return authUser;
    }
    return { ...authUser, profile: data };
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        let currentUser = session?.user ?? null;
        if (currentUser) {
          currentUser = await refreshUserProfile(currentUser);
        }
        setUser(currentUser);
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        setLoading(true);
        let currentUser = session?.user ?? null;
        if (currentUser) {
          currentUser = await refreshUserProfile(currentUser);
        }
        setUser(currentUser);
      } catch (err) {
        console.error("Auth state change error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signup = async (email, password, name, role = 'customer') => {
    return await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } } // stored in raw_user_meta_data
    });
  };

  const logout = async () => {
    return await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
