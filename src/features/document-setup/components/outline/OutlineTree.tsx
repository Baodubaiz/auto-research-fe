'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { HeadingNode, OutlineData, SubheadingNode } from '../../types/document-setup.type';
import {
  ChevronUp, ChevronDown, Plus, Trash2, Sparkles,
  GitBranch, Check, ChevronRight, Save
} from 'lucide-react';

interface OutlineTreeProps {
  outline: OutlineData;
  onUpdateOutline: (outline: OutlineData) => void;
  onSaveOutline: () => void;
  onContinueToWrite: () => void;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function OutlineTree({ outline, onUpdateOutline, onSaveOutline, onContinueToWrite }: OutlineTreeProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<HeadingNode>>({});

  const updateHeadings = (headings: HeadingNode[]) => {
    onUpdateOutline({ ...outline, headings });
  };

  const moveHeading = (idx: number, dir: 'up' | 'down') => {
    const hs = [...outline.headings];
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= hs.length) return;
    [hs[idx], hs[swapIdx]] = [hs[swapIdx], hs[idx]];
    updateHeadings(hs);
  };

  const addHeading = () => {
    const newH: HeadingNode = {
      id: uid(),
      title: 'New Section',
      targetWordCount: 500,
      ratioPercent: 10,
      overview: '',
      subheadings: [],
      referenceIds: [],
    };
    updateHeadings([...outline.headings, newH]);
  };

  const removeHeading = (id: string) => {
    updateHeadings(outline.headings.filter((h) => h.id !== id));
  };

  const addSubheading = (headingId: string) => {
    const newSub: SubheadingNode = { id: uid(), title: 'New Subsection', targetWordCount: 200 };
    updateHeadings(
      outline.headings.map((h) =>
        h.id === headingId ? { ...h, subheadings: [...h.subheadings, newSub] } : h
      )
    );
  };

  const removeSubheading = (headingId: string, subId: string) => {
    updateHeadings(
      outline.headings.map((h) =>
        h.id === headingId
          ? { ...h, subheadings: h.subheadings.filter((s) => s.id !== subId) }
          : h
      )
    );
  };

  const startEdit = (h: HeadingNode) => {
    setEditingId(h.id);
    setEditData({ title: h.title, overview: h.overview, targetWordCount: h.targetWordCount });
  };

  const saveEdit = (headingId: string) => {
    updateHeadings(
      outline.headings.map((h) => (h.id === headingId ? { ...h, ...editData } : h))
    );
    setEditingId(null);
    setEditData({});
  };

  const totalWords = outline.headings.reduce((sum, h) => sum + (h.targetWordCount || 0), 0);

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-primary" />
              2.3 Outline Builder
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Build and customize your document outline. Drag & rearrange sections with word count targets.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className="text-xs gap-1">
              Total: {totalWords.toLocaleString()} words
            </Badge>
            <Select
              value={outline.researchType}
              onChange={(e) => onUpdateOutline({ ...outline, researchType: e.target.value })}
              className="text-xs h-8 w-44"
            >
              <option value="qualitative">Qualitative Research</option>
              <option value="quantitative">Quantitative Research</option>
              <option value="mixed">Mixed Methods</option>
              <option value="review">Literature Review</option>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Global Word Count */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border">
          <Label className="text-xs font-semibold whitespace-nowrap">Total Word Count Target:</Label>
          <Input
            type="number"
            value={outline.totalWordCount}
            onChange={(e) => onUpdateOutline({ ...outline, totalWordCount: Number(e.target.value) })}
            className="text-xs h-8 w-32"
            step={500}
          />
          <Button size="sm" variant="outline" onClick={addHeading} className="gap-1.5 text-xs ml-auto">
            <Plus className="w-3.5 h-3.5" /> Add Section
          </Button>
          <Button size="sm" variant="outline" onClick={addHeading} className="gap-1.5 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> AI Modify Outline
          </Button>
        </div>

        {/* Outline Tree */}
        <div className="space-y-3">
          {outline.headings.map((heading, idx) => (
            <div
              key={heading.id}
              className={`rounded-xl border transition-all ${
                editingId === heading.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30 bg-card'
              }`}
            >
              {/* Heading Header */}
              <div className="flex items-center gap-2 p-4 pb-3">
                <div className="w-6 h-6 rounded-md bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>

                {editingId === heading.id ? (
                  <div className="flex-1 min-w-0">
                    <Input
                      value={editData.title ?? heading.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="text-xs h-8 font-semibold mb-2"
                    />
                    <Textarea
                      value={editData.overview ?? heading.overview}
                      onChange={(e) => setEditData({ ...editData, overview: e.target.value })}
                      placeholder="Section overview / description..."
                      rows={2}
                      className="text-xs resize-none"
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <Label className="text-xs shrink-0">Word count:</Label>
                      <Input
                        type="number"
                        value={editData.targetWordCount ?? heading.targetWordCount}
                        onChange={(e) => setEditData({ ...editData, targetWordCount: Number(e.target.value) })}
                        className="text-xs h-7 w-24"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">{heading.title}</p>
                    {heading.overview && (
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{heading.overview}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] py-0">
                        {heading.targetWordCount.toLocaleString()} words
                      </Badge>
                      {heading.subheadings.length > 0 && (
                        <Badge variant="outline" className="text-[10px] py-0">
                          {heading.subheadings.length} subsections
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveHeading(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                  >
                    <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => moveHeading(idx, 'down')}
                    disabled={idx === outline.headings.length - 1}
                    className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>

                  {editingId === heading.id ? (
                    <button
                      onClick={() => saveEdit(heading.id)}
                      className="p-1.5 rounded hover:bg-green-100 text-green-600 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(heading)}
                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-muted-foreground hover:text-foreground text-xs font-medium px-2"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => removeHeading(heading.id)}
                    className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Subheadings */}
              {heading.subheadings.length > 0 && (
                <div className="mx-4 mb-3 space-y-1.5 pl-4 border-l-2 border-primary/20">
                  {heading.subheadings.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                        <span className="text-xs text-foreground truncate">{sub.title}</span>
                        <Badge variant="secondary" className="text-[10px] py-0 shrink-0">
                          {sub.targetWordCount}w
                        </Badge>
                      </div>
                      <button
                        onClick={() => removeSubheading(heading.id, sub.id)}
                        className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950 text-muted-foreground hover:text-destructive transition-colors ml-2"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Subheading */}
              <div className="px-4 pb-3">
                <button
                  onClick={() => addSubheading(heading.id)}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  <Plus className="w-3 h-3" /> Add Subsection
                </button>
              </div>
            </div>
          ))}
        </div>

        {outline.headings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-3">
            <GitBranch className="w-10 h-10 opacity-30" />
            <p className="text-sm">No outline generated yet.</p>
            <Button size="sm" variant="outline" className="gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> Generate Outline with AI
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        {outline.headings.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button size="sm" variant="outline" onClick={onSaveOutline} className="gap-1.5 text-xs">
              <Save className="w-3.5 h-3.5" /> Save Outline
            </Button>
            <Button size="sm" onClick={onContinueToWrite} className="gap-1.5 text-xs font-medium">
              Continue Writing
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

