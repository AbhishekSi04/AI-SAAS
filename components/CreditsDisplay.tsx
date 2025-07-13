'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { CreditCard } from 'lucide-react';

export function CreditsDisplay() {
  const { user } = useUser();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/user/credits');
        if (response.ok) {
          const data = await response.json();
          setCredits(data.credits);
        }
      } catch (error) {
        console.error('Error fetching credits:', error);
      }
    };

    fetchCredits();
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <CreditCard className="h-4 w-4 text-primary" />
      <span className="text-sm font-medium">
        {credits !== null ? credits : '-'} credits
      </span>
    </div>
  );
} 