import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      setUser(currentUser ? mapSupabaseUser(currentUser) : null);
      setLoading(false);
    };

    bootstrapAuth();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser ? mapSupabaseUser(currentUser) : null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data?.user) {
      throw new Error(error?.message || 'Email ou mot de passe incorrect');
    }

    const userData = mapSupabaseUser(data.user);
    setUser(userData);
    return userData;
  };

  const register = async (email, password, nomComplet) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nom_complet: nomComplet
        }
      }
    });

    if (error) {
      throw new Error(error.message || 'Erreur lors de la création du compte');
    }

    if (!data?.user) {
      throw new Error('Compte créé, veuillez vérifier votre email pour activer le compte');
    }

    const userData = mapSupabaseUser(data.user);

    // Keep this profile table in sync with auth metadata.
    const { error: profileError } = await supabase
      .from('conseiller_profiles')
      .upsert({
        user_id: data.user.id,
        email,
        nom_complet: nomComplet
      })
      .select('user_id')
      .single();

    if (profileError && profileError.code !== '42501') {
      throw profileError;
    }

    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const newUserData = { ...(user || {}), ...updatedData };
    setUser(newUserData);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

const mapSupabaseUser = (authUser) => ({
  id: authUser.id,
  email: authUser.email,
  nom_complet: authUser.user_metadata?.nom_complet || authUser.email?.split('@')[0] || '',
  created_at: authUser.created_at
});
