'use client';

import React, { useState } from 'react';
import { ReferenceCard } from './ReferenceCard';
import { ReferenceItem } from '../../types/document-setup.type';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { X, ChevronRight, BookOpen, Plus } from 'lucide-react';

interface ReferenceListProps {
  references: ReferenceItem[];
  onToggleReference: (id: string) => void;
  onAddCustomReference?: (ref: Partial<ReferenceItem>) => void;
  onDeleteReference?: (id: string) => void;
  onContinueToOutline: () => void;
}

export function ReferenceList({
  references,
  onToggleReference,
  onAddCustomReference,
  onDeleteReference,
  onContinueToOutline,
}: ReferenceListProps) {
  const [viewingRef, setViewingRef] = useState<ReferenceItem | null>(null);
  const [isAddingRef, setIsAddingRef] = useState(false);
  const [newRefForm, setNewRefForm] = useState<Partial<ReferenceItem>>({
    title: '',
    authors: '',
    journal: '',
    year: 2024,
    openAccess: true,
    url: '',
    abstract: '',
  });

  const handleCreateReferenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRefForm.title?.trim() && onAddCustomReference) {
      onAddCustomReference(newRefForm);
      setIsAddingRef(false);
      setNewRefForm({ title: '', authors: '', journal: '', year: 2024, openAccess: true, url: '', abstract: '' });
    }
  };

  const selectedRefs = references.filter((r) => r.isSelected);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-primary" />
          Search Results ({references.length} papers)
          {selectedRefs.length > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-primary text-primary-foreground font-medium">
              {selectedRefs.length} selected
            </span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          {onAddCustomReference && (
            <Button size="sm" variant="outline" onClick={() => setIsAddingRef(true)} className="gap-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" /> Add Reference
            </Button>
          )}
          {selectedRefs.length > 0 && (
            <Button size="sm" onClick={onContinueToOutline} className="gap-1.5 text-xs font-medium">
              Continue to Outline
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Selected References Summary */}
      {selectedRefs.length > 0 && (
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-[11px] font-semibold text-primary mb-2">Selected References for Report:</p>
          <div className="flex flex-wrap gap-1.5">
            {selectedRefs.map((r) => (
              <Badge key={r.id} variant="outline" className="text-[10px] border-primary/50 gap-1.5 py-0.5 px-2">
                {r.title.slice(0, 35)}...
                <button onClick={() => onToggleReference(r.id)}>
                  <X className="w-2.5 h-2.5 hover:text-destructive" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {references.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-border rounded-xl space-y-2">
          <p className="text-xs text-muted-foreground">No references found yet. Search papers or click &quot;Add Reference&quot; to insert one manually.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {references.map((ref) => (
            <ReferenceCard
              key={ref.id}
              reference={ref}
              onSelect={(r) => onToggleReference(r.id)}
              onViewAbstract={setViewingRef}
              onDelete={onDeleteReference}
            />
          ))}
        </div>
      )}

      {/* Add Custom Reference Modal */}
      {isAddingRef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between p-6 pb-4 border-b border-border">
              <div>
                <h2 className="text-base font-bold text-foreground">Add Custom Reference</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Enter academic paper details to save to database</p>
              </div>
              <button onClick={() => setIsAddingRef(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <form onSubmit={handleCreateReferenceSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <Label htmlFor="ref-title" className="text-xs">Title</Label>
                <Input
                  id="ref-title"
                  placeholder="Paper title..."
                  value={newRefForm.title}
                  onChange={(e) => setNewRefForm({ ...newRefForm, title: e.target.value })}
                  required
                  className="text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="ref-authors" className="text-xs">Authors</Label>
                  <Input
                    id="ref-authors"
                    placeholder="e.g. John Doe, Jane Smith"
                    value={newRefForm.authors}
                    onChange={(e) => setNewRefForm({ ...newRefForm, authors: e.target.value })}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="ref-journal" className="text-xs">Journal / Conference</Label>
                  <Input
                    id="ref-journal"
                    placeholder="e.g. IEEE Access"
                    value={newRefForm.journal}
                    onChange={(e) => setNewRefForm({ ...newRefForm, journal: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="ref-year" className="text-xs">Year</Label>
                  <Input
                    id="ref-year"
                    type="number"
                    value={newRefForm.year}
                    onChange={(e) => setNewRefForm({ ...newRefForm, year: Number(e.target.value) })}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="ref-url" className="text-xs">URL / DOI</Label>
                  <Input
                    id="ref-url"
                    placeholder="https://doi.org/..."
                    value={newRefForm.url}
                    onChange={(e) => setNewRefForm({ ...newRefForm, url: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="ref-abstract" className="text-xs">Abstract</Label>
                <Textarea
                  id="ref-abstract"
                  rows={4}
                  placeholder="Abstract summary..."
                  value={newRefForm.abstract}
                  onChange={(e) => setNewRefForm({ ...newRefForm, abstract: e.target.value })}
                  className="text-xs"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id="ref-oa"
                  checked={newRefForm.openAccess}
                  onCheckedChange={(checked) => setNewRefForm({ ...newRefForm, openAccess: checked })}
                />
                <label htmlFor="ref-oa" className="text-xs font-medium cursor-pointer">Open Access</label>
              </div>
              <div className="p-6 pt-2 flex justify-end gap-2 border-t border-border -mx-6 -mb-6 mt-4">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsAddingRef(false)}>Cancel</Button>
                <Button size="sm" type="submit">Create Reference</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Abstract Drawer */}
      {viewingRef && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
          <div className="bg-card border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between p-6 pb-4 border-b border-border sticky top-0 bg-card">
              <div className="flex-1 min-w-0 pr-4">
                <h2 className="text-sm font-bold text-foreground leading-snug">{viewingRef.title}</h2>
                <p className="text-xs text-muted-foreground mt-1">{viewingRef.authors} · {viewingRef.journal} · {viewingRef.year}</p>
              </div>
              <button onClick={() => setViewingRef(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Abstract</p>
                <p className="text-sm text-foreground leading-relaxed">{viewingRef.abstract}</p>
              </div>
            </div>
            <div className="p-6 pt-0 flex justify-end gap-2 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setViewingRef(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
