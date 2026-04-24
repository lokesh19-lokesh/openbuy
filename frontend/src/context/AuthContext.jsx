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
    let mounted = true;

    // Fail-safe timeout to prevent infinite loading screen
    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn("Auth initialization timed out after 5s. Forcing UI to load.");
        setLoading(false);
      }
    }, 5000);

    // Get initial session
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Auth init error:", error);
        }
        
        let currentUser = session?.user ?? null;
        if (currentUser && mounted) {
          currentUser = await refreshUserProfile(currentUser);
        }
        
        if (mounted) {
          setUser(currentUser);
          setLoading(false);
          clearTimeout(timeoutId);
        }
      } catch (err) {
        console.error("Auth initialization exception:", err);
        if (mounted) {
          setLoading(false);
          clearTimeout(timeoutId);
        }
      }
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Ignore INITIAL_SESSION as we handle it with getSession() above to avoid race conditions
      if (event === 'INITIAL_SESSION') return;
      
      // Run async logic detached from the auth event loop to prevent deadlocks
      const handleAuthChange = async () => {
        try {
          let currentUser = session?.user ?? null;
          if (currentUser) {
            currentUser = await refreshUserProfile(currentUser);
          }
          
          if (mounted) {
            setUser(currentUser);
            // Only stop loading, never start it on auth state change to avoid UI hangs
            setLoading(false);
          }
        } catch (err) {
          console.error("Auth state change exception:", err);
        }
      };

      handleAuthChange();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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
      {loading ? (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A3673]"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading session...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
