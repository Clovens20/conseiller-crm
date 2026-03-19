import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';

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
    // Check for existing session on mount
    const storedUser = localStorage.getItem('crm_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Get user from database
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !users) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, users.password_hash);
    if (!isValid) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const userData = {
      id: users.id,
      email: users.email,
      nom_complet: users.nom_complet || users.email.split('@')[0],
      created_at: users.created_at
    };

    localStorage.setItem('crm_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (email, password, nomComplet) => {
    // Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      throw new Error('Cet email est déjà utilisé');
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email,
        password_hash,
        nom_complet: nomComplet
      })
      .select()
      .single();

    if (error) {
      throw new Error('Erreur lors de la création du compte');
    }

    const userData = {
      id: newUser.id,
      email: newUser.email,
      nom_complet: newUser.nom_complet,
      created_at: newUser.created_at
    };

    localStorage.setItem('crm_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('crm_user');
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    localStorage.setItem('crm_user', JSON.stringify(newUserData));
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
