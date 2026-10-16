const resultsDiv = document.getElementById("results");

function showResults(items) {
  resultsDiv.innerHTML = "";

  if (items.length === 0) {
    resultsDiv.innerHTML = "<p class='no-results'>No recommendations found. Try 'beach', 'temple' or 'country'.</p>";
    return;
  }

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}">
      <div class="result-info">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <button>Visit</button>
      </div>
    `;
    resultsDiv.appendChild(card);
  });
}

function searchCondition() {
  const input = document.getElementById("searchInput").value.toLowerCase().trim();

  fetch("travel_recommendation_api.json")
    .then(response => response.json())
    .then(data => {
      let results = [];

      // Accepts "beach", "beaches", "Beach", "BEACH", etc.
      if (input.includes("beach")) {
        results = data.beaches;
      } else if (input.includes("temple")) {
        results = data.temples;
      } else if (input.includes("countr")) {
        results = data.countries.flatMap(country => country.cities);
      } else {
        // Search by a country name, e.g. "japan"
        const country = data.countries.find(c => c.name.toLowerCase() === input);
        if (country) results = country.cities;
      }

      showResults(results);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
      resultsDiv.innerHTML = "<p class='no-results'>Could not load recommendations.</p>";
    });
}

function clearSearch() {
  document.getElementById("searchInput").value = "";
  resultsDiv.innerHTML = "";
}

// Press Enter to search
document.getElementById("searchInput").addEventListener("keydown", event => {
  if (event.key === "Enter") searchCondition();
});
