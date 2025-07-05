document.addEventListener('DOMContentLoaded', () => {
    // --- CHANGE THIS PASSWORD ---
    const CORRECT_PASSWORD = "jwst"; 
    // --------------------------

    const overlay = document.getElementById('password-overlay');
    const mainContent = document.getElementById('main-content');
    const passwordInput = document.getElementById('password-input');
    const passwordSubmit = document.getElementById('password-submit');
    const passwordError = document.getElementById('password-error');

    // Check if password is correct in sessionStorage
    if (sessionStorage.getItem('fitsmap_auth') === 'true') {
        unlockPage();
    }

    passwordSubmit.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });

    function checkPassword() {
        if (passwordInput.value === CORRECT_PASSWORD) {
            sessionStorage.setItem('fitsmap_auth', 'true');
            unlockPage();
        } else {
            passwordError.style.display = 'block';
            passwordInput.value = '';
        }
    }

    function unlockPage() {
        overlay.style.display = 'none';
        mainContent.style.display = 'flex'; // Use flex to match your layout
    }
});