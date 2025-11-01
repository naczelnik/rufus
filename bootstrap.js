

import init, { generate_report } from './pkg/flowpanel.js';

// --- FUNKCJA Z LOGIKĄ EKSPERCKĄ ---
const getExpertAnalysis = (data) => {
    let advice = [];
    
    // Reguła dla konwersji
    if (data.conversion_rate < 1.0) {
        advice.push("<strong>Niska konwersja:</strong> Wartość poniżej 1% sugeruje, że strona docelowa lub oferta mogą wymagać optymalizacji. Przetestuj nagłówki, wezwania do działania (CTA) i czytelność oferty.");
    } else if (data.conversion_rate > 3.0) {
        advice.push("<strong>Świetna konwersja!</strong> Wynik powyżej 3% jest bardzo dobry. Rozważ zwiększenie ruchu na stronie (np. przez reklamy), aby w pełni wykorzystać jej potencjał.");
    }

    // Reguła dla przychodu w stosunku do ruchu
    if (data.revenue < 1000 && data.visits > 2000) {
        advice.push("<strong>Niski przychód przy dużym ruchu:</strong> Mimo wielu odwiedzin, przychód jest niski. Przeanalizuj ofertę lub model cenowy. Możliwe, że ruch pochodzi ze źródeł, które nie generują wartościowych klientów.");
    }

    // Domyślna porada, jeśli żadna inna nie pasuje
    if (advice.length === 0) {
        advice.push("<strong>Stabilne wyniki:</strong> Metryki są w normie. Kontynuuj monitorowanie i szukaj okazji do optymalizacji poszczególnych kampanii marketingowych.");
    }

    return advice.map(item => `<p>${item}</p>`).join('');
};


// --- GŁÓWNA FUNKCJA APLIKACJI ---
async function run() {
  try {
    await init();
    console.log("Moduł FlowPanel (WASM) został pomyślnie załadowany.");

    // --- LOGIKA NOWEGO LAYOUTU ---
    const body = document.body;
    const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const THEME_KEY = 'flowpanel-theme';
    
    const iconMenu = document.getElementById('icon-menu');
    const iconClose = document.getElementById('icon-close');
    const iconSun = document.getElementById('icon-sun');
    const iconMoon = document.getElementById('icon-moon');

    // Przełączanie paska bocznego
    toggleSidebarBtn.addEventListener('click', () => {
      const isExpanded = body.classList.toggle('sidebar-expanded');
      body.classList.toggle('sidebar-collapsed', !isExpanded);
      iconMenu.style.display = isExpanded ? 'none' : 'block';
      iconClose.style.display = isExpanded ? 'block' : 'none';
    });

    // Funkcja do ustawiania motywu
    const applyTheme = (theme) => {
      body.classList.remove('dark-theme', 'light-theme');
      body.classList.add(`${theme}-theme`);
      
      const isDark = theme === 'dark';
      iconSun.style.display = isDark ? 'block' : 'none';
      iconMoon.style.display = isDark ? 'none' : 'block';
      
      localStorage.setItem(THEME_KEY, theme);
    };

    // Przełączanie motywu
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = localStorage.getItem(THEME_KEY) || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
    
    // Inicjalizacja stanu UI przy starcie
    const initUI = () => {
        // Ustawienie motywu
        const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
        applyTheme(savedTheme);

        // Ustawienie paska bocznego
        const isExpanded = body.classList.contains('sidebar-expanded');
        iconMenu.style.display = isExpanded ? 'none' : 'block';
        iconClose.style.display = isExpanded ? 'block' : 'none';
    };


    // --- NAWIGACJA MIĘDZY STRONAMI (SPA) ---
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const pages = document.querySelectorAll('.page');

    const switchPage = (targetId) => {
      // Deaktywuj wszystkie linki i ukryj wszystkie strony
      navLinks.forEach(link => link.classList.remove('active'));
      pages.forEach(page => page.style.display = 'none');

      // Aktywuj kliknięty link i pokaż odpowiednią stronę
      const activeLink = document.getElementById(`nav-${targetId.replace('page-','')}`);
      const targetPage = document.getElementById(targetId);

      if (activeLink) activeLink.classList.add('active');
      if (targetPage) targetPage.style.display = 'block';
    }

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPageId = `page-${link.id.replace('nav-','')}`;
        switchPage(targetPageId);
      });
    });

    // --- LOGIKA DASHBOARDU (PRZENIESIONA Z POPRZEDNIEJ WERSJI) ---
    const generateReportButton = document.getElementById('generateReportButton');
    const visitsEl = document.getElementById('metric-visits');
    const conversionEl = document.getElementById('metric-conversion');
    const revenueEl = document.getElementById('metric-revenue');
    const aiReportContainer = document.getElementById('ai-report-container');
    const aiReportContent = document.getElementById('ai-report-content');

    const generateAndAnalyze = () => {
      generateReportButton.disabled = true;
      generateReportButton.textContent = 'Generowanie...';

      // Używamy setTimeout, aby dać przeglądarce chwilę na odświeżenie UI (zmiana tekstu przycisku)
      setTimeout(() => {
        try {
          const reportJsonString = generate_report();
          const reportData = JSON.parse(reportJsonString);

          visitsEl.textContent = reportData.visits.toLocaleString('pl-PL');
          conversionEl.textContent = `${reportData.conversion_rate.toFixed(2)}%`;
          revenueEl.textContent = reportData.revenue.toLocaleString('pl-PL', { 
              style: 'currency', 
              currency: 'PLN',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
          });
          
          // Generowanie analizy przez lokalną logikę
          const expertAdvice = getExpertAnalysis(reportData);
          aiReportContent.innerHTML = expertAdvice;
          aiReportContainer.style.display = 'block';

        } catch (error) {
          console.error("Błąd podczas generowania raportu:", error);
           if (aiReportContent) {
            aiReportContent.innerHTML = `<p style="color: #ff9999;">Wystąpił błąd podczas generacji raportu. Spróbuj ponownie.</p>`;
           }
        } finally {
          generateReportButton.disabled = false;
          generateReportButton.textContent = 'Generuj Raport';
        }
      }, 50);
    };
    
    if (generateReportButton) {
      generateAndAnalyze();
      generateReportButton.addEventListener('click', generateAndAnalyze);
    }
    
    // Inicjalizacja i ustawienie strony startowej
    initUI();
    switchPage('page-dashboard');

  } catch (error) {
    console.error("Błąd krytyczny aplikacji FlowPanel:", error);
    document.body.innerHTML = `<div style="color: red; text-align: center; padding: 50px;">Wystąpił krytyczny błąd. Nie można załadować aplikacji. Sprawdź konsolę deweloperską.</div>`;
  }
}

run();