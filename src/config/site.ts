export const site = {
  name: "NovaCode",
  shortName: "NC",
  description:
    "Agencia digital especializada en desarrollo web, marketing digital, ecommerce y diseño. Soluciones a medida para hacer crecer tu negocio.",
  url: "https://novacode.com.ar",
  locale: "es_AR",
  email: "info@novacode.com.ar",
  phone: "+54 11 0000-0000",
  ogImage: "/og-image.svg",
} as const;

export const colors = {
  primary: "#000000",
  secondary: "#b978cc",
  accent: "#87da4a",
  highlight: "#ffbb00",
  textPrimary: "#ffffff",
  textSecondary: "rgba(255, 255, 255, 0.7)",
} as const;

export const sections = [
  { id: "inicio", label: "Inicio", href: "/" },
  { id: "sobre-nosotros", label: "Sobre Nosotros", href: "#sobre-nosotros" },
  { id: "servicios", label: "Servicios", href: "#servicios" },
  { id: "planes", label: "Planes", href: "#planes" },
  { id: "contacto", label: "Contacto", href: "#contacto" },
] as const;

export type Section = (typeof sections)[number];

export const socials = [
  { name: "Facebook", href: "#", icon: "facebook" },
  { name: "X (Twitter)", href: "#", icon: "twitter" },
  { name: "Instagram", href: "#", icon: "instagram" },
  { name: "LinkedIn", href: "#", icon: "linkedin" },
] as const;

export type Social = (typeof socials)[number];
