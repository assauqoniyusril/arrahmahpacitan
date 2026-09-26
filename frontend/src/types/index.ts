export interface News {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featured_image: string;
  image_caption: string;
  category: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages?: number;
}

export interface NewsListResponse {
  data: News[];
  meta: PaginationMeta;
}

export interface NewsDetailResponse {
  data: News;
  related: News[];
}

export interface NewsPayload {
  title: string;
  summary: string;
  content: string;
  featured_image: string;
  image_caption: string;
  category: string;
  published: boolean;
}
