'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';
import { KeywordSetupPayload } from '../../types/document-setup.type';
import { Search, X, Plus, ChevronRight } from 'lucide-react';

interface KeywordFormProps {
  onGenerateKeywords: () => void;
  onSearchPapers: (payload: KeywordSetupPayload) => void;
  isGenerating?: boolean;
}

export function KeywordForm({ onGenerateKeywords, onSearchPapers, isGenerating = false }: KeywordFormProps) {
  const [keywordsMain, setKeywordsMain] = useState<string[]>(['digital banking', 'fintech']);
  const [keywordsSub, setKeywordsSub] = useState<string[]>(['AI', 'machine learning']);
  const [keywordInput, setKeywordInput] = useState('');
  const [keywordSubInput, setKeywordSubInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [country, setCountry] = useState('');
  const [yearFrom, setYearFrom] = useState(2018);
  const [yearTo, setYearTo] = useState(2025);
  const [onlyOpenAccess, setOnlyOpenAccess] = useState(false);

  const addKeyword = (type: 'main' | 'sub') => {
    if (type === 'main' && keywordInput.trim()) {
      setKeywordsMain([...keywordsMain, keywordInput.trim()]);
      setKeywordInput('');
    } else if (type === 'sub' && keywordSubInput.trim()) {
      setKeywordsSub([...keywordsSub, keywordSubInput.trim()]);
      setKeywordSubInput('');
    }
  };

  const removeKeyword = (type: 'main' | 'sub', idx: number) => {
    if (type === 'main') setKeywordsMain(keywordsMain.filter((_, i) => i !== idx));
    else setKeywordsSub(keywordsSub.filter((_, i) => i !== idx));
  };

  const handleSearch = () => {
    onSearchPapers({
      keywordsMain,
      keywordsSub,
      searchQuery,
      country,
      yearFrom,
      yearTo,
      onlyOpenAccess,
      selectedDomains: [],
    });
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          2.2 Keywords & Reference Search
        </CardTitle>
        <CardDescription className="text-xs">
          Generate keywords from your proposal, then search for academic papers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Keywords Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Keywords */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold">Keywords chính</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add main keyword..."
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addKeyword('main')}
                className="text-xs"
              />
              <Button size="sm" variant="outline" onClick={() => addKeyword('main')} className="shrink-0 px-2.5">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {keywordsMain.map((k, i) => (
                <Badge key={i} variant="secondary" className="gap-1.5 py-1 px-2.5 text-xs">
                  {k}
                  <button onClick={() => removeKeyword('main', i)}>
                    <X className="w-3 h-3 hover:text-destructive" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Sub Keywords */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold">Keywords phụ</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add sub keyword..."
                value={keywordSubInput}
                onChange={(e) => setKeywordSubInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addKeyword('sub')}
                className="text-xs"
              />
              <Button size="sm" variant="outline" onClick={() => addKeyword('sub')} className="shrink-0 px-2.5">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {keywordsSub.map((k, i) => (
                <Badge key={i} variant="outline" className="gap-1.5 py-1 px-2.5 text-xs">
                  {k}
                  <button onClick={() => removeKeyword('sub', i)}>
                    <X className="w-3 h-3 hover:text-destructive" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Search Filters */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border space-y-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Search Filters</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2 lg:col-span-2">
              <Label className="text-xs">Query tìm kiếm (override)</Label>
              <Input
                placeholder="Custom search query..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Quốc gia</Label>
              <Select value={country} onChange={(e) => setCountry(e.target.value)} className="text-xs">
                <option value="">All Countries</option>
                <option value="VN">Vietnam</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="SG">Singapore</option>
                <option value="AU">Australia</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Năm xuất bản</Label>
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  value={yearFrom}
                  onChange={(e) => setYearFrom(Number(e.target.value))}
                  className="text-xs text-center"
                  min={1990}
                  max={2025}
                />
                <span className="text-muted-foreground text-xs shrink-0">–</span>
                <Input
                  type="number"
                  value={yearTo}
                  onChange={(e) => setYearTo(Number(e.target.value))}
                  className="text-xs text-center"
                  min={1990}
                  max={2025}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="openAccess"
              checked={onlyOpenAccess}
              onCheckedChange={setOnlyOpenAccess}
            />
            <label htmlFor="openAccess" className="text-xs font-medium text-foreground cursor-pointer">
              Chỉ lấy Open Access papers
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2.5 pt-2 border-t border-border">
          <Button
            size="sm"
            variant="outline"
            onClick={onGenerateKeywords}
            disabled={isGenerating}
            className="gap-1.5 text-xs font-medium"
          >
            <ChevronRight className="w-3.5 h-3.5 text-primary" />
            Generate Keywords from Proposal
          </Button>
          <Button
            size="sm"
            onClick={handleSearch}
            disabled={isGenerating}
            className="gap-1.5 text-xs font-medium"
          >
            <Search className="w-3.5 h-3.5" />
            Search Papers
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleSearch}
            disabled={isGenerating}
            className="gap-1.5 text-xs font-medium"
          >
            <Search className="w-3.5 h-3.5 text-purple-500" />
            Search from Uploaded Documents
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

