// Login form validation and interaction
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const submitButton = document.querySelector('.submit_button');

    function validateForm() {
        if (!usernameInput || !passwordInput) return true; // evita erro se elementos não existirem

        let ok = true;

        if (usernameInput.value.trim() === '') {
            usernameInput.classList.add('error');
            ok = false;
        } else {
            usernameInput.classList.remove('error');
        }

        if (passwordInput.value.trim() === '') {
            passwordInput.classList.add('error');
            ok = false;
        } else {
            passwordInput.classList.remove('error');
        }

        return ok;
    }

    if (usernameInput) {
        usernameInput.addEventListener('input', () => {
            if (usernameInput.value.trim() !== '') {
                usernameInput.classList.remove('error');
            }
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            if (passwordInput.value.trim() !== '') {
                passwordInput.classList.remove('error');
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            if (!validateForm()) {
                e.preventDefault();
            }
        });
    }

    // Language checkbox: muda o idioma imediatamente ao clicar
    const langCheckbox = document.getElementById('spanish');
    if (langCheckbox) {
        langCheckbox.addEventListener('change', function() {
            const targetLang = this.checked ? 'es' : 'pt';
            window.location.href = `/change_language/${targetLang}`;
        });
    }
});