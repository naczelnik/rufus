import { zarejestruj } from '../api/auth.js';

export function renderRejestracja() {
    return `
        <div class="public-page-container">
            <div class="form-container">
                <h1>Utwórz konto</h1>
                <p class="subtitle">Rozpocznij 14-dniowy okres próbny</p>
                <form id="registrationForm">
                    <div class="input-group">
                        <label for="email">Adres Email</label>
                        <input type="email" id="email" name="email" required autocomplete="email">
                    </div>
                    <div class="input-group">
                        <label for="password">Hasło (min. 6 znaków)</label>
                        <input type="password" id="password" name="password" required minlength="6" autocomplete="new-password">
                    </div>
                    <button type="submit" id="submitButton">Zarejestruj się</button>
                    <p id="errorMessage" class="error-message"></p>
                </form>
                <div class="form-footer">
                    Masz już konto? <a href="#/logowanie">Zaloguj się</a>
                </div>
            </div>
        </div>
    `;
}

export function inicjalizujLogikeRejestracji() {
    const form = document.getElementById('registrationForm');
    const submitButton = document.getElementById('submitButton');
    const errorMessage = document.getElementById('errorMessage');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        submitButton.disabled = true;
        submitButton.textContent = 'Tworzenie konta...';
        errorMessage.textContent = '';

        const email = form.email.value;
        const password = form.password.value;

        try {
            await zarejestruj(email, password);
            // Po pomyślnej rejestracji, Supabase wysyła email weryfikacyjny.
            // Możemy przekierować użytkownika lub pokazać mu komunikat.
            const formContainer = document.querySelector('.form-container');
            formContainer.innerHTML = `
                <h1>Sprawdź swoją skrzynkę!</h1>
                <p class="subtitle" style="text-align: center;">Wysłaliśmy link weryfikacyjny na adres <strong>${email}</strong>. Kliknij go, aby dokończyć rejestrację.</p>
                 <div class="form-footer">
                    <a href="#/logowanie">Przejdź do logowania</a>
                </div>
            `;
        } catch (error) {
            console.error('Błąd rejestracji:', error.message);
            errorMessage.textContent = 'Wystąpił błąd lub użytkownik o tym adresie email już istnieje.';
            submitButton.disabled = false;
            submitButton.textContent = 'Zarejestruj się';
        }
    });
}