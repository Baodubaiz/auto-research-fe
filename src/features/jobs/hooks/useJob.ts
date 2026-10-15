import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { jobService } from '../services/job.service';
import {
  CreateJobPayload,
  JobResultResponse,
  JobStatus,
} from '../types/job.type';

export function useJob<T = any>() {
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);

  const createJobMutation = useMutation({
    mutationFn: (payload: CreateJobPayload) => jobService.createJob(payload),
    onSuccess: (data) => {
      setCurrentJobId(data.job_id);
    },
  });

  const jobQuery = useQuery<JobResultResponse<T>>({
    queryKey: ['job', currentJobId],
    queryFn: () => jobService.getJobStatus<T>(currentJobId!),
    enabled: !!currentJobId,
    refetchInterval: (query) => {
      const status: JobStatus | undefined = query.state.data?.status;
      if (status === 'finished' || status === 'error' || status === 'suspended') {
        return false;
      }
      return 2000;
    },
  });

  const resumeJobMutation = useMutation({
    mutationFn: ({
      jobId,
      payload,
    }: {
      jobId: string;
      payload?: Record<string, any>;
    }) => jobService.resumeJob<T>(jobId, payload),
  });

  return {
    jobId: currentJobId,
    createJob: createJobMutation.mutateAsync,
    isCreating: createJobMutation.isPending,
    jobData: jobQuery.data,
    status: jobQuery.data?.status ?? (createJobMutation.isPending ? 'pending' : null),
    isLoading: jobQuery.isLoading || createJobMutation.isPending,
    error: jobQuery.data?.error || createJobMutation.error?.message,
    resumeJob: resumeJobMutation.mutateAsync,
    reset: () => setCurrentJobId(null),
  };
}

