export interface MemoItem {
  id: string;
  title: string;
  note: string;
  url?: string;
  createdAt: number;
  folder?: string;
}
