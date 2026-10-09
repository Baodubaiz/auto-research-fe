'use client';

import React, { useState } from 'react';
import { ProposalCard } from './ProposalCard';
import { ProposalItem } from '../../types/document-setup.type';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, X, ChevronRight } from 'lucide-react';

interface ProposalListProps {
  proposals: ProposalItem[];
  onSelectProposal: (id: string) => void;
  onUpdateProposal: (proposal: ProposalItem) => void;
  onDeleteProposal: (id: string) => void;
  onContinue: () => void;
}

export function ProposalList({
  proposals,
  onSelectProposal,
  onUpdateProposal,
  onDeleteProposal,
  onContinue,
}: ProposalListProps) {
  const [viewingProposal, setViewingProposal] = useState<ProposalItem | null>(null);
  const [editingProposal, setEditingProposal] = useState<ProposalItem | null>(null);
  const [editForm, setEditForm] = useState<ProposalItem | null>(null);

  const handleSelect = (proposal: ProposalItem) => {
    onSelectProposal(proposal.id);
  };

  const handleEdit = (proposal: ProposalItem) => {
    setEditingProposal(proposal);
    setEditForm({ ...proposal });
  };

  const handleSaveEdit = () => {
    if (editForm) {
      onUpdateProposal(editForm);
      setEditingProposal(null);
      setEditForm(null);
    }
  };

  const selectedCount = proposals.filter((p) => p.isSelected).length;

  if (!proposals.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-blue-600" />
          Generated Proposals ({proposals.length})
          {selectedCount > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-blue-600 text-white font-semibold">
              {selectedCount} selected
            </span>
          )}
        </h3>
        {selectedCount > 0 && (
          <Button size="sm" onClick={onContinue} className="gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white">
            Continue to Keywords
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {proposals.map((proposal) => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            onSelect={handleSelect}
            onViewDetails={setViewingProposal}
            onEdit={handleEdit}
            onDelete={onDeleteProposal}
          />
        ))}
      </div>

      {/* View Details Modal */}
      {viewingProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between p-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">{viewingProposal.title}</h2>
                <p className="text-xs text-slate-500 mt-0.5">Full Proposal Details</p>
              </div>
              <button
                onClick={() => setViewingProposal(null)}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-5 text-sm">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Problem Statement
                </p>
                <p className="text-slate-700 leading-relaxed">{viewingProposal.problemStatement}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Motivation
                </p>
                <p className="text-slate-700 leading-relaxed">{viewingProposal.motivation}</p>
              </div>
            </div>
            <div className="p-6 pt-0 flex justify-end gap-2 border-t border-slate-100 mt-2 pt-4">
              <Button variant="outline" size="sm" onClick={() => setViewingProposal(null)} className="border-slate-200 text-slate-700">
                Close
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  onSelectProposal(viewingProposal.id);
                  setViewingProposal(null);
                }}
              >
                Select This Proposal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingProposal && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between p-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Edit Proposal</h2>
                <p className="text-xs text-slate-500 mt-0.5">Customize this proposal before saving</p>
              </div>
              <button
                onClick={() => { setEditingProposal(null); setEditForm(null); }}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-title" className="text-xs font-bold text-slate-700">Title</Label>
                <Input
                  id="edit-title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="bg-white border-slate-200 text-slate-900 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-problem" className="text-xs font-bold text-slate-700">Problem Statement</Label>
                <Textarea
                  id="edit-problem"
                  rows={5}
                  value={editForm.problemStatement}
                  onChange={(e) => setEditForm({ ...editForm, problemStatement: e.target.value })}
                  className="bg-white border-slate-200 text-slate-900 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-motivation" className="text-xs font-bold text-slate-700">Motivation</Label>
                <Textarea
                  id="edit-motivation"
                  rows={4}
                  value={editForm.motivation}
                  onChange={(e) => setEditForm({ ...editForm, motivation: e.target.value })}
                  className="bg-white border-slate-200 text-slate-900 text-xs"
                />
              </div>
            </div>
            <div className="p-6 pt-3 flex justify-end gap-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => { setEditingProposal(null); setEditForm(null); }} className="border-slate-200 text-slate-700">
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveEdit} className="bg-blue-600 text-white hover:bg-blue-700">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
