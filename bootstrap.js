
import { GoogleGenAI } from 'https://esm.run/@google/genai';
import init, { generate_report } from './pkg/flowpanel.js';

// --- GŁÓWNA FUNKCJA APLIKACJI ---
async function run() {
  try {
    await init();
    console.log("Moduł FlowPanel (WASM) został pomyślnie załadowany.");

    // --- LOGIKA LAYOUTU I INTERAKCJI ---
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');
    const pinSidebarBtn = document.getElementById('pinSidebarBtn');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const pageTitle = document.getElementById('pageTitle');

    // Funkcja do ustawiania stanu przypięcia
    const setPinnedState = (isPinned) => {
      body.classList.toggle('sidebar-pinned', isPinned);
      pinSidebarBtn.classList.toggle('is-pinned', isPinned);
      pinSidebarBtn.title = isPinned ? 'Odepnij pasek boczny' : 'Przypnij pasek boczny';
      if (isPinned) {
        body.classList.add('sidebar-expanded');
        body.classList.remove('sidebar-collapsed');
      }
      localStorage.setItem('sidebarPinned', isPinned);
    };

    // Odczyt zapisanego stanu paska bocznego przy ładowaniu strony
    if (localStorage.getItem('sidebarPinned') === 'true') {
      setPinnedState(true);
    }

    // Automatyczne rozwijanie/zwijanie paska bocznego i przypinanie
    if (sidebar && pinSidebarBtn) {
        sidebar.addEventListener('mouseenter', () => {
            if (!body.classList.contains('sidebar-pinned')) {
                body.classList.add('sidebar-expanded');
                body.classList.remove('sidebar-collapsed');
            }
        });

        sidebar.addEventListener('mouseleave', () => {
            if (!body.classList.contains('sidebar-pinned')) {
                body.classList.remove('sidebar-expanded');
                body.classList.add('sidebar-collapsed');
            }
        });

        pinSidebarBtn.addEventListener('click', () => {
            const isCurrentlyPinned = body.classList.contains('sidebar-pinned');
            setPinnedState(!isCurrentlyPinned);
        });
    }

    // Przełączanie motywu
    themeToggleBtn.addEventListener('click', () => {
      body.classList.toggle('dark-theme');
      body.classList.toggle('light-theme');
    });

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
      if (targetPage) {
        targetPage.style.display = 'block';
        // Zaktualizuj tytuł w nagłówku
        if (pageTitle && targetPage.dataset.title) {
          pageTitle.textContent = targetPage.dataset.title;
        }
      }
    }

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPageId = `page-${link.id.replace('nav-','')}`;
        switchPage(targetPageId);
      });
    });

    // --- LOGIKA DASHBOARDU ---
    const generateReportButton = document.getElementById('generateReportButton');
    const visitsEl = document.getElementById('metric-visits');
    const conversionEl = document.getElementById('metric-conversion');
    const revenueEl = document.getElementById('metric-revenue');
    const aiReportContainer = document.getElementById('ai-report-container');
    const aiReportContent = document.getElementById('ai-report-content');

    const generateAndAnalyze = () => {
      generateReportButton.disabled = true;
      generateReportButton.textContent = 'Generowanie...';

      setTimeout(async () => {
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

          aiReportContainer.style.display = 'block';
          aiReportContent.innerHTML = '<div class="loader"></div>';

          const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
          const prompt = `Jesteś ekspertem od marketingu cyfrowego. Przeanalizuj poniższe dane z dashboardu i napisz zwięzły raport (maksymalnie 3-4 zdania) z kluczowymi wnioskami i praktycznymi poradami dla właściciela firmy w języku polskim. Użyj formatowania markdown (np. pogrubienie dla kluczowych metryk). Dane: Odwiedziny: ${reportData.visits}, Konwersja: ${reportData.conversion_rate.toFixed(2)}%, Przychód: ${reportData.revenue.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}.`;
          
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
          });

          const aiText = response.text;
          const formattedText = aiText
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/(\r\n|\n|\r)/gm, '<br>');

          aiReportContent.innerHTML = `<p>${formattedText}</p>`;

        } catch (error) {
          console.error("Błąd podczas generowania raportu lub analizy AI:", error);
           if (aiReportContent) {
            aiReportContent.innerHTML = `<p style="color: #ff9999;">Wystąpił błąd podczas generacji analizy AI. Spróbuj ponownie.</p>`;
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

    // Ustawienie strony startowej
    switchPage('page-dashboard');

  } catch (error) {
    console.error("Błąd krytyczny aplikacji FlowPanel:", error);
    document.body.innerHTML = `<div style="color: red; text-align: center; padding: 50px;">Wystąpił krytyczny błąd. Nie można załadować aplikacji. Sprawdź konsolę deweloperską.</div>`;
  }
}

run();