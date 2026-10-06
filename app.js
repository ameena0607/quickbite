const food = [
  { id: 1, name: "Paneer tikka wrap", venue: "The Green Table", price: 145, rating: 4.8, minutes: 18, category: "quick", veg: true, image: "photo-1525351484163-7529414344d8", tag: "Campus favorite" },
  { id: 2, name: "Cold brew tonic", venue: "Bean There Cafe", price: 110, rating: 4.7, minutes: 12, category: "beverage", veg: true, image: "photo-1461023058943-07fcbe16d735", tag: "New" },
  { id: 3, name: "Crispy chicken slider", venue: "Corner Crumb", price: 185, rating: 4.6, minutes: 20, category: "quick", veg: false, image: "photo-1568901346375-23c9450c58cd", tag: "Bestseller" },
  { id: 4, name: "Chilli garlic noodles", venue: "Chilli & Lime", price: 210, rating: 4.9, minutes: 24, category: "meals", veg: false, image: "photo-1569718212165-3a8278d5f624", tag: "Top rated" },
  { id: 5, name: "Mango yoghurt bowl", venue: "The Green Table", price: 160, rating: 4.8, minutes: 16, category: "dessert", veg: true, image: "photo-1511690743698-d9d85f2fbf38", tag: "Fresh today" },
  { id: 6, name: "Masala chai", venue: "Bean There Cafe", price: 55, rating: 4.5, minutes: 10, category: "beverage", veg: true, image: "photo-1571934811356-5cc061b6821f", tag: "Quick sip" },
  { id: 7, name: "Egg & cheese bun", venue: "Corner Crumb", price: 95, rating: 4.6, minutes: 14, category: "quick", veg: true, egg: true, image: "photo-1525351484163-7529414344d8", tag: "Egg special" },
  { id: 8, name: "Garden grain bowl", venue: "The Green Table", price: 195, rating: 4.7, minutes: 19, category: "meals", veg: true, image: "photo-1512621776951-a57141f2eefd", tag: "Plant powered" },
  { id: 9, name: "Cocoa brownie", venue: "Corner Crumb", price: 85, rating: 4.4, minutes: 11, category: "dessert", veg: true, image: "photo-1606313564200-e75d5e30476c", tag: "Baked today" }
];

const restaurants = [
  { name: "The Green Table", rating: 4.8, price: 195, time: 18, distance: "0.6 km" },
  { name: "Chilli & Lime", rating: 4.6, price: 210, time: 24, distance: "1.2 km" },
  { name: "Bean There Cafe", rating: 4.7, price: 110, time: 12, distance: "0.4 km" },
  { name: "Corner Crumb", rating: 4.5, price: 145, time: 16, distance: "0.8 km" }
];

const state = {
  cart: JSON.parse(localStorage.getItem("quickbite-cart") || "{}"),
  mode: "delivery",
  category: "all",
  vegOnly: false,
  search: "",
  purchaseCount: Number(localStorage.getItem("quickbite-purchases") || 0),
  student: localStorage.getItem("quickbite-student") === "true"
};

const byId = (id) => document.getElementById(id);
const dialog = byId("app-dialog");
let toastTimeout;

function money(value) { return `₹${Math.round(value)}`; }

function renderFood() {
  const grid = byId("food-grid");
  const query = state.search.toLowerCase().trim();
  const shown = food.filter((item) => {
    const categoryMatch = state.category === "all" || item.category === state.category;
    const vegMatch = !state.vegOnly || item.veg;
    const searchMatch = !query || `${item.name} ${item.venue} ${item.category}`.toLowerCase().includes(query);
    return categoryMatch && vegMatch && searchMatch;
  });
  grid.innerHTML = shown.map((item, index) => `
    <article class="food-card" style="animation-delay:${index * 35}ms">
      <div class="food-image" style="background-image:url('https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=600&q=80')">
        <span class="food-tag">${item.tag}</span><span class="food-type ${item.veg ? "" : "nonveg"}" title="${item.egg ? "Contains egg" : item.veg ? "Vegetarian" : "Non-vegetarian"}"></span>
      </div>
      <div class="food-info"><div class="food-name-line"><h3>${item.name}</h3><strong>${money(item.price)}</strong></div>
        <div class="food-meta"><span>${item.venue}</span><span class="rating">★ ${item.rating}</span></div>
        <div class="food-card-bottom"><small>${item.minutes} min · ${state.mode === "pickup" ? "pickup" : "near campus"}</small><button class="add-button" data-add="${item.id}" aria-label="Add ${item.name} to order">+</button></div>
      </div>
    </article>`).join("");
  byId("empty-state").hidden = shown.length > 0;
  byId("results-label").textContent = `${shown.length} tasty ${shown.length === 1 ? "pick" : "picks"} near campus`;
}

function renderCart() {
  const selected = food.filter((item) => state.cart[item.id]);
  const count = selected.reduce((sum, item) => sum + state.cart[item.id], 0);
  const subtotal = selected.reduce((sum, item) => sum + item.price * state.cart[item.id], 0);
  const discountRate = (state.purchaseCount >= 5 ? 0.15 : state.purchaseCount >= 2 ? 0.1 : 0) + (state.student ? 0.05 : 0);
  const discount = Math.round(subtotal * discountRate);
  const fee = state.mode === "delivery" ? 25 : 0;
  byId("cart-count").textContent = count;
  byId("cart-items").innerHTML = selected.length ? selected.map((item) => `
    <div class="cart-item"><span class="cart-item-name">${item.name}</span><span class="cart-item-price">${money(item.price * state.cart[item.id])}</span>
      <span class="quantity-control"><button data-qty="${item.id}" data-change="-1" aria-label="Remove one ${item.name}">−</button>${state.cart[item.id]}<button data-qty="${item.id}" data-change="1" aria-label="Add one ${item.name}">+</button></span>
    </div>`).join("") : `<div class="cart-empty"><span class="empty-plate" aria-hidden="true">◯</span><strong>Nothing in the bag. Yet.</strong><p>Pick a quick bite and we’ll take it from here.</p></div>`;
  byId("cart-footer").hidden = selected.length === 0;
  byId("subtotal").textContent = money(subtotal);
  byId("fee").textContent = money(fee);
  byId("fee-label").textContent = state.mode === "delivery" ? "Delivery fee" : "Service fee";
  byId("discount-row").hidden = discount === 0;
  byId("discount").textContent = `−${money(discount)}`;
  byId("offer-applied").hidden = discount === 0;
  byId("offer-applied").querySelector("span").textContent = [
    state.purchaseCount >= 5 ? "15% purchase reward" : state.purchaseCount >= 2 ? "10% purchase reward" : "",
    state.student ? "5% student offer" : ""
  ].filter(Boolean).join(" + ") + " applied";
  byId("total").textContent = money(subtotal + fee - discount);
  localStorage.setItem("quickbite-cart", JSON.stringify(state.cart));
}

function renderOffers() {
  const next = state.purchaseCount >= 5 ? "15% off your order, unlocked for you." : state.purchaseCount >= 2 ? "10% off your order, unlocked for you." : `${2 - state.purchaseCount} more ${state.purchaseCount === 1 ? "order" : "orders"} to unlock 10% off.`;
  byId("offer-copy").textContent = next;
}

function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll(".mode-button").forEach((button) => button.classList.toggle("active", button.dataset.mode === mode));
  byId("mode-label").textContent = mode === "delivery" ? "Delivery to Campus, Main Gate" : mode === "pickup" ? "Pickup · choose a food spot" : "Dining in · reserve a table";
  renderFood();
  renderCart();
}

function showToast(message) {
  const toast = byId("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2600);
}

function openDialog(title, copy, content = "") {
  byId("dialog-content").innerHTML = `<span class="eyebrow">QUICKBITE</span><h2 class="dialog-title">${title}</h2><div class="dialog-copy">${copy}</div>${content}`;
  dialog.showModal();
}

function compareRestaurants() {
  const sorted = [...restaurants].sort((a, b) => b.rating - a.rating);
  const rows = `<div class="comparison-row"><span>Food spot</span><span>Rating</span><span>From</span></div>${sorted.map((place) => `<div class="comparison-row"><span><strong>${place.name}</strong><br>${place.distance} · ${place.time} min</span><span>★ ${place.rating}</span><span>${money(place.price)}</span></div>`).join("")}`;
  openDialog("Find your kind of good", "Restaurants ranked by rating, with starting prices and estimated distance side by side.", `<div class="comparison-table">${rows}</div><button class="dialog-primary" id="sort-price">Sort by lowest price</button>`);
  byId("sort-price").addEventListener("click", () => {
    const lowFirst = [...restaurants].sort((a, b) => a.price - b.price);
    document.querySelector(".comparison-table").innerHTML = `<div class="comparison-row"><span>Food spot</span><span>Rating</span><span>From</span></div>${lowFirst.map((place) => `<div class="comparison-row"><span><strong>${place.name}</strong><br>${place.distance} · ${place.time} min</span><span>★ ${place.rating}</span><span>${money(place.price)}</span></div>`).join("")}`;
  });
}

function startGroupOrder() {
  const code = `QB-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  openDialog("Bring everyone to the table", "Invite friends to add their own picks. Group orders can include food from multiple spots.", `<div class="dialog-form"><label>Group link<input id="group-code" readonly value="quickbite.local/group/${code}"></label><label>Split orders by<input value="Person chooses and pays" readonly></label><button class="dialog-primary" id="copy-group">Copy invite link</button></div>`);
  byId("copy-group").addEventListener("click", async () => {
    const input = byId("group-code");
    input.select();
    try { await navigator.clipboard.writeText(input.value); showToast("Group invite copied"); }
    catch { showToast(`Invite code: ${code}`); }
  });
}

function openChat() {
  byId("chat-panel").hidden = false;
  byId("chat-launcher").hidden = true;
  byId("chat-input").focus();
}

function addChatMessage(text, user = false) {
  const message = document.createElement("div");
  message.className = `chat-message ${user ? "user-message" : "bot-message"}`;
  message.textContent = text;
  byId("chat-messages").append(message);
  byId("chat-messages").scrollTop = byId("chat-messages").scrollHeight;
}

function respondToChat(text) {
  const value = text.toLowerCase();
  if (value.includes("complaint") || value.includes("issue") || value.includes("wrong") || value.includes("refund")) {
    addChatMessage("I’m sorry something went wrong. Tell me the order number and what happened. Refund requests are reviewed here and processed within 2 working days.");
  } else if (value.includes("recommend") || value.includes("pick") || value.includes("suggest") || value.includes("hungry")) {
    const pick = [...food].sort((a, b) => b.rating - a.rating)[0];
    addChatMessage(`Based on ratings, try ${pick.name} from ${pick.venue}. It’s ${money(pick.price)} and rated ${pick.rating} stars. Want something cheaper? Bean There Cafe has a ${money(55)} masala chai.`);
  } else if (value.includes("track") || value.includes("where")) {
    addChatMessage("Your shortest available delivery route is being estimated. Open ‘Find the quickest route’ for the current route and arrival estimate.");
  } else if (value.includes("menu") || value.includes("update")) {
    addChatMessage("Menus refresh regularly. The green ‘Menu updated’ indicator shows the most recent sync time.");
  } else {
    addChatMessage("Got it. I can recommend a meal, help with a complaint or refund, or explain the order options. What should we tackle?");
  }
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const qtyButton = event.target.closest("[data-qty]");
  const categoryButton = event.target.closest("[data-category]");
  const dineButton = event.target.closest("[data-dine]");
  if (addButton) {
    const id = Number(addButton.dataset.add);
    state.cart[id] = (state.cart[id] || 0) + 1;
    renderCart();
    showToast(`${food.find((item) => item.id === id).name} added`);
  }
  if (qtyButton) {
    const id = qtyButton.dataset.qty;
    state.cart[id] = (state.cart[id] || 0) + Number(qtyButton.dataset.change);
    if (state.cart[id] <= 0) delete state.cart[id];
    renderCart();
  }
  if (categoryButton) {
    state.category = categoryButton.dataset.category;
    document.querySelectorAll(".category-chip").forEach((button) => button.classList.toggle("active", button === categoryButton));
    renderFood();
  }
  if (dineButton) openDialog(`A table at ${dineButton.dataset.dine}`, "Choose a time and party size. Your table request will be held while the restaurant confirms.", `<form class="dialog-form" id="booking-form"><label>Party size<select><option>2 people</option><option>1 person</option><option>3 people</option><option>4 people</option></select></label><label>Arrival time<select><option>Today, 7:00 pm</option><option>Today, 7:30 pm</option><option>Today, 8:00 pm</option></select></label><button class="dialog-primary">Request a table</button></form>`);
});

document.querySelectorAll(".mode-button").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
byId("search-input").addEventListener("input", (event) => { state.search = event.target.value; renderFood(); });
byId("veg-toggle").addEventListener("change", (event) => { state.vegOnly = event.target.checked; renderFood(); });
byId("compare-button").addEventListener("click", compareRestaurants);
byId("group-nav").addEventListener("click", startGroupOrder);
byId("group-cart-button").addEventListener("click", startGroupOrder);
byId("offers-button").addEventListener("click", () => openDialog("Your offers, earned one order at a time", `You’ve completed ${state.purchaseCount} ${state.purchaseCount === 1 ? "purchase" : "purchases"}. Keep ordering to unlock a bigger thank-you.`, `<ul class="dialog-list"><li>2+ purchases: 10% off your next order</li><li>5+ purchases: 15% off your next order</li><li>Student deal: extra 5% off while your campus status is active</li></ul><p class="dialog-copy">${state.student ? "Your student offer is active and can be combined with eligible purchase rewards." : "Verify your student status to unlock campus pricing."}</p>`));
byId("student-button").addEventListener("click", () => openDialog("A little campus advantage", "Verify your student email to activate student pricing on participating cafes.", `<form class="dialog-form" id="student-form"><label>Student email<input required type="email" placeholder="you@college.edu"></label><button class="dialog-primary">Verify student status</button></form>`));
byId("membership-button").addEventListener("click", () => openDialog("Quickbite Plus", "Membership options for regulars. Save on delivery and get member-only offers at local food spots.", `<ul class="dialog-list"><li>Monthly: ₹99 · reduced delivery fees</li><li>Annual: ₹899 · member offers all year</li><li>Cancel any time from your profile</li></ul><button class="dialog-primary" id="join-membership">Explore membership</button>`));
byId("stream-button").addEventListener("click", () => openDialog("Snack & stream", "Entertainment partner perks can be linked to an eligible subscription. Partner account connection is a demo in this prototype.", `<ul class="dialog-list"><li>Order a movie-night combo and browse partner perks</li><li>Linking an OTT account would require partner authorization</li><li>Offers vary by plan and region</li></ul><button class="dialog-primary" id="stream-perk">Show sample perk</button>`));
byId("route-button").addEventListener("click", () => openDialog("Quickest route to your door", "We compare nearby kitchens and current delivery estimates to find a fast route.", `<ul class="dialog-list"><li><strong>Bean There Cafe</strong> · 0.4 km · estimated 12 min</li><li><strong>The Green Table</strong> · 0.6 km · estimated 18 min</li><li>Route estimates are illustrative; live maps and courier location need a connected service.</li></ul>`));
byId("address-button").addEventListener("click", () => openDialog("Where should we deliver?", "Choose a saved campus location or enter a new address.", `<form class="dialog-form" id="address-form"><label>Delivery address<input required value="Campus, Main Gate"></label><button class="dialog-primary">Save address</button></form>`));
byId("dining-button").addEventListener("click", () => { document.querySelector("#dining").scrollIntoView({ behavior: "smooth" }); });
byId("edit-mode").addEventListener("click", () => document.querySelector(".quick-controls").scrollIntoView({ behavior: "smooth" }));
byId("notification-button").addEventListener("click", () => {
  const hour = new Date().getHours();
  const suggestion = hour < 11 ? "Morning pick: masala chai and an egg & cheese bun." : hour < 16 ? "Lunch-hour pick: a top-rated grain bowl, ready in about 19 minutes." : "Evening pick: a quick snack and a cocoa brownie to finish.";
  openDialog("A timely little nudge", `${suggestion} Notification timing adapts to your local time.`, `<ul class="dialog-list"><li>Student offers and new menu items are included when relevant.</li><li>Manage notification preferences in your account settings.</li></ul>`);
});
byId("accessibility-button").addEventListener("click", () => openDialog("Make Quickbite comfortable", "Adjust the display to suit you. Controls are keyboard accessible and the menu supports vegetarian, non-vegetarian, and egg options.", `<div class="accessibility-options"><button id="large-text">Larger text</button><button id="high-contrast">Higher contrast</button></div>`));
byId("account-button").addEventListener("click", () => openDialog("Welcome to Quickbite", "Sign in or create an account to save your favorite food spots, offers, and addresses.", `<form class="dialog-form" id="account-form"><label>Email address<input name="email" type="email" required placeholder="you@example.com"></label><label>Password<input type="password" required minlength="4" placeholder="At least 4 characters"></label><button class="dialog-primary">Continue</button></form>`));
byId("tip-button").addEventListener("click", () => openDialog("Pass a little kindness along", "Tips go to your delivery partner and are optional.", `<form class="dialog-form" id="tip-form"><label>Choose a tip<select><option>₹10</option><option>₹20</option><option>₹30</option><option>Custom amount</option></select></label><button class="dialog-primary">Add tip at checkout</button></form>`));
document.querySelectorAll("[data-info]").forEach((button) => button.addEventListener("click", () => {
  if (button.dataset.info === "refund") openDialog("Refunds, without the runaround", "For eligible orders, refunds are processed within 2 working days after review. Start a complaint in the Quickbite buddy chat with your order number.", `<ul class="dialog-list"><li>Share the order number and a short description</li><li>Support reviews the issue and confirms the refund status</li><li>Refund timing depends on your payment provider</li></ul>`);
  else openDialog("Earn while you learn", "Explore flexible opportunities with local food partners and delivery teams.", `<ul class="dialog-list"><li>Food spot crew · part-time shifts</li><li>Delivery partner · flexible hours</li><li>Student ambassador · campus offers</li></ul><button class="dialog-primary" id="job-interest">Register interest</button>`);
}));

byId("checkout-button").addEventListener("click", () => openDialog("One last look", "Choose how you’d like to complete this demo order.", `<div class="dialog-form"><label>Payment method<select><option>UPI (demo)</option><option>Pay on pickup (demo)</option></select></label><button class="dialog-primary" id="place-order">Place demo order</button><p class="dialog-copy">Payments are not collected in this prototype.</p></div>`));
byId("dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener("submit", (event) => {
  event.preventDefault();
  if (event.target.id === "account-form") {
    const email = new FormData(event.target).get("email");
    byId("account-label").textContent = String(email).split("@")[0];
    byId("account-button").querySelector(".avatar").textContent = String(email).charAt(0).toUpperCase();
    showToast("Signed in for this demo");
  } else if (event.target.id === "student-form") {
    state.student = true;
    localStorage.setItem("quickbite-student", "true");
    showToast("Student offer activated");
  } else if (event.target.id === "booking-form") showToast("Table request sent to the restaurant");
  else if (event.target.id === "address-form") showToast("Delivery address updated");
  else if (event.target.id === "tip-form") showToast("Tip added for checkout");
  dialog.close();
});

dialog.addEventListener("click", (event) => {
  if (event.target.id === "place-order") {
    state.purchaseCount += 1;
    localStorage.setItem("quickbite-purchases", String(state.purchaseCount));
    state.cart = {};
    renderCart();
    renderOffers();
    dialog.close();
    showToast("Demo order placed. Thanks for supporting local food spots!");
  }
  if (event.target.id === "large-text") document.body.classList.toggle("large-text");
  if (event.target.id === "high-contrast") document.body.classList.toggle("high-contrast");
  if (event.target.id === "join-membership") showToast("Membership options are ready to connect");
  if (event.target.id === "stream-perk") showToast("Sample perk: 10% off a movie-night combo");
  if (event.target.id === "job-interest") showToast("Thanks! Job applications need a connected partner service");
});

byId("chat-launcher").addEventListener("click", openChat);
byId("chat-close").addEventListener("click", () => { byId("chat-panel").hidden = true; byId("chat-launcher").hidden = false; });
document.querySelectorAll("[data-chat]").forEach((button) => button.addEventListener("click", () => {
  const text = button.dataset.chat === "complaint" ? "I have an order issue" : "Can you recommend something?";
  addChatMessage(text, true);
  respondToChat(text);
}));
byId("chat-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = byId("chat-input");
  const text = input.value.trim();
  if (!text) return;
  addChatMessage(text, true);
  input.value = "";
  setTimeout(() => respondToChat(text), 250);
});
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    byId("search-input").focus();
  }
});

renderFood();
renderCart();
renderOffers();