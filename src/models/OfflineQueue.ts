export interface PostPayload {
  title: string;
  message: string;
}

export interface QueuedPostItem {
  id: string;
  url: string;
  payload: PostPayload & { timestamp: number };
  createdAt: number;
}
