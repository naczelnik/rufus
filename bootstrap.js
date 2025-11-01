import init, { generate_report } from './pkg/flowpanel.js';

let revenueChartInstance = null; // Zmienna do przechowywania instancji wykresu

// --- FUNKCJA RYSUJĄCA WYKRES ---
const renderRevenueChart = (reportData) => {
    const ctx = document.getElementById('revenueChart').getContext('2d');

    // Symulacja danych historycznych dla wykresu
    // W przyszłości te dane będą pochodzić z modułu Rust
    const labels = ['Dzień 1', 'Dzień 2', 'Dzień 3', 'Dzień 4', 'Dzień 5', 'Dzień 6', 'Dzień 7'];
    const revenueData = Array.from({length: 6}, () => Math.random() * reportData.revenue * 0.2);
    revenueData.push(reportData.revenue); // Ostatni dzień to aktualny przychód
    const costData = revenueData.map(r => r * (0.4 + Math.random() * 0.2)); // Koszt jako % przychodu

    const chartConfig = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Przychód',
                data: revenueData,
                backgroundColor: 'rgba(0, 255, 153, 0.1)',
                borderColor: 'rgba(0, 255, 153, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(0, 255, 153, 1)',
                pointRadius: 4,
            }, {
                label: 'Koszt',
                data: costData,
                backgroundColor: 'rgba(176, 179, 184, 0.1)',
                borderColor: 'rgba(176, 179, 184, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(176, 179, 184, 1)',
                pointRadius: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                       callback: function(value) {
                           return value.toLocaleString('pl-PL') + ' zł';
                       }
                    }
                },
                x: {
                   grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        boxWidth: 12,
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' });
                            }
                            return label;
                        }
                    }
                }
            }
        }
    };
    
    if (revenueChartInstance) {
        revenueChartInstance.destroy();
    }
    
    revenueChartInstance = new Chart(ctx, chartConfig);
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
    
    const initUI = () => {
        const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
        applyTheme(savedTheme);
        const isExpanded = body.classList.contains('sidebar-expanded');
        iconMenu.style.display = isExpanded ? 'none' : 'block';
        iconClose.style.display = isExpanded ? 'block' : 'none';
    };

    // --- NAWIGACJA MIĘDZY STRONAMI (SPA) ---
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const pages = document.querySelectorAll('.page');
    const switchPage = (targetId) => {
      navLinks.forEach(link => link.classList.remove('active'));
      pages.forEach(page => page.style.display = 'none');
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

    // --- LOGIKA NOWEGO DASHBOARDU ---
    const refreshDataButton = document.getElementById('refreshDataButton');
    const conversionEl = document.getElementById('metric-conversion');
    const revenueEl = document.getElementById('metric-revenue');

    const generateAndAnalyze = async () => {
      refreshDataButton.disabled = true;
      refreshDataButton.textContent = 'Ładowanie...';

      // Symulujemy opóźnienie, aby dać wrażenie ładowania
      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        const reportJsonString = generate_report();
        const reportData = JSON.parse(reportJsonString);

        // Aktualizacja metryk w widgecie
        conversionEl.textContent = `${reportData.conversion_rate.toFixed(2)}%`;
        revenueEl.textContent = reportData.revenue.toLocaleString('pl-PL', { 
            style: 'currency', 
            currency: 'PLN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        
        // Renderowanie wykresu
        renderRevenueChart(reportData);

      } catch (error) {
        console.error("Błąd podczas generowania raportu:", error);
        alert("Wystąpił błąd podczas generacji raportu. Spróbuj ponownie.");
      } finally {
        refreshDataButton.disabled = false;
        refreshDataButton.textContent = 'Odśwież dane';
      }
    };
    
    if (refreshDataButton) {
      generateAndAnalyze(); // Wygeneruj dane przy pierwszym załadowaniu
      refreshDataButton.addEventListener('click', generateAndAnalyze);
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
