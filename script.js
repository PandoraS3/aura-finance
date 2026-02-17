let dataFinance = JSON.parse(localStorage.getItem('aura_data')) || { entrees: [0,0,0], depenses: [0,0,0] };
let myChart;

function initChart() {
    const ctx = document.getElementById('financeChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Janvier', 'Février', 'Mars'], // Tu peux automatiser les mois après
            datasets: [{
                label: 'Entrées',
                data: dataFinance.entrees,
                backgroundColor: '#2ecc71'
            }, {
                label: 'Dépenses',
                data: dataFinance.depenses,
                backgroundColor: '#e74c3c'
            }]
        },
        options: {
            plugins: { legend: { labels: { color: 'white' } } },
            scales: { y: { ticks: { color: 'white' } }, x: { ticks: { color: 'white' } } }
        }
    });
}

function addTransaction() {
    const desc = document.getElementById('desc').value;
    const val = parseFloat(document.getElementById('val').value);
    const type = document.getElementById('type').value;

    if (!val || val <= 0) return alert("Entrez un montant valide");

    // Pour l'exemple, on ajoute au mois en cours (Mars par exemple, index 2)
    if (type === 'entree') {
        dataFinance.entrees[2] += val;
    } else {
        dataFinance.depenses[2] += val;
    }

    localStorage.setItem('aura_data', JSON.stringify(dataFinance));
    updateUI();
}

function updateUI() {
    myChart.update();
    // Ici, tu peux aussi mettre à jour ton Solde Total affiché en haut
}

window.onload = initChart;