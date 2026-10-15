'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LoadingState } from '@/components/common/LoadingState';
import { useDocuments } from '@/features/document-setup/hooks/useDocuments';
import {
  Plus, FileText, Layers, BookOpen,
  ArrowRight, Calendar, Trash2, Edit3, X
} from 'lucide-react';

export default function DocumentsPage() {
  const { documents, isLoading, updateDocument, deleteDocument } = useDocuments();
  const [editingDoc, setEditingDoc] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editField, setEditField] = useState('');

  const handleStartEdit = (doc: any) => {
    setEditingDoc(doc);
    setEditTitle(doc.title || '');
    setEditField(doc.field || '');
  };

  const handleSaveEdit = async () => {
    if (!editingDoc) return;
    try {
      await updateDocument({
        id: editingDoc.id,
        dto: { title: editTitle.trim(), field: editField.trim() },
      });
      toast.success('Document updated!');
      setEditingDoc(null);
    } catch (err: any) {
      toast.error('Failed to update document');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title || 'this document'}"?`)) {
      try {
        await deleteDocument(id);
        toast.success('Document deleted!');
      } catch (err: any) {
        toast.error('Failed to delete document');
      }
    }
  };

  if (isLoading) {
    return <LoadingState message="Fetching research documents..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Research Documents</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage all your AI-assisted research projects
          </p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs font-medium" asChild>
          <Link href="/documents/new/setup">
            <Plus className="w-4 h-4" /> New Research Project
          </Link>
        </Button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* Create New Card */}
        <Link href="/documents/new/setup" className="group">
          <Card className="h-full border-dashed border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer shadow-none">
            <CardContent className="flex flex-col items-center justify-center gap-3 p-8 text-center h-full min-h-[220px]">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">New Research Project</p>
                <p className="text-xs text-muted-foreground mt-0.5">Start from domain → proposal → outline</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Document Cards from API */}
        {documents.map((doc: any) => (
          <Card key={doc.id} className="border-border shadow-sm hover:border-primary/30 hover:shadow-md transition-all flex flex-col justify-between">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <StatusBadge status={doc.status || 'draft'} />
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1 mr-1">
                    <Calendar className="w-3 h-3" />
                    {doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString() : 'Today'}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleStartEdit(doc)}
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    title="Edit Document"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(doc.id, doc.title)}
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    title="Delete Document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-sm font-bold text-foreground leading-snug line-clamp-2">
                {doc.title || 'Untitled Research Project'}
              </CardTitle>
              {doc.field && (
                <Badge variant="secondary" className="text-[10px] mt-1 w-fit">{doc.field}</Badge>
              )}
            </CardHeader>

            <CardContent className="px-5 py-0 space-y-3 flex-1">
              <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-2">
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3 text-purple-500" />
                  {Array.isArray(doc.domains) ? doc.domains.length : 0} domains
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-green-500" />
                  {doc.language || 'Vietnamese'}
                </span>
              </div>
            </CardContent>

            <CardFooter className="p-5 pt-4 flex gap-2 border-t border-border/50 mt-4">
              <Button size="sm" variant="outline" className="flex-1 text-xs gap-1" asChild>
                <Link href={`/documents/${doc.id}/setup`}>
                  <Layers className="w-3.5 h-3.5" /> Setup
                </Link>
              </Button>
              <Button size="sm" className="flex-1 text-xs gap-1 font-medium" asChild>
                <Link href={`/documents/${doc.id}/write`}>
                  Write Report <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-sm font-bold text-foreground">Edit Document</h3>
              <button onClick={() => setEditingDoc(null)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <Label className="text-xs">Document Title</Label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Research Field</Label>
                <Input
                  value={editField}
                  onChange={(e) => setEditField(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button variant="outline" size="sm" onClick={() => setEditingDoc(null)}>Cancel</Button>
                <Button size="sm" onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
