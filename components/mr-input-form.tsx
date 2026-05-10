'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, ArrowRight } from 'lucide-react';

interface MRInputFormProps {
  onSubmit: (mrLink: string) => void;
  isLoading?: boolean;
}

export function MRInputForm({ onSubmit, isLoading = false }: MRInputFormProps) {
  const [mrLink, setMrLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mrLink.trim()) {
      onSubmit(mrLink);
      setMrLink('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="mr-link" className="block text-sm font-medium text-foreground">
          Merge Request Link
        </label>
        <div className="flex gap-3">
          <Input
            id="mr-link"
            type="url"
            placeholder="https://github.com/org/repo/pull/123"
            value={mrLink}
            onChange={(e) => setMrLink(e.target.value)}
            className="flex-1 bg-card border-border text-foreground placeholder:text-muted-foreground"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !mrLink.trim()}
            className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
            style={{cursor:'pointer'}}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Submit
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Paste your GitHub, GitLab, or Bitbucket merge request URL to start the analysis
        </p>
      </div>
    </form>
  );
}
