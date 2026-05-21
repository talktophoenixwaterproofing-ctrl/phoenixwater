import { LucideIcon } from 'lucide-react';

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  image?: string;
  technicalDetails?: string;
}

export interface BusinessInfo {
  name: string;
  phones: string[];
  address: string;
  email: string;
}

export interface SEOContent {
  title: string;
  description: string;
  keywords: string;
}

export interface PastWork {
  id: string;
  imageUrl: string;
  title: string;
  category?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
  photoUrl: string;
}

export interface SiteContent {
  businessInfo: BusinessInfo;
  services: Service[];
  seo: SEOContent;
  pastWorks?: PastWork[];
  testimonials?: Testimonial[];
}
