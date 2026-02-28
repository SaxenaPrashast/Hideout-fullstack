import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

interface UseAuthReturn {
  user: ReturnType<typeof useContext<typeof AuthContext>>['user'];
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: ReturnType<typeof useContext<typeof AuthContext>>['login'];
  register: ReturnType<typeof useContext<typeof AuthContext>>['register'];
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
