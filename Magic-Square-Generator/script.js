function generateMagicSquare() {
    const size = parseInt(document.getElementById('size').value);

    if (isNaN(size) || size % 2 === 0 || size < 1) {
        alert("Please enter a valid odd number greater than 0.");
        return;
    }

    let square = Array.from({ length: size }, () => Array(size).fill(0));
    let num = 1;
    let i = 0, j = Math.floor(size / 2);
    let steps = [];

    while (num <= size * size) {
        square[i][j] = num;
        steps.push(`Placed ${num} at position (${i + 1}, ${j + 1})`);

        let newi = (i - 1 + size) % size;
        let newj = (j + 1) % size;

        if (square[newi][newj] !== 0) {
            i = (i + 1) % size;
            steps.push(`Cell occupied, moving down to position (${i + 1}, ${j + 1})`);
        } else {
            i = newi;
            j = newj;
        }

        num++;
    }

    displayMagicSquare(square);
    displayMagicConstant(size * (size * size + 1) / 2);
    displaySteps(steps);
}

function displayMagicSquare(square) {
    const container = document.getElementById('magic-square-container');
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${square.length}, 60px)`;

    square.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const div = document.createElement('div');
            div.className = 'square';
            div.textContent = cell;
            container.appendChild(div);

            // Animation for cells
            setTimeout(() => div.classList.add('visible'), (rowIndex * square.length + colIndex) * 100);
        });
    });
}

function displayMagicConstant(magicConstant) {
    document.getElementById('magic-constant-container').textContent = `Magic Constant: ${magicConstant}`;
}

function displaySteps(steps) {
    const stepContainer = document.getElementById('step-by-step');
    stepContainer.innerHTML = '<h3>Step-by-Step Calculation:</h3><ul></ul>';
    const ul = stepContainer.querySelector('ul');

    steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        ul.appendChild(li);
    });
}