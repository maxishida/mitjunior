'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase.config';
import { User } from 'firebase/auth';

interface AuthContextType {
  user: User | null | undefined;
  loading: boolean;
  error: Error | undefined;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, error: undefined });

function AuthProviderInner({ children }: { children: ReactNode }) {
  const [user, loading, error] = useAuthState(auth);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state while checking for client-side
  if (!isClient) {
    return (
      <AuthContext.Provider value={{ user: null, loading: true, error: undefined }} suppressHydrationWarning>
        {children}
      </AuthContext.Provider>
    );
  }

  return <AuthProviderInner>{children}</AuthProviderInner>;
};

export const useAuth = () => useContext(AuthContext);
