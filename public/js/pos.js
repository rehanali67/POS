const resizeBtn = document.querySelector("[data-resize-btn]");
const toggleCategories = document.getElementById('toggleCategories');
const categories = document.querySelectorAll('.category');
document.querySelectorAll('.item-card').forEach(card => {
  const addButton = card.querySelector('.add');
  const minusButton = card.querySelector('.minus');
  const quantityDisplay = card.querySelector('.qtty');

  let quantity = 0;

  addButton.addEventListener('click', () => {
    quantity++;
    quantityDisplay.textContent = quantity;
  });

  minusButton.addEventListener('click', () => {
    if (quantity > 0) {
      quantity--;
      quantityDisplay.textContent = quantity;
    }
  });
});

let visible = false;

toggleCategories.addEventListener('click', () => {
  categories.forEach((category, index) => {
    setTimeout(() => {
      category.classList.toggle('show');
    }, index * 100);
  });
  visible = !visible;
});

resizeBtn.addEventListener("click", function (e) {
  e.preventDefault();
  document.body.classList.toggle("sb-expanded");
});