function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  const q = message.toLowerCase();
  let reply;

  if (q.includes("burger")) {
    reply = "🍔 I recommend Burger Hub — 4.4★.";
  } else if (q.includes("kerala") || q.includes("malabar")) {
    reply = "🥘 Try Malabar Bites — 4.8★.";
  } else if (q.includes("chinese") || q.includes("noodle")) {
    reply = "🥡 Try Wok Express — 4.2★.";
  } else if (q.includes("healthy") || q.includes("salad")) {
    reply = "🥗 Try Green Bowl — 4.7★.";
  } else if (q.includes("best") || q.includes("rating")) {
    reply = "⭐ Malabar Bites is currently the highest-rated restaurant at 4.8★.";
  } else {
    reply = "I can recommend burgers, Kerala food, Chinese food, healthy food, or the best-rated restaurant.";
  }

  setTimeout(() => addMessage(reply, "bot"), 300);
}

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = type;
  div.innerHTML = text;
  document.getElementById("messages").appendChild(div);
}