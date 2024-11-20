document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 0;
    const steps = document.querySelectorAll('.step');
    const backBtn = document.getElementById('backBtn');
    const nextBtn = document.getElementById('nextBtn');
    const summaryContent = document.getElementById('summaryContent');

    // Object to store user selections
    const selections = {
        enterprise: { type: null },
        network: { type: null, realm: null },
        connectivity: { type: null, formFactor: null, imsiType: null, plan: null, countries: [] },
        billing: { rateCard: null, plan: null },
    };

    // Initialize the first step
    steps[currentStep].classList.add('active');
    updateNavigation();

    /* --- Event Listeners for Enterprise Configuration --- */
    document.querySelectorAll('[data-action="selectEnterprise"]').forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            selections.enterprise.type = type;

            // Show enterprise inputs
            document.getElementById('enterpriseInputs').classList.remove('hidden');

            // Show or hide child portals based on enterprise type
            const childPortals = document.getElementById('childPortals');
            if (type === 'multi') {
                childPortals.classList.remove('hidden');
            } else {
                childPortals.classList.add('hidden');
                document.getElementById('childPortalCount').value = ''; // Reset input
            }

            // Optionally, mark the step as complete and enable Next
            validateCurrentStep();
        });
    });

    /* --- Event Listeners for Network Configuration --- */
    document.querySelectorAll('[data-action="selectNetwork"]').forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            selections.network.type = type;

            // Show realm inputs
            document.getElementById('realmInputs').classList.remove('hidden');

            // Reset previous selections
            selections.network.realm = null;
            document.getElementById('realmName').classList.add('hidden');
            validateCurrentStep();
        });
    });

    document.querySelectorAll('[data-action="selectRealm"]').forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            selections.network.realm = type;

            // Show or hide realm name input based on realm type
            const realmName = document.getElementById('realmName');
            if (type === 'custom') {
                realmName.classList.remove('hidden');
            } else {
                realmName.classList.add('hidden');
                realmName.value = ''; // Reset input
            }

            validateCurrentStep();
        });
    });

    /* --- Event Listeners for Connectivity Options --- */
    document.querySelectorAll('[data-action="chooseOption"]').forEach(button => {
        button.addEventListener('click', () => {
            const option = button.dataset.option;
            selections.connectivity.type = option;

            // Show form factor inputs
            document.getElementById('formFactorInputs').classList.remove('hidden');

            // Reset previous selections
            selections.connectivity.formFactor = null;
            selections.connectivity.imsiType = null;
            selections.connectivity.plan = null;
            document.getElementById('imsiOptions').classList.add('hidden');
            document.getElementById('profilePlans').classList.add('hidden');
            document.getElementById('countryStep').classList.add('hidden');

            validateCurrentStep();
        });
    });

    document.querySelectorAll('[data-action="selectFormFactor"]').forEach(button => {
        button.addEventListener('click', () => {
            const factor = button.dataset.factor;
            selections.connectivity.formFactor = factor;

            // Show or hide IMSI options based on form factor
            const imsiOptions = document.getElementById('imsiOptions');
            if (factor !== 'esim') {
                imsiOptions.classList.remove('hidden');
            } else {
                imsiOptions.classList.add('hidden');
                selections.connectivity.imsiType = null;
            }

            // Reset previous selections
            selections.connectivity.imsiType = null;
            selections.connectivity.plan = null;
            document.getElementById('profilePlans').classList.add('hidden');
            document.getElementById('countryStep').classList.add('hidden');

            validateCurrentStep();
        });
    });

    document.querySelectorAll('[data-action="selectIMSI"]').forEach(button => {
        button.addEventListener('click', () => {
            const imsi = button.dataset.imsi;
            selections.connectivity.imsiType = imsi;

            // Show profile plans
            document.getElementById('profilePlans').classList.remove('hidden');

            // Reset previous plan selection
            selections.connectivity.plan = null;
            document.getElementById('countryStep').classList.add('hidden');

            validateCurrentStep();
        });
    });

    document.querySelectorAll('[data-action="selectPlan"]').forEach(button => {
        button.addEventListener('click', () => {
            const plan = button.dataset.plan;
            selections.connectivity.plan = plan;

            // Show country selection if custom plan is chosen
            if (plan === 'custom') {
                document.getElementById('countryStep').classList.remove('hidden');
            } else {
                document.getElementById('countryStep').classList.add('hidden');
            }

            validateCurrentStep();
        });
    });

    /* --- Event Listener for Country Selection --- */
    document.getElementById('countrySelect').addEventListener('change', () => {
        const selectedOptions = Array.from(document.getElementById('countrySelect').selectedOptions);
        selections.connectivity.countries = selectedOptions.map(option => option.value);
        validateCurrentStep();
    });

    /* --- Event Listeners for Rate Card and Billing --- */
    document.querySelectorAll('[data-action="selectRateCard"]').forEach(button => {
        button.addEventListener('click', () => {
            const rateCard = button.dataset.ratecard;
            selections.billing.rateCard = rateCard;

            // Show billing options
            document.getElementById('billingOptions').classList.remove('hidden');

            // Reset previous billing selection
            selections.billing.plan = null;

            validateCurrentStep();
        });
    });

    document.querySelectorAll('[data-action="selectBilling"]').forEach(button => {
        button.addEventListener('click', () => {
            const billingPlan = button.dataset.billing;
            selections.billing.plan = billingPlan;

            validateCurrentStep();
        });
    });

    /* --- Navigation Buttons --- */
    backBtn.addEventListener('click', () => {
        navigate('back');
    });

    nextBtn.addEventListener('click', () => {
        if (validateCurrentStep()) {
            navigate('next');
        } else {
            alert('Please complete all required fields before proceeding.');
        }
    });

    /* --- Navigation Function --- */
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

    /* --- Update Navigation Buttons --- */
    function updateNavigation() {
        backBtn.style.display = currentStep > 0 ? 'block' : 'none';
        nextBtn.style.display = currentStep < steps.length - 1 ? 'block' : 'none';

        // If on the summary step, disable Next button
        if (currentStep === steps.length - 1) {
            nextBtn.style.display = 'none';
            showSummary();
        } else {
            nextBtn.style.display = 'block';
            nextBtn.disabled = false; // Reset disabled state
        }
    }

    /* --- Validation Function --- */
    function validateCurrentStep() {
        let isValid = false;

        switch (currentStep) {
            case 0: // Enterprise Configuration
                isValid = selections.enterprise.type !== null;
                if (selections.enterprise.type === 'multi') {
                    const childCount = document.getElementById('childPortalCount').value;
                    if (childCount && parseInt(childCount) >= 2) {
                        isValid = isValid && true;
                    } else {
                        isValid = false;
                    }
                }
                break;

            case 1: // Network Configuration
                isValid = selections.network.type !== null && selections.network.realm !== null;
                if (selections.network.realm === 'custom') {
                    const realmName = document.getElementById('realmName').value.trim();
                    isValid = isValid && realmName !== '';
                }
                break;

            case 2: // Connectivity Options
                isValid = selections.connectivity.type !== null;
                if (selections.connectivity.type !== null) {
                    if (selections.connectivity.formFactor !== null) {
                        isValid = isValid && true;
                        if (selections.connectivity.formFactor !== 'esim') {
                            if (selections.connectivity.imsiType !== null) {
                                isValid = isValid && true;
                                if (selections.connectivity.plan !== null) {
                                    isValid = isValid && true;
                                    if (selections.connectivity.plan === 'custom') {
                                        isValid = isValid && selections.connectivity.countries.length > 0;
                                    }
                                } else {
                                    isValid = false;
                                }
                            } else {
                                isValid = false;
                            }
                        }
                    } else {
                        isValid = false;
                    }
                }
                break;

            case 3: // Country Selection
                // This step is only visible if a custom plan is selected
                if (document.getElementById('countryStep').classList.contains('hidden')) {
                    isValid = true;
                } else {
                    isValid = selections.connectivity.countries.length > 0;
                }
                break;

            case 4: // Rate Card and Billing
                isValid = selections.billing.rateCard !== null;
                if (selections.billing.rateCard !== null) {
                    isValid = isValid && selections.billing.plan !== null;
                }
                break;

            case 5: // Summary
                isValid = true; // Always valid
                break;

            default:
                isValid = false;
        }

        // Enable or disable Next button based on validation
        if (currentStep < steps.length - 1) {
            nextBtn.disabled = !isValid;
        }

        return isValid;
    }

    /* --- Show Summary Function --- */
    function showSummary() {
        const { enterprise, network, connectivity, billing } = selections;
        const countryList = connectivity.countries.length > 0 ? connectivity.countries.join(', ') : 'N/A';

        const summaryHTML = `
            <p><strong>Enterprise:</strong> ${enterprise.type ? formatType(enterprise.type) : 'N/A'}</p>
            <p><strong>Enterprise Name:</strong> ${document.getElementById('enterpriseName').value || 'N/A'}</p>
            <p><strong>Number of Child Portals:</strong> ${enterprise.type === 'multi' ? (document.getElementById('childPortalCount').value || 'N/A') : 'N/A'}</p>
            <p><strong>Network:</strong> ${network.type ? formatType(network.type) : 'N/A'}</p>
            <p><strong>Realm:</strong> ${network.realm ? formatType(network.realm) : 'N/A'}</p>
            <p><strong>Realm Name:</strong> ${network.realm === 'custom' ? (document.getElementById('realmName').value || 'N/A') : 'N/A'}</p>
            <p><strong>Connectivity Type:</strong> ${connectivity.type ? formatType(connectivity.type) : 'N/A'}</p>
            <p><strong>Form Factor:</strong> ${connectivity.formFactor ? formatType(connectivity.formFactor) : 'N/A'}</p>
            <p><strong>IMSI Type:</strong> ${connectivity.imsiType ? formatType(connectivity.imsiType) : 'N/A'}</p>
            <p><strong>Connectivity Plan:</strong> ${connectivity.plan ? formatType(connectivity.plan) : 'N/A'}</p>
            <p><strong>Countries:</strong> ${countryList}</p>
            <p><strong>Rate Card:</strong> ${billing.rateCard ? formatType(billing.rateCard) : 'N/A'}</p>
            <p><strong>Billing Plan:</strong> ${billing.plan ? formatType(billing.plan) : 'N/A'}</p>
        `;
        summaryContent.innerHTML = summaryHTML;
    }

    /* --- Utility Function to Format Text --- */
    function formatType(type) {
        // Convert snake_case or other formats to Title Case for better readability
        return type.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    }

    /* --- Initial Validation --- */
    validateCurrentStep();
});
