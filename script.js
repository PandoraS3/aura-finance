let dataFinance = JSON.parse(localStorage.getItem('aura_data')) || { 
    entrees: [0, 0, 0, 0, 0, 0], 
    depenses: [0, 0, 0, 0, 0, 0], 
    historique: [] 
};

let myChart;
const moisLabels = ['Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar'];

function initChart() {
    const ctx = document.getElementById('financeChart').getContext('2d');
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: moisLabels,
            datasets: [
                { label: 'Entrées', data: dataFinance.entrees, backgroundColor: '#2ecc71' },
                { label: 'Dépenses', data: dataFinance.depenses, backgroundColor: '#e74c3c' }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#fff' } } } }
    });
}

function processTransaction() {
    const desc = document.getElementById('desc').value;
    const val = parseFloat(document.getElementById('val').value);
    const type = document.getElementById('type').value;
    const editIndex = parseInt(document.getElementById('editIndex').value);

    if (!desc || isNaN(val)) return alert("Remplissez les champs");

    if (editIndex === -1) {
        // AJOUT
        const newTrans = { id: Date.now(), description: desc, montant: val, type: type, date: new Date().toLocaleDateString('fr-FR') };
        dataFinance.historique.unshift(newTrans);
    } else {
        // MODIFICATION (On annule l'ancien impact avant d'ajouter le nouveau)
        const old = dataFinance.historique[editIndex];
        recalculateGraphImpact(old.type, -old.montant); 
        
        dataFinance.historique[editIndex] = { ...dataFinance.historique[editIndex], description: desc, montant: val, type: type };
    }

    // Mise à jour impact graphique (Index 5 = Mars)
    recalculateGraphImpact(type, val);
    saveAndRefresh();
    resetForm();
}

function recalculateGraphImpact(type, montant) {
    if (type === 'entree') dataFinance.entrees[5] += montant;
    else dataFinance.depenses[5] += montant;
}

function deleteTransaction(index) {
    if (confirm("Supprimer cette transaction ?")) {
        const item = dataFinance.historique[index];
        recalculateGraphImpact(item.type, -item.montant);
        dataFinance.historique.splice(index, 1);
        saveAndRefresh();
    }
}

function editTransaction(index) {
    const item = dataFinance.historique[index];
    document.getElementById('desc').value = item.description;
    document.getElementById('val').value = item.montant;
    document.getElementById('type').value = item.type;
    document.getElementById('editIndex').value = index;
    document.getElementById('submitBtn').innerText = "Modifier";
    document.getElementById('formTitle').innerText = "Modifier la Transaction";
    window.scrollTo(0, 0);
}

function saveAndRefresh() {
    localStorage.setItem('aura_data', JSON.stringify(dataFinance));
    renderHistory();
    renderMonthlyTable();
    updateStats();
    initChart();
}

function renderHistory() {
    const list = document.getElementById('historyList');
    list.innerHTML = '';
    dataFinance.historique.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'transaction-item';
        li.innerHTML = `
            <div><span class="item-desc">${item.description}</span><br><small>${item.date}</small></div>
            <div style="display:flex; align-items:center;">
                <span class="${item.type === 'entree' ? 'pos' : 'neg'}">${item.montant} €</span>
                <div class="actions">
                    <button class="btn-edit" onclick="editTransaction(${index})">✎</button>
                    <button class="btn-delete" onclick="deleteTransaction(${index})">🗑</button>
                </div>
            </div>`;
        list.appendChild(li);
    });
}

function renderMonthlyTable() {
    const body = document.getElementById('monthlyTableBody');
    body.innerHTML = '';
    ['Octobre', 'Novembre', 'Décembre', 'Janvier', 'Février', 'Mars'].forEach((mois, i) => {
        const net = dataFinance.entrees[i] - dataFinance.depenses[i];
        body.innerHTML += `<tr><td>${mois}</td><td class="pos">${dataFinance.entrees[i]}€</td><td class="neg">${dataFinance.depenses[i]}€</td><td style="color:${net>=0?'#2ecc71':'#e74c3c'}">${net}€</td></tr>`;
    });
}

function updateStats() {
    const totalE = dataFinance.entrees.reduce((a, b) => a + b, 0);
    const totalD = dataFinance.depenses.reduce((a, b) => a + b, 0);
    document.getElementById('totalBalance').innerText = `${totalE - totalD} €`;
    document.getElementById('totalSavings').innerText = `${totalE - totalD > 0 ? totalE - totalD : 0} €`;
}

function resetForm() {
    document.getElementById('desc').value = '';
    document.getElementById('val').value = '';
    document.getElementById('editIndex').value = "-1";
    document.getElementById('submitBtn').innerText = "Ajouter";
    document.getElementById('formTitle').innerText = "Enregistrer une Transaction";
}

function clearHistory() { if(confirm("Tout effacer ?")) { localStorage.clear(); location.reload(); } }

window.onload = () => {
    saveAndRefresh();
    document.getElementById('currentDate').innerText = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
};