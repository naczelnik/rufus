/**
 * Centralny obiekt do zarządzania flagami funkcyjnymi w aplikacji.
 * Pozwala na włączanie/wyłączanie poszczególnych funkcjonalności.
 * 
 * Przykład użycia:
 * import { featureFlags } from './utils/featureFlags';
 * 
 * if (featureFlags.authEnabled) {
 *   // Uruchom kod związany z autoryzacją
 * }
 */
export const featureFlags = {
    /**
     * @type {boolean}
     * Włącza/wyłącza cały system autoryzacji i logowania oparty na Supabase.
     * Ustaw na `false`, aby aplikacja działała w trybie publicznym (jak wcześniej).
     * Ustaw na `true`, aby wymagać logowania od użytkowników.
     */
    authEnabled: true,
};
