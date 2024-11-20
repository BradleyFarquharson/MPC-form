// app.js
let currentStep = 1;
const totalSteps = 5;

const selections = {
    enterprise: null,
    network: null,
    formFactor: null,
    billing: null
};

function selectOption(category, value) {
    selections[category] = value;
    document.querySelectorAll(`#step${currentStep} .option-btn`).forEach(btn => {
        btn.style.backgroundColor = btn.innerText.toLowerCase().includes(value.toLowerCase()) 
            ? '#FFF' 
            : var(--orange);
        btn.style.color = btn.innerText.toLowerCase().includes(value.toLowerCase()) 
            ? '#2D2D2D' 
            : '#FFF';
    });
}

function navigate(direction) {
    if (direction === 'next' && currentStep < totalSteps) {
        currentStep++;
    } else if (direction === 'back' && currentStep > 1) {
        currentStep--;
    }

    // Update visibility
    document.querySelectorAll('.step').forEach(step => {
        step.style.display = 'none';
    });
    document.getElementById(`step${currentStep}`).style.display = 'block';

    // Update counter
    document.getElementById('stepCounter').innerText = `Step ${currentStep} of ${totalSteps}`;

    // Update navigation buttons
    document.getElementById('backBtn').style.display = currentStep > 1 ? 'block' : 'none';
    document.getElementById('nextBtn').style.display = currentStep < totalSteps ? 'block' : 'none';

    // If we're on the summary step, show the summary
    if (currentStep === totalSteps) {
        showSummary();
    }
}

function showSummary() {
    const summaryHTML = `
        <p><strong>Enterprise Type:</strong> ${selections.enterprise}</p>
        <p><strong>Network:</strong> ${selections.network}</p>
        <p><strong>Form Factor:</strong> ${selections.formFactor}</p>
        <p><strong>Billing Plan:</strong> ${selections.billing}</p>
    `;
    document.getElementById('summary').innerHTML = summaryHTML;
}
