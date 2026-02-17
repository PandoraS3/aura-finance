// 1. Initialisation des données (Récupération du localStorage ou données vides)
let dataFinance = JSON.parse(localStorage.getItem('aura_data')) || { 
    entrees: [0, 0, 0, 0, 0, 0], 
    depenses: [0, 0, 0, 0, 0, 0], 
    historique: [] 
};

let myChart;

// 2. Fonction pour initialiser le Graphique
function initChart() {
    const ctx = document.getElementById('financeChart').getContext('2d');
    
    // Destruction de l'ancien graphique si on rafraîchit pour éviter les bugs visuels
    if (myChart) { myChart.destroy(); }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar'], // Ajuste selon tes besoins
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

    // Mettre à jour le graphique (ici on cible le mois de 'Mar' qui est l'index 5)
    if (type === 'entree') {
        dataFinance.entrees[5] += val;
    } else {
        dataFinance.depenses[5] += val;
    }

    // Sauvegarder
    localStorage.setItem('aura_data', JSON.stringify(dataFinance));
    
    // Rafraîchir l'interface
    renderHistory();
    initChart(); 
    updateStats();

    // Reset formulaire
    document.getElementById('desc').value = '';
    document.getElementById('val').value = '';
}

// 4. Afficher l'historique
function renderHistory() {
    const listElement = document.getElementById('historyList');
    if (!listElement) return;
    
    listElement.innerHTML = '';

    dataFinance.historique.forEach(item => {
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

// 5. Calculateur d'objectif (ta fonction précédente)
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

// 6. Mise à jour des stats globales (Solde)
function updateStats() {
    const totalEntrees = dataFinance.entrees.reduce((a, b) => a + b, 0);
    const totalDepenses = dataFinance.depenses.reduce((a, b) => a + b, 0);
    const solde = totalEntrees - totalDepenses;
    
    document.getElementById('totalBalance').innerText = `${solde.toLocaleString()} €`;
}

// 7. Nettoyer tout
function clearHistory() {
    if(confirm("Voulez-vous réinitialiser toutes vos données ?")) {
        localStorage.removeItem('aura_data');
        location.reload();
    }
}

// Lancement au chargement de la page
window.onload = function() {
    initChart();
    renderHistory();
    updateStats();
    document.getElementById('currentDate').innerText = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
};