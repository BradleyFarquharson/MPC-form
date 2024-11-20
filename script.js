let history = ['initial'];

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show the selected section
    document.getElementById(sectionId).classList.add('active');

    // Update history for back navigation
    if (history[history.length - 1] !== sectionId) {
        history.push(sectionId);
    }
}

function goBack() {
    if (history.length > 1) {
        history.pop(); // Remove current section
        const previousSection = history[history.length - 1];
        showSection(previousSection);
    }
}

// Function to show plan content based on selected tab
function showPlanContent(planId) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Add active class to selected tab
    document.querySelector(`.tab[onclick="showPlanContent('${planId}')"]`).classList.add('active');

    // Hide all plan contents
    document.querySelectorAll('.plan-content').forEach(content => {
        content.classList.remove('active');
    });

    // Show the selected plan content
    document.getElementById(planId).classList.add('active');
}

function finalMessage(message) {
    alert(`You have completed the selection: ${message}`);
    // Optionally, you can reset the flow or navigate to the initial section
    // showSection('initial');
}

// Generate Dynamic Switch Plans
function generateSwitchPlans() {
    const plansContainer = document.getElementById('dynamic-plans');
    const plans = [];
    while (plans.length < 10) {
        const num = Math.floor(Math.random() * 90) + 10;
        if (!plans.includes(num)) plans.push(num);
    }
    plans.forEach(plan => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = `Switch Plan ${plan}`;
        btn.onclick = () => showSection('plan-selection');
        plansContainer.appendChild(btn);
    });
}

// Initialize the application
generateSwitchPlans();
