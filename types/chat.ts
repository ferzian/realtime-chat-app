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
  imageUrl?: string;
  senderId?: number;
  createdAt?: string;
  isDeleted?: boolean;
  status?: "SENT" | "DELIVERED" | "READ";
  replyToId?: number;
  replyTo?: {
    id: number;
    content: string;
    imageUrl?: string;
    isDeleted?: boolean;
    sender?: {
      username: string;
    };
  };
  sender?: {
    id: number;
    username: string;
  };
}
