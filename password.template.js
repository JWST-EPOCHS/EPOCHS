document.addEventListener('DOMContentLoaded', () => {
    // This placeholder will be replaced by the GitHub Action
    const CORRECT_PASSWORD_HASH = "__PASSWORD_HASH_PLACEHOLDER__";

    const overlay = document.getElementById('password-overlay');
    const mainContent = document.getElementById('main-content');
    const passwordInput = document.getElementById('password-input');
    const passwordSubmit = document.getElementById('password-submit');
    const passwordError = document.getElementById('password-error');

    // Function to hash input using SHA-256
    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Check sessionStorage
    if (sessionStorage.getItem('fitsmap_auth') === 'true') {
        unlockPage();
    }

    passwordSubmit.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkPassword(); });

    async function checkPassword() {
        const enteredPassword = passwordInput.value;
        const hashedInput = await sha256(enteredPassword);

        if (hashedInput === CORRECT_PASSWORD_HASH) {
            sessionStorage.setItem('fitsmap_auth', 'true');
            unlockPage();
        } else {
            passwordError.style.display = 'block';
            passwordInput.value = '';
        }
    }

    function unlockPage() {
        overlay.style.display = 'none';
        mainContent.style.display = 'flex';
    }
});