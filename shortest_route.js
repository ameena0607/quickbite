// Graph: distance between locations in km
const graph = {
  Home: { A: 4, B: 2 },
  A: { Home: 4, C: 5, D: 10 },
  B: { Home: 2, D: 3 },
  C: { A: 5, Restaurant: 3 },
  D: { A: 10, B: 3, Restaurant: 4 },
  Restaurant: { C: 3, D: 4 }
};

function dijkstra(graph, start, end) {
  const distances = {};
  const previous = {};
  const visited = new Set();

  Object.keys(graph).forEach(node => distances[node] = Infinity);
  distances[start] = 0;

  while (visited.size < Object.keys(graph).length) {
    let current = null;

    for (const node in distances) {
      if (!visited.has(node) &&
          (current === null || distances[node] < distances[current])) {
        current = node;
      }
    }

    if (current === null || distances[current] === Infinity) break;
    visited.add(current);

    for (const neighbor in graph[current]) {
      const newDistance = distances[current] + graph[current][neighbor];

      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = current;
      }
    }
  }

  const path = [];
  let current = end;

  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  return {path, distance: distances[end]};
}

function findRoute() {
  const result = dijkstra(graph, "Home", "Restaurant");

  document.getElementById("routeResult").innerHTML = `
    <div class="result">
      <h3>Shortest Route Found</h3>
      <p><b>Route:</b> ${result.path.join(" → ")}</p>
      <p><b>Distance:</b> ${result.distance} km</p>
    </div>
  `;
}