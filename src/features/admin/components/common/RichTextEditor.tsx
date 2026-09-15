import React, { useRef, useState } from 'react';
import {
  Bold,
  Code,
  Eye,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write content here (Markdown supported)...',
  className,
  minHeight = 'min-h-[280px]',
}: RichTextEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;

    const updated = value.substring(0, start) + replacement + value.substring(end);
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selected ? selected.length : 4),
      );
    }, 10);
  };

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-white/10 bg-card/60', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 bg-white/[0.03] px-3 py-2">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            title="Bold"
            onClick={() => insertText('**', '**')}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Italic"
            onClick={() => insertText('*', '*')}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <Italic className="h-4 w-4" />
          </button>

          <div className="mx-1 h-4 w-px bg-white/10" />

          <button
            type="button"
            title="Heading 1"
            onClick={() => insertText('# ')}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Heading 2"
            onClick={() => insertText('## ')}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Heading 3"
            onClick={() => insertText('### ')}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <Heading3 className="h-4 w-4" />
          </button>

          <div className="mx-1 h-4 w-px bg-white/10" />

          <button
            type="button"
            title="Bullet List"
            onClick={() => insertText('- ')}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Numbered List"
            onClick={() => insertText('1. ')}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Quote"
            onClick={() => insertText('> ')}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <Quote className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Code Block"
            onClick={() => insertText('```\n', '\n```')}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <Code className="h-4 w-4" />
          </button>

          <div className="mx-1 h-4 w-px bg-white/10" />

          <button
            type="button"
            title="Insert Link"
            onClick={() => insertText('[', '](https://example.com)')}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Insert Image"
            onClick={() => insertText('![alt text](', ')')}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
        </div>

        {/* View toggle */}
        <div className="flex items-center rounded-xl bg-white/5 p-0.5">
          <button
            type="button"
            onClick={() => setMode('edit')}
            className={cn(
              'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
              mode === 'edit'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={cn(
              'inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
              mode === 'preview'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Eye className="h-3 w-3" /> Preview
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {mode === 'edit' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:outline-none',
            minHeight,
          )}
        />
      ) : (
        <div className={cn('prose prose-invert max-w-none p-6 text-foreground/90', minHeight)}>
          {value ? (
            <div className="space-y-4 whitespace-pre-wrap text-sm leading-relaxed">
              {value}
            </div>
          ) : (
            <p className="italic text-muted-foreground">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
