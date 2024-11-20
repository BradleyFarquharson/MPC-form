document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 0;
    const steps = document.querySelectorAll('.step');
    const backBtn = document.getElementById('backBtn');
    const selections = {
        enterprise: { type: null },
        network: { type: null, realm: null },
        connectivity: { type: null, formFactor: null, imsiType: null, plan: null, countries: [] },
        billing: { rateCard: null, plan: null },
    };

    // Initialize
    steps[currentStep].classList.add('active');

    /* --- Event Listeners --- */
    document.querySelectorAll('[data-action="selectEnterprise"]').forEach(button => {
        button.addEventListener('click', () => {
            selections.enterprise.type = button.dataset.type;
            const childPortals = document.getElementById('childPortals');
            if (selections.enterprise.type === 'multi') {
                childPortals.classList.remove('hidden');
            } else {
                childPortals.classList.add('hidden');
            }
            goToNextStep();
        });
    });

    document.querySelectorAll('[data-action="selectNetwork"]').forEach(button => {
        button.addEventListener('click', () => {
            selections.network.type = button.dataset.type;
            showElement('realmInputs');
        });
    });

    document.querySelectorAll('[data-action="selectRealm"]').forEach(button => {
        button.addEventListener('click', () => {
            selections.network.realm = button.dataset.type;
            const realmName = document.getElementById('realmName');
            if (selections.network.realm === 'custom') {
                realmName.classList.remove('hidden');
            } else {
                realmName.classList.add('hidden');
            }
            goToNextStep();
        });
    });

    document.querySelectorAll('[data-action="chooseOption"]').forEach(button => {
        button.addEventListener('click', () => {
            selections.connectivity.type = button.dataset.option;
            showElement('formFactorInputs');
        });
    });

    document.querySelectorAll('[data-action="selectFormFactor"]').forEach(button => {
        button.addEventListener('click', () => {
            selections.connectivity.formFactor = button.dataset.factor;
            if (button.dataset.factor === 'esim') {
                goToNextStep();
            } else {
                showElement('imsiOptions');
            }
        });
    });

    document.querySelectorAll('[data-action="selectIMSI"]').forEach(button => {
        button.addEventListener('click', () => {
            selections.connectivity.imsiType = button.dataset.imsi;
            showElement('profilePlans');
        });
    });

    document.querySelectorAll('[data-action="selectPlan"]').forEach(button => {
        button.addEventListener('click', () => {
            selections.connectivity.plan = button.dataset.plan;
            if (button.dataset.plan === 'custom') {
                showElement('countryStep');
            } else {
                goToNextStep();
            }
        });
    });

    document.getElementById('countrySelect').addEventListener('change', () => {
        selections.connectivity.countries = Array.from(document.getElementById('countrySelect').selectedOptions).map(option => option.value);
        goToNextStep();
    });

    document.querySelectorAll('[data-action="selectRateCard"]').forEach(button => {
        button.addEventListener('click', () => {
            selections.billing.rateCard = button.dataset.ratecard;
            showElement('billingOptions');
        });
    });

    document.querySelectorAll('[data-action="selectBilling"]').forEach(button => {
        button.addEventListener('click', () => {
            selections.billing.plan = button.dataset.billing;
            goToNextStep();
        });
    });

    backBtn.addEventListener('click', () => {
        steps[currentStep].classList.remove('active');
        currentStep--;
        steps[currentStep].classList.add('active');
        backBtn.style.display = currentStep > 0 ? 'block' : 'none';
    });

    /* --- Helper Functions --- */
    function goToNextStep() {
        steps[currentStep].classList.remove('active');
        currentStep++;
        steps[currentStep].classList.add('active');
        backBtn.style.display = currentStep > 0 ? 'block' : 'none';
        if (currentStep === steps.length - 1) showSummary();
    }

    function showElement(id) {
        document.getElementById(id).classList.remove('hidden');
    }

    function showSummary() {
        const summaryContent = `
            <p><strong>Enterprise:</strong> ${selections.enterprise.type || 'N/A'}</p>
            <p><strong>Network:</strong> ${selections.network.type || 'N/A'}</p>
            <p><strong>Connectivity:</strong> ${selections.connectivity.type || 'N/A'}</p>
            <p><strong>Billing:</strong> ${selections.billing.rateCard || 'N/A'}</p>
        `;
        document.getElementById('summaryContent').innerHTML = summaryContent;
    }
});
