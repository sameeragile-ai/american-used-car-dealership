export type BlogCategory = 'Buying Tips' | 'Market Trends' | 'Financing' | 'Dealership News' | 'Maintenance';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: BlogCategory;
  coverImage: string;
  excerpt: string;
  body: string; // Markdown or HTML formatted text
  author: string;
  authorRole: string;
  authorAvatar?: string;
  readTimeMinutes: number;
  publishedAt: string;
  status: 'published' | 'draft';
  tags: string[];
}
