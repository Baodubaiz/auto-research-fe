'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { TopicSetupPayload } from '../../types/document-setup.type';
import { Sparkles, Layers, ListFilter, PlusCircle, Blend } from 'lucide-react';

interface DocumentFormProps {
  onGenerateDomains: (data: TopicSetupPayload) => void;
  onGenerateSubdomains: () => void;
  onGenerateTitles: () => void;
  onAddCustomTitle: (title: string) => void;
  onMixProposals: () => void;
  isGenerating?: boolean;
}

export function DocumentForm({
  onGenerateDomains,
  onGenerateSubdomains,
  onGenerateTitles,
  onAddCustomTitle,
  onMixProposals,
  isGenerating = false,
}: DocumentFormProps) {
  const [field, setField] = useState('Finance & Banking');
  const [language, setLanguage] = useState('Vietnamese');
  const [documentType, setDocumentType] = useState('Research Report');
  const [numberOfDomains, setNumberOfDomains] = useState(3);
  const [numberOfSubdomains, setNumberOfSubdomains] = useState(3);
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  const [customTitle, setCustomTitle] = useState('');

  const handleGenerateDomainsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateDomains({
      field,
      language,
      documentType,
      numberOfDomains,
      numberOfSubdomains,
      webSearchEnabled,
    });
  };

  const handleAddTitleSubmit = () => {
    if (customTitle.trim()) {
      onAddCustomTitle(customTitle.trim());
      setCustomTitle('');
    }
  };

  return (
    <Card className="border-slate-200 bg-white shadow-xs overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50/80 to-indigo-50/40 border-b border-slate-100 p-5">
        <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          2.1 Topic Setup & Proposal Generator
        </CardTitle>
        <CardDescription className="text-xs text-slate-500 mt-1">
          Nhập lĩnh vực nghiên cứu, ngôn ngữ và số lượng tham số để AI phát triển các định hướng đề tài.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5 space-y-6">
        <form onSubmit={handleGenerateDomainsSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="field" className="text-xs font-bold text-slate-700">Lĩnh vực nghiên cứu</Label>
            <Input
              id="field"
              value={field}
              onChange={(e) => setField(e.target.value)}
              placeholder="e.g. Finance, Machine Learning, Supply Chain"
              className="bg-white border-slate-200 text-slate-900 text-xs focus-visible:ring-blue-600"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="language" className="text-xs font-bold text-slate-700">Ngôn ngữ</Label>
            <Select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white border-slate-200 text-slate-900 text-xs focus-visible:ring-blue-600"
            >
              <option value="Vietnamese">Tiếng Việt</option>
              <option value="English">English</option>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="documentType" className="text-xs font-bold text-slate-700">Loại tài liệu</Label>
            <Select
              id="documentType"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="bg-white border-slate-200 text-slate-900 text-xs focus-visible:ring-blue-600"
            >
              <option value="Research Report">Nghiên cứu / Báo cáo khoa học</option>
              <option value="Thesis Proposal">Đề tài Luận văn / Đề khảo</option>
              <option value="Market Analysis">Phân tích thị trường</option>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="numberOfDomains" className="text-xs font-bold text-slate-700">Số lượng Domain</Label>
            <Input
              id="numberOfDomains"
              type="number"
              min={1}
              max={10}
              value={numberOfDomains}
              onChange={(e) => setNumberOfDomains(Number(e.target.value))}
              className="bg-white border-slate-200 text-slate-900 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="numberOfSubdomains" className="text-xs font-bold text-slate-700">Số lượng Subdomain</Label>
            <Input
              id="numberOfSubdomains"
              type="number"
              min={1}
              max={10}
              value={numberOfSubdomains}
              onChange={(e) => setNumberOfSubdomains(Number(e.target.value))}
              className="bg-white border-slate-200 text-slate-900 text-xs"
            />
          </div>

          <div className="space-y-1.5 flex flex-col justify-end">
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/80">
              <span className="text-xs font-semibold text-slate-700">Bật tìm kiếm Web</span>
              <Switch checked={webSearchEnabled} onCheckedChange={setWebSearchEnabled} />
            </div>
          </div>
        </form>

        {/* Action Button Bar */}
        <div className="flex flex-wrap gap-2.5 pt-3 border-t border-slate-100">
          <Button
            size="sm"
            onClick={handleGenerateDomainsSubmit}
            disabled={isGenerating}
            className="gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
          >
            <Layers className="w-3.5 h-3.5" />
            1. Generate Domains
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onGenerateSubdomains}
            disabled={isGenerating}
            className="gap-1.5 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <ListFilter className="w-3.5 h-3.5 text-blue-600" />
            2. Generate Subdomains
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={onGenerateTitles}
            disabled={isGenerating}
            className="gap-1.5 text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            3. Generate Titles & Proposals
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onMixProposals}
            disabled={isGenerating}
            className="gap-1.5 text-xs font-semibold border-purple-200 text-purple-700 bg-purple-50/50 hover:bg-purple-100/50"
          >
            <Blend className="w-3.5 h-3.5 text-purple-600" />
            Mix Selected Proposals
          </Button>
        </div>

        {/* Custom Title Input Bar */}
        <div className="flex gap-2 pt-2">
          <Input
            placeholder="Hoặc nhập tên đề tài tùy chỉnh của bạn..."
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            className="text-xs bg-white border-slate-200 text-slate-900"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddTitleSubmit}
            disabled={!customTitle.trim() || isGenerating}
            className="gap-1.5 text-xs font-semibold shrink-0 border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
            Add Custom Title
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
