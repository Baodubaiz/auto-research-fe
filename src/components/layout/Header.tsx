'use client';

import React from 'react';
import { Breadcrumb } from './Breadcrumb';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Bell, Plus } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-10 shadow-xs">
      <div className="flex items-center gap-4">
        <Breadcrumb />
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Search */}
        <div className="relative w-64 hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search documents..."
            className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 focus-visible:bg-white text-slate-800"
          />
        </div>

        {/* Notifications */}
        <Button variant="outline" size="icon" className="h-9 w-9 relative border-slate-200 text-slate-600 hover:bg-slate-50">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
        </Button>

        {/* Create Document CTA */}
        <Button size="sm" className="gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs" asChild>
          <Link href="/documents/new/setup">
            <Plus className="w-4 h-4" />
            New Research
          </Link>
        </Button>
      </div>
    </header>
  );
}
