document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 0;
    const steps = document.querySelectorAll('.step');
    const selections = {
        enterprise: { type: null },
        network: { type: null, realm: null },
        connectivity: { type: null, formFactor: null, imsiType: null, countries: [] },
        billing: { rateCard: null, plan: null },
    };

    steps[currentStep].classList.add('active');
    updateNavigation();

    document.querySelectorAll('[data-action="selectEnterprise"]').forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            selections.enterprise.type = type;
            document.getElementById('enterpriseInputs').classList.remove('hidden');
            const childPortals = document.getElementById('childPortals');
            if (type === 'multi') {
                childPortals.classList.remove('hidden');
            } else {
                childPortals.classList.add('hidden');
            }
        });
    });

    document.querySelectorAll('[data-action="selectNetwork"]').forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            selections.network.type = type;
            document.getElementById('realmInputs').classList.remove('hidden');
        });
    });

    document.querySelectorAll('[data-action="selectRealm"]').forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            selections.network.realm = type;
            const realmName = document.getElementById('realmName');
            if (type === 'custom') {
                realmName.classList.remove('hidden');
            } else {
                realmName.classList.add('hidden');
            }
        });
    });

    document.querySelectorAll('[data-action="chooseOption"]').forEach(button => {
        button.addEventListener('click', () => {
            selections.connectivity.type = button.dataset.option;
            document.getElementById('formFactorInputs').classList.remove('hidden');
        });
    });

    document.querySelectorAll('[data-action="selectFormFactor"]').forEach(button => {
        button.addEventListener('click', () => {
            const factor = button.dataset.factor;
            selections.connectivity.formFactor = factor;
            const imsiOptions = document.getElementById('imsiOptions');
            if (factor !== 'esim') {
                imsiOptions.classList.remove('hidden');
            } else {
                navigate('next');
            }
        });
    });

    document.querySelectorAll('[data-action="selectIMSI"]').forEach(button => {
        button.addEventListener('click', () => {
            selections.connectivity.imsiType = button.dataset.imsi;
            document.getElementById('profilePlans').classList.remove('hidden');
        });
    });

    document.querySelectorAll('[data-action="selectPlan"]').forEach(button => {
        button.addEventListener('click', () => {
            const plan = button.dataset.plan;
            selections.connectivity.plan = plan;
            if (plan === 'plan24' || plan === 'plan25') {
                navigate('next');
            } else {
                document.getElementById('countryStep').classList.remove('hidden');
            }
        });
    });

    document.getElementById('countrySelect').addEventListener('change', () => {
        selections.connectivity.countries = Array.from(document.getElementById('countrySelect').selectedOptions).map(option => option.value);
    });

    document.querySelectorAll('[data-action="selectRateCard"]').forEach(button => {
        button.addEventListener('click', () => {
            selections.billing.rateCard = button.dataset.ratecard;
            document.getElementById('billingOptions').classList.remove('hidden');
        });
    });

    document.querySelectorAll('[data-action="selectBilling"]').forEach(button => {
        button.addEventListener('click', () => {
            selections.billing.plan = button.dataset.billing;
            navigate('next');
        });
    });

    document.getElementById('backBtn').addEventListener('click', () => navigate('back'));
    document.getElementById('nextBtn').addEventListener('click', () => navigate('next'));

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
        if (currentStep === steps.length - 1) showSummary();
    }

    function showSummary() {
        const summaryContent = `
            <p><strong>Enterprise:</strong> ${selections.enterprise.type || 'N/A'}</p>
            <p><strong>Network:</strong> ${selections.network.type || 'N/A'}</p>
            <p><strong>Realm:</strong> ${selections.network.realm || 'N/A'}</p>
            <p><strong>Connectivity:</strong> ${selections.connectivity.type || 'N/A'}</p>
            <p><strong>Form Factor:</strong> ${selections.connectivity.formFactor || 'N/A'}</p>
            <p><strong>IMSI Type:</strong> ${selections.connectivity.imsiType || 'N/A'}</p>
            <p><strong>Countries:</strong> ${selections.connectivity.countries.join(', ') || 'N/A'}</p>
            <p><strong>Rate Card:</strong> ${selections.billing.rateCard || 'N/A'}</p>
            <p><strong>Billing Plan:</strong> ${selections.billing.plan || 'N/A'}</p>
        `;
        document.getElementById('summaryContent').innerHTML = summaryContent;
    }
});
