'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddMonitorFormProps {
  onAdd: (domain: string) => void;
}

export function AddMonitorForm({ onAdd }: AddMonitorFormProps) {
  const [domain, setDomain] = React.useState('');
  const [error, setError] = React.useState('');

  const validate = (value: string) => {
    if (!value.trim()) return 'Enter a domain name';
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/.test(value.trim())) {
      return 'Enter a valid domain (e.g. acme.com)';
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate(domain);
    if (err) { setError(err); return; }
    onAdd(domain.trim().toLowerCase());
    setDomain('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-start">
      <div className="flex-1">
        <Input
          placeholder="acme.com"
          value={domain}
          onChange={(e) => { setDomain(e.target.value); setError(''); }}
          error={error}
          aria-label="Domain to monitor"
        />
      </div>
      <Button type="submit" leftIcon={<Plus size={15} />}>
        Watch
      </Button>
    </form>
  );
}
