// State Management
const state = {
    currentStep: 1,
    selections: {
        enterprise: {
            type: null,
            name: null,
            childPortals: null
        },
        network: {
            type: null,
            realm: {
                type: null,
                name: null
            }
        },
        connectivity: {
            formFactor: null,
            imsiType: null,
            plan: null,
            countries: [],
            network: null
        },
        billing: null
    }
};

// Profile Plan Options
const PROFILE_PLANS = {
    multiIMSI: ['Switch Plan 24', 'Switch Plan 25'],
    singleIMSI: ['Single IMSI Plan 71', 'Single IMSI Plan 21']
};

// DOM Elements
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);
backBtn.addEventListener('click', previousStep);
nextBtn.addEventListener('click', nextStep);

// Initialize all option buttons
document.querySelectorAll('.option-btn').forEach(button => {
    button.addEventListener('click', (e) => handleSelection(e));
});

function initializeApp() {
    updateStepVisibility();
    updateNavigationButtons();
    setupInputListeners();
}

function setupInputListeners() {
    // Enterprise name input
    const enterpriseNameInput = document.querySelector('input[placeholder="Enterprise Name"]');
    if (enterpriseNameInput) {
        enterpriseNameInput.addEventListener('input', (e) => {
            state.selections.enterprise.name = e.target.value;
            updateNavigationButtons();
        });
    }

    // Child portals input
    const childPortalsInput = document.querySelector('input[placeholder="Number of Child Portals"]');
    if (childPortalsInput) {
        childPortalsInput.addEventListener('input', (e) => {
            state.selections.enterprise.childPortals = parseInt(e.target.value);
            updateNavigationButtons();
        });
    }

    // Realm name input
    const realmNameInput = document.querySelector('input[placeholder="Enter Realm Name"]');
    if (realmNameInput) {
        realmNameInput.addEventListener('input', (e) => {
            state.selections.network.realm.name = e.target.value;
            updateNavigationButtons();
        });
    }
}

function handleSelection(event) {
    const button = event.target;
    const step = button.closest('.step');
    const section = button.closest('.section');
    const value = button.dataset.value;

    // Remove selection from siblings
    button.closest('.options').querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    button.classList.add('selected');

    // Update state based on the button's context
    if (step.id === 'step1') {
        handleEnterpriseSelection(value);
    } else if (step.id === 'step2') {
        if (button.closest('.realm-config')) {
            handleRealmSelection(value);
        } else {
            handleNetworkSelection(value);
        }
    } else if (step.id.includes('step3')) {
        handleConnectivitySelection(button, value, section);
    } else if (step.id === 'step4') {
        state.selections.billing = value;
    }

    updateNavigationButtons();
}

function handleEnterpriseSelection(value) {
    state.selections.enterprise.type = value;
    const childPortalsInput = document.querySelector('input[placeholder="Number of Child Portals"]');
    childPortalsInput.classList.toggle('hidden', value !== 'multi');
    document.querySelector('.enterprise-details').classList.remove('hidden');
}

function handleNetworkSelection(value) {
    state.selections.network.type = value;
    document.querySelector('.realm-config').classList.remove('hidden');
}

function handleRealmSelection(value) {
    state.selections.network.realm.type = value;
    const realmNameInput = document.querySelector('input[placeholder="Enter Realm Name"]');
    realmNameInput.classList.toggle('hidden', value !== 'custom');
}

function handleConnectivitySelection(button, value, section) {
    if (section && section.querySelector('h3').textContent === 'Form Factor') {
        state.selections.connectivity.formFactor = value;
        if (value === 'esim') {
            state.selections.connectivity.imsiType = 'single';
            showCountrySelection();
        } else {
            showIMSISelection();
        }
    } else if (section && section.querySelector('h3').textContent === 'IMSI Type') {
        state.selections.connectivity.imsiType = value;
        updateProfilePlans(value);
    } else if (button.closest('#step3-local')) {
        if (section && section.querySelector('h3').textContent === 'Network Selection') {
            state.selections.connectivity.network = value;
        }
    }
}

function showIMSISelection() {
    const imsiSection = document.querySelector('.imsi-section');
    if (imsiSection) {
        imsiSection.classList.remove('hidden');
    }
}

function updateProfilePlans(imsiType) {
    const planSelect = document.querySelector('.select-input');
    planSelect.innerHTML = '<option value="" disabled selected>Select Profile Plan</option>';
    
    const plans = imsiType === 'multi' ? PROFILE_PLANS.multiIMSI : PROFILE_PLANS.singleIMSI;
    plans.forEach(plan => {
        const option = document.createElement('option');
        option.value = plan;
        option.textContent = plan;
        planSelect.appendChild(option);
    });
}

function showCountrySelection() {
    const countrySelect = document.querySelector('select[multiple]');
    if (countrySelect) {
        countrySelect.closest('.section').classList.remove('hidden');
    }
}

function nextStep() {
    if (isStepValid()) {
        state.currentStep++;
        updateStepVisibility();
        updateNavigationButtons();
    }
}

function previousStep() {
    if (state.currentStep > 1) {
        state.currentStep--;
        updateStepVisibility();
        updateNavigationButtons();
    }
}

function updateStepVisibility() {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.add('hidden');
    });

    let currentStepElement;
    if (state.currentStep === 3) {
        currentStepElement = document.getElementById(
            state.selections.network.type === 'earth' ? 'step3-earth' : 'step3-local'
        );
    } else {
        currentStepElement = document.getElementById(`step${state.currentStep}`);
    }

    if (currentStepElement) {
        currentStepElement.classList.remove('hidden');
    }

    // Update step counter
    const stepCounter = document.querySelector('.step-counter');
    if (stepCounter) {
        stepCounter.textContent = `Step ${state.currentStep} of 5`;
    }
}

function updateNavigationButtons() {
    backBtn.style.display = state.currentStep > 1 ? 'block' : 'none';
    nextBtn.style.display = state.currentStep < 5 ? 'block' : 'none';
    nextBtn.disabled = !isStepValid();
}

function isStepValid() {
    switch (state.currentStep) {
        case 1:
            return state.selections.enterprise.type && 
                   state.selections.enterprise.name &&
                   (state.selections.enterprise.type !== 'multi' || 
                    (state.selections.enterprise.childPortals && 
                     state.selections.enterprise.childPortals >= 2));
        case 2:
            return
