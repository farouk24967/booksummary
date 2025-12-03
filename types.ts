
export enum Language {
  FR = 'Français',
  EN = 'English',
  AR = 'العربية',
  ES = 'Español'
}

export enum Category {
  BUSINESS = 'Business',
  PSYCHOLOGY = 'Psychology',
  FICTION = 'Fiction',
  SCIENCE = 'Science',
  BIOGRAPHY = 'Biography',
  SELF_HELP = 'Self Help',
  PRODUCTIVITY = 'Productivity'
}

export type VoiceGender = 'male' | 'female';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  category: Category;
  rating: number;
  duration: number; // in minutes
  summary: string; // Short description
  longSummary?: string; // Detailed summary (~500 words)
  fullSummary?: {
    mainIdea: string;
    keyPoints: string[];
    lessons: string[];
  };
  audioUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year' | 'forever';
  features: string[];
  recommended?: boolean;
  color: string;
}

export type PaymentMethod = 'edahabia' | 'ccp';
