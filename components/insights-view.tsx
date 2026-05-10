'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileCode, CheckCircle2, AlertCircle } from 'lucide-react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';

interface FileInsight {
  name: string;
  summary: string;
  keyPoints: string[];
  improvements: string[];
  oldText: string;
  newText: string;
}

interface InsightsData {
  mrTitle: string;
  mrLink: string;
  overallSummary: string;
  filesAnalyzed: number;
  files: FileInsight[];
}

interface InsightsViewProps {
  data: InsightsData;
  onBack: () => void;
}

export function InsightsView({ data, onBack }: InsightsViewProps) {
  const [expandedFile, setExpandedFile] = useState<string | null>(data.files[0]?.name || null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 gap-2 text-accent hover:bg-accent/10 hover:text-accent"
          style={{cursor:'pointer'}}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Button>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">{data.mrTitle}</h2>
          <p className="text-sm text-muted-foreground mb-4 break-all">{data.mrLink}</p>
          {/* <p className="text-foreground leading-relaxed">{data.overallSummary}</p> */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm text-accent">
              <FileCode className="h-4 w-4" />
              {data.filesAnalyzed > 1 ? `${data.filesAnalyzed} files analyzed` : `${data.filesAnalyzed} file analyzed`}
            </span>
          </div>
        </div>
      </div>

      {/* Files Analysis */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">File-wise Analysis</h3>

        {data.files.map((file) => (
          <div
            key={file.name}
            className="border border-border bg-card rounded-lg overflow-hidden transition-all hover:border-border/80"
          >
            {/* File Header - Clickable */}
            <button
              onClick={() => setExpandedFile(expandedFile === file.name ? null : file.name)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-card/80 transition-colors text-left"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <FileCode className="h-5 w-5 text-accent flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-foreground" style={{ wordBreak: 'break-word',
                      overflowWrap: 'anywhere'}}>{file.name}</p>
                  <p className="text-sm text-muted-foreground">{file.summary}</p>
                </div>
              </div>
              <div className={`transition-transform ${expandedFile === file.name ? 'rotate-180' : ''}`}>
                <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </button>

            {/* File Details - Expandable */}
            {expandedFile === file.name && (
              <div className="border-t border-border bg-background/50 px-6 py-4 space-y-4">
                {/* Key Points */}
                <ReactDiffViewer
                  oldValue={file.oldText}
                  newValue={file.newText}
                  splitView={false}
                  useDarkTheme={false}
                  disableWordDiff={false}
                  compareMethod={DiffMethod.WORDS}
                  styles={{
                    line: {
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                    },
                    diffContainer: {
                      overflowX: 'auto',
                    },
                  }}
                />

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <h4 className="font-semibold text-foreground">Key Changes</h4>
                  </div>
                  <ul className="space-y-2 ml-7">
                    {file.keyPoints.map((point, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-accent">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                    <h4 className="font-semibold text-foreground">Improvement Suggestions</h4>
                  </div>
                  <ul className="space-y-2 ml-7">
                    {file.improvements.map((improvement, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-yellow-400">⚡</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
