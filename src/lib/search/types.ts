export type SearchDocumentType = "Post" | "Talk" | "Stream";

export interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
  type: SearchDocumentType;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
}

export interface SearchDocumentInput {
  id: string;
  url: string;
  title: string;
  excerpt: string;
  type: SearchDocumentType;
  textToEmbed: string;
}
