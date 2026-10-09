'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadedDocItem } from '../../types/document-setup.type';
import { FileText, RefreshCw, Trash2, Eye, Loader2, CheckCircle2, AlertCircle, Upload, Plus, X } from 'lucide-react';

interface UploadedDocumentListProps {
  documents: UploadedDocItem[];
  onUpload?: (data: { fileName: string; title?: string }) => void;
  onProcess: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (doc: UploadedDocItem) => void;
}

function ProcessingStatusBadge({ status }: { status: UploadedDocItem['processingStatus'] }) {
  switch (status) {
    case 'uploaded':
      return <Badge variant="outline" className="text-[10px] border-slate-400 text-slate-600">Uploaded</Badge>;
    case 'processing':
      return (
        <Badge variant="outline" className="text-[10px] border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950 gap-1">
          <Loader2 className="w-2.5 h-2.5 animate-spin" /> Processing
        </Badge>
      );
    case 'embedded':
      return (
        <Badge variant="outline" className="text-[10px] border-green-500 text-green-600 bg-green-50 dark:bg-green-950 gap-1">
          <CheckCircle2 className="w-2.5 h-2.5" /> Embedded
        </Badge>
      );
    case 'error':
      return (
        <Badge variant="destructive" className="text-[10px] gap-1">
          <AlertCircle className="w-2.5 h-2.5" /> Error
        </Badge>
      );
    default:
      return null;
  }
}

export function UploadedDocumentList({ documents, onUpload, onProcess, onDelete, onView }: UploadedDocumentListProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [title, setTitle] = useState('');

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fileName.trim() && onUpload) {
      onUpload({ fileName: fileName.trim(), title: title.trim() || undefined });
      setFileName('');
      setTitle('');
      setIsUploading(false);
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              2.4 User Uploaded Documents
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Manage your personal reference documents for embedding and search.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {documents.filter((d) => d.isEmbedded).length}/{documents.length} Embedded
            </Badge>
            {onUpload && (
              <Button size="sm" onClick={() => setIsUploading(true)} className="gap-1.5 text-xs font-medium">
                <Plus className="w-3.5 h-3.5" /> Upload File
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Modal */}
        {isUploading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h3 className="text-sm font-bold text-foreground">Upload Reference File</h3>
                <button onClick={() => setIsUploading(false)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <form onSubmit={handleUploadSubmit} className="p-5 space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="upload-fileName" className="text-xs">File Name</Label>
                  <Input
                    id="upload-fileName"
                    placeholder="e.g. research_paper.pdf"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    required
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="upload-title" className="text-xs">Title (Optional)</Label>
                  <Input
                    id="upload-title"
                    placeholder="e.g. Financial Market Analysis 2024"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <Button variant="outline" size="sm" type="button" onClick={() => setIsUploading(false)}>Cancel</Button>
                  <Button size="sm" type="submit">Upload Document</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-3">
            <FileText className="w-10 h-10 opacity-30" />
            <p className="text-sm">No documents uploaded yet.</p>
            <p className="text-xs text-muted-foreground max-w-sm">
              Upload your research papers, reports, or any documents to use as custom references in this project.
            </p>
            {onUpload && (
              <Button size="sm" variant="outline" onClick={() => setIsUploading(true)} className="gap-1.5 text-xs">
                <Plus className="w-3.5 h-3.5" /> Upload First Document
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 border-y border-border text-muted-foreground uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">File / Title</th>
                  <th className="px-3 py-3">Size</th>
                  <th className="px-3 py-3">Processing</th>
                  <th className="px-3 py-3">Embedded</th>
                  <th className="px-3 py-3">Uploaded</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate max-w-[200px]">{doc.title || doc.fileName}</p>
                          <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">{doc.fileName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{doc.fileSize || '—'}</td>
                    <td className="px-3 py-3">
                      <ProcessingStatusBadge status={doc.processingStatus} />
                    </td>
                    <td className="px-3 py-3">
                      {doc.isEmbedded ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{doc.uploadedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onView(doc)}
                          className="h-7 text-[11px] gap-1 px-2 text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="w-3 h-3" /> View
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onProcess(doc.id)}
                          disabled={doc.processingStatus === 'processing'}
                          className="h-7 text-[11px] gap-1 px-2 text-muted-foreground hover:text-foreground"
                        >
                          <RefreshCw className="w-3 h-3" />
                          {doc.processingStatus === 'embedded' ? 'Re-process' : 'Process'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(doc.id)}
                          className="h-7 text-[11px] gap-1 px-2 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
