'use client';

import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function LoadingWrapper({ children }: Props) {
  return <>{children}</>;
}