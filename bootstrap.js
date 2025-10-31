// WAŻNE: Importujemy nie tylko funkcję `generate_report`, ale też `init`.
// `init` to funkcja, która musi "odpalić" nasz silnik z Rusta.
import init, { generate_report } from './pkg/rufus.js';

async function run() {
  try {
    // KROK 1: Inicjalizujemy moduł. To jest kluczowy, brakujący krok.
    // Czekamy, aż przeglądarka załaduje i przygotuje nasz kod z Rusta.
    await init();
    console.log("Moduł Rufus (WASM) został pomyślnie załadowany i zainicjalizowany.");

    // Reszta kodu jest taka sama jak wcześniej...
    const generateReportButton = document.getElementById('generateReportButton');
    const visitsEl = document.getElementById('metric-visits');
    const conversionEl = document.getElementById('metric-conversion');
    const revenueEl = document.getElementById('metric-revenue');

    const updateDashboardFromRust = () => {
      const reportJsonString = generate_report();
      const reportData = JSON.parse(reportJsonString);

      if (visitsEl && conversionEl && revenueEl) {
        visitsEl.textContent = reportData.visits.toLocaleString('pl-PL');
        conversionEl.textContent = `${reportData.conversion_rate.toFixed(2)}%`;
        revenueEl.textContent = reportData.revenue.toLocaleString('pl-PL', { 
            style: 'currency', 
            currency: 'PLN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
      }
    };
    
    // Generujemy pierwszy raport od razu po załadowaniu
    if (generateReportButton) {
      updateDashboardFromRust();
      generateReportButton.addEventListener('click', updateDashboardFromRust);
    }

  } catch (error) {
    console.error("Błąd podczas ładowania lub inicjalizacji modułu WebAssembly:", error);
    document.body.innerHTML = `<div style="color: red; text-align: center; padding-top: 50px;">Wystąpił krytyczny błąd. Nie można załadować modułu analitycznego (WASM). Sprawdź konsolę deweloperską.</div>`;
  }
}

run();
