'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  FileText,
  BookOpen,
  Sparkles,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';

export default function DashboardPage() {
  // Mock recent documents data for UI demonstration
  const recentDocuments = [
    {
      id: 'doc-001',
      title: 'Digital Transformation in Commercial Banking',
      domain: 'Finance / Banking',
      updatedAt: '2026-09-16 09:15',
      status: 'finished',
      progress: 100,
    },
    {
      id: 'doc-002',
      title: 'AI-driven Credit Risk Assessment Models',
      domain: 'Fintech / Machine Learning',
      updatedAt: '2026-09-15 14:30',
      status: 'processing',
      progress: 65,
    },
    {
      id: 'doc-003',
      title: 'Blockchain Technology in Supply Chain Management',
      domain: 'Logistics / Supply Chain',
      updatedAt: '2026-09-14 11:20',
      status: 'pending',
      progress: 20,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary-foreground border border-primary/30">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            AI Workspace Ready
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Research & Report Management
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Automate academic proposal generation, reference search, report writing, data analysis, and slide generation with AI.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" variant="secondary" className="gap-2 text-xs" asChild>
            <Link href="/documents">
              <BookOpen className="w-4 h-4" />
              View Documents
            </Link>
          </Button>
          <Button size="sm" className="gap-2 text-xs" asChild>
            <Link href="/documents/new/setup">
              <Plus className="w-4 h-4" />
              New Proposal
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Proposals
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-600 font-medium">+2</span> this week
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Reports Completed
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-950 text-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-[11px] text-muted-foreground mt-1 text-slate-500">
              67% completion rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Papers Searched
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-[11px] text-muted-foreground mt-1 text-slate-500">
              Across Open Access sources
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active AI Tasks
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-[11px] text-muted-foreground mt-1 text-amber-600 font-medium">
              Writing report section...
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Documents Table */}
        <Card className="lg:col-span-2 border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Recent Research Documents</CardTitle>
              <CardDescription className="text-xs">
                Your latest proposals, reference outlines, and generated reports
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="text-xs gap-1" asChild>
              <Link href="/documents">
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 border-y border-border text-muted-foreground uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-3">Document Title</th>
                    <th className="px-4 py-3">Domain</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Updated</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">
                        <Link
                          href={`/documents/${doc.id}`}
                          className="hover:text-primary transition-colors flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="truncate max-w-xs">{doc.title}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{doc.domain}</td>
                      <td className="px-4 py-4">
                        <StatusBadge status={doc.status} />
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{doc.updatedAt}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                          <Link href={`/documents/${doc.id}/setup`}>Open</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Right 1 Col: Quick Workflow Shortcuts */}
        <div className="space-y-4">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Research Workflows</CardTitle>
              <CardDescription className="text-xs">
                Select a stage to continue your research process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="/documents/new/setup"
                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground group-hover:text-primary">
                    Document Setup
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    Domain, Proposals, Keywords & References
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </Link>

              <Link
                href="/documents/doc-001/write"
                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-950 text-green-600 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground group-hover:text-primary">
                    Write Report
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    Report Editor, Data Analysis & Slides
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </Link>

              <Link
                href="/chatbot"
                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground group-hover:text-primary">
                    AI Chatbot & Writer
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    General, In-Doc, Writer mode chat
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

