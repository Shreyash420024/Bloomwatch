// --- Map setup ---
var map = L.map('map').setView([35, -115], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Data (unchanged)
var sites = [
  { name: "Chino Hills", type: "Wild", seasons: ["spring"], lat: 33.93, lng: -117.75 },
  { name: "Carrizo Plain National Monument", type: "Wild", seasons: ["spring"], lat: 35.15, lng: -119.85 },
  { name: "Antelope Valley California Poppy Reserve", type: "Wild", seasons: ["spring"], lat: 34.72, lng: -118.40 },
  { name: "Laura and Jack Dangermond Reserve", type: "Wild", seasons: ["spring"], lat: 34.50, lng: -120.45 },
  { name: "Sedgwick Reserve", type: "Wild", seasons: ["spring"], lat: 34.70, lng: -120.03 },
  { name: "Anza-Borrego Desert State Park", type: "Wild", seasons: ["spring"], lat: 33.05, lng: -116.20 },
  { name: "Montaña de Oro State Park", type: "Wild", seasons: ["spring"], lat: 35.22, lng: -120.80 },
  { name: "Figueroa Mountain", type: "Wild", seasons: ["spring"], lat: 34.70, lng: -119.75 },
  { name: "Red Hills Recreational Area", type: "Wild", seasons: ["spring"], lat: 37.85, lng: -120.50 },
  { name: "Jepson Prairie Preserve", type: "Wild", seasons: ["spring"], lat: 38.27, lng: -121.82 },
  { name: "Bear Valley Wildflower", type: "Wild", seasons: ["spring"], lat: 39.12, lng: -122.43 },
  { name: "North Table Mountain Reserve", type: "Wild", seasons: ["spring"], lat: 39.60, lng: -121.55 },
  { name: "Channel Islands National Park", type: "Wild", seasons: ["spring"], lat: 34.00, lng: -119.80 },
  { name: "Black Canyon City", type: "Wild", seasons: ["spring"], lat: 34.15, lng: -112.15 },
  { name: "Suguaro Lake", type: "Wild", seasons: ["spring"], lat: 33.60, lng: -111.55 },
  { name: "San Carlos Reservation", type: "Wild", seasons: ["spring"], lat: 33.35, lng: -110.45 },
  { name: "Golden Valley", type: "Wild", seasons: ["spring"], lat: 35.00, lng: -114.25 },
  { name: "Estrella Mountain Regional Park", type: "Wild", seasons: ["spring"], lat: 33.33, lng: -112.37 },
  { name: "Picacho Peak State Park", type: "Wild", seasons: ["spring"], lat: 32.63, lng: -111.42 },
  { name: "South Mountain Park", type: "Wild", seasons: ["spring"], lat: 33.34, lng: -112.08 },
  { name: "Gold Butte National Monument", type: "Wild", seasons: ["spring"], lat: 36.25, lng: -114.20 },
  { name: "Carlsbad Ranch", type: "Plantation", seasons: ["spring"], lat: 33.13, lng: -117.32 },
  { name: "Lompoc Flower Fields", type: "Plantation", seasons: ["spring","summer"], lat: 34.66, lng: -120.52 },
  { name: "Yolo sunflowers", type: "Plantation", seasons: ["summer"], lat: 38.55, lng: -121.85 }
];

// Build markers
var markers = [];
sites.forEach(function(site) {
  var marker = L.circleMarker([site.lat, site.lng], {
    radius: 12, weight: 2, color: 'white', fillOpacity: 0.8
  }).addTo(map);
  marker.bindPopup(
    '<strong>' + site.name + '</strong><br>' +
    'Type: ' + site.type + '<br>' +
    'Blooms: ' + site.seasons.join(', ')
  );
  markers.push({ marker, site });
});

// UI elements
var countEl = document.getElementById('bloom-count');
var statusLine = document.getElementById('status-line');
var seasonButtons = {
  spring: document.getElementById('btn-spring'),
  summer: document.getElementById('btn-summer'),
  fall:   document.getElementById('btn-fall'),
  winter: document.getElementById('btn-winter')
};

// Update function
function updateMap(season) {
  var bloomingCount = 0;

  markers.forEach(function(item) {
    var isBlooming = item.site.seasons.includes(season);
    if (isBlooming) {
      bloomingCount++;
      var color = item.site.type === "Wild" ? "#2ECC71" : "#9B59B6";
      item.marker.setStyle({ fillColor: color });
    } else {
      item.marker.setStyle({ fillColor: "#D0D0D0" });
    }
  });

  countEl.textContent = bloomingCount;
  // Friendly inline message instead of alerts
  var msg = bloomingCount > 0
    ? `Showing ${capitalize(season)} blooms.`
    : `No blooms in ${capitalize(season)} for this dataset.`;
  statusLine.textContent = msg;
}

// Helpers
function setActiveButton(activeBtn) {
  Object.values(seasonButtons).forEach(function(btn) {
    btn.classList.remove('selected');
    btn.setAttribute('aria-selected', 'false');
  });
  activeBtn.classList.add('selected');
  activeBtn.setAttribute('aria-selected', 'true');
}
function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

// Click handlers
seasonButtons.spring.addEventListener('click', function(){ setActiveButton(this); updateMap('spring'); });
seasonButtons.summer.addEventListener('click', function(){ setActiveButton(this); updateMap('summer'); });
seasonButtons.fall  .addEventListener('click', function(){ setActiveButton(this); updateMap('fall');   });
seasonButtons.winter.addEventListener('click', function(){ setActiveButton(this); updateMap('winter'); });

// Keyboard shortcuts: 1-4
document.addEventListener('keydown', function(e){
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
  if (e.key === '1') seasonButtons.spring.click();
  if (e.key === '2') seasonButtons.summer.click();
  if (e.key === '3') seasonButtons.fall.click();
  if (e.key === '4') seasonButtons.winter.click();
});

// Init
setActiveButton(seasonButtons.spring);
updateMap('spring');
