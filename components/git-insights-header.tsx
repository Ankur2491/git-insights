import { GitBranch } from 'lucide-react';

export function GitInsightsHeader() {
  return (
    <div className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-accent/10 p-2">
            <GitBranch className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Git Insights</h1>
            <p className="text-sm text-muted-foreground">Analyze merge requests and understand code changes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
