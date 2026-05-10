'use client';

import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Job {
  _id: string;
  mrLink: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  author: string;
}

interface JobsTableProps {
  jobs: Job[];
  onViewInsights: (jobId: string) => void;
  onDelete: (jobId: string) => void;
}

type StatusConfigItem = {
  icon: typeof Clock;
  label: string;
  bgColor: string;
  textColor: string;
  pulse?: boolean;
};

const statusConfig: Record<Job['status'], StatusConfigItem> = {
  pending: { icon: Clock, label: 'Pending', bgColor: 'bg-muted/50', textColor: 'text-muted-foreground' },
  processing: { icon: Clock, label: 'Processing', bgColor: 'bg-blue-500/20', textColor: 'text-blue-400', pulse: true },
  completed: { icon: CheckCircle2, label: 'Completed', bgColor: 'bg-green-500/20', textColor: 'text-green-400' },
  failed: { icon: AlertCircle, label: 'Failed', bgColor: 'bg-red-500/20', textColor: 'text-red-400' },
};

export function JobsTable({ jobs, onViewInsights, onDelete }: JobsTableProps) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <Clock className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground">No analysis jobs yet. Submit a merge request to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-card/50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">MR Title</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Link</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Author</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Submitted</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => {
              const config = statusConfig[job.status];
              const StatusIcon = config.icon;

              return (
                <tr
                  key={job.id}
                  className={`border-b border-border transition-colors hover:bg-card/80 ${index % 2 === 1 ? 'bg-card/50' : ''
                    }`}
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{job.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    {/* <code className="rounded bg-background px-2 py-1 text-xs text-muted-foreground">
                      {job.mrLink.split('/').slice(-1)[0]}
                    </code> */}
                    <Link href={job.mrLink} target="_blank" className="text-sm text-blue-500 hover:underline">
                      {job.mrLink.split('/').slice(-1)[0]}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{job.author}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${config.bgColor}`}>
                      <StatusIcon className={`h-4 w-4 ${config.textColor} ${config.pulse ? 'animate-pulse' : ''}`} />
                      <span className={`text-xs font-medium ${config.textColor}`}>{config.label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">{formatDistanceToNow(job?.createdAt, { addSuffix: true })}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {job.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewInsights(job._id)}
                          className="gap-2 border-border bg-background hover:bg-card text-foreground"
                          style={{ cursor: 'pointer' }}
                        >
                          <Eye className="h-4 w-4" />
                          View Insights
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(job._id)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        style={{ cursor: 'pointer' }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
