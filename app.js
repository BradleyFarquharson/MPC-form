document.addEventListener('DOMContentLoaded', () => {
    // Initial state
    let currentStep = 0;
    const steps = document.querySelectorAll('.step');
    const selections = {
        enterprise: {},
        network: {},
        connectivity: {},
        billing: {},
    };

    // Initialize first step
    steps[currentStep].classList.add('active');
    updateNavigation();

    // Navigation function
    function navigate(direction) {
        steps[currentStep].classList.remove('active');
        
        if (direction === 'next' && currentStep < steps.length - 1) {
            currentStep++;
        } else if (direction === 'back' && currentStep > 0) {
            currentStep--;
        }

        steps[currentStep].classList.add('active');
        updateNavigation();
    }

    function updateNavigation() {
        document.getElementById('backBtn').style.display = currentStep > 0 ? 'block' : 'none';
        document.getElementById('nextBtn').style.display = currentStep < steps.length - 1 ? 'block' : 'none';

        // Show summary if on last step
        if (currentStep === steps.length - 1) {
            showSummary();
        }
    }

    // Enterprise Configuration
    function selectEnterprise(type) {
        selections.enterprise.type = type;
        const enterpriseInputs = document.getElementById('enterpriseInputs');
        enterpriseInputs.classList.remove('hidden');

        if (type === 'multi') {
            document.getElementById('childPortals').classList.remove('hidden');
        } else {
            document.getElementById('childPortals').classList.add('hidden');
        }
    }

    // Network Configuration
    function selectNetwork(type) {
        selections.network.type = type;
        document.getElementById('realmInputs').classList.remove('hidden');
    }

    function selectRealm(type) {
        selections.network.realm = type;
        if (type === 'custom') {
            document.getElementById('realmName').classList.remove('hidden');
        } else {
            document.getElementById('realmName').classList.add('hidden');
        }
    }

    // Connectivity Options
    function chooseOption(option) {
        selections.connectivity.type = option;
        document.getElementById('formFactorInputs').classList.remove('hidden');
    }

    function selectFormFactor(factor) {
        selections.connectivity.formFactor = factor;
        if (factor !== 'esim') {
            document.getElementById('imsiOptions').classList.remove('hidden');
        } else {
            navigate('next'); // E-SIM goes directly to the next step
        }
    }

    function selectIMSI(type) {
        selections.connectivity.imsiType = type;
        document.getElementById('profilePlans').classList.remove('hidden');
    }

    function selectPlan(plan) {
        selections.connectivity.plan = plan;
        if (plan === 'plan24' || plan === 'plan25') {
            navigate('next');
        } else {
            document.getElementById('countryStep').classList.remove('hidden');
        }
    }

    // Country Selection
    function selectCountryPlan() {
        const countrySelect = document.getElementById('countrySelect');
        selections.connectivity.countries = Array.from(countrySelect.selectedOptions).map(option => option.value);
        navigate('next');
    }

    // Rate Card and Billing Plan
    function selectRateCard(rateCard) {
        selections.billing.rateCard = rateCard;
        document.getElementById('billingOptions').classList.remove('hidden');
    }

    function selectBilling(plan) {
        selections.billing.plan = plan;
        navigate('next');
    }

    // Summary
    function showSummary() {
        let html = `
            <p><strong>Enterprise:</strong> ${selections.enterprise.type}</p>
            <p><strong>Network:</strong> ${selections.network.type}</p>
            <p><strong>Connectivity:</strong> ${selections.connectivity.type}</p>
            <p><strong>Form Factor:</strong> ${selections.connectivity.formFactor}</p>
            <p><strong>IMSI Type:</strong> ${selections.connectivity.imsiType}</p>
            <p><strong>Connectivity Plan:</strong> ${selections.connectivity.plan}</p>
            <p><strong>Countries:</strong> ${selections.connectivity.countries.join(', ')}</p>
            <p><strong>Rate Card:</strong> ${selections.billing.rateCard}</p>
            <p><strong>Billing Plan:</strong> ${selections.billing.plan}</p>
        `;
        document.getElementById('summaryContent').innerHTML = html;
    }
});
