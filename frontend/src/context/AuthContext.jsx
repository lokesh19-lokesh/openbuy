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
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      let currentUser = session?.user ?? null;
      if (currentUser) {
        currentUser = await refreshUserProfile(currentUser);
      }
      setUser(currentUser);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      let currentUser = session?.user ?? null;
      if (currentUser) {
        currentUser = await refreshUserProfile(currentUser);
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signup = async (email, password, name) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } } // stored in raw_user_meta_data
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
