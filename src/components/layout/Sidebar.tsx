'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { useAuth } from '@/providers/AuthProvider';
import { useAuthActions } from '@/features/auth/hooks/useAuthActions';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  LogOut,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface SidebarItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}

function SidebarItem({ href, icon: Icon, label, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
        active
          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className={cn('w-4 h-4', active ? 'text-white' : 'text-slate-400')} />
        <span>{label}</span>
      </div>
      {active && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { logout, isLoggingOut } = useAuthActions();

  const navItems = [
    {
      href: ROUTES.DASHBOARD.HOME,
      icon: LayoutDashboard,
      label: 'Overview',
      exact: true,
    },
    {
      href: ROUTES.DASHBOARD.DOCUMENTS,
      icon: FileText,
      label: 'Documents',
      exact: false,
    },
    {
      href: ROUTES.DASHBOARD.CHATBOT,
      icon: MessageSquare,
      label: 'AI Chatbot',
      exact: false,
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col h-screen sticky top-0 shadow-sm">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-base tracking-tight text-slate-900 leading-none">
            AutoResearch
          </h2>
          <span className="text-[11px] font-medium text-slate-500">
            AI Academic Workspace
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3.5 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Main Menu
        </div>
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && item.href !== '/';
          return (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={isActive}
            />
          );
        })}
      </div>

      {/* User Footer */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/80">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
            {user?.fullName?.[0] || user?.userName?.[0] || user?.email?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate text-slate-800">
              {user?.fullName || user?.userName || 'Researcher'}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {user?.email || 'user@research.ai'}
            </p>
          </div>
        </div>
        <button
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
