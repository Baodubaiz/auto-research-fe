'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProposalItem } from '../../types/document-setup.type';
import { Check, Edit3, Eye, Trash2 } from 'lucide-react';

interface ProposalCardProps {
  proposal: ProposalItem;
  onSelect: (proposal: ProposalItem) => void;
  onViewDetails: (proposal: ProposalItem) => void;
  onEdit: (proposal: ProposalItem) => void;
  onDelete: (proposalId: string) => void;
}

export function ProposalCard({
  proposal,
  onSelect,
  onViewDetails,
  onEdit,
  onDelete,
}: ProposalCardProps) {
  return (
    <Card
      className={`border-slate-200 bg-white shadow-xs transition-all ${
        proposal.isSelected
          ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/30'
          : 'hover:border-blue-300'
      }`}
    >
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-bold text-slate-900 leading-snug">
            {proposal.title}
          </CardTitle>
          <div className="flex items-center gap-1 shrink-0">
            {proposal.isSelected && (
              <Badge className="text-[10px] gap-1 bg-blue-600 text-white">
                <Check className="w-3 h-3" /> Selected
              </Badge>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(proposal.id)}
              className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
              title="Delete Proposal"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0 space-y-3 text-xs">
        <div>
          <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">
            Problem Statement
          </span>
          <p className="text-slate-600 line-clamp-3 leading-relaxed font-normal">
            {proposal.problemStatement}
          </p>
        </div>

        <div>
          <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">
            Motivation & Scope
          </span>
          <p className="text-slate-600 line-clamp-2 leading-relaxed font-normal">
            {proposal.motivation}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-3 flex items-center justify-between gap-2 border-t border-slate-100">
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewDetails(proposal)}
            className="h-8 text-xs gap-1 px-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <Eye className="w-3.5 h-3.5" /> View
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(proposal)}
            className="h-8 text-xs gap-1 px-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </Button>
        </div>
        <Button
          size="sm"
          variant={proposal.isSelected ? 'default' : 'outline'}
          onClick={() => onSelect(proposal)}
          className={`h-8 text-xs gap-1.5 font-semibold ${
            proposal.isSelected
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {proposal.isSelected ? (
            <>
              <Check className="w-3.5 h-3.5" /> Selected
            </>
          ) : (
            'Select Proposal'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
