"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react'

interface Props {
  children: any;
}

export default function Providers({ children }: Props) {
  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  )
}

