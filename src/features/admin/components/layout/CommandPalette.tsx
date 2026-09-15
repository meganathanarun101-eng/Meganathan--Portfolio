import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  BadgeCheck,
  BarChart3,
  BookOpen,
  Briefcase,
  Code2,
  Download,
  ExternalLink,
  FileText,
  FolderGit2,
  GraduationCap,
  Layers,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquareQuote,
  PlusCircle,
  Settings,
  Trophy,
  User,
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useAdminData } from '../../context/AdminDataContext';
import { useAuth } from '../../context/AuthContext';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { projects, blogPosts, messages, exportJSON, resetToDefaults } = useAdminData();
  const { logout } = useAuth();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search portfolio items..." />
      <CommandList className="max-h-96">
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/admin/dashboard' }))}
          >
            <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/admin/profile' }))}
          >
            <User className="mr-2 h-4 w-4 text-primary" />
            <span>Profile &amp; Bio</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/admin/projects' }))}
          >
            <FolderGit2 className="mr-2 h-4 w-4 text-primary" />
            <span>Projects Management</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/admin/education' }))}
          >
            <GraduationCap className="mr-2 h-4 w-4 text-primary" />
            <span>Education</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/admin/skills' }))}
          >
            <Code2 className="mr-2 h-4 w-4 text-primary" />
            <span>Skills &amp; Toolkit</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/admin/experience' }))}
          >
            <Briefcase className="mr-2 h-4 w-4 text-primary" />
            <span>Work Experience</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/admin/services' }))}
          >
            <Layers className="mr-2 h-4 w-4 text-primary" />
            <span>Services</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/admin/certificates' }))}
          >
            <BadgeCheck className="mr-2 h-4 w-4 text-primary" />
            <span>Certificates &amp; Credentials</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/admin/achievements' }))}
          >
            <Trophy className="mr-2 h-4 w-4 text-primary" />
            <span>Achievements</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/admin/resume' }))}
          >
            <FileText className="mr-2 h-4 w-4 text-primary" />
            <span>Resume Documents</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/admin/blog' }))}
          >
            <BookOpen className="mr-2 h-4 w-4 text-primary" />
            <span>Blog &amp; Articles</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/admin/testimonials' }))}
          >
            <MessageSquareQuote className="mr-2 h-4 w-4 text-primary" />
            <span>Testimonials</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/admin/messages' }))}
          >
            <Mail className="mr-2 h-4 w-4 text-primary" />
            <span>Messages Inbox</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/admin/analytics' }))}
          >
            <BarChart3 className="mr-2 h-4 w-4 text-primary" />
            <span>Visitor &amp; Project Analytics</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/admin/settings' }))}
          >
            <Settings className="mr-2 h-4 w-4 text-primary" />
            <span>Settings &amp; Backup</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Projects">
          {projects.slice(0, 5).map((p) => (
            <CommandItem
              key={p.id}
              onSelect={() => runCommand(() => navigate({ to: '/admin/projects' }))}
            >
              <FolderGit2 className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{p.title}</span>
              <span className="ml-auto text-[0.65rem] text-muted-foreground">{p.category}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Recent Messages">
          {messages.slice(0, 4).map((m) => (
            <CommandItem
              key={m.id}
              onSelect={() => runCommand(() => navigate({ to: '/admin/messages' }))}
            >
              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="truncate">{m.senderName}: {m.subject}</span>
              <span className="ml-auto text-[0.65rem] uppercase text-muted-foreground">{m.status}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Blog Posts">
          {blogPosts.slice(0, 4).map((b) => (
            <CommandItem
              key={b.id}
              onSelect={() => runCommand(() => navigate({ to: '/admin/blog' }))}
            >
              <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="truncate">{b.title}</span>
              <span className="ml-auto text-[0.65rem] text-muted-foreground">{b.status}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/admin/projects' }))}
          >
            <PlusCircle className="mr-2 h-4 w-4 text-emerald-400" />
            <span>Create New Project</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: '/admin/blog' }))}
          >
            <PlusCircle className="mr-2 h-4 w-4 text-cyan-400" />
            <span>Write New Blog Post</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                const json = exportJSON();
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
              })
            }
          >
            <Download className="mr-2 h-4 w-4 text-primary" />
            <span>Export Portfolio JSON Backup</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => window.open('/', '_blank'))}
          >
            <ExternalLink className="mr-2 h-4 w-4 text-primary" />
            <span>Open Public Portfolio in New Tab</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                logout();
                navigate({ to: '/admin/login' });
              })
            }
          >
            <LogOut className="mr-2 h-4 w-4 text-rose-400" />
            <span className="text-rose-400">Logout of Admin Console</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
