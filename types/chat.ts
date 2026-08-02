export interface Message {
  id: number;
  content: string;
  isDeleted?: boolean;
}

export interface Room {
  id: number;
  name?: string;
  messages?: Array<{ content: string }>;
}