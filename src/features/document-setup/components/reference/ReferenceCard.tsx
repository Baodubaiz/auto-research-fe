'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ReferenceItem } from '../../types/document-setup.type';
import { ExternalLink, Eye, BookOpen, CheckCircle2, MinusCircle, Trash2 } from 'lucide-react';

interface ReferenceCardProps {
  reference: ReferenceItem;
  onSelect: (ref: ReferenceItem) => void;
  onViewAbstract: (ref: ReferenceItem) => void;
  onDelete?: (refId: string) => void;
}

export function ReferenceCard({ reference, onSelect, onViewAbstract, onDelete }: ReferenceCardProps) {
  return (
    <Card
      className={`border-border shadow-sm transition-all ${
        reference.isSelected
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
          : 'hover:border-primary/30'
      }`}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">
              {reference.title}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
              {reference.authors}
            </p>
          </div>
          {onDelete && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(reference.id)}
              className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
              title="Delete Reference Record"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {reference.openAccess && (
            <Badge variant="outline" className="text-[10px] border-green-500 text-green-600 bg-green-50 dark:bg-green-950 py-0.5 px-2">
              Open Access
            </Badge>
          )}
          {reference.downloadedStatus === 'downloaded' && (
            <Badge variant="outline" className="text-[10px] border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950 py-0.5 px-2">
              Downloaded
            </Badge>
          )}
          {reference.journal && (
            <Badge variant="secondary" className="text-[10px] py-0.5 px-2 truncate max-w-[150px]">
              {reference.journal}
            </Badge>
          )}
          <span className="text-[11px] text-muted-foreground ml-auto">{reference.year}</span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onViewAbstract(reference)}
              className="h-7 text-[11px] gap-1 px-2 text-muted-foreground hover:text-foreground"
            >
              <Eye className="w-3 h-3" /> Abstract
            </Button>
            {reference.url && (
              <a
                href={reference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-7 items-center gap-1 px-2 rounded-md text-[11px] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <ExternalLink className="w-3 h-3" /> Open
              </a>
            )}
          </div>
          <Button
            size="sm"
            variant={reference.isSelected ? 'default' : 'outline'}
            onClick={() => onSelect(reference)}
            className="h-7 text-[11px] gap-1 px-2.5"
          >
            {reference.isSelected ? (
              <>
                <MinusCircle className="w-3 h-3" /> Remove
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3" /> Select
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
