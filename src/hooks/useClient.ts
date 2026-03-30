import { CLIENTS_BY_DOMAIN, DEFAULT_CLIENT, type ClientConfig } from '@/data/clients';

const STORAGE_KEY = 'wuru_active_client';

export function saveActiveClient(clientId: string) {
  localStorage.setItem(STORAGE_KEY, clientId);
}

export function clearActiveClient() {
  // Borra solo la sesión activa y el resultado de cotización temporal.
  // El historial por cliente (wuru_quotations_*) se conserva para futuras sesiones.
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('quotationData');
  sessionStorage.clear();
}

export function useClient(): ClientConfig {
  const id = localStorage.getItem(STORAGE_KEY);
  if (!id) return DEFAULT_CLIENT;
  return Object.values(CLIENTS_BY_DOMAIN).find(c => c.id === id) ?? DEFAULT_CLIENT;
}
