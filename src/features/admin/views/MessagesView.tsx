import React, { useMemo, useState } from 'react';
import {
  Archive,
  ArrowRight,
  Check,
  CheckCheck,
  Clock,
  CornerDownRight,
  Mail,
  MailOpen,
  Phone,
  Search,
  Send,
  Star,
  Trash2,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useAdminData } from '../context/AdminDataContext';
import { ContactMessage, MessageStatus } from '../types/messages';
import { cn } from '@/lib/utils';

export function MessagesView() {
  const {
    messages,
    saveMessage,
    deleteMessage,
    replyToMessage,
    markMessageRead,
    toggleMessageStarred,
  } = useAdminData();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(() => {
    return messages[0]?.id ?? null;
  });
  const [replyText, setReplyText] = useState('');
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (activeFilter === 'unread') return m.status === 'unread';
      if (activeFilter === 'starred') return m.starred;
      if (activeFilter === 'replied') return m.status === 'replied';
      if (activeFilter === 'archived') return m.status === 'archived';

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          m.senderName.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [messages, activeFilter, searchQuery]);

  const activeMessage = useMemo(() => {
    return messages.find((m) => m.id === selectedMessageId) ?? filteredMessages[0] ?? null;
  }, [messages, selectedMessageId, filteredMessages]);

  const handleSelectMessage = (msg: ContactMessage) => {
    setSelectedMessageId(msg.id);
    if (msg.status === 'unread') {
      markMessageRead(msg.id, true);
    }
  };

  const handleSendReply = () => {
    if (!activeMessage || !replyText.trim()) return;
    replyToMessage(activeMessage.id, replyText);
    setReplyText('');
  };

  const handleApplyTemplate = (tmpl: string) => {
    setReplyText(tmpl);
  };

  const handleArchive = (msg: ContactMessage) => {
    saveMessage({
      ...msg,
      status: msg.status === 'archived' ? 'read' : 'archived',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Contact &amp; Client Enquiries
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage incoming inquiries, send direct email responses, and filter client leads.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">
            <Mail className="h-3.5 w-3.5 text-primary" /> {messages.length} total
          </span>
          <span className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-primary font-bold">
            {messages.filter((m) => m.status === 'unread').length} unread
          </span>
        </div>
      </div>

      {/* Inbox Split Pane Container */}
      <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-card/60 backdrop-blur-xl lg:grid-cols-[380px_1fr] min-h-[640px]">
        {/* Left Column: Inbox List */}
        <div className="flex flex-col border-r border-white/10 bg-black/20">
          {/* Top search & filter tabs */}
          <div className="p-4 border-b border-white/10 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sender, subject, or email..."
                className="h-9 rounded-xl border-white/10 bg-white/[0.03] pl-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto">
              {[
                { id: 'all', label: 'All' },
                { id: 'unread', label: 'Unread' },
                { id: 'starred', label: 'Starred' },
                { id: 'replied', label: 'Replied' },
                { id: 'archived', label: 'Archived' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={cn(
                    'rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap',
                    activeFilter === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {filteredMessages.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground">
                No messages found in this view.
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = activeMessage?.id === msg.id;

                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={cn(
                      'group relative flex cursor-pointer flex-col gap-1 p-4 transition-all',
                      isSelected
                        ? 'bg-primary/10 border-l-4 border-primary'
                        : 'hover:bg-white/[0.03]',
                      msg.status === 'unread' ? 'font-semibold' : '',
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-foreground truncate max-w-[180px]">
                        {msg.senderName}
                      </span>
                      <span className="font-mono text-[0.65rem] text-muted-foreground">
                        {new Date(msg.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <p className="text-xs text-foreground/90 truncate">{msg.subject}</p>
                    <p className="text-[0.7rem] text-muted-foreground truncate line-clamp-1">
                      {msg.message}
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`rounded-full px-2 py-0.2 text-[0.6rem] font-bold uppercase ${
                            msg.status === 'unread'
                              ? 'bg-primary/20 text-primary'
                              : msg.status === 'replied'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-white/10 text-muted-foreground'
                          }`}
                        >
                          {msg.status}
                        </span>

                        {msg.priority === 'urgent' && (
                          <span className="rounded-full bg-rose-500/20 px-1.5 text-[0.6rem] font-bold text-rose-400">
                            Urgent
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMessageStarred(msg.id);
                        }}
                        className="text-muted-foreground hover:text-amber-400 p-1"
                      >
                        <Star
                          className={`h-3.5 w-3.5 ${
                            msg.starred ? 'fill-amber-400 text-amber-400' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Reader Pane */}
        {activeMessage ? (
          <div className="flex flex-col justify-between">
            <div>
              {/* Message Header Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-5 bg-white/[0.01]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-accent to-neon text-primary-foreground font-display font-bold text-sm">
                    {activeMessage.senderName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">
                      {activeMessage.senderName}
                    </h3>
                    <p className="font-mono text-xs text-muted-foreground">
                      {activeMessage.email}
                      {activeMessage.phone && ` · ${activeMessage.phone}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      markMessageRead(activeMessage.id, activeMessage.status !== 'read')
                    }
                    className="h-8 border-white/10 text-xs"
                    title="Toggle Read / Unread"
                  >
                    {activeMessage.status === 'read' ? (
                      <Mail className="h-3.5 w-3.5" />
                    ) : (
                      <MailOpen className="h-3.5 w-3.5" />
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleArchive(activeMessage)}
                    className="h-8 border-white/10 text-xs"
                    title={activeMessage.status === 'archived' ? 'Unarchive' : 'Archive'}
                  >
                    <Archive className="h-3.5 w-3.5" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setItemToDelete(activeMessage.id)}
                    className="h-8 border-white/10 text-xs text-rose-400 hover:bg-rose-500/10"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Message Subject & Body */}
              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-primary font-bold">
                      Subject
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {new Date(activeMessage.date).toLocaleString()}
                    </span>
                  </div>
                  <h2 className="mt-1 font-display text-lg font-bold text-foreground">
                    {activeMessage.subject}
                  </h2>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
                  <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {activeMessage.message}
                  </p>
                </div>

                {/* Reply thread history if any */}
                {activeMessage.replyHistory && activeMessage.replyHistory.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <CornerDownRight className="h-3.5 w-3.5 text-primary" /> Reply History
                    </h4>
                    {activeMessage.replyHistory.map((rep) => (
                      <div
                        key={rep.id}
                        className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-primary">{rep.sentBy}</span>
                          <span className="font-mono text-[0.65rem] text-muted-foreground">
                            {new Date(rep.sentAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap">
                          {rep.body}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Reply Box */}
            <div className="border-t border-white/10 bg-white/[0.02] p-5 space-y-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[0.65rem] font-bold uppercase text-muted-foreground">
                  Quick Responses:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleApplyTemplate(
                      `Hi ${activeMessage.senderName},\n\nThank you for reaching out! I would be thrilled to discuss this project. I am available for a brief introductory call this week.\n\nBest regards,\nMeganathan R`,
                    )
                  }
                  className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[0.65rem] text-muted-foreground hover:text-foreground"
                >
                  Schedule Call
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleApplyTemplate(
                      `Hi ${activeMessage.senderName},\n\nThanks for your inquiry! I have reviewed your requirements and would love to send over an estimated proposal and timeline.\n\nWarm regards,\nMeganathan R`,
                    )
                  }
                  className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[0.65rem] text-muted-foreground hover:text-foreground"
                >
                  Send Proposal
                </button>
              </div>

              <div className="flex gap-2">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Write your response to ${activeMessage.senderName}...`}
                  rows={3}
                  className="rounded-2xl border-white/10 bg-black/40 text-xs leading-relaxed"
                />
                <Button
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="self-end rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 gap-1.5 text-xs font-semibold"
                >
                  <Send className="h-3.5 w-3.5" /> Send Reply
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-12 text-sm text-muted-foreground">
            Select a message from the list to read details.
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title="Delete Message?"
        description="Are you sure you want to remove this message from your inbox?"
        onConfirm={() => {
          if (itemToDelete) {
            deleteMessage(itemToDelete);
            setItemToDelete(null);
          }
        }}
      />
    </div>
  );
}
