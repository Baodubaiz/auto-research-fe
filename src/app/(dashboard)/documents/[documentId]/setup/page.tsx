'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Services & Hooks
import { useDocuments, useDocumentDetail } from '@/features/document-setup/hooks/useDocuments';
import { useProposals } from '@/features/document-setup/hooks/useProposals';
import { useKeywords } from '@/features/document-setup/hooks/useKeywords';
import { useOutline } from '@/features/document-setup/hooks/useOutline';
import { useUploadedDocuments } from '@/features/document-setup/hooks/useUploadedDocuments';
import { useReferences } from '@/features/document-setup/hooks/useReferences';
import { useJob } from '@/features/jobs/hooks/useJob';

// Components
import { DocumentForm } from '@/features/document-setup/components/document/DocumentForm';
import { DomainList } from '@/features/document-setup/components/document/DomainList';
import { ProposalList } from '@/features/document-setup/components/proposal/ProposalList';
import { KeywordForm } from '@/features/document-setup/components/keyword/KeywordForm';
import { ReferenceList } from '@/features/document-setup/components/reference/ReferenceList';
import { OutlineTree } from '@/features/document-setup/components/outline/OutlineTree';
import { UploadedDocumentList } from '@/features/document-setup/components/uploaded-document/UploadedDocumentList';
import { LoadingState } from '@/components/common/LoadingState';

// Types
import {
  DomainItem,
  ProposalItem,
  ReferenceItem,
  OutlineData,
  TopicSetupPayload,
  KeywordSetupPayload,
} from '@/features/document-setup/types/document-setup.type';

import { Check, Layers, BookOpen, GitBranch, Upload } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Topic Setup',         icon: Layers    },
  { id: 2, label: 'Keywords & Refs',     icon: BookOpen  },
  { id: 3, label: 'Outline',             icon: GitBranch },
  { id: 4, label: 'My Documents',        icon: Upload    },
];

export default function DocumentSetupPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.documentId as string;
  const isNew = !rawId || rawId === 'new';

  const [documentId, setDocumentId] = useState<string | undefined>(isNew ? undefined : rawId);
  const [currentStep, setCurrentStep] = useState(1);

  // Real API Hooks
  const { createDocument, updateDocument: updateDocMutation } = useDocuments();
  const { document, isLoading: isDocLoading, references: attachedRefs, attachReference, detachReference } = useDocumentDetail(documentId);
  const { proposals, createProposal, selectProposal, updateProposal, deleteProposal, refetch: refetchProposals } = useProposals(documentId);
  const { keywordsData, createKeyword, updateKeyword, refetch: refetchKeywords } = useKeywords(documentId);
  const { outline: serverOutline, createOutline, updateOutline, refetch: refetchOutline } = useOutline(documentId);
  const { uploadedDocuments, uploadDocument, deleteDocument: deleteUploadedDoc, refetch: refetchUploaded } = useUploadedDocuments(documentId);
  const { references: searchReferences, createReference, deleteReference, refetch: refetchReferences } = useReferences();
  const { createJob, isCreating: isJobCreating } = useJob();

  // Active Outline State
  const [outline, setOutline] = useState<OutlineData>({
    totalWordCount: 8000,
    researchType: 'quantitative',
    headings: [],
  });

  // Sync Server Outline Data when loaded
  useEffect(() => {
    if (serverOutline?.structure) {
      setOutline(serverOutline.structure as OutlineData);
    }
  }, [serverOutline]);

  // Helper: Ensures a document is created in DB before executing sub-actions
  const ensureDocumentCreated = async (payload?: TopicSetupPayload): Promise<string> => {
    if (documentId && documentId !== 'new') {
      return documentId;
    }
    const createdDoc = await createDocument({
      title: payload?.field ? `Research on ${payload.field}` : 'New Research Project',
      field: payload?.field || 'Finance & Banking',
      language: payload?.language || 'Vietnamese',
      documentType: payload?.documentType || 'Research Report',
      numberOfDomains: payload?.numberOfDomains || 3,
      numberOfSubdomains: payload?.numberOfSubdomains || 3,
      webSearchEnabled: payload?.webSearchEnabled ?? true,
    });
    setDocumentId(createdDoc.id);
    router.replace(`/documents/${createdDoc.id}/setup`);
    return createdDoc.id;
  };

  // Extract Domains from Document record
  const domains: DomainItem[] = Array.isArray(document?.domains) ? document.domains : [];

  // Map References with selection status
  const referenceList: ReferenceItem[] = (searchReferences || []).map((ref: any) => ({
    ...ref,
    isSelected: Array.isArray(attachedRefs)
      ? attachedRefs.some((attached: any) => attached.referenceId === ref.id || attached.id === ref.id)
      : false,
  }));

  // ── Step 1 Handlers (Topic Setup) ──────────────────────
  const handleGenerateDomains = async (payload: TopicSetupPayload) => {
    try {
      const activeDocId = await ensureDocumentCreated(payload);
      const res = await createJob({
        module: 'document_setup',
        action: 'generate_domains',
        document_id: activeDocId,
        payload: { field: payload.field, language: payload.language },
      });
      toast.success('Generated domains successfully!');
      // Refetch queries to sync updated DB record
      window.location.reload();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to generate domains');
    }
  };

  const handleGenerateSubdomains = async () => {
    try {
      const activeDocId = await ensureDocumentCreated();
      await createJob({
        module: 'document_setup',
        action: 'generate_subdomains',
        document_id: activeDocId,
        payload: { field: document?.field || 'Finance' },
      });
      toast.success('Generated subdomains!');
      window.location.reload();
    } catch (err: any) {
      toast.error('Failed to generate subdomains');
    }
  };

  const handleGenerateTitles = async () => {
    try {
      const activeDocId = await ensureDocumentCreated();
      await createJob({
        module: 'document_setup',
        action: 'generate_titles',
        document_id: activeDocId,
        payload: { field: document?.field || 'Finance' },
      });
      toast.success('Generated titles and proposals!');
      await refetchProposals();
    } catch (err: any) {
      toast.error('Failed to generate titles');
    }
  };

  const handleAddCustomTitle = async (title: string) => {
    try {
      const activeDocId = await ensureDocumentCreated();
      await createProposal({
        documentId: activeDocId,
        title,
        problemStatement: 'Custom user defined problem statement.',
        motivation: 'Custom user defined motivation.',
      });
      toast.success('Proposal created successfully!');
      await refetchProposals();
    } catch (err: any) {
      toast.error('Failed to create proposal');
    }
  };

  const handleSelectProposal = async (id: string) => {
    try {
      await selectProposal(id);
      toast.success('Proposal selected!');
      await refetchProposals();
    } catch (err: any) {
      toast.error('Failed to select proposal');
    }
  };

  const handleUpdateProposal = async (proposal: ProposalItem) => {
    try {
      await updateProposal({
        id: proposal.id,
        dto: {
          title: proposal.title,
          problemStatement: proposal.problemStatement,
          motivation: proposal.motivation,
        },
      });
      toast.success('Proposal updated!');
      await refetchProposals();
    } catch (err: any) {
      toast.error('Failed to update proposal');
    }
  };

  const handleDeleteProposal = async (id: string) => {
    try {
      await deleteProposal(id);
      toast.success('Proposal deleted!');
      await refetchProposals();
    } catch (err: any) {
      toast.error('Failed to delete proposal');
    }
  };

  const handleAddDomain = async (domainName: string) => {
    try {
      const activeDocId = await ensureDocumentCreated();
      const updatedDomains = [...domains, { id: `domain-${Date.now()}`, domainName, subdomains: [] }];
      await updateDocMutation({ id: activeDocId, dto: { domains: updatedDomains } });
      toast.success('Domain added!');
    } catch (err: any) {
      toast.error('Failed to add domain');
    }
  };

  const handleRemoveDomain = async (domainId: string) => {
    if (!documentId) return;
    try {
      const updatedDomains = domains.filter((d) => d.id !== domainId);
      await updateDocMutation({ id: documentId, dto: { domains: updatedDomains } });
      toast.success('Domain removed!');
    } catch (err: any) {
      toast.error('Failed to remove domain');
    }
  };

  const handleAddSubdomain = async (domainId: string, subdomain: string) => {
    if (!documentId) return;
    try {
      const updatedDomains = domains.map((d) =>
        d.id === domainId ? { ...d, subdomains: [...d.subdomains, subdomain] } : d
      );
      await updateDocMutation({ id: documentId, dto: { domains: updatedDomains } });
      toast.success('Subdomain added!');
    } catch (err: any) {
      toast.error('Failed to add subdomain');
    }
  };

  const handleRemoveSubdomain = async (domainId: string, subdomain: string) => {
    if (!documentId) return;
    try {
      const updatedDomains = domains.map((d) =>
        d.id === domainId ? { ...d, subdomains: d.subdomains.filter((s) => s !== subdomain) } : d
      );
      await updateDocMutation({ id: documentId, dto: { domains: updatedDomains } });
      toast.success('Subdomain removed!');
    } catch (err: any) {
      toast.error('Failed to remove subdomain');
    }
  };

  // ── Step 2 Handlers (Keywords & References) ───────────
  const handleSearchPapers = async (payload: KeywordSetupPayload) => {
    try {
      const activeDocId = await ensureDocumentCreated();

      if (keywordsData?.id) {
        await updateKeyword({
          id: keywordsData.id,
          dto: {
            keywordsMain: payload.keywordsMain,
            keywordsSub: payload.keywordsSub,
            searchQuery: payload.searchQuery,
            country: payload.country,
            yearFrom: payload.yearFrom,
            yearTo: payload.yearTo,
            onlyOpenAccess: payload.onlyOpenAccess,
          },
        });
      } else {
        await createKeyword({
          documentId: activeDocId,
          keywordsMain: payload.keywordsMain,
          keywordsSub: payload.keywordsSub,
          searchQuery: payload.searchQuery,
          country: payload.country,
          yearFrom: payload.yearFrom,
          yearTo: payload.yearTo,
          onlyOpenAccess: payload.onlyOpenAccess,
        });
      }

      await createJob({
        module: 'document_setup',
        action: 'search_papers',
        document_id: activeDocId,
        payload,
      });
      toast.success('Search papers completed!');
      await refetchReferences();
      await refetchKeywords();
    } catch (err: any) {
      toast.error('Failed to search papers');
    }
  };

  const handleAddCustomReference = async (ref: Partial<ReferenceItem>) => {
    try {
      await createReference({
        title: ref.title || 'Untitled Reference',
        authors: ref.authors,
        journal: ref.journal,
        year: ref.year || 2024,
        openAccess: ref.openAccess ?? true,
        url: ref.url,
        abstract: ref.abstract,
      });
      toast.success('Reference created in database!');
      await refetchReferences();
    } catch (err: any) {
      toast.error('Failed to create reference');
    }
  };

  const handleDeleteReference = async (id: string) => {
    try {
      await deleteReference(id);
      toast.success('Reference deleted!');
      await refetchReferences();
    } catch (err: any) {
      toast.error('Failed to delete reference');
    }
  };

  const handleToggleReference = async (refId: string) => {
    try {
      const activeDocId = await ensureDocumentCreated();
      const isAttached = attachedRefs?.some((a: any) => a.referenceId === refId || a.id === refId);
      if (isAttached) {
        await detachReference(refId);
        toast.info('Reference detached');
      } else {
        await attachReference(refId);
        toast.success('Reference attached to document!');
      }
    } catch (err: any) {
      toast.error('Failed to update reference attachment');
    }
  };

  // ── Step 3 Handlers (Outline) ──────────────────────────
  const handleGenerateOutline = async () => {
    try {
      const activeDocId = await ensureDocumentCreated();
      const jobRes = await createJob({
        module: 'document_setup',
        action: 'generate_outline',
        document_id: activeDocId,
        payload: { totalWordCount: outline.totalWordCount, researchType: outline.researchType },
      });
      toast.success('Outline generated!');
      await refetchOutline();
    } catch (err: any) {
      toast.error('Failed to generate outline');
    }
  };

  const handleSaveOutline = async () => {
    try {
      const activeDocId = await ensureDocumentCreated();
      if (serverOutline?.id) {
        await updateOutline({
          id: serverOutline.id,
          dto: { totalWordCount: outline.totalWordCount, structure: outline },
        });
      } else {
        await createOutline({
          documentId: activeDocId,
          totalWordCount: outline.totalWordCount,
          structure: outline,
        });
      }
      toast.success('Outline saved to Backend DB!');
      await refetchOutline();
    } catch (err: any) {
      toast.error('Failed to save outline');
    }
  };

  // ── Step 4 Handlers (Uploaded Documents) ──────────────
  const handleUploadDoc = async (data: { fileName: string; title?: string }) => {
    try {
      const activeDocId = await ensureDocumentCreated();
      await uploadDocument({
        documentId: activeDocId,
        fileName: data.fileName,
        title: data.title,
      });
      toast.success('Document uploaded!');
      await refetchUploaded();
    } catch (err: any) {
      toast.error('Failed to upload document');
    }
  };

  if (isDocLoading) {
    return <LoadingState message="Fetching document details..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {document?.title ? document.title : 'New Research Document Setup'}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure topic, proposals, keywords, references, and outline
          </p>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="flex items-center gap-0 bg-card border border-border rounded-xl p-1.5 shadow-sm">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => setCurrentStep(step.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : isCompleted
                    ? 'text-primary hover:bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{step.id}</span>
              </button>
              {idx < STEPS.length - 1 && (
                <div className={`w-4 h-0.5 shrink-0 ${isCompleted ? 'bg-primary' : 'bg-border'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <DocumentForm
            onGenerateDomains={handleGenerateDomains}
            onGenerateSubdomains={handleGenerateSubdomains}
            onGenerateTitles={handleGenerateTitles}
            onAddCustomTitle={handleAddCustomTitle}
            onMixProposals={() => toast.info('Mix proposals action submitted')}
            isGenerating={isJobCreating}
          />
          <DomainList
            domains={domains}
            onAddDomain={handleAddDomain}
            onRemoveDomain={handleRemoveDomain}
            onAddSubdomain={handleAddSubdomain}
            onRemoveSubdomain={handleRemoveSubdomain}
          />
          <ProposalList
            proposals={proposals.map((p: any) => ({ ...p, isSelected: p.isSelected ?? false }))}
            onSelectProposal={handleSelectProposal}
            onUpdateProposal={handleUpdateProposal}
            onDeleteProposal={handleDeleteProposal}
            onContinue={() => setCurrentStep(2)}
          />
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <KeywordForm
            onGenerateKeywords={() => handleSearchPapers({ keywordsMain: ['AI', 'Finance'], keywordsSub: [], searchQuery: '', country: '', yearFrom: 2018, yearTo: 2025, onlyOpenAccess: false, selectedDomains: [] })}
            onSearchPapers={handleSearchPapers}
            isGenerating={isJobCreating}
          />
          <ReferenceList
            references={referenceList}
            onToggleReference={handleToggleReference}
            onAddCustomReference={handleAddCustomReference}
            onDeleteReference={handleDeleteReference}
            onContinueToOutline={() => setCurrentStep(3)}
          />
        </div>
      )}

      {currentStep === 3 && (
        <OutlineTree
          outline={outline}
          onUpdateOutline={setOutline}
          onSaveOutline={handleSaveOutline}
          onContinueToWrite={() => router.push(`/documents/${documentId}/write`)}
        />
      )}

      {currentStep === 4 && (
        <UploadedDocumentList
          documents={uploadedDocuments.map((doc: any) => ({
            id: doc.id,
            fileName: doc.fileName,
            title: doc.title || doc.fileName,
            processingStatus: doc.processingStatus || 'uploaded',
            isEmbedded: doc.isEmbedded || false,
            uploadedAt: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'Today',
          }))}
          onUpload={handleUploadDoc}
          onProcess={(id) => toast.info(`Processing document ${id}...`)}
          onDelete={(id) => deleteUploadedDoc(id)}
          onView={(doc) => toast.info(`Viewing ${doc.fileName}`)}
        />
      )}
    </div>
  );
}
