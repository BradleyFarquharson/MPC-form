let history = ['initial'];

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    if (history[history.length - 1] !== sectionId) {
        history.push(sectionId);
    }
}

function goBack() {
    if (history.length > 1) {
        history.pop();
        showSection(history[history.length - 1]);
        history.pop();
    }
}

function showEarthConnectOptions() {
    showSection('earth-connect-options');
}

function showLocalConnectOptions() {
    showSection('local-connect-options');
}

function showFormFactor() {
    showSection('form-factor');
}

function selectESIM() {
    showCountrySelection();
}

function showIMSIOptions() {
    showSection('imsi-option');
}

function showSwitchPlanOptions() {
    showSection('switch-plan-option');
}

function showCountrySelection() {
    showSection('country-selection');
}

function showPlanSelection() {
    showSection('plan-selection');
}

function showSpecificPlan(plan) {
    document.querySelectorAll('#plan-selection .section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(`${plan}-plan`).style.display = 'block';
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.tab[onclick="showSpecificPlan('${plan}')"]`).classList.add('active');
}

function showPooledOptions() {
    finalMessage('Selecting Pooled Plan Option.');
}

function finalMessage(option) {
    alert(`You have completed the selection: ${option}`);
}
