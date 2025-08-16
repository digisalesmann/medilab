// src/data/mockData.d.ts

export type Category = {
  label: string;
  image?: string;
  bgGradient?: string;
};

export type Brand = {
  name: string;
  img?: string;
  link?: string;
  bg?: string;
};

export type Product = {
  id?: string | number;
  title?: string;
  name?: string;
  slug?: string;
  price?: number;
  mrp?: number;
  discount?: number;
  image?: string;
  bgGradient?: string;
  // add fields you actually use…
};

export type LabTest = {
  id?: string | number;
  title: string;
  slug?: string;
  // add fields you actually use…
};

// ✅ ADD THIS
export type Doctor = {
  id: string | number;
  name: string;
  specialty: string;
  hospital?: string;
  location?: string;
  languages?: string[];
  img?: string;
  rating?: number;
};

export type Pharmacy = {
  id: string | number;
  name: string;
  location?: string;
  rating?: number;
  phone?: string;
  img?: string;
};

export type Deal = Product;

export const products: Product[];
export const categories: Category[];
export const brands: Brand[];
export const labTests: LabTest[];
export const deals: Deal[];
export const topDoctors: Doctor[];
export const mockPharmacies: Pharmacy[];