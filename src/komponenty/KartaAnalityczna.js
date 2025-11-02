export function renderKartaAnalityczna(dane) {
    const { id, tytul, ikona, metryki, daneWykresu } = dane;

    const metrykiHTML = metryki.map(m => `
        <div class="metric-item">
            <h3>${m.etykieta}</h3>
            <p class="${m.klasa || ''}">
                ${m.wartosc.toLocaleString('pl-PL', { minimumFractionDigits: m.waluta ? 2 : 0, maximumFractionDigits: m.waluta ? 2 : 0 })}
                ${m.waluta ? ` ${m.waluta}` : ''}
            </p>
        </div>
    `).join('');

    return `
        <div class="stat-card" id="card-${id}">
            <div class="stat-card-header">
                <div class="stat-card-title">
                    <span>${ikona}</span>
                    <span>${tytul}</span>
                </div>
                <!-- Można dodać menu opcji dla karty -->
            </div>
            <div class="stat-card-metrics">
                ${metrykiHTML}
            </div>
            <div class="stat-card-chart">
                <canvas data-chartdata='${JSON.stringify(daneWykresu)}'></canvas>
            </div>
        </div>
    `;
}