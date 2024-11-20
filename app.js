document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 0;
    const steps = document.querySelectorAll('.step');
    const selections = {
        enterprise: {},
        network: {},
        connectivity: {},
        billing: {},
    };

    steps[currentStep].classList.add('active');
    updateNavigation();

    // Button click handlers need to have these methods available
    window.selectEnterprise = function(type) {
        selections.enterprise.type = type;
        document.getElementById('enterpriseInputs').classList.remove('hidden');
        if (type === 'multi') {
            document.getElementById('childPortals').classList.remove('hidden');
        } else {
            document.getElementById('childPortals').classList.add('hidden');
        }
    };

    window.selectNetwork = function(type) {
        selections.network.type = type;
        document.getElementById('realmInputs').classList.remove('hidden');
    };

    window.selectRealm = function(type) {
        selections.network.realm = type;
        if (type === 'custom') {
            document.getElementById('realmName').classList.remove('hidden');
        } else {
            document.getElementById('realmName').classList.add('hidden');
        }
    };

    window.chooseOption = function(option) {
        selections.connectivity.type = option;
        document.getElementById('formFactorInputs').classList.remove('hidden');
    };

    window.selectFormFactor = function(factor) {
        selections.connectivity.formFactor = factor;
        if (factor !== 'esim') {
            document.getElementById('imsiOptions').classList.remove('hidden');
        } else {
            navigate('next');
        }
    };

    window.selectIMSI = function(type) {
        selections.connectivity.imsiType = type;
        document.getElementById('profilePlans').classList.remove('hidden');
    };

    window.selectPlan = function(plan) {
        selections.connectivity.plan = plan;
        if (plan === 'plan24' || plan === 'plan25') {
            navigate('next');
        } else {
            document.getElementById('countryStep').classList.remove('hidden');
        }
    };

    window.selectCountryPlan = function() {
        const countrySelect = document.getElementById('countrySelect');
        selections.connectivity.countries = Array.from(countrySelect.selectedOptions).map(option => option.value);
        navigate('next');
    };

    window.selectRateCard = function(rateCard) {
        selections.billing.rateCard = rateCard;
        document.getElementById('billingOptions').classList.remove('hidden');
    };

    window.selectBilling = function(plan) {
        selections.billing.plan = plan;
        navigate('next');
    };

    window.navigate = function(direction) {
        steps[currentStep].classList.remove('active');
        
        if (direction === 'next' && currentStep < steps.length - 1) {
            currentStep++;
        } else if (direction === 'back' && currentStep > 0) {
            currentStep--;
        }

        steps[currentStep].classList.add('active');
        updateNavigation();
    };

    function updateNavigation() {
        document.getElementById('backBtn').style.display = currentStep > 0 ? 'block' : 'none';
        document.getElementById('nextBtn').style.display = currentStep < steps.length - 1 ? 'block' : 'none';

        if (currentStep === steps.length - 1) {
            showSummary();
        }
    }

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
