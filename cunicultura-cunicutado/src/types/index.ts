// Product Types
export type RabbitCategory =
  | "gigantes"
  | "medios"
  | "mini"
  | "anoes"
  | "reprodutores"
  | "matrizes"
  | "filhotes";

export type RabbitSex = "macho" | "femea";

export interface Rabbit {
  id: string;
  name: string;
  slug: string;
  category: RabbitCategory;
  breed: string;
  sex: RabbitSex;
  age: string;
  weight: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  longDescription: string;
  images: string[];
  video?: string;
  vaccination: string[];
  feeding: string;
  origin: string;
  guarantee: string;
  available: boolean;
  featured: boolean;
  bestSeller: boolean;
  onSale: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export type ProductCategory =
  | "racoes"
  | "fenos"
  | "vitaminas"
  | "medicamentos"
  | "bebedouros"
  | "comedouros"
  | "gaiolas"
  | "casinhas"
  | "ninhos"
  | "tapetes"
  | "brinquedos"
  | "higiene"
  | "ferramentas"
  | "equipamentos"
  | "reproducao"
  | "manejo"
  | "kits";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  longDescription: string;
  images: string[];
  brand?: string;
  weight?: string;
  dimensions?: string;
  stock: number;
  available: boolean;
  featured: boolean;
  bestSeller: boolean;
  onSale: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

// Service Types
export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  icon: string;
  image: string;
  features: string[];
  cta: string;
}

// Portfolio Types
export type PortfolioCategory =
  | "projetos"
  | "clientes"
  | "granjas"
  | "instalacoes"
  | "eventos"
  | "feiras"
  | "exposicoes"
  | "entregas"
  | "producao";

export interface PortfolioItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  description: string;
  images: string[];
  video?: string;
  beforeAfter?: { before: string; after: string };
  date: string;
  client?: string;
  location?: string;
}

// Blog Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  authorRole: string;
  authorImage: string;
  date: string;
  readTime: string;
  tags: string[];
  comments: BlogComment[];
}

export interface BlogComment {
  id: string;
  name: string;
  email: string;
  content: string;
  date: string;
  approved: boolean;
}

// FAQ Types
export interface FAQCategory {
  id: string;
  title: string;
  icon: string;
  questions: FAQItem[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

// Testimonial
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  date: string;
}

// Partner
export interface Partner {
  id: string;
  name: string;
  logo: string;
  url: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: "admin" | "customer";
  addresses: Address[];
  orders: Order[];
  favorites: string[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

// Order Types
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  status: OrderStatus;
  paymentMethod: string;
  trackingCode?: string;
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  productId: string;
  type: "rabbit" | "product";
  name: string;
  image: string;
  price: number;
  quantity: number;
}

// Navigation
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// Review
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  productType: "rabbit" | "product";
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
}
