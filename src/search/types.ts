export type SearchType =
  | "product"
  | "labtest"
  | "doctor"
  | "article"
  | "brand"
  | "category"
  | "pharmacy"
  | "deal";

export interface SearchDoc {
  id: string;
  type: SearchType;
  title: string;
  subtitle?: string;
  url: string;
  keywords?: string[];
}