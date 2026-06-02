export type ServiceIcon = 'chart' | 'monitor' | 'sparkle';
export type SocialIcon = 'facebook' | 'twitter' | 'instagram' | 'linkedin';
export type IconName = ServiceIcon | SocialIcon | 'check' | 'chevron-down' | 'arrow-right';

export interface Service {
  icon: ServiceIcon;
  title: string;
  description: string;
  features: readonly string[];
}

export type PlanVariant = 'primary' | 'outline';

export interface Plan {
  name: string;
  description: string;
  features: readonly string[];
  cta: { label: string; href: string; variant: PlanVariant };
  featured?: boolean;
  badge?: string;
}

export interface SocialLink {
  name: string;
  href: string;
  icon: SocialIcon;
}

export interface ContactInfo {
  emoji: string;
  title: string;
  description: string;
}
