// On récupère les données existantes ou on initialise
let dataFinance = JSON.parse(localStorage.getItem('aura_data')) || { entrees: [0,0,0], depenses: [0,0,0], historique: [] };

function addTransaction() {
    const desc = document.getElementById('desc').value;
    const val = parseFloat(document.getElementById('val').value);
    const type = document.getElementById('type').value;

    if (!desc || !val || val <= 0) return alert("Veuillez remplir tous les champs correctement.");

    const nouvelleTransaction = {
        id: Date.now(),
        description: desc,
        montant: val,
        type: type,
        date: new Date().toLocaleDateString('fr-FR')
    };

    // 1. Ajouter à l'historique
    dataFinance.historique.unshift(nouvelleTransaction); // Ajoute au début de la liste

    // 2. Mettre à jour les données du graphique (ex: Mars, index 2)
    if (type === 'entree') {
        dataFinance.entrees[2] += val;
    } else {
        dataFinance.depenses[2] += val;
    }

    // 3. Sauvegarder et rafraîchir
    localStorage.setItem('aura_data', JSON.stringify(dataFinance));
    renderHistory();
    updateUI();
    
    // Reset du formulaire
    document.getElementById('desc').value = '';
    document.getElementById('val').value = '';
}

function renderHistory() {
    const listElement = document.getElementById('historyList');
    listElement.innerHTML = '';

    dataFinance.historique.forEach(item => {
        const li = document.createElement('li');
        li.className = 'transaction-item';
        const colorClass = item.type === 'entree' ? 'pos' : 'neg';
        const prefix = item.type === 'entree' ? '+' : '-';

        li.innerHTML = `
            <div>
                <span class="item-desc">${item.description}</span>
                <span class="item-date">${item.date}</span>
            </div>
            <span class="${colorClass}">${prefix} ${item.montant.toLocaleString()} €</span>
        `;
        listElement.appendChild(li);
    });
}

function clearHistory() {
    if(confirm("Effacer tout l'historique ?")) {
        dataFinance = { entrees: [0,0,0], depenses: [0,0,0], historique: [] };
        localStorage.setItem('aura_data', JSON.stringify(dataFinance));
        location.reload();
    }
}

// Appeler renderHistory au chargement
window.onload = () => {
    initChart();
    renderHistory();
};