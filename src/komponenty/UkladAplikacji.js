import { wyloguj } from '../api/auth.js';
import { featureFlags } from '../utils/featureFlags.js';

export function renderUkladAplikacji(user) {
    const userEmail = user ? user.email : '';

    return `
        <div class="app-layout">
            <aside class="sidebar">
                <div class="sidebar-header">
                    <span class="sidebar-logo">FlowPanel</span>
                    <button class="pin-sidebar-btn" id="pinSidebarBtn" title="Przypnij pasek boczny">📌</button>
                </div>
                <nav class="sidebar-nav">
                    <ul>
                        <li><a href="#/pulpit" id="nav-dashboard" class="active">
                            <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg></span>
                            <span class="nav-text">Pulpit</span>
                        </a></li>
                        <li><a href="#/raporty" id="nav-raporty">
                            <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></span>
                            <span class="nav-text">Raporty</span>
                        </a></li>
                        <li><a href="#/dane-sprzedazy" id="nav-dane-sprzedazy">
                            <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 12V8H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12v4"></path><path d="M4 6v12a2 2 0 0 0 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1-.9-2-2-2Z"></path></svg></span>
                            <span class="nav-text">Dane Sprzedaży</span>
                        </a></li>
                        <li><a href="#/tracking" id="nav-tracking">
                             <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg></span>
                            <span class="nav-text">Tracking</span>
                        </a></li>
                    </ul>
                </nav>
            </aside>

            <header class="app-header">
                <div class="header-left">
                     <h1 id="pageTitle">Pulpit</h1>
                </div>
                <div class="header-right">
                    <div id="user-profile-section" class="user-profile-section">
                        <span id="user-email" class="user-email">${userEmail}</span>
                        <button id="logoutButton" title="Wyloguj">Wyloguj</button>
                    </div>
                    <button class="theme-toggle-btn" id="themeToggleBtn" title="Zmień motyw">
                        <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                        <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                    </button>
                </div>
            </header>
            
            <main class="main-content"></main>
        </div>
    `;
}

export function inicjalizujLogikeUkladu(user) {
    const layout = document.querySelector('.app-layout');
    const sidebar = document.querySelector('.sidebar');
    const pinSidebarBtn = document.getElementById('pinSidebarBtn');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const logoutButton = document.getElementById('logoutButton');

    // Wylogowanie
    if (featureFlags.authEnabled && user && logoutButton) {
        logoutButton.addEventListener('click', async () => {
            await wyloguj();
            window.location.hash = '#/logowanie';
            window.dispatchEvent(new CustomEvent('auth-change'));
        });
    }

    // Pasek boczny
    const setPinnedState = (isPinned) => {
        layout.classList.toggle('sidebar-pinned', isPinned);
        pinSidebarBtn.classList.toggle('is-pinned', isPinned);
        if (isPinned) layout.classList.add('sidebar-expanded');
        localStorage.setItem('sidebarPinned', isPinned);
    };

    if (localStorage.getItem('sidebarPinned') === 'true') {
        setPinnedState(true);
    }

    if (sidebar && pinSidebarBtn) {
        sidebar.addEventListener('mouseenter', () => !layout.classList.contains('sidebar-pinned') && layout.classList.add('sidebar-expanded'));
        sidebar.addEventListener('mouseleave', () => !layout.classList.contains('sidebar-pinned') && layout.classList.remove('sidebar-expanded'));
        pinSidebarBtn.addEventListener('click', () => setPinnedState(!layout.classList.contains('sidebar-pinned')));
    }

    // Motyw
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-theme');
        document.documentElement.classList.toggle('light-theme');
    });
}