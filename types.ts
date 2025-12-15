export interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  location: string; // e.g., "Downtown, Seattle"
  credits: number;
  skillsOffered: string[];
  skillsNeeded: string[];
  rating: number;
  reviewCount: number;
}

export interface TradeRequest {
  id: string;
  authorId: string;
  title: string;
  description: string;
  type: 'OFFER' | 'NEED'; // Is the author OFFERING help or NEEDING help
  credits: number;
  skillTags: string[];
  location: string;
  distance?: number; // Distance in miles from current user
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  participantIds: string[];
  lastMessage: string;
  lastMessageTime: string;
  messages: ChatMessage[];
}

export enum TabView {
  DISCOVER = 'DISCOVER',
  REVERSE_MATCH = 'REVERSE_MATCH',
  MY_REQUESTS = 'MY_REQUESTS'
}