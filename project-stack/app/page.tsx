'use client';

import { useProfile } from '@/lib/useProfile';
import Dashboard from '@/components/dashboard';
import { Spinner } from '@/components/ui/spinner';

export default function Home() {
  const store = useProfile();

  if (!store.ready || !store.profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-6 h-6" />
      </div>
    );
  }

  return <Dashboard store={store} />;
}
