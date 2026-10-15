import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateUploadedDocDto, uploadedDocumentService } from '../services/uploaded-document.service';

export function useUploadedDocuments(documentId?: string) {
  const queryClient = useQueryClient();

  const uploadedDocsQuery = useQuery({
    queryKey: ['uploaded-documents', documentId],
    queryFn: () => uploadedDocumentService.findAll(documentId!),
    enabled: !!documentId && documentId !== 'new',
  });

  const uploadDocMutation = useMutation({
    mutationFn: (dto: CreateUploadedDocDto) => uploadedDocumentService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploaded-documents', documentId] });
    },
  });

  const updateDocMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<CreateUploadedDocDto> }) =>
      uploadedDocumentService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploaded-documents', documentId] });
    },
  });

  const deleteDocMutation = useMutation({
    mutationFn: (id: string) => uploadedDocumentService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploaded-documents', documentId] });
    },
  });

  return {
    uploadedDocuments: uploadedDocsQuery.data ?? [],
    isLoading: uploadedDocsQuery.isLoading,
    uploadDocument: uploadDocMutation.mutateAsync,
    updateDocument: updateDocMutation.mutateAsync,
    deleteDocument: deleteDocMutation.mutateAsync,
    refetch: uploadedDocsQuery.refetch,
  };
}

