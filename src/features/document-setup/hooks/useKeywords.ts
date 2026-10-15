import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateKeywordDto, keywordService } from '../services/keyword.service';

export function useKeywords(documentId?: string) {
  const queryClient = useQueryClient();

  const keywordsQuery = useQuery({
    queryKey: ['document-keywords', documentId],
    queryFn: () => keywordService.findByDocument(documentId!),
    enabled: !!documentId && documentId !== 'new',
  });

  const createKeywordMutation = useMutation({
    mutationFn: (dto: CreateKeywordDto) => keywordService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-keywords', documentId] });
    },
  });

  const updateKeywordMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<CreateKeywordDto> }) =>
      keywordService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-keywords', documentId] });
    },
  });

  return {
    keywordsData: keywordsQuery.data?.[0] || keywordsQuery.data,
    isLoading: keywordsQuery.isLoading,
    createKeyword: createKeywordMutation.mutateAsync,
    updateKeyword: updateKeywordMutation.mutateAsync,
    refetch: keywordsQuery.refetch,
  };
}

