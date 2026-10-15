import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateProposalDto, proposalService, UpdateProposalDto } from '../services/proposal.service';

export function useProposals(documentId?: string) {
  const queryClient = useQueryClient();

  const proposalsQuery = useQuery({
    queryKey: ['proposals', documentId],
    queryFn: () => proposalService.findAll(documentId!),
    enabled: !!documentId && documentId !== 'new',
  });

  const createProposalMutation = useMutation({
    mutationFn: (dto: CreateProposalDto) => proposalService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals', documentId] });
    },
  });

  const selectProposalMutation = useMutation({
    mutationFn: (id: string) => proposalService.select(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals', documentId] });
    },
  });

  const updateProposalMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateProposalDto }) =>
      proposalService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals', documentId] });
    },
  });

  const deleteProposalMutation = useMutation({
    mutationFn: (id: string) => proposalService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals', documentId] });
    },
  });

  return {
    proposals: proposalsQuery.data ?? [],
    isLoading: proposalsQuery.isLoading,
    createProposal: createProposalMutation.mutateAsync,
    selectProposal: selectProposalMutation.mutateAsync,
    updateProposal: updateProposalMutation.mutateAsync,
    deleteProposal: deleteProposalMutation.mutateAsync,
    refetch: proposalsQuery.refetch,
  };
}

