'use client';

import * as React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { NameStyle } from '@/types';

const STYLES: { value: NameStyle; label: string; description: string }[] = [
  { value: 'invented',    label: 'Invented',    description: 'Coined word (Spotify, Xerox)' },
  { value: 'descriptive', label: 'Descriptive', description: 'Clear meaning (Basecamp)' },
  { value: 'metaphor',    label: 'Metaphor',    description: 'Evocative (Amazon, Apple)' },
  { value: 'compound',    label: 'Compound',    description: 'Two words (YouTube)' },
];

const PLACEHOLDERS = [
  'A platform that helps remote teams run better async standups…',
  'An AI tool that turns meeting recordings into action items…',
  'A marketplace for freelance designers and startups…',
  'A personal finance app for Gen Z that makes saving feel like a game…',
];

interface IdeaInputProps {
  onSubmit: (idea: string, style?: NameStyle) => void;
  loading?: boolean;
}

export function IdeaInput({ onSubmit, loading = false }: IdeaInputProps) {
  const [idea, setIdea] = React.useState('');
  const [style, setStyle] = React.useState<NameStyle | undefined>(undefined);
  const [placeholder] = React.useState(
    () => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim().length < 3) return;
    onSubmit(idea.trim(), style);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        label="Describe your startup idea"
        placeholder={placeholder}
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        rows={3}
        maxLength={500}
        charCount
        hint="Be specific — the more context you give, the better the names."
        className="text-base"
        aria-required="true"
      />

      {/* Style selector */}
      <fieldset>
        <legend className="text-sm font-medium text-surface-700 mb-2">
          Name style <span className="text-surface-400 font-normal">(optional)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStyle(style === s.value ? undefined : s.value)}
              aria-pressed={style === s.value}
              title={s.description}
              className={cn(
                'rounded-full px-3 py-1 text-sm font-medium border transition-colors duration-150',
                style === s.value
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-white text-surface-700 border-surface-200 hover:border-brand-300 hover:text-brand-600'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </fieldset>

      <Button
        type="submit"
        size="lg"
        loading={loading}
        disabled={idea.trim().length < 3}
        className="w-full sm:w-auto"
      >
        {loading ? 'Finding names…' : 'Find names →'}
      </Button>
    </form>
  );
}
