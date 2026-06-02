import type { Plan, Service, SocialLink, ContactInfo } from '../types';

export const site = {
  name: 'NovaCode',
  shortName: 'NC',
  description:
    'Agencia digital especializada en desarrollo web, marketing digital, ecommerce y diseño. Soluciones a medida para hacer crecer tu negocio.',
  url: 'https://novacode.com.ar',
  locale: 'es_AR',
  email: 'info@novacode.com.ar',
  phone: '+54 11 0000-0000',
  ogImage: '/og-image.svg',
} as const;

export const colors = {
  // Surfaces
  bgBase: '#0a0a0f',
  bgSurface: '#11121a',
  bgElevated: '#1a1c28',
  // Text
  textPrimary: '#f5f6fa',
  textSecondary: 'rgba(245, 246, 250, 0.65)',
  textTertiary: 'rgba(245, 246, 250, 0.45)',
  // Accents
  accent: '#6366f1',
  accentHover: '#818cf8',
  accent2: '#06b6d4',
  // Legacy (kept for service icon backgrounds and badge)
  secondary: '#b978cc',
  secondaryStrong: '#7a4f8b',
  success: '#87da4a',
  warning: '#ffbb00',
} as const;

export const sections = [
  { id: 'inicio', label: 'Inicio', href: '/' },
  { id: 'sobre-nosotros', label: 'Sobre Nosotros', href: '#sobre-nosotros' },
  { id: 'servicios', label: 'Servicios', href: '#servicios' },
  { id: 'planes', label: 'Planes', href: '#planes' },
  { id: 'contacto', label: 'Contacto', href: '#contacto' },
] as const;

export type Section = (typeof sections)[number];

export const socials: readonly SocialLink[] = [
  { name: 'Facebook', href: '#', icon: 'facebook' },
  { name: 'X (Twitter)', href: '#', icon: 'twitter' },
  { name: 'Instagram', href: '#', icon: 'instagram' },
  { name: 'LinkedIn', href: '#', icon: 'linkedin' },
];

export const services: readonly Service[] = [
  {
    icon: 'chart',
    title: 'Marketing Digital',
    description:
      'Construimos estrategias que conectan con tu audiencia y convierten visitantes en clientes.',
    features: [
      'Estrategias SEO para mayor visibilidad',
      'Publicidad digital (Google Ads, Meta Ads)',
      'Gestión y crecimiento en redes sociales',
    ],
  },
  {
    icon: 'monitor',
    title: 'Diseño y Desarrollo Web',
    description:
      'Creamos sitios web rápidos, atractivos y funcionales que garantizan una experiencia impecable.',
    features: [
      'Páginas web personalizadas',
      'Diseño UX/UI optimizado para conversión',
      'Desarrollo responsivo y orientado a SEO',
    ],
  },
  {
    icon: 'sparkle',
    title: 'Branding y Estrategia Visual',
    description: 'Diseñamos identidades visuales que representan la esencia de cada marca.',
    features: [
      'Creación de logotipos y manuales de identidad',
      'Estrategias de branding coherentes',
      'Desarrollo de material gráfico para campañas',
    ],
  },
];

export const plans: readonly Plan[] = [
  {
    name: 'Plan Básico',
    description: 'Ideal para pequeños negocios que inician su presencia digital',
    features: [
      'Sitio Web Responsive',
      'Hasta 5 Páginas',
      'SEO Básico',
      'Formulario de Contacto',
      'Integración con Redes Sociales',
    ],
    cta: { label: 'Comenzar Ahora', href: '#contacto', variant: 'outline' },
  },
  {
    name: 'Plan Profesional',
    description: 'Perfecto para empresas en crecimiento',
    features: [
      'Todo del Plan Básico',
      'Hasta 10 Páginas',
      'Blog Integrado',
      'SEO Avanzado',
      'Analytics y Reportes',
      'Optimización de Conversión',
      'Soporte Premium',
    ],
    cta: { label: 'Empezar Ahora', href: '#contacto', variant: 'primary' },
    featured: true,
    badge: 'Más Popular',
  },
  {
    name: 'Plan Empresarial',
    description: 'Solución completa para grandes empresas',
    features: [
      'Todo del Plan Profesional',
      'Páginas Ilimitadas',
      'E-commerce Integrado',
      'Panel de Administración',
      'API Personalizada',
      'Seguridad Avanzada',
      'Soporte 24/7',
    ],
    cta: { label: 'Contactar', href: '#contacto', variant: 'outline' },
  },
];

export const contactInfo: readonly ContactInfo[] = [
  { emoji: '📍', title: 'Ubicación', description: 'Buenos Aires, Argentina' },
  { emoji: '📧', title: 'Email', description: 'info@novacode.com.ar' },
  { emoji: '📱', title: 'Teléfono', description: '+54 9 11 5734-5989' },
];

export const legalLinks = [
  { label: 'Política de Privacidad', href: '/privacidad' },
  { label: 'Términos y Condiciones', href: '/terminos' },
] as const;
