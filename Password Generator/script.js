const generateBtn = document.getElementById('generate');
        const passwordField = document.getElementById('password');
        const lengthInput = document.getElementById('length');
        const uppercaseCheckbox = document.getElementById('uppercase');
        const digitsCheckbox = document.getElementById('digits');
        const specialCheckbox = document.getElementById('special');
        const strengthMeter = document.getElementById('strength');
        const copyBtn = document.getElementById('copy');
        const darkModeToggle = document.getElementById('darkMode');

        function generatePassword(length, includeUppercase, includeDigits, includeSpecial) {
            const lowercase = 'abcdefghijklmnopqrstuvwxyz';
            const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const digits = '0123456789';
            const special = '!@#$%^&*()_+-=[]{}|;:,.<>?/';

            let characters = lowercase;
            if (includeUppercase) characters += uppercase;
            if (includeDigits) characters += digits;
            if (includeSpecial) characters += special;

            let password = '';
            for (let i = 0; i < length; i++) {
                password += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return password;
        }

        function checkStrength(password) {
            const lengthCriteria = password.length >= 8; // Minimum length of 8
            const upperCriteria = /[A-Z]/ .test(password);
            const digitCriteria = /[0-9]/.test(password);
            const specialCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

            if (lengthCriteria && upperCriteria && digitCriteria && specialCriteria) {
                return 'Strong';
            } else if (lengthCriteria && (upperCriteria || digitCriteria || specialCriteria)) {
                return 'Medium';
            } else {
                return 'Weak';
            }
        }

        generateBtn.addEventListener('click', () => {
            const length = parseInt(lengthInput.value);
            const includeUppercase = uppercaseCheckbox.checked;
            const includeDigits = digitsCheckbox.checked;
            const includeSpecial = specialCheckbox.checked;

            const password = generatePassword(length, includeUppercase, includeDigits, includeSpecial);
            passwordField.value = password;

            const strength = checkStrength(password);
            strengthMeter.textContent = `Password Strength: ${strength}`;
            strengthMeter.className = strength.toLowerCase();
        });

        copyBtn.addEventListener('click', () => {
            if (passwordField.value) {
                navigator.clipboard.writeText(passwordField.value).then(() => {
                    alert('Password copied to clipboard!');
                });
            } else {
                alert('No password to copy!');
            }
        });

        darkModeToggle.addEventListener('change', (event) => {
            document.body.classList.toggle('dark-mode', event.target.checked);
        });