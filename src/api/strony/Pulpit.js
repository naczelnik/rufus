import { renderKartaAnalityczna } from '../komponenty/KartaAnalityczna.js';

export function renderPulpit() {
    // Te dane będą w przyszłości pobierane z API
    const daneDoKart = [
        {
            id: 'total-ad-spend',
            tytul: 'Całkowity Zysk z Reklam',
            ikona: '💰',
            metryki: [
                { etykieta: 'Profit', wartosc: 930.06, waluta: 'zł', klasa: 'positive' },
                { etykieta: 'Sprzedaże', wartosc: 25 }
            ],
            daneWykresu: {
                labels: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj'],
                datasets: [{
                    label: 'Profit',
                    data: [150, 280, 220, 450, 930],
                    borderColor: 'var(--success-color)',
                    tension: 0.4,
                    fill: false
                }]
            }
        },
        {
            id: 'meta-stats',
            tytul: 'Meta Stats',
            ikona: 'Ⓜ️',
            metryki: [
                { etykieta: 'Profit', wartosc: 822.06, waluta: 'zł', klasa: 'positive' },
                { etykieta: 'Sprzedaże', wartosc: 24 }
            ],
            daneWykresu: {
                labels: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj'],
                datasets: [{
                    label: 'Profit',
                    data: [120, 200, 180, 380, 822],
                     borderColor: '#1877F2',
                    tension: 0.4,
                    fill: false
                }]
            }
        },
        {
            id: 'google-stats',
            tytul: 'Google Stats',
            ikona: '🇬',
            metryki: [
                { etykieta: 'Profit', wartosc: 77, waluta: 'zł', klasa: 'positive' },
                { etykieta: 'Sprzedaże', wartosc: 1 }
            ],
             daneWykresu: {
                labels: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj'],
                datasets: [{
                    label: 'Profit',
                    data: [10, 20, 15, 40, 77],
                     borderColor: '#4285F4',
                    tension: 0.4,
                    fill: false
                }]
            }
        },
        {
            id: 'tiktok-stats',
            tytul: 'Tiktok Stats',
            ikona: '🎵',
            metryki: [
                { etykieta: 'Profit', wartosc: 0, waluta: 'zł' },
                { etykieta: 'Sprzedaże', wartosc: 0 }
            ],
             daneWykresu: {
                labels: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj'],
                datasets: [{
                    label: 'Profit',
                    data: [0, 0, 0, 0, 0],
                    borderColor: '#EE1D52',
                    tension: 0.4,
                    fill: false
                }]
            }
        },
    ];

    let kartyHTML = daneDoKart.map(dane => renderKartaAnalityczna(dane)).join('');

    return `
        <div id="page-dashboard" class="page">
            <div class="page-header">
                <h1>Pulpit Główny</h1>
            </div>
            <div class="dashboard-grid">
                ${kartyHTML}
            </div>
        </div>
    `;
}

export function inicjalizujLogikePulpitu() {
    // Po renderowaniu HTML, inicjalizujemy wykresy
    document.querySelectorAll('.stat-card-chart canvas').forEach(canvas => {
        const chartDataString = canvas.dataset.chartdata;
        if (chartDataString) {
            const chartData = JSON.parse(chartDataString);
            new Chart(canvas.getContext('2d'), {
                type: 'line',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                        },
                    },
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    },
                    elements: {
                        point: { radius: 0 }
                    }
                }
            });
        }
    });
}