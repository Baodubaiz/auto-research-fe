'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { ROUTES } from '@/lib/constants';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.DASHBOARD.HOME);
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 text-slate-900 p-4">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-blue-600">
          Auto Research
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Academic Research & Automated Report Workspace
        </p>
      </div>
      {children}
    </div>
  );
}
