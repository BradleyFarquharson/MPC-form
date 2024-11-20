// State Management
const STATE = {
    currentStep: 1,
    totalSteps: 5,
    configuration: {
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
        billing: {
            plan: null
        }
    }
};

// Constants
const COUNTRY_OPTIONS = [
    'USA', 'Canada', 'UK', 'Germany', 'France', 'Asia-Pacific',
    'South America', 'Australia', 'Japan', 'China', 'India', 'South Africa'
];

const PROFILE_PLANS = {
    multiIMSI: ['Switch Plan 24', 'Switch Plan 25'],
    singleIMSI: ['Single IMSI Plan 71', 'Single IMSI Plan 21']
};

const NETWORK_COUNTRY_MAP = {
    mtn: 'South Africa',
    vodacom: 'South Africa',
    telkom: 'South Africa',
    ee: 'UK',
    att: 'USA',
    vodafone: 'UK'
};

// Utility Functions
const hideAllCards = () => {
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('hidden');
    });
};

const showCard = (cardId) => {
    hideAllCards();
    const card = document.getElementById(cardId);
    if (card) {
        card.classList.remove('hidden');
        card.classList.add('fade-in');
    }
};

const updateProgress = () => {
    const progress = ((STATE.currentStep - 1) / (STATE.totalSteps - 1)) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
    document.getElementById('stepIndicator').textContent = `Step ${STATE.currentStep} of ${STATE.totalSteps}`;
};

const validateInput = (value, type = 'text') => {
    if (!value) return false;
    
    switch(type) {
        case 'number':
            return !isNaN(value) && parseInt(value) >= 2;
        case 'text':
            return value.trim().length >= 2;
        default:
            return true;
    }
};

const updateNavigationButtons = () => {
    const backBtn = document.getElementById('backBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    backBtn.style.display = STATE.currentStep > 1 ? 'block' : 'none';
    nextBtn.style.display = STATE.currentStep < STATE.totalSteps ? 'block' : 'none';
    
    nextBtn.disabled = !isStepComplete();
};

// Step Validation
const isStepComplete = () => {
    switch(STATE.currentStep) {
        case 1:
            return STATE.configuration.enterprise.type && 
                   (STATE.configuration.enterprise.type === 'single' ? 
                   STATE.configuration.enterprise.name : 
                   (STATE.configuration.enterprise.name && STATE.configuration.enterprise.childPortals));
        case 2:
            return STATE.configuration.network.type && STATE.configuration.network.realm.type &&
                   (STATE.configuration.network.realm.type === 'shared' || STATE.configuration.network.realm.name);
        case 3:
            return STATE.configuration.connectivity.formFactor &&
                   (STATE.configuration.network.type === 'local' ? 
                   STATE.configuration.connectivity.network :
                   (STATE.configuration.connectivity.imsiType && STATE.configuration.connectivity.plan));
        case 4:
            return STATE.configuration.billing.plan;
        default:
            return true;
    }
};

// Event Handlers
const selectEnterprise = (type) => {
    STATE.configuration.enterprise.type = type;
    const inputsContainer = document.getElementById('enterpriseInputs');
    inputsContainer.innerHTML = '';

    const nameInput = document.createElement('div');
    nameInput.className = 'input-group';
    nameInput.innerHTML = `
        <input type="text" 
               class="input-field" 
               placeholder="${type === 'single' ? 'Enterprise Name' : 'Main Enterprise Name'}"
               onchange="updateEnterpriseName(this.value)">
    `;
    inputsContainer.appendChild(nameInput);

    if (type === 'multi') {
        const portalsInput = document.createElement('div');
        portalsInput.className = 'input-group';
        portalsInput.innerHTML = `
            <input type="number" 
                   class="input-field" 
                   min="2"
                   placeholder="Number of Child Portals"
                   onchange="updateChildPortals(this.value)">
        `;
        inputsContainer.appendChild(portalsInput);
    }

    showCard('enterpriseDetailsCard');
    updateNavigationButtons();
};

const updateEnterpriseName = (name) => {
    if (validateInput(name)) {
        STATE.configuration.enterprise.name = name;
        updateNavigationButtons();
    }
};

const updateChildPortals = (number) => {
    if (validateInput(number, 'number')) {
        STATE.configuration.enterprise.childPortals = parseInt(number);
        updateNavigationButtons();
    }
};

const selectNetwork = (type) => {
    STATE.configuration.network.type = type;
    showCard('realmCard');
    updateNavigationButtons();
};

const selectRealm = (type) => {
    STATE.configuration.network.realm.type = type;
    const realmNameInput = document.getElementById('realmNameInput');
    
    if (type === 'custom') {
        realmNameInput.classList.remove('hidden');
    } else {
        realmNameInput.classList.add('hidden');
        STATE.configuration.network.realm.name = null;
        nextStep();
    }
    
    updateNavigationButtons();
};

const updateRealmName = (name) => {
    if (validateInput(name)) {
        STATE.configuration.network.realm.name = name;
        updateNavigationButtons();
    }
};

const selectFormFactor = (factor) => {
    STATE.configuration.connectivity.formFactor = factor;
    
    if (factor === 'esim') {
        STATE.configuration.connectivity.imsiType = 'single';
        STATE.configuration.connectivity.plan = 'Single IMSI Plan 71';
        showCountrySelection();
    } else {
        document.getElementById('imsiSelection').classList.remove('hidden');
    }
    
    updateNavigationButtons();
};

const selectLocalFormFactor = (factor) => {
    STATE.configuration.connectivity.formFactor = factor;
    document.getElementById('networkSelection').classList.remove('hidden');
    updateNavigationButtons();
};

const selectIMSI = (type) => {
    STATE.configuration.connectivity.imsiType = type;
    showProfilePlanSelection();
    updateNavigationButtons();
};

const showProfilePlanSelection = () => {
    const planSelect = document.getElementById('profilePlan');
    planSelect.innerHTML = '';
    
    const plans = STATE.configuration.connectivity.imsiType === 'multi' ? 
                 PROFILE_PLANS.multiIMSI : 
                 PROFILE_PLANS.singleIMSI;

    plans.forEach(plan => {
        planSelect.add(new Option(plan, plan));
    });
    
    document.getElementById('profilePlanSelection').classList.remove('hidden');
};

const showCountrySelection = () => {
    const countrySelect = document.getElementById('countries');
    countrySelect.innerHTML = '';
    
    COUNTRY_OPTIONS.forEach(country => {
        countrySelect.add(new Option(country, country));
    });
    
    document.getElementById('countrySelection').classList.remove('hidden');
    updateNavigationButtons();
};

const selectCountries = () => {
    const countrySelect = document.getElementById('countries');
    STATE.configuration.connectivity.countries = Array.from(countrySelect.selectedOptions).map(option => option.value);
    updateNavigationButtons();
};

const selectLocalNetwork = (network) => {
    STATE.configuration.connectivity.network = network;
    STATE.configuration.connectivity.countries = [NETWORK_COUNTRY_MAP[network]];
    nextStep();
};

const selectBillingPlan = (plan) => {
    STATE.configuration.billing.plan = plan;
    updateNavigationButtons();
    nextStep();
};

// Navigation Functions
const nextStep = () => {
    if (STATE.currentStep < STATE.totalSteps && isStepComplete()) {
        STATE.currentStep++;
        updateProgress();
        showCurrentStep();
    }
};

const previousStep = () => {
    if (STATE.currentStep > 1) {
        STATE.currentStep--;
        updateProgress();
        showCurrentStep();
    }
};

const showCurrentStep = () => {
    switch(STATE.currentStep) {
        case 1:
            showCard('enterpriseCard');
            break;
        case 2:
            showCard('networkCard');
            break;
        case 3:
            if (STATE.configuration.network.type === 'earth') {
                showCard('earthConnectCard');
            } else {
                showCard('localConnectCard');
            }
            break;
        case 4:
            showCard('billingCard');
            break;
        case 5:
            showSummary();
            break;
    }
    updateNavigationButtons();
};

const showSummary = () => {
    const summaryContent = document.getElementById('summaryContent');
    let summary = '';

    // Enterprise Summary
    summary += `<p><strong>Enterprise Type:</strong> ${STATE.configuration.enterprise.type === 'single' ? 'Single Enterprise' : 'Multi-Tenant Enterprise'}</p>`;
    summary += `<p><strong>Enterprise Name:</strong> ${STATE.configuration.enterprise.name}</p>`;
    if (STATE.configuration.enterprise.childPortals) {
        summary += `<p><strong>Child Portals:</strong> ${STATE.configuration.enterprise.childPortals}</p>`;
    }

    // Network Summary
    summary += `<p><strong>Network Type:</strong> ${STATE.configuration.network.type === 'earth' ? 'Earth Connect' : 'Local Connect'}</p>`;
    summary += `<p><strong>Realm Type:</strong> ${STATE.configuration.network.realm.type}</p>`;
    if (STATE.configuration.network.realm.name) {
        summary += `<p><strong>Realm Name:</strong> ${STATE.configuration.network.realm.name}</p>`;
    }

    // Connectivity Summary
    summary += `<p><strong>Form Factor:</strong> ${STATE.configuration.connectivity.formFactor}</p>`;
    if (STATE.configuration.connectivity.imsiType) {
        summary += `<p><strong>IMSI Type:</strong> ${STATE.configuration.connectivity.imsiType}</p>`;
    }
    if (STATE.configuration.connectivity.plan) {
        summary += `<p><strong>Profile Plan:</strong> ${STATE.configuration.connectivity.plan}</p>`;
    }
    if (STATE.configuration.connectivity.network) {
        summary += `<p><strong>Network:</strong> ${STATE.configuration.connectivity.network}</p>`;
    }
    if (STATE.configuration.connectivity.countries.length > 0) {
        summary += `<p><strong>Countries:</strong> ${STATE.configuration.connectivity.countries.join(', ')}</p>`;
    }

    // Billing Summary
    summary += `<p><strong>Billing Plan:</strong> ${STATE.configuration.billing.plan}</p>`;

    summaryContent.innerHTML = summary;
    showCard('summaryCard');
};

// Error Handling
const handleError = (message) => {
    console.error(message);
    // You could add visual error handling here
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
    showCurrentStep();
    
    // Add event listeners for realm name input
    const realmNameInput = document.getElementById('realmName');
    if (realmNameInput) {
        realmNameInput.addEventListener('change', (e) => updateRealmName(e.target.value));
    }

    // Initialize all dropdowns
    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', function() {
            this.classList.toggle('active', this.value !== '');
        });
    });
});

// Save configuration
const saveConfiguration = () => {
    const configuration = JSON.stringify(STATE.configuration);
    localStorage.setItem('savedConfiguration', configuration);
    alert('Configuration saved successfully!');
};

// Load configuration
const loadConfiguration = () => {
    const savedConfig = localStorage.getItem('savedConfiguration');
    if (savedConfig) {
        STATE.configuration = JSON.parse(savedConfig);
        showCurrentStep();
        return true;
    }
    return false;
};

// Reset configuration
const resetConfiguration = () => {
    STATE.currentStep = 1;
    STATE.configuration = {
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
        billing: {
            plan: null
        }
    };
    updateProgress();
    showCurrentStep();
    localStorage.removeItem('savedConfiguration');
};
