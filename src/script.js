function calculateGoal() {
    const target = document.getElementById('targetAmount').value;
    const monthly = document.getElementById('monthlyInput').value;
    const resultDisplay = document.getElementById('goalResult');

    if (target > 0 && monthly > 0) {
        const months = Math.ceil(target / monthly);
        const years = (months / 12).toFixed(1);
        
        resultDisplay.innerHTML = `Objectif atteignable en <strong>${months} mois</strong> (environ ${years} ans).<br> 
        Conseil : Augmentez votre épargne de 10% pour gagner ${Math.ceil(months * 0.1)} mois.`;
        resultDisplay.style.color = "#2ecc71";
    } else {
        resultDisplay.innerText = "Veuillez entrer des montants valides.";
        resultDisplay.style.color = "#e74c3c";
    }
}

document.getElementById('currentDate').innerText = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });