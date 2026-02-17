// 1. Initialisation des données (Récupération du localStorage ou données vides)
let dataFinance = JSON.parse(localStorage.getItem('aura_data')) || { 
    entrees: [0, 0, 0, 0, 0, 500], // Exemple avec une donnée en Mars (index 5)
    depenses: [0, 0, 0, 0, 0, 200], 
    historique: [] 
};

let myChart;
const moisLabels = ['Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar'];
const moisComplets = ['Octobre', 'Novembre', 'Décembre', 'Janvier', 'Février', 'Mars'];

// 2. Fonction pour initialiser le Graphique
function initChart() {
    const ctx = document.getElementById('financeChart').getContext('2d');
    
    if (myChart) { myChart.destroy(); }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: moisLabels,
            datasets: [{
                label: 'Entrées (€)',
                data: dataFinance.entrees,
                backgroundColor: '#2ecc71',
                borderRadius: 5
            }, {
                label: 'Dépenses (€)',
                data: dataFinance.depenses,
                backgroundColor: '#e74c3c',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#ffffff', font: { family: 'Inter' } } }
            },
            scales: {
                y: { grid: { color: '#222' }, ticks: { color: '#aaa' } },
                x: { grid: { display: false }, ticks: { color: '#aaa' } }
            }
        }
    });
}

// 3. Ajouter une transaction
function addTransaction() {
    const desc = document.getElementById('desc').value;
    const val = parseFloat(document.getElementById('val').value);
    const type = document.getElementById('type').value;

    if (!desc || isNaN(val) || val <= 0) {
        alert("Veuillez entrer une description et un montant valide.");
        return;
    }

    const nouvelleTransaction = {
        id: Date.now(),
        description: desc,
        montant: val,
        type: type,
        date: new Date().toLocaleDateString('fr-FR')
    };

    // Ajouter à l'historique (au début)
    dataFinance.historique.unshift(nouvelleTransaction);

    // Mettre à jour le graphique (Index 5 = Mars)
    if (type === 'entree') {
        dataFinance.entrees[5] += val;
    } else {
        dataFinance.depenses[5] += val;
    }

    // Sauvegarder
    localStorage.setItem('aura_data', JSON.stringify(dataFinance));
    
    // Rafraîchir toute l'interface
    refreshUI();

    // Reset formulaire
    document.getElementById('desc').value = '';
    document.getElementById('val').value = '';
}

// 4. Afficher l'historique (Liste à côté du graphique)
function renderHistory() {
    const listElement = document.getElementById('historyList');
    if (!listElement) return;
    
    listElement.innerHTML = '';
    // On ne montre que les 10 dernières pour garder le style épuré
    const limitedHistory = dataFinance.historique.slice(0, 10);

    limitedHistory.forEach(item => {
        const li = document.createElement('li');
        li.className = 'transaction-item';
        const isEntree = item.type === 'entree';

        li.innerHTML = `
            <div>
                <span class="item-desc">${item.description}</span>
                <span class="item-date">${item.date}</span>
            </div>
            <span class="${isEntree ? 'pos' : 'neg'}">${isEntree ? '+' : '-'} ${item.montant.toLocaleString()} €</span>
        `;
        listElement.appendChild(li);
    });
}

// 5. Afficher le tableau récapitulatif (En bas)
function renderMonthlyTable() {
    const tableBody = document.getElementById('monthlyTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    moisComplets.forEach((mois, index) => {
        const ent = dataFinance.entrees[index] || 0;
        const dep = dataFinance.depenses[index] || 0;
        const net = ent - dep;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${mois}</td>
            <td class="pos">+ ${ent.toLocaleString()} €</td>
            <td class="neg">- ${dep.toLocaleString()} €</td>
            <td style="font-weight: bold; color: ${net >= 0 ? '#2ecc71' : '#e74c3c'}">
                ${net.toLocaleString()} €
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 6. Mise à jour des stats globales (Solde et Épargne)
function updateStats() {
    const totalEntrees = dataFinance.entrees.reduce((a, b) => a + b, 0);
    const totalDepenses = dataFinance.depenses.reduce((a, b) => a + b, 0);
    const solde = totalEntrees - totalDepenses;
    
    // On considère l'épargne comme le solde positif accumulé
    document.getElementById('totalBalance').innerText = `${solde.toLocaleString()} €`;
    document.getElementById('totalSavings').innerText = `${(solde > 0 ? solde : 0).toLocaleString()} €`;
}

// 7. Calculateur d'objectif
function calculateGoal() {
    const target = document.getElementById('targetAmount').value;
    const monthly = document.getElementById('monthlyInput').value;
    const resultDisplay = document.getElementById('goalResult');

    if (target > 0 && monthly > 0) {
        const months = Math.ceil(target / monthly);
        resultDisplay.innerHTML = `Objectif atteignable en <strong>${months} mois</strong>.`;
        resultDisplay.style.color = "#2ecc71";
    }
}

// 8. Fonction de rafraîchissement global
function refreshUI() {
    initChart();
    renderHistory();
    renderMonthlyTable();
    updateStats();
}

// 9. Nettoyer tout
function clearHistory() {
    if(confirm("Voulez-vous réinitialiser toutes vos données ?")) {
        localStorage.removeItem('aura_data');
        location.reload();
    }
}

// Lancement au chargement de la page
window.onload = function() {
    refreshUI();
    document.getElementById('currentDate').innerText = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
};