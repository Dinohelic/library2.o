

export interface User {
  uid: string;
  name: string | null;
  email: string | null;
  imageUrl: string;
}

export interface Resource {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  content: string;
  summary?: string;
  imageUrl: string;
  authorId?: string;
  authorName?: string;
  fileName?: string;
  status?: 'published' | 'processing' | 'pending_review';
  tags?: string[];
  likes?: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
}

export enum MessageAuthor {
  USER = 'user',
  AI = 'ai',
}

export interface ChatMessage {
  author: MessageAuthor;
  text: string;
}

export interface Comment {
  id: string;
  resourceId: string;
  authorId: string;
  authorName: string;
  authorImageUrl: string;
  text: string;
  timestamp: number;
}

export interface Report {
  resourceId: string;
  reporterId: string;
  timestamp: number;
  resourceTitle: string;
}
export interface EmpathyRating {
  userId: string;
  rating: number;
}