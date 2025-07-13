'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Ensure user exists in our database
      fetch('/api/user/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch((error) => {
        console.error('Error ensuring user exists:', error);
      });
    }
  }, [user, isLoaded]);

  return <>{children}</>;
} 