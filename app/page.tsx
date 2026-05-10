'use client';

import { useEffect, useState } from 'react';
import { GitInsightsHeader } from '@/components/git-insights-header';
import { MRInputForm } from '@/components/mr-input-form';
import { JobsTable } from '@/components/jobs-table';
import { InsightsView } from '@/components/insights-view';
import axios, { all } from 'axios';
interface Job {
  id: string;
  mrLink: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  author: string;
}

interface InsightsData {
  mrTitle: string;
  mrLink: string;
  overallSummary: string;
  filesAnalyzed: number;
  files: Array<{
    name: string;
    summary: string;
    keyPoints: string[];
    improvements: string[];
    oldText?: string;
    newText?: string;
  }>;
}

export default function Home() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [allInsights, setAllInsights] = useState<Record<string, InsightsData>>({});
  const [viewingInsights, setViewingInsights] = useState<InsightsData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getJobs = async () => {
    let res = await axios.get(`http://localhost:3001/git/jobs`);
    setJobs(res.data);
  }
  useEffect(()=> {
    getJobs();
    const jobTimer = setInterval(() => {
      getJobs();
    }, 5000);
    return () => clearInterval(jobTimer);
  }, [])

  // Sample insights data for demonstration
  const sampleInsights: Record<string, InsightsData> = {
    'job-1': {
      mrTitle: 'Refactor authentication flow and add OAuth support',
      mrLink: 'https://github.com/org/repo/pull/456',
      overallSummary:
        'This MR introduces a complete overhaul of the authentication system, adding OAuth2 support for Google and GitHub. The changes include migration of legacy session management to JWT tokens, implementation of secure token refresh mechanisms, and updated security policies.',
      filesAnalyzed: 3,
      files: [
        {
          name: 'src/auth/oauth.ts',
          summary: 'New OAuth2 provider implementation with Google and GitHub support',
          keyPoints: [
            'Implements OAuth2 authorization code flow for Google and GitHub',
            'Handles token refresh and expiration validation',
            'Integrates with existing user database for account linking',
            'Includes comprehensive error handling for failed authentications',
          ],
          improvements: [
            'Consider adding rate limiting for token refresh endpoints to prevent abuse',
            'Add CSRF token validation for OAuth callback routes',
            'Document the OAuth configuration environment variables',
            'Consider implementing request signing for improved security',
          ],
        },
        {
          name: 'src/middleware/auth.ts',
          summary: 'Authentication middleware updated to support JWT tokens',
          keyPoints: [
            'Updated to validate JWT tokens from Authorization header',
            'Maintains backward compatibility with session-based auth',
            'Added refresh token rotation mechanism',
            'Implements token expiration and grace periods',
          ],
          improvements: [
            'Move JWT secret to secure vault instead of environment variable',
            'Implement token blacklisting for immediate logout',
            'Add logging for authentication failures',
            'Consider adding geo-location verification for suspicious logins',
          ],
        },
        {
          name: 'src/database/migrations/auth-tokens.sql',
          summary: 'Database schema updates for JWT and OAuth support',
          keyPoints: [
            'Added new oauth_accounts table to track linked accounts',
            'Added refresh_tokens table with expiration tracking',
            'Maintains referential integrity with existing users table',
            'Includes proper indexing for performance',
          ],
          improvements: [
            'Add retention policy for expired tokens (auto-cleanup)',
            'Consider partitioning refresh_tokens table by created_at for better performance',
            'Add audit logging for account linkages',
            'Document migration rollback procedure',
          ],
        },
      ],
    },
  };

  const detectProjectIdFromMRLink = (mrLink: string): string | null => {   
    if(mrLink.includes('ng-smax-ui')) {
      return "44098";
    }
    else if(mrLink.includes('itsma-x')) {
      return "53548";
    }
    return null;
  }

  const handleMRSubmit = async (mrLink: string) => {
    setIsSubmitting(true);
    let projectId = detectProjectIdFromMRLink(mrLink);
    let mrIdMatch = mrLink.match(/merge_requests\/(\d+)/);
    let mrId = mrIdMatch ? mrIdMatch[1] : null;
    const newJob: Job = {
      id: `${projectId}_${mrId}`,
      mrLink,
      title: mrId ? mrId.toString() : '',
      status: 'pending',
      createdAt: new Date(),
      author: ''
    };

    let res = await axios.get(`http://localhost:3001/git/changes/${projectId}/${mrId}`);
    newJob.author = res.data.author;
    newJob.title = res.data.title;

    setJobs((prev) => [newJob, ...prev]);

    // // Simulate job processing
    // setTimeout(() => {
    //   setJobs((prev) =>
    //     prev.map((job) =>
    //       job.id === newJob.id
    //         ? {
    //             ...job,
    //             status: 'processing',
    //           }
    //         : job,
    //     ),
    //   );
    // }, 1000);

    // // Simulate completion after 3 seconds
    // setTimeout(() => {
    //   setJobs((prev) =>
    //     prev.map((job) =>
    //       job.id === newJob.id
    //         ? {
    //             ...job,
    //             status: 'completed',
    //             completedAt: new Date(),
    //           }
    //         : job,
    //     ),
    //   );
    // }, 3000);

    setIsSubmitting(false);
  };

  const formInsightsData = (): Record<string, InsightsData> => {
    const data: Record<string, InsightsData> = {};
    jobs.forEach((job) => {
      let insightsObj: any = {}; 
      insightsObj.mrTitle = job.title;
      insightsObj.mrLink = job.mrLink;
      insightsObj.overallSummary = "";
      insightsObj.filesAnalyzed = job?.evaluation?.length;
      insightsObj.files = job?.evaluation?.map((fileEval: any) => ({
        name: fileEval.file,
        summary: fileEval.summary,
        keyPoints: fileEval.bullets,
        improvements: fileEval.improvements,
        oldText: fileEval.oldText,
        newText: fileEval.newText,
      })) || [];

      data[job._id] = insightsObj;
    });
    return data;
  }
  const handleViewInsights = (jobId: string) => {
    console.log('Viewing insights for job:', jobId);
    let allInsightsData = formInsightsData();
    setAllInsights(allInsightsData);
    const insights = allInsightsData[jobId];
    setViewingInsights(insights);
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  return (
    <div className="min-h-screen bg-background">
      <GitInsightsHeader />

      <main className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        {viewingInsights ? (
          <InsightsView data={viewingInsights} onBack={() => setViewingInsights(null)} />
        ) : (
          <>
            <div className="rounded-lg border border-border bg-card p-6">
              <MRInputForm onSubmit={handleMRSubmit} isLoading={isSubmitting} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Analysis Jobs</h2>
              <JobsTable jobs={jobs} onViewInsights={handleViewInsights} onDelete={handleDeleteJob} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
