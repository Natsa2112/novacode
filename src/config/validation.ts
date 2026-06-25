import { z } from 'zod';

export const contactSchema = z.object({
  nombre: z
    .string()
    .min(2, 'Ingresá tu nombre (2-100 caracteres).')
    .max(100, 'El nombre no puede superar los 100 caracteres.'),
  email: z.email('Email inválido.').max(200, 'El email no puede superar los 200 caracteres.'),
  telefono: z
    .string()
    .regex(/^[\d\s+\-()]{6,}$/, 'Teléfono inválido.')
    .max(30, 'El teléfono no puede superar los 30 caracteres.'),
  servicio: z.enum(['web', 'marketing', 'ecommerce', 'otro'], {
    message: 'Elegí un servicio válido.',
  }),
  mensaje: z
    .string()
    .min(3, 'El mensaje debe tener entre 3 y 2000 caracteres.')
    .max(2000, 'El mensaje debe tener entre 3 y 2000 caracteres.'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
