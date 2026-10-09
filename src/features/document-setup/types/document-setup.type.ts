export interface TopicSetupPayload {
  field: string;
  language: string;
  documentType: string;
  numberOfDomains: number;
  numberOfSubdomains: number;
  webSearchEnabled: boolean;
}

export interface DomainItem {
  id: string;
  domainName: string;
  subdomains: string[];
  selected?: boolean;
}

export interface ProposalItem {
  id: string;
  title: string;
  problemStatement: string;
  motivation: string;
  isSelected?: boolean;
}

export interface KeywordSetupPayload {
  keywordsMain: string[];
  keywordsSub: string[];
  searchQuery: string;
  country: string;
  yearFrom: number;
  yearTo: number;
  onlyOpenAccess: boolean;
  selectedDomains: string[];
}

export interface ReferenceItem {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  openAccess: boolean;
  downloadedStatus: 'pending' | 'downloaded' | 'failed';
  url?: string;
  abstract: string;
  isSelected?: boolean;
}

export interface SubheadingNode {
  id: string;
  title: string;
  targetWordCount: number;
}

export interface HeadingNode {
  id: string;
  title: string;
  targetWordCount: number;
  ratioPercent: number;
  overview: string;
  subheadings: SubheadingNode[];
  referenceIds: string[];
}

export interface OutlineData {
  totalWordCount: number;
  researchType: string;
  headings: HeadingNode[];
}

export interface UploadedDocItem {
  id: string;
  fileName: string;
  title: string;
  processingStatus: 'uploaded' | 'processing' | 'embedded' | 'error';
  isEmbedded: boolean;
  uploadedAt: string;
  fileSize?: string;
}

