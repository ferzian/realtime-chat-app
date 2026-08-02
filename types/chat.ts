export interface Participant {
  id: number;
  userId: number;
  role: string;
  user: {
    id: number;
    username: string;
  };
}

export interface Room {
  id: number;
  isGroup: boolean;
  name?: string;
  participants: Participant[];
  messages?: Array<{ content: string; createdAt: string }>;
}

export interface Message {
  id: number;
  content: string;
  senderId?: number;
  isDeleted?: boolean;
}