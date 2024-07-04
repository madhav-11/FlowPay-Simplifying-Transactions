
// modulated export
import PriorityQueue from './priority_queue.js'

// Event listener for form submission to add a transaction
document.getElementById('debtForm').addEventListener('submit', function (event) {
  event.preventDefault();

  // Read input values
  const from = document.getElementById('fromInput').value.trim();
  const to = document.getElementById('toInput').value.trim();
  const amount = parseFloat(document.getElementById('amountInput').value.trim());

  // Validate input
  if (from === '' || to === '' || isNaN(amount) || amount <= 0) {
    alert('Please enter valid values for From, To, and Amount.');
    return;
  }

  // Clear input fields
  document.getElementById('fromInput').value = '';
  document.getElementById('toInput').value = '';
  document.getElementById('amountInput').value = '';

  // Add transaction to debts array
  const transaction = { payer: from, payee: to, amount: amount };
  addTransaction(transaction);
});



// Function to add a transaction to the list
function addTransaction(transaction) {
  const transactionTable = document.getElementById('transactionTable').querySelector('tbody');
  const row = transactionTable.insertRow();
  row.insertCell(0).textContent = transaction.payer;
  row.insertCell(1).textContent = transaction.payee;
  row.insertCell(2).textContent = transaction.amount.toFixed(2); // Display amount with 2 decimal places

  // Add delete button to the row
  const deleteCell = row.insertCell(3);
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('delete-button');
  deleteButton.addEventListener('click', function () {
    row.remove();
    updateGraph();
  });
  deleteCell.appendChild(deleteButton);

  updateGraph();
}

// Function to update the graph visualization
function updateGraph() {
  const transactionTable = document.getElementById('transactionTable').querySelector('tbody');
  const rows = Array.from(transactionTable.rows);
  const transactions = rows.map(row => {
    return {
      payer: row.cells[0].textContent,
      payee: row.cells[1].textContent,
      amount: parseFloat(row.cells[2].textContent)
    };
  });
  drawGraph(transactions, '#graph');
}

// Event listener for form submission to minimize transactions
document.getElementById('minimizeForm').addEventListener('submit', function (event) {
  event.preventDefault();
  minimizeTransactions();
});

// Function to minimize transactions
function minimizeTransactions() {
  const transactionTable = document.getElementById('transactionTable').querySelector('tbody');
  const rows = Array.from(transactionTable.rows);
  const debts = rows.map(row => {
    return {
      payer: row.cells[0].textContent,
      payee: row.cells[1].textContent,
      amount: parseFloat(row.cells[2].textContent)
    };
  });

  // Get minimized transactions
  const minimizedTransactions = getMinimizedTransactions(debts);

  // Update minimized transactions table
  const minimizedTransactionTable = document.getElementById('minimizedTransactionTable').querySelector('tbody');
  minimizedTransactionTable.innerHTML = ''; // Clear previous results
  minimizedTransactions.forEach(transaction => {
    const row = minimizedTransactionTable.insertRow();
    row.insertCell(0).textContent = transaction.payer;
    row.insertCell(1).textContent = transaction.payee;
    row.insertCell(2).textContent = transaction.amount.toFixed(2); // Display amount with 2 decimal places
  });

  // Draw graph for minimized transactions
  drawGraph(minimizedTransactions, '#minimizedGraph');
}

// Function to minimize debts and return minimized transactions
function getMinimizedTransactions(debts) {
  const netBalances = {};

  // Calculate net balances for each person
  debts.forEach(({ payer, payee, amount }) => {
    if (!netBalances[payer]) netBalances[payer] = 0;
    if (!netBalances[payee]) netBalances[payee] = 0;
    netBalances[payer] -= amount;
    netBalances[payee] += amount;
  });

  const positiveBalances = new PriorityQueue();
  const negativeBalances = new PriorityQueue();

  // Separate positive and negative balances
  for (const person in netBalances) {
    if (netBalances[person] > 0) {
      positiveBalances.push(netBalances[person], person);
    } else if (netBalances[person] < 0) {
      negativeBalances.push(-netBalances[person], person);
    }
  }

  const minimizedTransactions = [];

  // Settle debts
  while (!positiveBalances.empty() && !negativeBalances.empty()) {
    const credit = positiveBalances.pop();
    const debit = negativeBalances.pop();
    const settledAmount = Math.min(credit.val, debit.val);
    minimizedTransactions.push({ payer: debit.name, payee: credit.name, amount: settledAmount });

    // Adjust remaining balances
    if (credit.val > debit.val) {
      positiveBalances.push(credit.val - settledAmount, credit.name);
    } else if (debit.val > credit.val) {
      negativeBalances.push(debit.val - settledAmount, debit.name);
    }
  }

  return minimizedTransactions;
}

// Function to draw graph using D3-Graphviz
function drawGraph(transactions, containerId) {
  const dotString = generateDotString(transactions);
  d3.select(containerId).graphviz()
    .renderDot(dotString);
}

// Function to generate DOT string for graph visualization
function generateDotString(transactions) {
  let dotString = 'digraph G {';
  transactions.forEach(({ payer, payee, amount }) => {
    dotString += `"${payer}" -> "${payee}" [label="${amount.toFixed(2)}"];`;
  });
  dotString += '}';
  return dotString;
}

// Initial graph render
updateGraph();
