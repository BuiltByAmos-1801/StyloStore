// Replace these sample products, prices, images and details with your own catalogue.
const products = [
  {
    id: "everyday-tee",
    name: "The Everyday Tee",
    category: "T-Shirts",
    price: 1299,
    originalPrice: 1599,
    description: "An easy, relaxed essential made for repeat wear. Replace this copy with verified fabric and fit details.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Chalk"],
    tag: "Bestseller",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=82",
    alt: "Chalk relaxed-fit everyday t-shirt"
  },
  {
    id: "washed-tee",
    name: "Washed Form Tee",
    category: "T-Shirts",
    price: 1490,
    description: "A lived-in look with a roomy silhouette. Add your own confirmed product specifications.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Washed black"],
    tag: "New",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=82",
    alt: "Dark washed t-shirt styled for an editorial"
  },
  {
    id: "studio-shirt",
    name: "Studio Overshirt",
    category: "Shirts",
    price: 2490,
    originalPrice: 2990,
    description: "An easy layer for changing plans and cooler evenings. Replace this placeholder with the garment's real details.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Stone"],
    tag: "Easy layer",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=82",
    alt: "Stone-coloured relaxed shirt"
  },
  {
    id: "daily-hoodie",
    name: "Daily Uniform Hoodie",
    category: "Hoodies",
    price: 2890,
    description: "A laid-back layer with a clean, everyday shape. Add your own verified material and fit notes.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Oat"],
    tag: "Off-duty",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=82",
    alt: "Oat-coloured everyday hoodie"
  },
  {
    id: "boxy-shirt",
    name: "After Hours Shirt",
    category: "Shirts",
    price: 2190,
    description: "A relaxed shape that works open or buttoned up. Product details are sample copy for this demo.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Ink"],
    tag: "Just in",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=82",
    alt: "Dark relaxed-fit button-up shirt"
  },
  {
    id: "weekend-layer",
    name: "Weekend Layer",
    category: "New Arrivals",
    price: 3290,
    description: "A new-season statement in an easy-to-wear silhouette. Replace this description with accurate product information.",
    sizes: ["S", "M", "L"],
    colors: ["Moss"],
    tag: "New arrival",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=82",
    alt: "Contemporary streetwear look in earthy tones"
  }
];

// Set the business WhatsApp number here using country code and digits only, without "+" or spaces.
const WHATSAPP_NUMBER = "";
const CART_STORAGE_KEY = "stylo-stroe-demo-cart";
const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 760'%3E%3Crect width='600' height='760' fill='%23e3e0d8'/%3E%3Cpath d='M250 286h100l30 46 74 38-35 64-52-25v178H233V409l-52 25-35-64 74-38z' fill='%23c9c6bc'/%3E%3Ctext x='300' y='660' text-anchor='middle' fill='%2377756f' font-family='Arial' font-size='17' letter-spacing='4'%3ESTYLO STROE%3C/text%3E%3C/svg%3E";

const productGrid = document.querySelector("#product-grid");
const productTotal = document.querySelector("#product-total");
const modal = document.querySelector("#product-modal");
const cartDrawer = document.querySelector("#cart-drawer");
const overlay = document.querySelector("#overlay");
const toast = document.querySelector("#toast");
const cartContent = document.querySelector("#cart-content");
const cartFooter = document.querySelector("#cart-footer");
const whatsappWarning = document.querySelector("#whatsapp-warning");
let activeProduct = null;
let selectedSize = "";
let activeFilter = "All";
let lastFocusedElement = null;
let toastTimer;

function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function setImageFallback(image) {
  image.addEventListener("error", () => {
    image.src = FALLBACK_IMAGE;
    image.onerror = null;
  }, { once: true });
}

document.querySelectorAll(".hero-image, .category-card img, .story-image-wrap img").forEach(setImageFallback);

function loadCart() {
  // This localStorage cart is only a frontend demonstration, not a connected order database.
  try {
    const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    if (!Array.isArray(savedCart)) return [];
    return savedCart.filter((item) =>
      item &&
      products.some((product) => product.id === item.productId && product.sizes.includes(item.size)) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      item.quantity <= 10
    );
  } catch (error) {
    console.warn("Could not load the saved demo bag from localStorage.", error);
    return [];
  }
}

let cart = loadCart();

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.warn("Could not save the demo bag to localStorage.", error);
    showToast("Your bag works for this visit, but could not be saved on this device.");
  }
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const imageWrap = document.createElement("div");
  imageWrap.className = "product-image-wrap";
  const image = document.createElement("img");
  image.className = "product-image";
  image.src = product.image;
  image.alt = product.alt;
  image.loading = "lazy";
  image.decoding = "async";
  setImageFallback(image);
  imageWrap.append(image);

  const tag = document.createElement("span");
  tag.className = "product-tag";
  tag.textContent = product.tag;
  imageWrap.append(tag);

  const viewButton = document.createElement("button");
  viewButton.className = "product-quick-view";
  viewButton.type = "button";
  viewButton.textContent = "View product";
  viewButton.setAttribute("aria-label", `View ${product.name}`);
  viewButton.addEventListener("click", () => openProduct(product));
  imageWrap.append(viewButton);

  const meta = document.createElement("div");
  meta.className = "product-meta";
  const details = document.createElement("div");
  const name = document.createElement("h3");
  name.className = "product-name";
  name.textContent = product.name;
  const category = document.createElement("p");
  category.className = "product-category";
  category.textContent = product.category;
  details.append(name, category);

  const price = document.createElement("p");
  price.className = "product-price";
  if (product.originalPrice) {
    const originalPrice = document.createElement("del");
    originalPrice.textContent = formatPrice(product.originalPrice);
    price.append(originalPrice);
  }
  price.append(document.createTextNode(formatPrice(product.price)));
  meta.append(details, price);
  card.append(imageWrap, meta);
  return card;
}

function renderProducts() {
  const visibleProducts = products.filter((product) =>
    activeFilter === "All" || product.category === activeFilter
  );
  productGrid.replaceChildren(...visibleProducts.map(createProductCard));
  productTotal.textContent = `${String(visibleProducts.length).padStart(2, "0")} pieces`;
}

function setFilter(category) {
  activeFilter = category;
  document.querySelectorAll(".filter-button").forEach((button) => {
    const isActive = button.dataset.filter === category;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  renderProducts();
}

function updateOverlay() {
  const isOpen = !modal.hidden || !cartDrawer.hidden;
  overlay.hidden = !isOpen;
  document.body.classList.toggle("locked", isOpen);
}

function openProduct(product) {
  activeProduct = product;
  selectedSize = "";
  lastFocusedElement = document.activeElement;
  document.querySelector("#modal-category").textContent = product.category;
  document.querySelector("#modal-name").textContent = product.name;
  const price = document.querySelector("#modal-price");
  price.replaceChildren();
  if (product.originalPrice) {
    const originalPrice = document.createElement("del");
    originalPrice.textContent = formatPrice(product.originalPrice);
    price.append(originalPrice);
  }
  price.append(document.createTextNode(formatPrice(product.price)));
  document.querySelector("#modal-description").textContent = product.description;
  document.querySelector("#modal-colors").textContent = `Color${product.colors.length === 1 ? "" : "s"}: ${product.colors.join(", ")}`;
  const image = document.querySelector("#modal-image");
  image.src = product.image;
  image.alt = product.alt;
  image.onerror = null;
  setImageFallback(image);
  document.querySelector("#product-quantity").value = "1";
  document.querySelector("#size-error").textContent = "";
  const sizeOptions = document.querySelector("#size-options");
  sizeOptions.replaceChildren(...product.sizes.map((size) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "size-button";
    button.textContent = size;
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      selectedSize = size;
      sizeOptions.querySelectorAll(".size-button").forEach((sizeButton) => {
        const isSelected = sizeButton === button;
        sizeButton.classList.toggle("is-selected", isSelected);
        sizeButton.setAttribute("aria-pressed", String(isSelected));
      });
      document.querySelector("#size-error").textContent = "";
    });
    return button;
  }));
  cartDrawer.hidden = true;
  modal.hidden = false;
  updateOverlay();
  document.querySelector(".modal-close").focus();
}

function closePanels() {
  const hadOpenPanel = !modal.hidden || !cartDrawer.hidden;
  modal.hidden = true;
  cartDrawer.hidden = true;
  updateOverlay();
  if (hadOpenPanel && lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

function getCartItems() {
  return cart.map((item) => ({
    ...item,
    product: products.find((product) => product.id === item.productId)
  })).filter((item) => item.product);
}

function updateBagCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelector("#bag-count").textContent = String(count);
  document.querySelector("#bag-open").setAttribute("aria-label", `Open shopping bag, ${count} ${count === 1 ? "item" : "items"}`);
  document.querySelector("#drawer-count").textContent = `(${count})`;
}

function renderCart() {
  const items = getCartItems();
  updateBagCount();
  cartFooter.hidden = items.length === 0;
  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-cart";
    const mark = document.createElement("p");
    mark.className = "empty-cart-mark";
    mark.textContent = "S.";
    const heading = document.createElement("h3");
    heading.textContent = "A little room for something good.";
    const message = document.createElement("p");
    message.textContent = "Your bag is empty. Take a look around and find a piece that feels like you.";
    const shopLink = document.createElement("a");
    shopLink.className = "button button-dark";
    shopLink.href = "#shop";
    shopLink.textContent = "Explore the collection";
    shopLink.addEventListener("click", closePanels);
    empty.append(mark, heading, message, shopLink);
    cartContent.replaceChildren(empty);
    return;
  }

  const itemNodes = items.map(({ product, size, quantity }) => {
    const row = document.createElement("article");
    row.className = "cart-item";
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.alt;
    image.loading = "lazy";
    setImageFallback(image);
    const info = document.createElement("div");
    info.className = "cart-item-info";
    const name = document.createElement("h3");
    name.textContent = product.name;
    const options = document.createElement("p");
    options.textContent = `${product.colors.join(", ")} · Size ${size}`;
    const unitPrice = document.createElement("span");
    unitPrice.className = "cart-item-price";
    unitPrice.textContent = formatPrice(product.price);
    const actions = document.createElement("div");
    actions.className = "cart-item-actions";
    const quantityControl = document.createElement("span");
    quantityControl.className = "cart-qty";
    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.textContent = "−";
    decrease.setAttribute("aria-label", `Decrease ${product.name} quantity`);
    decrease.addEventListener("click", () => changeQuantity(product.id, size, -1));
    const quantityText = document.createElement("span");
    quantityText.textContent = String(quantity);
    const increase = document.createElement("button");
    increase.type = "button";
    increase.textContent = "+";
    increase.setAttribute("aria-label", `Increase ${product.name} quantity`);
    increase.addEventListener("click", () => changeQuantity(product.id, size, 1));
    quantityControl.append(decrease, quantityText, increase);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => removeFromCart(product.id, size));
    actions.append(quantityControl, remove);
    info.append(name, options, unitPrice, actions);
    const lineTotal = document.createElement("span");
    lineTotal.className = "cart-line-total";
    lineTotal.textContent = formatPrice(product.price * quantity);
    row.append(image, info, lineTotal);
    return row;
  });
  cartContent.replaceChildren(...itemNodes);
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  document.querySelector("#cart-subtotal").textContent = formatPrice(subtotal);
}

function addToCart() {
  if (!activeProduct) return;
  if (!selectedSize) {
    document.querySelector("#size-error").textContent = "Please choose a size before adding this piece.";
    document.querySelector("#size-options").querySelector("button")?.focus();
    return;
  }
  const quantityInput = document.querySelector("#product-quantity");
  const quantity = Math.max(1, Math.min(10, Number.parseInt(quantityInput.value, 10) || 1));
  quantityInput.value = String(quantity);
  const existingItem = cart.find((item) => item.productId === activeProduct.id && item.size === selectedSize);
  if (existingItem) existingItem.quantity = Math.min(10, existingItem.quantity + quantity);
  else cart.push({ productId: activeProduct.id, size: selectedSize, quantity });
  saveCart();
  renderCart();
  closePanels();
  showToast(`${activeProduct.name} added to your bag.`);
}

function changeQuantity(productId, size, amount) {
  const item = cart.find((entry) => entry.productId === productId && entry.size === size);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cart = cart.filter((entry) => entry !== item);
  else item.quantity = Math.min(item.quantity, 10);
  saveCart();
  renderCart();
}

function removeFromCart(productId, size) {
  cart = cart.filter((item) => !(item.productId === productId && item.size === size));
  saveCart();
  renderCart();
}

function openCart() {
  lastFocusedElement = document.activeElement;
  modal.hidden = true;
  cartDrawer.hidden = false;
  renderCart();
  updateOverlay();
  document.querySelector(".cart-close").focus();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function orderViaWhatsApp() {
  const phoneNumber = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (!phoneNumber) {
    whatsappWarning.textContent = "Set your business phone number in script.js (WHATSAPP_NUMBER) to enable WhatsApp enquiries.";
    return;
  }
  const items = getCartItems();
  if (!items.length) {
    whatsappWarning.textContent = "Add a product to your bag before starting an enquiry.";
    return;
  }
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const lines = items.map(({ product, size, quantity }) =>
    `• ${product.name} — Size ${size} × ${quantity}: ${formatPrice(product.price * quantity)}`
  );
  const message = [
    "Hello Stylo Stroe, I'd like to enquire about these pieces:",
    "",
    ...lines,
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    "",
    "Could you please confirm availability and shipping details? This is an enquiry, not a confirmed order."
  ].join("\n");
  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  whatsappWarning.textContent = "WhatsApp opened for your enquiry. Your order is not confirmed until the brand replies.";
}

function trapPanelFocus(event) {
  if (event.key !== "Tab") return;
  const panel = modal.hidden ? cartDrawer : modal;
  if (panel.hidden) return;
  const focusable = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])')];
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});
document.querySelectorAll("[data-category-link]").forEach((link) => {
  link.addEventListener("click", () => setFilter(link.dataset.categoryLink));
});
document.querySelector("#modal-add").addEventListener("click", addToCart);
document.querySelector("#bag-open").addEventListener("click", openCart);
document.querySelector(".modal-close").addEventListener("click", closePanels);
document.querySelector(".cart-close").addEventListener("click", closePanels);
overlay.addEventListener("click", closePanels);
document.querySelector("#whatsapp-order").addEventListener("click", orderViaWhatsApp);
document.querySelectorAll("[data-quantity-step]").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.querySelector("#product-quantity");
    const value = Number.parseInt(input.value, 10) || 1;
    input.value = String(Math.max(1, Math.min(10, value + Number(button.dataset.quantityStep))));
  });
});
document.querySelector("#product-quantity").addEventListener("change", (event) => {
  event.currentTarget.value = String(Math.max(1, Math.min(10, Number.parseInt(event.currentTarget.value, 10) || 1)));
});
document.querySelector("#menu-toggle").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const nav = document.querySelector("#primary-nav");
  const isOpen = nav.classList.toggle("is-open");
  button.setAttribute("aria-expanded", String(isOpen));
  button.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});
document.querySelectorAll("#primary-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector("#primary-nav").classList.remove("is-open");
    document.querySelector("#menu-toggle").setAttribute("aria-expanded", "false");
    document.querySelector("#menu-toggle").setAttribute("aria-label", "Open navigation menu");
  });
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!modal.hidden || !cartDrawer.hidden) closePanels();
    const nav = document.querySelector("#primary-nav");
    nav.classList.remove("is-open");
    document.querySelector("#menu-toggle").setAttribute("aria-expanded", "false");
    document.querySelector("#menu-toggle").setAttribute("aria-label", "Open navigation menu");
  }
  trapPanelFocus(event);
});
document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const emailInput = document.querySelector("#newsletter-email");
  const message = document.querySelector("#newsletter-message");
  if (!emailInput.validity.valid || !emailInput.value.trim()) {
    message.textContent = "Enter a valid email address to continue.";
    emailInput.focus();
    return;
  }
  message.textContent = "Thanks for your interest. Newsletter sign-up is not active until a mailing-list service is connected.";
});
document.querySelector("#year").textContent = String(new Date().getFullYear());

renderProducts();
renderCart();
