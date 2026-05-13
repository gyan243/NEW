const productGrid = document.querySelector("#productGrid");
const viewAllButton = document.querySelector("#viewAllProducts");
const cartList = document.querySelector("#cartList");
const cartTotal = document.querySelector("#cartTotal");
const clearCartButton = document.querySelector("#clearCart");
const toast = document.querySelector("#toast");
const contactForm = document.querySelector(".contact-form");
const navLinks = document.querySelectorAll(".nav-link");

const cart = new Map();
let toastTimer;

function formatRupees(value) {
  return `\u20b9${value}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

function renderCart() {
  cartList.innerHTML = "";

  if (cart.size === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-cart";
    emptyItem.textContent = "No items added yet.";
    cartList.appendChild(emptyItem);
    cartTotal.textContent = formatRupees(0);
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    const lineTotal = item.price * item.quantity;
    total += lineTotal;

    const row = document.createElement("li");
    row.innerHTML = `
      <span>${item.name} x ${item.quantity}</span>
      <strong>${formatRupees(lineTotal)}</strong>
    `;
    cartList.appendChild(row);
  });

  cartTotal.textContent = formatRupees(total);
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".btn-cart");
  if (!button) return;

  const card = button.closest(".product-card");
  const name = card.dataset.product;
  const price = Number(card.dataset.price);
  const current = cart.get(name) || { name, price, quantity: 0 };

  current.quantity += 1;
  cart.set(name, current);
  renderCart();
  showToast(`${name} added to cart`);
});

viewAllButton.addEventListener("click", () => {
  const expanded = productGrid.classList.toggle("products-expanded");
  viewAllButton.textContent = expanded ? "Show Less" : "View All Products";
});

clearCartButton.addEventListener("click", () => {
  cart.clear();
  renderCart();
  showToast("Cart cleared");
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  contactForm.reset();
  showToast("Thanks, your enquiry is ready for the shop team.");
});

const sections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

window.addEventListener("scroll", () => {
  const activeSection = sections
    .slice()
    .reverse()
    .find((section) => section.getBoundingClientRect().top <= 120);

  if (!activeSection) return;

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${activeSection.id}`);
  });
});