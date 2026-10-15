import React from 'react';
import { Badge } from '@/components/ui/badge';
import { JobStatus } from '@/features/jobs/types/job.type';
import { Loader2, CheckCircle2, XCircle, AlertTriangle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: JobStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="gap-1 border-yellow-500 text-yellow-600 bg-yellow-50">
          <Clock className="w-3 h-3 animate-pulse" />
          Pending
        </Badge>
      );
    case 'processing':
      return (
        <Badge variant="outline" className="gap-1 border-blue-500 text-blue-600 bg-blue-50">
          <Loader2 className="w-3 h-3 animate-spin" />
          Processing
        </Badge>
      );
    case 'finished':
      return (
        <Badge variant="outline" className="gap-1 border-green-500 text-green-600 bg-green-50">
          <CheckCircle2 className="w-3 h-3" />
          Finished
        </Badge>
      );
    case 'error':
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="w-3 h-3" />
          Error
        </Badge>
      );
    case 'suspended':
      return (
        <Badge variant="outline" className="gap-1 border-orange-500 text-orange-600 bg-orange-50">
          <AlertTriangle className="w-3 h-3" />
          Suspended
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

