import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateReferenceDto, referenceService } from '../services/reference.service';

export function useReferences(search?: string) {
  const queryClient = useQueryClient();

  const referencesQuery = useQuery({
    queryKey: ['references', search],
    queryFn: () => referenceService.findAll(search),
  });

  const createReferenceMutation = useMutation({
    mutationFn: (dto: CreateReferenceDto) => referenceService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['references'] });
    },
  });

  const deleteReferenceMutation = useMutation({
    mutationFn: (id: string) => referenceService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['references'] });
    },
  });

  return {
    references: referencesQuery.data ?? [],
    isLoading: referencesQuery.isLoading,
    createReference: createReferenceMutation.mutateAsync,
    deleteReference: deleteReferenceMutation.mutateAsync,
    refetch: referencesQuery.refetch,
  };
}

