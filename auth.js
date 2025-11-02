import { supabase } from './supabaseClient.js';

/**
 * Rejestruje nowego użytkownika i ustawia 14-dniowy okres próbny.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<object>} Obiekt użytkownika.
 */
export async function zarejestruj(email, password) {
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 14);

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                trial_ends_at: trialEndDate.toISOString(),
                plan: 'trial'
            }
        }
    });

    if (error) {
        throw error;
    }
    return data.user;
}


/**
 * Loguje użytkownika za pomocą adresu email i hasła.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<object>} Obiekt użytkownika.
 */
export async function zaloguj(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        throw error;
    }

    return data.user;
}

/**
 * Wylogowuje aktualnie zalogowanego użytkownika.
 */
export async function wyloguj() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Błąd podczas wylogowywania:', error);
        throw error;
    }
}

/**
 * Pobiera dane aktualnie zalogowanego użytkownika na podstawie aktywnej sesji.
 * @returns {Promise<object|null>} Obiekt użytkownika lub null, jeśli nikt nie jest zalogowany.
 */
export async function pobierzUzytkownika() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
        console.error("Błąd podczas pobierania sesji:", error);
        return null;
    }
    
    return session ? session.user : null;
}