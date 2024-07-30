document.addEventListener('DOMContentLoaded', () => {
  const expenseForm = document.getElementById('expenseForm');
  const expenseTableBody = document.getElementById('expenseTableBody');
  const totalExpenseElement = document.getElementById('totalExpense');

  let totalExpense = 0;

  // Fetch existing expenses from the backend
  fetch('https://wizzypos.netlify.app/api/expenses')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        data.expenses.forEach(expense => {
          addExpenseToTable(expense);
          totalExpense += expense.price;
        });
        updateTotalExpense(totalExpense);
      }
    })
    .catch(error => console.error('Error fetching expenses:', error));

  expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(expenseForm);
    const expenseData = {
      title: formData.get('title'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price'))
    };

    // Send the new expense data to the backend
    fetch('/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(expenseData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          addExpenseToTable(data.expense);
          totalExpense += data.expense.price;
          updateTotalExpense(totalExpense);
          expenseForm.reset();
        } else {
          console.error('Error adding expense:', data.message);
        }
      })
      .catch(error => console.error('Error adding expense:', error));
  });

  const resizeBtn = document.querySelector("[data-resize-btn]");
  resizeBtn.addEventListener("click", function (e) {
    e.preventDefault();
    document.body.classList.toggle("sb-expanded");
  });

  function addExpenseToTable(expense) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${expense._id}</td>
      <td>${expense.title}</td>
      <td>${expense.description}</td>
      <td>$${expense.price.toFixed(2)}</td>
      <td>${new Date(expense.date).toLocaleString()}</td>
      <td>
        <button class="btn btn-danger" onclick="deleteExpense('${expense._id}', ${expense.price}, this.closest('tr'))">
          <i class='bx bx-trash'></i>
        </button>
      </td>
    `;
    expenseTableBody.appendChild(row);
  }

  function updateTotalExpense(amount) {
    totalExpenseElement.textContent = `$${amount.toFixed(2)}`;
  }

  window.deleteExpense = function(expenseId, price, row) {
    fetch(`/api/expenses/${expenseId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          expenseTableBody.removeChild(row);
          totalExpense -= price;
          updateTotalExpense(totalExpense);
        } else {
          console.error('Error deleting expense:', data.message);
        }
      })
      .catch(error => console.error('Error deleting expense:', error));
  }
});
