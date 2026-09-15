export type MessageStatus = 'unread' | 'read' | 'replied' | 'archived';
export type MessagePriority = 'normal' | 'high' | 'urgent';

export interface ContactMessage {
  id: string;
  senderName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date: string;
  status: MessageStatus;
  priority: MessagePriority;
  starred: boolean;
  replyHistory?: Array<{
    id: string;
    body: string;
    sentAt: string;
    sentBy: string;
  }>;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'message' | 'visitor' | 'project' | 'certificate' | 'resume' | 'system';
  link?: string;
}
