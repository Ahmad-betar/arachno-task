export interface Article {
  id: string;
  title: string;
  category: string;
  tags: string[];
  coverImage: string | null;
  content: string; 
  isPublished: boolean;
  publishDate: string | null;
  createdAt: string;
}
