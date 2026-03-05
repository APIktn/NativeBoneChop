import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';
import { tokenStorage } from '@/services/token.storage';

export type AuthUser = {
  userCode: string;
  email: string;
  userName: string | null;
  firstName: string;
  lastName: string;
  displayName?: string;
  address?: string | null;
  tel?: string | null;
  imageProfile?: string | null;
  imageUpload?: string | null;
};

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser) => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* restore session on startup */
  useEffect(() => {
    (async () => {
      try {
        const token = await tokenStorage.getAccessToken();
        if (token) {
          const res = await authService.me();
          const raw = res.data.user;
          // server /auth/me returns "profileImage", map to our "imageProfile"
          setUserState({ ...raw, imageProfile: raw.profileImage ?? raw.imageProfile });
        }
      } catch {
        await tokenStorage.clearTokens();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const setUser = (user: AuthUser) => setUserState(user);

  const updateUser = (updates: Partial<AuthUser>) =>
    setUserState((prev) => (prev ? { ...prev, ...updates } : prev));

  const logout = async () => {
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (refreshToken) await authService.logout(refreshToken);
    } catch {
      // ignore — still clear local state
    }
    await tokenStorage.clearTokens();
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
