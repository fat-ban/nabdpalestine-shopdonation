export enum ChatRole {
  USER = 'user',
  BOT = 'bot',
  SYSTEM = 'system',
}

export interface ChatMessage {
  id?: string;
  role: ChatRole;
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  reply: ChatMessage;
  history: ChatMessage[];
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
}
