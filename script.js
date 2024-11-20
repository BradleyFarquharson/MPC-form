:root {
    --dark-grey: #2D2D2D;
    --orange: #FF6B2B;
    --white: #FFFFFF;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s ease;
}

body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background-color: var(--dark-grey);
    color: var(--white);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    width: 90%;
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
}

.card {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 24px;
    margin: 20px 0;
    box-shadow: var(--shadow);
    transition: var(--transition);
}

.btn {
    background-color: var(--orange);
    color: var(--white);
    border: none;
    border-radius: 6px;
    padding: 12px 24px;
    cursor: pointer;
    transition: var(--transition);
    font-size: 16px;
    margin: 8px;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow);
}

.button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    margin-top: 20px;
}

.progress-bar {
    width: 100%;
    height: 4px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    margin-bottom: 20px;
}

.progress {
    height: 100%;
    background-color: var(--orange);
    border-radius: 2px;
    transition: var(--transition);
    width: 0%;
}

.step-indicator {
    text-align: center;
    margin-bottom: 20px;
    color: var(--white);
    font-size: 14px;
}

.navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

/* Add styles for inputs when we add them */
