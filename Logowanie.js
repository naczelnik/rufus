import { zaloguj } from '../api/auth.js';

export function renderLogowanie() {
    return `
        <div class="public-page-container">
            <div class="form-container">
                <h1>Witaj w FlowPanel</h1>
                <p class="subtitle">Zaloguj się, aby kontynuować</p>
                <form id="loginForm">
                    <div class="input-group">
                        <label for="email">Adres Email</label>
                        <input type="email" id="email" name="email" required autocomplete="email">
                    </div>
                    <div class="input-group">
                        <label for="password">Hasło</label>
                        <input type="password" id="password" name="password" required autocomplete="current-password">
                    </div>
                    <button type="submit" id="submitButton">Zaloguj się</button>
                    <p id="errorMessage" class="error-message"></p>
                </form>
                <div class="form-footer">
                    Nie masz konta? <a href="#/rejestracja">Zarejestruj się</a>
                </div>
            </div>
        </div>
    `;
}

export function inicjalizujLogikeLogowania() {
    const form = document.getElementById('loginForm');
    const submitButton = document.getElementById('submitButton');
    const errorMessage = document.getElementById('errorMessage');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        submitButton.disabled = true;
        submitButton.textContent = 'Logowanie...';
        errorMessage.textContent = '';

        const email = form.email.value;
        const password = form.password.value;

        try {
            const user = await zaloguj(email, password);
            if (user) {
                window.location.hash = '#/pulpit';
                // Informujemy router, że stan autoryzacji się zmienił
                window.dispatchEvent(new CustomEvent('auth-change'));
            }
        } catch (error) {
            console.error('Błąd logowania:', error.message);
            errorMessage.textContent = 'Nieprawidłowy email lub hasło.';
            submitButton.disabled = false;
            submitButton.textContent = 'Zaloguj się';
        }
    });
}