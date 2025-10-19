'use client';

import { ReactNode, useEffect, useState } from 'react';

interface HydrationSafeWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function HydrationSafeWrapper({ children, fallback = null }: HydrationSafeWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}