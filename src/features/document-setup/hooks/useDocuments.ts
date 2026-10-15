import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateDocumentDto, documentService, UpdateDocumentDto } from '../services/document.service';

export function useDocuments() {
  const queryClient = useQueryClient();

  const documentsQuery = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentService.findAll(),
  });

  const createDocumentMutation = useMutation({
    mutationFn: (dto: CreateDocumentDto) => documentService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const updateDocumentMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateDocumentDto }) =>
      documentService.update(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document', variables.id] });
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: (id: string) => documentService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  return {
    documents: documentsQuery.data ?? [],
    isLoading: documentsQuery.isLoading,
    error: documentsQuery.error,
    createDocument: createDocumentMutation.mutateAsync,
    isCreating: createDocumentMutation.isPending,
    updateDocument: updateDocumentMutation.mutateAsync,
    isUpdating: updateDocumentMutation.isPending,
    deleteDocument: deleteDocumentMutation.mutateAsync,
    isDeleting: deleteDocumentMutation.isPending,
    refetch: documentsQuery.refetch,
  };
}

export function useDocumentDetail(id?: string) {
  const queryClient = useQueryClient();

  const documentQuery = useQuery({
    queryKey: ['document', id],
    queryFn: () => documentService.findOne(id!),
    enabled: !!id && id !== 'new',
  });

  const referencesQuery = useQuery({
    queryKey: ['document-references', id],
    queryFn: () => documentService.listReferences(id!),
    enabled: !!id && id !== 'new',
  });

  const attachRefMutation = useMutation({
    mutationFn: (referenceId: string) => documentService.attachReference(id!, referenceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-references', id] });
    },
  });

  const detachRefMutation = useMutation({
    mutationFn: (referenceId: string) => documentService.detachReference(id!, referenceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-references', id] });
    },
  });

  return {
    document: documentQuery.data,
    isLoading: documentQuery.isLoading,
    references: referencesQuery.data ?? [],
    attachReference: attachRefMutation.mutateAsync,
    detachReference: detachRefMutation.mutateAsync,
  };
}

