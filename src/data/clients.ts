/**
 * Configuración de clientes (multi-tenant mock).
 *
 * CÓMO AGREGAR UN NUEVO CLIENTE:
 * 1. Agrega una nueva entrada en CLIENTS_BY_DOMAIN con el dominio de email como clave.
 * 2. Coloca el logo en /public/logos/<cliente>.svg (o .png)
 * 3. Coloca el favicon en /public/logos/<cliente>-favicon.svg
 * 4. Agrega los cirujanos del cliente en src/data/surgeons.ts
 *    usando exactamente los mismos nombres de hospitales que defines aquí.
 */

import haLogoUrl from '@/assets/ha-logo.png';

export interface ClientConfig {
  id: string;
  name: string;
  logo: string | null;    // URL o path al logo — null muestra el nombre como texto
  favicon: string;        // URL o path al favicon
  hospitals: string[];
  credentials: { email: string; password: string };
}

export const CLIENTS_BY_DOMAIN: Record<string, ClientConfig> = {
  'hospitalangeles.com': {
    id: 'angeles',
    name: 'Hospital Ángeles Health System',
    logo: haLogoUrl,
    favicon: '/favicon.ico',
    hospitals: [
      'Hospital Ángeles Acoxpa (CDMX)',
      'Hospital Ángeles Centro Sur (CDMX)',
      'Hospital Ángeles Ciudad Juárez (Chihuahua)',
      'Hospital Ángeles Clínica Londres (CDMX)',
      'Hospital Ángeles Culiacán (Sinaloa)',
      'Hospital Ángeles Del Carmen (Guadalajara, Jalisco)',
      'Hospital Ángeles León (Guanajuato)',
      'Hospital Ángeles Lindavista (CDMX)',
      'Hospital Ángeles Lomas (CDMX / Huixquilucan)',
      'Hospital Ángeles Metropolitano (CDMX)',
      'Hospital Ángeles México (CDMX)',
      'Hospital Ángeles Mocel (CDMX)',
      'Hospital Ángeles Morelia (Michoacán)',
      'Hospital Ángeles Pedregal (CDMX)',
      'Hospital Ángeles Puebla (Puebla)',
      'Hospital Ángeles Querétaro (Querétaro)',
      'Hospital Ángeles Roma (CDMX)',
      'Hospital Ángeles Cuauhtémoc (Cuauhtémoc, Chih.)',
      'Hospital Ángeles Chihuahua (Chihuahua)',
      'Hospital Ángeles Universidad (CDMX)',
    ],
    credentials: { email: 'admin@hospitalangeles.com', password: 'admin' },
  },

  'hospitalsantabarbara.com': {
    id: 'santa-barbara',
    name: 'Clínica Santa Bárbara',
    logo: '/logos/santa-barbara.png',
    favicon: '/logos/santa-barbara-favicon.svg',
    hospitals: [
      'Clínica Santa Bárbara Norte',
      'Clínica Santa Bárbara Oeste',
      'Clínica Santa Bárbara Sur',
      'Clínica Santa Bárbara Centro',
      'Clínica Santa Bárbara Este',
    ],
    credentials: { email: 'admin@hospitalsantabarbara.com', password: 'adminwuru' },
  },
};

/**
 * Resuelve el cliente a partir del dominio del email.
 * Devuelve null si el dominio no está registrado.
 */
export function resolveClientByEmail(email: string): ClientConfig | null {
  const domain = email.split('@')[1]?.toLowerCase() ?? '';
  return CLIENTS_BY_DOMAIN[domain] ?? null;
}

/** Cliente por defecto para la app (cuando no hay sesión activa). */
export const DEFAULT_CLIENT = CLIENTS_BY_DOMAIN['hospitalangeles.com'];
