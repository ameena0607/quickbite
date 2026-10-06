const restaurants = [
  {name: "Malabar Bites", cuisine: "Kerala", rating: 4.8},
  {name: "Green Bowl", cuisine: "Healthy", rating: 4.7},
  {name: "Spice Route", cuisine: "Indian", rating: 4.6},
  {name: "Burger Hub", cuisine: "Burgers", rating: 4.4},
  {name: "Wok Express", cuisine: "Chinese", rating: 4.2}
];

restaurants.sort((a, b) => b.rating - a.rating);

document.getElementById("restaurants").innerHTML = restaurants.map(r => `
  <div class="restaurant-card">
    <h2>${r.name}</h2>
    <p>${r.cuisine}</p>
    <strong>⭐ ${r.rating}/5</strong>
  </div>
`).join("");