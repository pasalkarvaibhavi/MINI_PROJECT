/**
 * Animates items being added to the sack visually.
 * @param {number[]} itemIndexes - Array of item indices to animate.
 */
function animateItems(itemIndexes, itemPercentages) {
    const sack = document.querySelector(".sack");
    const tableContainer = document.querySelector(".split.right");  // Table container to scroll
    sack.innerHTML = ""; // Clear previous animation
    const spacing = 50;
    const offsetTop = 50;
    
    const totalItems = itemIndexes.length;
    const maxItemsPerRow = 5; // You can change this to control how many items per row
    const containerWidth = sack.offsetWidth; // Get the width of the container
    let itemSize = 20; // Default size for an item
    
    // Calculate the size of each item based on the number of items
    const maxItemsInRow = Math.floor(containerWidth / itemSize);
    const rowsNeeded = Math.ceil(totalItems / maxItemsInRow);

    if (totalItems > maxItemsInRow * rowsNeeded) {
        itemSize = Math.max(containerWidth / totalItems - 5, 10); // Reduce item size if there are too many items
    }

    let totalHeight = 0;  // To track the total height of the items being added

    itemIndexes.forEach((index, i) => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("item");

        const itemNumber = document.createElement("span");
        itemNumber.textContent = `I${index + 1}`;
        itemElement.appendChild(itemNumber);

        // Get the percentage of the item added
        const itemPercentage = itemPercentages[i];

        // Adjust the background color based on whether it's partially added
        if (itemPercentage === 1) {
            // Fully added item
            itemElement.style.backgroundColor = "blue"; // Full blue color for full item
        } else {
            // Partially added item
            itemElement.style.background = `linear-gradient(to right, blue ${itemPercentage * 100}%, white ${itemPercentage * 100}%)`; // Gradient from blue to white
            itemElement.style.color = "black"; // Set text color to black
        }

        // Set the width and height dynamically
        itemElement.style.width = `${itemSize}px`;
        itemElement.style.height = `${itemSize}px`;

        // Calculate position for animation
        const topPosition = offsetTop + (Math.floor(i / maxItemsPerRow) * spacing);
        const leftPosition = 100 + (i % maxItemsPerRow) * spacing;

        itemElement.style.top = `${topPosition}px`;
        itemElement.style.left = `${leftPosition}px`;

        sack.appendChild(itemElement);

        // Update totalHeight based on the number of rows added
        totalHeight = topPosition + itemSize;

        // Automatically scroll the table container if the items exceed the current visible area
        if (totalHeight > tableContainer.scrollTop + tableContainer.clientHeight) {
            tableContainer.scrollTop = totalHeight; // Scroll the table container to the new height
        }
    });
}



/**
 * Calculates the maximum profit for the fractional knapsack problem
 * and updates the table and sack visualization step by step.
 */
async function calculateKnapsackProfit() {
    clearPreviousResults();  // Clear previous results

    const weightsInput = document.getElementById("weights").value;
    const profitsInput = document.getElementById("values").value;
    const capacityInput = document.getElementById("capacity").value;

    const weights = weightsInput.split(',').map(Number);
    const profits = profitsInput.split(',').map(Number);
    const capacity = Number(capacityInput);

    const n = weights.length;
    const items = [];

    for (let i = 0; i < n; i++) {
        items.push({
            index: i,
            weight: weights[i],
            profit: profits[i],
            ratio: profits[i] / weights[i]
        });
    }

    // Sort items by profit-to-weight ratio
    items.sort((a, b) => b.ratio - a.ratio);

    let totalProfit = 0;
    let remainingCapacity = capacity;
    const sackItems = [];
    const itemPercentages = [];  // Array to store the percentage of each item added

    for (let i = 0; i < n; i++) {
        if (remainingCapacity === 0) break;

        const item = items[i];
        let profitTaken, weightUsed;
        let itemPercentage = 1;

        if (item.weight <= remainingCapacity) {
            profitTaken = item.profit;
            weightUsed = item.weight;
            remainingCapacity -= weightUsed;
        } else {
            profitTaken = item.profit * (remainingCapacity / item.weight);
            weightUsed = remainingCapacity;
            remainingCapacity = 0;
            itemPercentage = weightUsed / item.weight;  // Calculate partial percentage
        }

        totalProfit += profitTaken;
        sackItems.push({
            index: item.index,
            profitTaken,
            weightUsed,
            remainingCapacity
        });

        itemPercentages.push(itemPercentage);  // Store the percentage of the item added

        // Update the table and animate items
        await updateDetailedTableRow(item.index + 1, weightUsed, profitTaken, totalProfit, remainingCapacity);
        animateItems(sackItems.map(item => item.index), itemPercentages);

        // Wait for 2 seconds before proceeding to next item
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Display the final profit
    document.getElementById("result").innerHTML = `Maximum Profit is: ${totalProfit.toFixed(2)}`;
    document.getElementById("itemCount").textContent = `Number of items: ${sackItems.length}`;
}

/**
 * Clears previous results from the table and sack visualization.
 */
function clearPreviousResults() {
    // Clear detailed table
    const tableBody = document.querySelector("#detailedTable tbody");
    tableBody.innerHTML = '';

    // Clear sack visualization
    const sack = document.querySelector(".sack");
    sack.innerHTML = '';
}

/**
 * Updates the detailed table row by row with item information, showing calculations for total profit and remaining capacity.
 * @param {number} itemNumber - Item index (1-based).
 * @param {number} weightUsed - Weight used from the item.
 * @param {number} profitTaken - Profit taken from the item.
 * @param {number} totalProfit - Cumulative total profit.
 * @param {number} remainingCapacity - Remaining capacity of the sack.
 */
async function updateDetailedTableRow(itemNumber, weightUsed, profitTaken, totalProfit, remainingCapacity) {
    const tableBody = document.querySelector("#detailedTable tbody");

    // Create a new row
    const row = tableBody.insertRow();

    // Insert cells and set their content with detailed calculations
    const itemCell = row.insertCell(0);
    const profitCell = row.insertCell(1);
    const weightCell = row.insertCell(2);

    // Format the calculations
    const initialProfit = totalProfit - profitTaken; // Previous profit before adding this item's profit
    const initialCapacity = remainingCapacity + weightUsed; // Previous capacity before subtracting the current item's weight

    itemCell.textContent = `I${itemNumber}`;
    profitCell.textContent = `${initialProfit.toFixed(2)} + ${profitTaken.toFixed(2)} = ${totalProfit.toFixed(2)}`;
    weightCell.textContent = `${initialCapacity.toFixed(2)} - ${weightUsed.toFixed(2)} = ${remainingCapacity.toFixed(2)}`;
}

/**
 * Updates the initial items table showing profits, weights, and ratios.
 */
function updateTable() {
    const weightsInput = document.getElementById("weights").value;
    const profitsInput = document.getElementById("values").value;

    const weights = weightsInput.split(',').map(Number);
    const profits = profitsInput.split(',').map(Number);

    const itemCount = weights.length;

    document.getElementById("itemCount").textContent = `Number of items: ${itemCount}`;

    const tableBody = document.querySelector("#resultTable tbody");
    tableBody.innerHTML = ''; // Clear existing rows

    // Populate table rows
    for (let i = 0; i < itemCount; i++) {
        const weight = weights[i];
        const profit = profits[i];
        const ratio = profit / weight;

        const row = tableBody.insertRow();
        const profitCell = row.insertCell(0);
        const weightCell = row.insertCell(1);
        const ratioCell = row.insertCell(2);

        profitCell.textContent = profit;
        weightCell.textContent = weight;
        ratioCell.textContent = ratio.toFixed(2);
    }
}

// Attach event listeners
document.getElementById("weights").addEventListener("input", updateTable);
document.getElementById("values").addEventListener("input", updateTable);
document.getElementById("calculate").addEventListener("click", calculateKnapsackProfit);

