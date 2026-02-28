import React, { createContext, useCallback, useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import {
  IUser,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from '../types';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  error: null,
  clearError: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!token;

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async (): Promise<void> => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axiosClient.get<IUser>('/auth/me');
        setUser(response.data);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setError(null);
      const response = await axiosClient.post<AuthResponse>(
        '/auth/login',
        credentials
      );
      const { user: userData, token: authToken } = response.data;

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(authToken);
      setUser(userData);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message =
        axiosError.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (
    credentials: RegisterCredentials
  ): Promise<void> => {
    try {
      setError(null);
      const response = await axiosClient.post<AuthResponse>(
        '/auth/register',
        credentials
      );
      const { user: userData, token: authToken } = response.data;

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(authToken);
      setUser(userData);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message =
        axiosError.response?.data?.message ||
        'Registration failed. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = useCallback((): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
