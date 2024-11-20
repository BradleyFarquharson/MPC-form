// State management
let currentStep = 1;
const totalSteps = 5;
let configState = {
    enterprise: null,
    network: null,
    realm: null,
    connectivity: null,
    billing: null
};

// Update progress bar
function updateProgress() {
    const progress = (currentStep - 1) / (totalSteps - 1) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
    document.getElementById('stepIndicator').textContent = `Step ${currentStep} of ${totalSteps}`;
}

// Enterprise selection handler
function selectEnterprise(type) {
    configState.enterprise = type;
    if (type === 'single') {
        // Show enterprise name input
        showEnterpriseNameInput();
    } else {
        // Show multi-tenant inputs
        showMultiTenantInputs();
    }
}

// Navigation handlers
function nextStep() {
    if (currentStep < totalSteps) {
        currentStep++;
        updateProgress();
        showCurrentStep();
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateProgress();
        showCurrentStep();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
});
