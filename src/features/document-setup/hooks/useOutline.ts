import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateOutlineDto, outlineService, UpdateOutlineDto } from '../services/outline.service';

export function useOutline(documentId?: string) {
  const queryClient = useQueryClient();

  const outlineQuery = useQuery({
    queryKey: ['outline', documentId],
    queryFn: () => outlineService.findByDocument(documentId!),
    enabled: !!documentId && documentId !== 'new',
  });

  const createOutlineMutation = useMutation({
    mutationFn: (dto: CreateOutlineDto) => outlineService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outline', documentId] });
    },
  });

  const updateOutlineMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateOutlineDto }) =>
      outlineService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outline', documentId] });
    },
  });

  return {
    outline: outlineQuery.data,
    isLoading: outlineQuery.isLoading,
    createOutline: createOutlineMutation.mutateAsync,
    updateOutline: updateOutlineMutation.mutateAsync,
    refetch: outlineQuery.refetch,
  };
}

