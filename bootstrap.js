import init from './pkg/flowpanel.js';
import { renderLanding } from './src/strony/Landing.js';
import { renderLogowanie, inicjalizujLogikeLogowania } from './src/strony/Logowanie.js';
import { renderRejestracja, inicjalizujLogikeRejestracji } from './src/strony/Rejestracja.js';
import { renderPulpit, inicjalizujLogikePulpitu } from './src/strony/Pulpit.js';
import { renderUkladAplikacji, inicjalizujLogikeUkladu } from './src/komponenty/UkladAplikacji.js';
import { pobierzUzytkownika } from './src/api/auth.js';
import { featureFlags } from './src/utils/featureFlags.js';

const appContainer = document.getElementById('app');

const routes = {
    '': renderLanding,
    '#/logowanie': renderLogowanie,
    '#/rejestracja': renderRejestracja,
    '#/pulpit': renderPulpit,
};

async function router() {
    const path = window.location.hash || '#/';
    const publicPaths = ['#/', '#/logowanie', '#/rejestracja'];
    
    // Proste zabezpieczenie pulpitu
    if (path.startsWith('#/pulpit') && featureFlags.authEnabled) {
        const user = await pobierzUzytkownika();
        if (!user) {
            window.location.hash = '#/logowanie';
            return;
        }
        // Użytkownik jest zalogowany, renderujemy układ aplikacji z pulpitem
        appContainer.innerHTML = renderUkladAplikacji(user);
        const mainContent = appContainer.querySelector('.main-content');
        mainContent.innerHTML = renderPulpit();
        inicjalizujLogikeUkladu(user);
        inicjalizujLogikePulpitu();

    } else if (publicPaths.includes(path)) {
        // Renderowanie stron publicznych
        const renderFunction = routes[path.substring(1)] || renderLanding;
        appContainer.innerHTML = renderFunction();

        // Inicjalizacja logiki dla konkretnych stron
        if (path === '#/logowanie') inicjalizujLogikeLogowania();
        if (path === '#/rejestracja') inicjalizujLogikeRejestracji();
    } else {
        // Jeśli ścieżka nie jest publiczna i nie jest pulpitem (lub auth jest wyłączone)
        // przekierowujemy na stronę główną lub logowanie w zależności od stanu.
        const user = await pobierzUzytkownika();
        window.location.hash = user && featureFlags.authEnabled ? '#/pulpit' : '#/';
    }
}


async function run() {
  try {
    await init();
    console.log("Moduł FlowPanel (WASM) został pomyślnie załadowany.");

    // Nasłuchiwanie na zmiany w URL (hash)
    window.addEventListener('hashchange', router);
    // Stworzenie niestandardowego eventu, aby móc odświeżyć widok po logowaniu/wylogowaniu
    window.addEventListener('auth-change', router);
    
    // Pierwsze uruchomienie routera
    router();

  } catch (error) {
    console.error("Błąd krytyczny aplikacji FlowPanel:", error);
    document.body.innerHTML = `<div style="color: red; text-align: center; padding: 50px;">Wystąpił krytyczny błąd. Nie można załadować aplikacji. Sprawdź konsolę deweloperską.</div>`;
  }
}

run();