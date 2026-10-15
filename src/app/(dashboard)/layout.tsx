'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/providers/AuthProvider';
import { LoadingState } from '@/components/common/LoadingState';
import { ROUTES } from '@/lib/constants';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.AUTH.LOGIN);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <LoadingState message="Checking authentication..." />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto bg-slate-50">{children}</main>
      </div>
    </div>
  );
}
