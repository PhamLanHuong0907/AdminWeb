// Navigation Types
export interface DropdownItem {
  label: string;
  href: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  dropdown?: DropdownItem[];
}

// Introduce Services Types
export interface ServiceImage {
  id: string;
  url: string;
  alt: string;
}

export interface IntroduceService {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  gradient: string;
  images: ServiceImage[];
  href: string;
}

// Services HeroSection Types
export interface HeroCard {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface ServiceHeroSection {
  id: string;
  serviceId: string;
  serviceName: string;
  backgroundImage: string;
  title: string;
  subtitle: string;
  slogan: string;
  cards: HeroCard[];
}

// Products Services Types
export interface ProductItem {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  path: string;
}

export interface ProductService {
  id: string;
  serviceId: string;
  serviceName: string;
  products: ProductItem[];
}

// Products Types
export interface ProductTag {
  icon: string;
  text: string;
  colorClass: string;
}

export interface ProductFeature {
  tag: ProductTag;
  title: string;
  description: string;
  image: string;
}

export interface ProductInfo {
  icon: string;
  text: string;
  subText: string;
}

export interface Product {
  id: string;
  systemId: string;
  systemName: string;
  path: string;
  title: string;
  highlight: string;
  description: string;
  image: string;
  features: ProductFeature[];
  info: ProductInfo[];
}

// Projects Types
export interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  category: string;
  path: string;
  urlWord: string;
}

// Testimonials Types
export interface Testimonial {
  id: string;
  content: string;
  author: string;
  position: string;
  company: string;
}
