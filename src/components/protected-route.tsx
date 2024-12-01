'use client'

import { useAuth } from '@/contexts/AuthContext';
import { Code } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className='grid h-screen place-items-center'>
        <Code className='animate-spin' />
    </div>;
  }

  return user ? <>{children}</> : null;
}

