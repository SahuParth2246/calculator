const display = document.querySelector('.display');
let displayText = '';
let justEvaluated = false;

function updateDisplay(text) {
    display.innerText = text || '0';
}

// Numbers
document.querySelectorAll('.numbers button').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (justEvaluated) {
            displayText = '';
            justEvaluated = false;
        }
        displayText += e.target.id;
        updateDisplay(displayText);
    });
});

// Operators
document.querySelectorAll('.operations button').forEach(btn => {
    btn.addEventListener('click', (e) => {
        justEvaluated = false;
        const op = e.target.id;

        // Prevent double operators
        const lastChar = displayText.slice(-1);
        const isOperator = ['+', '-', '/', '*', '^', '%'].includes(lastChar);
        if (isOperator) displayText = displayText.slice(0, -1);

        // ^ needs to become ** for eval
        displayText += (op === '^') ? '**' : op;
        updateDisplay(displayText);
    });
});

// Start buttons (=, X, AC, .)
document.querySelectorAll('.start button').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const id = e.target.id;

        if (id === '=') {
            if (!displayText) return;
            try {
                // % as "percent of" — e.g. 50%20 → 50*(20/100)
                let expr = displayText.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
                const result = Function('"use strict"; return (' + expr + ')')();
                const rounded = parseFloat(result.toFixed(10)); // avoid float hell
                displayText = String(rounded);
                updateDisplay(displayText);
                justEvaluated = true;
            } catch {
                display.innerText = 'Error';
                displayText = '';
            }
        }

        if (id === 'X') {
            displayText = displayText.slice(0, -1);
            updateDisplay(displayText);
        }

        if (id === 'ac') {
            displayText = '';
            justEvaluated = false;
            updateDisplay('');
        }

        if (id === '.') {
            // Find the last number segment and check if it already has a dot
            const parts = displayText.split(/[\+\-\*\/\^%]/);
            const lastPart = parts[parts.length - 1];
            if (lastPart.includes('.')) return;
            if (!lastPart) displayText += '0'; // operator then dot → 0.
            displayText += '.';
            updateDisplay(displayText);
        }
    });
});

// Keyboard support (bonus — resume flex)
document.addEventListener('keydown', (e) => {
    const key = e.key;
    if ('0123456789'.includes(key)) document.getElementById(key)?.click();
    if (['+', '-', '*', '/'].includes(key)) document.getElementById(key)?.click();
    if (key === 'Enter' || key === '=') document.getElementById('=')?.click();
    if (key === 'Backspace') document.getElementById('X')?.click();
    if (key === 'Escape') document.getElementById('ac')?.click();
    if (key === '.') document.getElementById('.')?.click();
});