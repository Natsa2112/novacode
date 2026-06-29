export type ServiceIcon = 'megaphone' | 'code' | 'palette';
export type SocialIcon = 'facebook' | 'twitter' | 'instagram' | 'linkedin';
export type ContactIcon = 'map-pin' | 'mail' | 'phone';
export type IconName =
  | ServiceIcon
  | SocialIcon
  | ContactIcon
  | 'check'
  | 'chevron-down'
  | 'arrow-right';

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
  icon: ContactIcon;
  title: string;
  description: string;
}
