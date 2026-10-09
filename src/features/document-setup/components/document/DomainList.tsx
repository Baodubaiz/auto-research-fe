'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DomainItem } from '../../types/document-setup.type';
import { Layers, Plus, Trash2, X } from 'lucide-react';

interface DomainListProps {
  domains: DomainItem[];
  onAddDomain?: (domainName: string) => void;
  onRemoveDomain?: (domainId: string) => void;
  onAddSubdomain?: (domainId: string, subdomain: string) => void;
  onRemoveSubdomain?: (domainId: string, subdomain: string) => void;
}

export function DomainList({
  domains,
  onAddDomain,
  onRemoveDomain,
  onAddSubdomain,
  onRemoveSubdomain,
}: DomainListProps) {
  const [newDomainInput, setNewDomainInput] = useState('');
  const [activeDomainId, setActiveDomainId] = useState<string | null>(null);
  const [newSubdomainInput, setNewSubdomainInput] = useState('');

  const handleCreateDomain = () => {
    if (newDomainInput.trim() && onAddDomain) {
      onAddDomain(newDomainInput.trim());
      setNewDomainInput('');
    }
  };

  const handleCreateSubdomain = (domainId: string) => {
    if (newSubdomainInput.trim() && onAddSubdomain) {
      onAddSubdomain(domainId, newSubdomainInput.trim());
      setNewSubdomainInput('');
      setActiveDomainId(null);
    }
  };

  if (!domains.length && !onAddDomain) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-primary" />
          Domains & Subdomains ({domains.length})
        </h3>

        {/* Add Domain inline bar */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="New Domain name..."
            value={newDomainInput}
            onChange={(e) => setNewDomainInput(e.target.value)}
            className="h-8 text-xs w-48"
            onKeyDown={(e) => e.key === 'Enter' && handleCreateDomain()}
          />
          <Button size="sm" variant="outline" onClick={handleCreateDomain} className="h-8 text-xs gap-1 shrink-0">
            <Plus className="w-3.5 h-3.5" /> Add Domain
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {domains.map((domain) => (
          <Card key={domain.id} className="border-border shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold flex items-center justify-between text-foreground">
                <span className="truncate pr-2">{domain.domainName}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <Badge variant="secondary" className="text-[10px]">
                    {domain.subdomains.length} Subdomains
                  </Badge>
                  {onRemoveDomain && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onRemoveDomain(domain.id)}
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      title="Delete Domain"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium text-muted-foreground">Subdomains:</p>
                <button
                  onClick={() => setActiveDomainId(activeDomainId === domain.id ? null : domain.id)}
                  className="text-[11px] text-primary font-medium hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Subdomain
                </button>
              </div>

              {/* Subdomain Input Form */}
              {activeDomainId === domain.id && (
                <div className="flex gap-1.5 pt-1">
                  <Input
                    placeholder="Subdomain name..."
                    value={newSubdomainInput}
                    onChange={(e) => setNewSubdomainInput(e.target.value)}
                    className="h-7 text-xs"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateSubdomain(domain.id)}
                  />
                  <Button size="sm" onClick={() => handleCreateSubdomain(domain.id)} className="h-7 text-xs px-2">
                    Save
                  </Button>
                </div>
              )}

              {/* Subdomain Badges */}
              <div className="flex flex-wrap gap-1.5">
                {domain.subdomains.map((sub, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-xs py-1 px-2.5 gap-1.5 border-border bg-slate-50 dark:bg-slate-900"
                  >
                    <span>{sub}</span>
                    {onRemoveSubdomain && (
                      <button
                        onClick={() => onRemoveSubdomain(domain.id, sub)}
                        className="hover:text-destructive transition-colors"
                        title="Remove Subdomain"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
