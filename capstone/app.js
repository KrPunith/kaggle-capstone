/* ==========================================================================
   LifeBridge AI - Emergency Response & Disaster Assistant Engine (Indian Edition)
   Core Logic: Mumbai geographic mappings, NDRF Relief protocols, IMD forecasts.
   ========================================================================== */

// Mumbai Geolocation Coordinates for map vectors
const SECTOR_COORDS = {
  "Colaba / Fort": [18.9220, 72.8340],       // South Mumbai Heritage/Commercial
  "Marine Drive / Worli": [18.9620, 72.8120], // Coastal Highway / Port Waterfront
  "Malabar Hill": [18.9560, 72.7980],         // High ground hills (Uplands)
  "Dharavi / Kurla": [19.0300, 72.8600],      // Dense residential / Central Lowlands
  "Bandra / Andheri": [19.0520, 72.8360]       // Suburban centers
};

// Initial Data States
let appState = {
  activeScenario: "none", // none, flood, earthquake, cyclone
  offlineMode: false,
  incidents: [],
  shelters: [
    { id: "S1", name: "NDRF Relief Camp A (Shivaji Ground Gym)", sector: "Colaba / Fort", capacity: 300, occupancy: 42, status: "Open", itemsNeeded: "Dry Rations, Tarpaulins" },
    { id: "S2", name: "BMC Relief Shelter B (Worli Koliwada Center)", sector: "Marine Drive / Worli", capacity: 250, occupancy: 215, status: "Open", itemsNeeded: "Bottled Water, Life Jackets, ORS Packets" },
    { id: "S3", name: "BMC Camp C (Malabar Hill Gymkhana)", sector: "Malabar Hill", capacity: 400, occupancy: 15, status: "Standby", itemsNeeded: "None" },
    { id: "S4", name: "Dharavi Municipal School Relief Point", sector: "Dharavi / Kurla", capacity: 200, occupancy: 0, status: "Standby", itemsNeeded: "None" }
  ],
  hospitals: [
    { id: "H1", name: "KEM Municipal Hospital & Trauma Centre", sector: "Colaba / Fort", capacity: 250, activeBeds: 210, waitTime: "20 min", status: "Operational" },
    { id: "H2", name: "Bhabha General Hospital ER", sector: "Marine Drive / Worli", capacity: 100, activeBeds: 92, waitTime: "45 min", status: "Overloaded" },
    { id: "H3", name: "H.N. Reliance Foundation Hospital", sector: "Malabar Hill", capacity: 180, activeBeds: 60, waitTime: "5 min", status: "Operational" }
  ],
  safePersons: [
    { name: "Rajesh Kumar", phone: "+91 98200 45678", location: "Colaba / Fort (South Mumbai)", status: "Safe at relief camp A, uninjured." },
    { name: "Priya Patel", phone: "+91 98920 12345", location: "Malabar Hill (Uplands)", status: "Staying at home, power backup functional." },
    { name: "Amit Deshmukh", phone: "+91 99300 89765", location: "Bandra / Andheri Suburbs", status: "Relocated to relative's house on 3rd floor." }
  ],
  missingPersons: [
    { name: "Sanjay Mishra", age: 58, lastSeen: "Kurla West market area near station, Monday 6PM", details: "Wearing white kurta, black sandals. Carry walking stick.", reporter: "Alok Mishra (Son) - 98112 34567" },
    { name: "Sunita Rao", age: 34, lastSeen: "Marine Drive promenade, Tuesday 4PM", details: "Wearing dark blue salwar kameez, red umbrella.", reporter: "Karan Rao (Husband) - 98223 90812" }
  ],
  volunteerOffers: [
    { name: "Gurudwara Langar Seva Committee", contact: "Harpreet Singh 99870 12098", type: "Supplies (Water, Food, Blankets)", details: "Ready to deliver 1,000 hot meals (Dal Khichdi) and bottled water packs daily to relief shelters." },
    { name: "Mumbai Offroaders Club (4x4)", contact: "Vikram 98201 98201", type: "Logistics (Heavy Vehicles, Boats, Transport)", details: "8 high-ground clearing 4x4 SUVs on call to assist towing stalled ambulances or transport personnel." },
    { name: "Robin Hood Army (Mumbai)", contact: "Sunita 97690 12345", type: "Rescue/Manpower (Search and Rescue)", details: "35 student volunteers available for relief camp coordination, packing kit packets, or elderly assistance." }
  ],
  checklists: {
    flood: [
      { id: "f1", text: "Store 15-20 liters of boiled/chlorinated drinking water per person", checked: false },
      { id: "f2", text: "Keep dry foods ready (roasted chana, biscuits, puffed rice)", checked: false },
      { id: "f3", text: "Pack emergency medications and ORS packets in waterproof bags", checked: false },
      { id: "f4", text: "Keep a battery-powered radio and torch with extra dry cells ready", checked: false },
      { id: "f5", text: "Track high-ground evacuation zones near your ward", checked: false },
      { id: "f6", text: "Disconnect main electrical power switches to avoid electric shock (earthing hazards)", checked: false }
    ],
    earthquake: [
      { id: "e1", text: "Find a sturdy table or bed frame to take shelter underneath", checked: false },
      { id: "e2", text: "Secure tall wardrobes, gas cylinders, and water tanks to structural walls", checked: false },
      { id: "e3", text: "Keep heavy slippers/shoes close to the bed to avoid glass cut injuries", checked: false },
      { id: "e4", text: "Assemble first aid bandages, antiseptic liquids, and adhesive tapes", checked: false },
      { id: "e5", text: "Locate main domestic gas valves and water taps for instant shutoff", checked: false },
      { id: "e6", text: "Designate a standard open family meeting location (e.g., local park)", checked: false }
    ],
    cyclone: [
      { id: "c1", text: "Clear balconies of loose plant pots, toys, and light furniture", checked: false },
      { id: "c2", text: "Check window panes and latch/board them securely", checked: false },
      { id: "c3", text: "Fully charge all mobile phones, torches, and backup power banks", checked: false },
      { id: "c4", text: "Prepare raincoats, umbrellas, and sturdy waterproof footwear", checked: false },
      { id: "c5", text: "Keep fuel tanks of bikes/cars full for sudden evacuation drives", checked: false },
      { id: "c6", text: "Keep cash in hand, as ATMs and digital UPI lines will be down if grid fails", checked: false }
    ],
    firstaid: [
      { id: "a1", text: "Sterile cotton pads, bandage rolls, and medical scissors", checked: false },
      { id: "a2", text: "Antiseptic liquids (Dettol/Savlon) and burn ointments", checked: false },
      { id: "a3", text: "ORS packets and rehydration tablets", checked: false },
      { id: "a4", text: "Paracetamol, anti-diarrhea tablets, and band-aids", checked: false },
      { id: "a5", text: "Disposable gloves and safety pins", checked: false },
      { id: "a6", text: "Thermometer and clean surgical scissors", checked: false }
    ]
  },
  activeChecklistType: "flood"
};

// Map Reference Containers
let mainMap, fullMap;
let mainMarkersGroup, fullMarkersGroup;
let mainRoadsGroup, fullRoadsGroup;

// Initialize when DOM loads
document.addEventListener("DOMContentLoaded", () => {
  initUIEvents();
  initMaps();
  renderState();
  startRealTimeSim();
});

// ==========================================================================
// 1. Navigation and UI Event Listeners
// ==========================================================================
function initUIEvents() {
  // Sidebar Tabs Navigation
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      navItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      
      const tabId = item.getAttribute("data-tab");
      switchTab(tabId);
    });
  });

  // Right Panel Sub-Tabs (AI Chat vs SOS Form)
  const panelTabs = document.querySelectorAll(".panel-tab-btn");
  panelTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      panelTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const sideTabId = tab.getAttribute("data-side-tab");
      document.querySelectorAll(".right-panel-content").forEach(content => {
        content.classList.remove("active");
      });
      document.getElementById(sideTabId).classList.add("active");
    });
  });

  // Low-Bandwidth Network Toggle
  document.getElementById("networkModeBtn").addEventListener("click", toggleLowBandwidth);

  // Header SOS Click -> shifts to SOS side form
  document.getElementById("sosHeaderBtn").addEventListener("click", () => {
    const sosTab = document.querySelector('[data-side-tab="sos-form"]');
    if (sosTab) sosTab.click();
  });

  // Simulator Buttons
  document.getElementById("btnSimFlood").addEventListener("click", () => triggerScenario("flood"));
  document.getElementById("btnSimEarthquake").addEventListener("click", () => triggerScenario("earthquake"));
  document.getElementById("btnSimCyclone").addEventListener("click", () => triggerScenario("cyclone"));
  document.getElementById("btnSimReset").addEventListener("click", () => triggerScenario("none"));

  // Forms Submissions
  document.getElementById("sosReportForm").addEventListener("submit", handleSOSSubmission);
  document.getElementById("registerSafeForm").addEventListener("submit", handleSafeRegister);
  document.getElementById("volunteerForm").addEventListener("submit", handleVolunteerSubmission);
  document.getElementById("missingPersonForm").addEventListener("submit", handleMissingSubmission);

  // Missing Person Modal toggles
  const missingModal = document.getElementById("missingModal");
  document.getElementById("reportMissingBtn").addEventListener("click", () => missingModal.classList.add("active"));
  document.getElementById("closeModalBtn").addEventListener("click", () => missingModal.classList.remove("active"));

  // Bulletin filters
  document.querySelectorAll(".bulletin-tab").forEach(tab => {
    tab.addEventListener("click", (e) => {
      document.querySelectorAll(".bulletin-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderBulletinBoard(tab.getAttribute("data-filter"), document.getElementById("bulletinSearch").value);
    });
  });

  document.getElementById("bulletinSearch").addEventListener("input", (e) => {
    const activeFilter = document.querySelector(".bulletin-tab.active").getAttribute("data-filter");
    renderBulletinBoard(activeFilter, e.target.value);
  });

  // Survival checklist toggler
  document.querySelectorAll(".choice-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".choice-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      appState.activeChecklistType = btn.getAttribute("data-type");
      renderSurvivalSection();
    });
  });

  // Add custom checklist item
  document.getElementById("addCustomItemBtn").addEventListener("click", addCustomChecklistItem);
  document.getElementById("customItemInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") addCustomChecklistItem();
  });

  // AI Chat send events
  document.getElementById("sendChatBtn").addEventListener("click", handleChatSend);
  document.getElementById("chatInputField").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleChatSend();
  });

  // AI Chat Suggestions Click Listener
  document.getElementById("chatSuggestions").addEventListener("click", (e) => {
    if (e.target.classList.contains("suggest-btn")) {
      const query = e.target.getAttribute("data-query");
      document.getElementById("chatInputField").value = query;
      handleChatSend();
    }
  });
}

// Global switcher to handle UI tab transitions and Leaflet map sizing issues
function switchTab(tabId) {
  document.querySelectorAll(".tab-panel").forEach(panel => {
    panel.classList.remove("active");
  });
  
  const targetPanel = document.getElementById(tabId);
  if (targetPanel) targetPanel.classList.add("active");

  // Fix Leaflet sizing bug when rendering on hidden grids
  setTimeout(() => {
    if (mainMap) mainMap.invalidateSize();
    if (fullMap) fullMap.invalidateSize();
  }, 100);
}

// ==========================================================================
// 2. Leaflet Mapping System
// ==========================================================================
function initMaps() {
  // Initialize Dashboard Mini Map (Centered in Mumbai Harbour)
  mainMap = L.map("map", {
    center: [18.9750, 72.8258],
    zoom: 11,
    zoomControl: false,
    attributionControl: false
  });

  // Initialize Full-Screen Navigation Map
  fullMap = L.map("full-map", {
    center: [18.9750, 72.8258],
    zoom: 12
  });

  // Base Map Layer (CartoDB Dark Matter fits our premium aesthetics)
  const cartoDbUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  
  L.tileLayer(cartoDbUrl, {
    maxZoom: 20
  }).addTo(mainMap);

  L.tileLayer(cartoDbUrl, {
    maxZoom: 20
  }).addTo(fullMap);

  // Initialize feature groups to easily wipe/replocate layers
  mainMarkersGroup = L.featureGroup().addTo(mainMap);
  fullMarkersGroup = L.featureGroup().addTo(fullMap);
  mainRoadsGroup = L.featureGroup().addTo(mainMap);
  fullRoadsGroup = L.featureGroup().addTo(fullMap);

  drawMapAssets();
}

function drawMapAssets() {
  // Clear existing items
  mainMarkersGroup.clearLayers();
  fullMarkersGroup.clearLayers();
  mainRoadsGroup.clearLayers();
  fullRoadsGroup.clearLayers();

  if (appState.offlineMode) {
    // In low bandwidth, do not render maps to conserve resources
    return;
  }

  // Draw Shelters
  appState.shelters.forEach(shelter => {
    const coords = SECTOR_COORDS[shelter.sector];
    if (coords && shelter.status === "Open") {
      // Offset slightly to prevent overlaps
      const markerCoords = [coords[0] + 0.003, coords[1] - 0.003];
      const percent = Math.round((shelter.occupancy / shelter.capacity) * 100);
      
      const customIcon = L.divIcon({
        className: 'custom-leaflet-icon',
        html: `<div style="background-color: #00e676; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px #00e676;"></div>`,
        iconSize: [12, 12]
      });

      const popupContent = `
        <h4>🏠 ${shelter.name}</h4>
        <p><strong>Ward Location:</strong> ${shelter.sector}</p>
        <p><strong>Occupancy:</strong> ${shelter.occupancy}/${shelter.capacity} (${percent}%)</p>
        <p><strong>Critical Supplies Needed:</strong> ${shelter.itemsNeeded}</p>
      `;

      L.marker(markerCoords, { icon: customIcon }).addTo(mainMarkersGroup).bindPopup(popupContent);
      L.marker(markerCoords, { icon: customIcon }).addTo(fullMarkersGroup).bindPopup(popupContent);
    }
  });

  // Draw Hospitals
  appState.hospitals.forEach(hospital => {
    const coords = SECTOR_COORDS[hospital.sector];
    if (coords) {
      const markerCoords = [coords[0] - 0.004, coords[1] + 0.004];
      const bedsLeft = hospital.capacity - hospital.activeBeds;
      
      const customIcon = L.divIcon({
        className: 'custom-leaflet-icon',
        html: `<div style="background-color: #2979ff; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px #2979ff;"></div>`,
        iconSize: [12, 12]
      });

      const popupContent = `
        <h4>🏥 ${hospital.name}</h4>
        <p><strong>Status:</strong> ${hospital.status}</p>
        <p><strong>Available ER Beds:</strong> ${bedsLeft}/${hospital.capacity}</p>
        <p><strong>Active Wait Time:</strong> ${hospital.waitTime}</p>
      `;

      L.marker(markerCoords, { icon: customIcon }).addTo(mainMarkersGroup).bindPopup(popupContent);
      L.marker(markerCoords, { icon: customIcon }).addTo(fullMarkersGroup).bindPopup(popupContent);
    }
  });

  // Draw Incidents (Active SOS)
  appState.incidents.forEach(inc => {
    const baseCoords = SECTOR_COORDS[inc.sector];
    if (baseCoords) {
      // Jitter incident location slightly
      const coords = [baseCoords[0] + inc.offsetY, baseCoords[1] + inc.offsetX];

      const pulsingMarkerIcon = L.divIcon({
        className: 'leaflet-pulsing-icon',
        html: `<span class="pulsing-marker incident-${inc.severity}"></span>`,
        iconSize: [14, 14]
      });

      const popupContent = `
        <h4 style="color: #ff3d00;">⚠️ NDRF Case #${inc.id}</h4>
        <p><strong>Reporter:</strong> ${inc.name}</p>
        <p><strong>Incident:</strong> ${inc.type}</p>
        <p><strong>Severity:</strong> <span class="badge ${inc.severity === 'CRITICAL' ? 'badge-pulse-red' : 'badge-cyan'}">${inc.severity}</span></p>
        <p><strong>Details:</strong> ${inc.desc}</p>
      `;

      L.marker(coords, { icon: pulsingMarkerIcon }).addTo(mainMarkersGroup).bindPopup(popupContent);
      L.marker(coords, { icon: pulsingMarkerIcon }).addTo(fullMarkersGroup).bindPopup(popupContent);
    }
  });

  // Draw Roads Overlay Vector (Simulation-based)
  // Connect Colaba -> Worli -> Dharavi -> Bandra -> Malabar
  const routePoints = [
    { from: "Colaba / Fort", to: "Marine Drive / Worli", coords: [SECTOR_COORDS["Colaba / Fort"], SECTOR_COORDS["Marine Drive / Worli"]] },
    { from: "Marine Drive / Worli", to: "Bandra / Andheri", coords: [SECTOR_COORDS["Marine Drive / Worli"], SECTOR_COORDS["Bandra / Andheri"]] },
    { from: "Colaba / Fort", to: "Malabar Hill", coords: [SECTOR_COORDS["Colaba / Fort"], SECTOR_COORDS["Malabar Hill"]] },
    { from: "Malabar Hill", to: "Dharavi / Kurla", coords: [SECTOR_COORDS["Malabar Hill"], SECTOR_COORDS["Dharavi / Kurla"]] },
    { from: "Dharavi / Kurla", to: "Bandra / Andheri", coords: [SECTOR_COORDS["Dharavi / Kurla"], SECTOR_COORDS["Bandra / Andheri"]] }
  ];

  routePoints.forEach(route => {
    let roadColor = "#00e5ff"; // safe highway
    let roadWeight = 3;
    let dashStyle = "5, 5";
    let isBlocked = false;

    // Apply simulation blocks
    if (appState.activeScenario === "flood" && (route.from === "Colaba / Fort" && route.to === "Marine Drive / Worli" || route.from === "Dharavi / Kurla" && route.to === "Bandra / Andheri")) {
      roadColor = "#ff3d00"; // Red blocked road due to severe logging
      roadWeight = 5;
      dashStyle = null;
      isBlocked = true;
    } else if (appState.activeScenario === "earthquake" && route.from === "Colaba / Fort" && route.to === "Malabar Hill") {
      roadColor = "#ff3d00";
      roadWeight = 5;
      dashStyle = null;
      isBlocked = true;
    } else if (appState.activeScenario === "cyclone" && route.from === "Colaba / Fort" && route.to === "Marine Drive / Worli") {
      roadColor = "#ffb300"; // Warning amber road (High tidal surge winds)
      roadWeight = 4;
      dashStyle = "1, 10";
      isBlocked = true;
    }

    const polyline = L.polyline(route.coords, {
      color: roadColor,
      weight: roadWeight,
      dashArray: dashStyle,
      opacity: 0.8
    });

    polyline.addTo(mainRoadsGroup).bindPopup(`<strong>Corridor: ${route.from} to ${route.to}</strong><br>Status: ${isBlocked ? '⚠️ Closed (Waterlogged / Structural Damage)' : '✅ Safe Passage'}`);
    
    const polylineFull = L.polyline(route.coords, {
      color: roadColor,
      weight: roadWeight,
      dashArray: dashStyle,
      opacity: 0.8
    });
    polylineFull.addTo(fullRoadsGroup).bindPopup(`<strong>Corridor: ${route.from} to ${route.to}</strong><br>Status: ${isBlocked ? '⚠️ Closed (Waterlogged / Structural Damage)' : '✅ Safe Passage'}`);
  });
}

// ==========================================================================
// 3. Disaster Simulation Engine (Indian Monsoon & Tectonic Focus)
// ==========================================================================
function triggerScenario(type) {
  appState.activeScenario = type;

  // Grab DOM elements
  const container = document.getElementById("appContainer");
  const scenarioCard = document.getElementById("activeScenarioCard");
  const scenarioPulse = document.getElementById("scenarioPulse");
  const scenarioLabel = document.getElementById("scenarioLabel");
  const scenarioDesc = document.getElementById("scenarioDesc");
  const powerVal = document.getElementById("powerStatus");
  const powerIcon = document.getElementById("powerIcon");
  const commVal = document.getElementById("commStatus");
  const commIcon = document.getElementById("commIcon");
  const weatherVal = document.getElementById("weatherStatus");
  const weatherIcon = document.getElementById("weatherIcon");

  // Reset animations and classes
  container.classList.remove("flash-alert");
  scenarioPulse.className = "pulse-indicator";

  if (type === "none") {
    // Normal Monsoon Monitoring Mode
    scenarioPulse.classList.add("status-green");
    scenarioLabel.innerText = "No Active Threat";
    scenarioDesc.innerText = "LifeBridge monitoring is synchronized with IMD & SDMA. All sectors green.";
    
    // Status Indicators
    powerVal.innerText = "100%";
    powerIcon.className = "fa-solid fa-plug-circle-bolt status-icon text-cyan";
    commVal.innerText = "Stable";
    commIcon.className = "fa-solid fa-tower-cell status-icon text-cyan";
    weatherVal.innerText = "Normal";
    weatherIcon.className = "fa-solid fa-cloud-sun status-icon text-cyan";

    // Set Shelters to normal
    appState.shelters = [
      { id: "S1", name: "NDRF Relief Camp A (Shivaji Ground Gym)", sector: "Colaba / Fort", capacity: 300, occupancy: 42, status: "Open", itemsNeeded: "Dry Rations, Tarpaulins" },
      { id: "S2", name: "BMC Relief Shelter B (Worli Koliwada Center)", sector: "Marine Drive / Worli", capacity: 250, occupancy: 32, status: "Open", itemsNeeded: "Bottled Water, Life Jackets, ORS Packets" },
      { id: "S3", name: "BMC Camp C (Malabar Hill Gymkhana)", sector: "Malabar Hill", capacity: 400, occupancy: 0, status: "Standby", itemsNeeded: "None" },
      { id: "S4", name: "Dharavi Municipal School Relief Point", sector: "Dharavi / Kurla", capacity: 200, occupancy: 0, status: "Standby", itemsNeeded: "None" }
    ];

    // Set Hospitals to normal
    appState.hospitals.forEach(h => {
      h.activeBeds = Math.floor(h.capacity * 0.5);
      h.status = "Operational";
      h.waitTime = "10 min";
    });

    postSystemBroadcast("Monsoon monitoring active. System metrics normal. No warning alerts.");
    addAIChatResponse("Monsoon control center is in standby. Local environments are safe. How can I help you prepare today?");
  } 
  else if (type === "flood") {
    // Mumbai Floods (Extreme High Tide + Heavy Rainfall)
    container.classList.add("flash-alert");
    scenarioPulse.classList.add("status-red");
    scenarioLabel.innerText = "Mumbai Floods Red Alert";
    scenarioDesc.innerText = "Heavy rain combined with a 4.8m high tide. Severe water logging in Kurla, Dharavi, and Hindmata. Evacuate low zones.";

    powerVal.innerText = "68%";
    powerIcon.className = "fa-solid fa-plug-circle-bolt status-icon text-amber";
    commVal.innerText = "Congested";
    commIcon.className = "fa-solid fa-tower-cell status-icon text-cyan";
    weatherVal.innerText = "Extreme Rain / High Tide";
    weatherIcon.className = "fa-solid fa-cloud-showers-water status-icon text-red";

    // Occupy Worli camp B and Dharavi camp D
    appState.shelters[1].occupancy = 242;
    appState.shelters[1].itemsNeeded = "ORS Packets, Mosquito Nets, Dry Rations";
    appState.shelters[3].status = "Open";
    appState.shelters[3].occupancy = 180;
    appState.shelters[3].itemsNeeded = "Tarpaulins, Bottled Water, Bleaching Powder";

    // Hospitals
    appState.hospitals[1].activeBeds = 98; // Bhabha hospital ER full
    appState.hospitals[1].status = "Emergency Surge";
    appState.hospitals[1].waitTime = "50 min";

    postSystemBroadcast("IMD RED ALERT: Extreme rain with high tide warning. Hindmata & Kurla subways CLOSED. Use Western Express highway.");
    addAIChatResponse("🚨 **IMD RED ALERT WARNING:** Mumbai is experiencing extreme monsoon flooding combined with a high tidal swell. \n\n- Severe logging reported in **Dharavi / Kurla** lowlands. Dharavi Municipal School relief point is now **OPEN**.\n- Avoid **Marine Drive / Worli** coastal roads due to massive tide waves.\n- In case of water enters your house, turn off the main switch immediately to avoid earthing electrocutions. Reach out to the SOS tab if you need boat rescue assistance.");
  } 
  else if (type === "earthquake") {
    // Earth Tremor (Tectonic shift in Koyna line)
    scenarioPulse.classList.add("status-red");
    scenarioLabel.innerText = "5.8 M Earth Tremor";
    scenarioDesc.innerText = "Tremors felt across South Mumbai. Compromised building hazards in old structures. Evacuation camps open.";

    powerVal.innerText = "45%";
    powerIcon.className = "fa-solid fa-plug-circle-bolt status-icon text-red";
    commVal.innerText = "Intermittent Signals";
    commIcon.className = "fa-solid fa-tower-cell status-icon text-red";
    weatherVal.innerText = "Overcast";
    weatherIcon.className = "fa-solid fa-cloud status-icon text-secondary";

    // Open Malabar Gymkhana and Shivaji ground shelters
    appState.shelters[0].occupancy = 275;
    appState.shelters[0].itemsNeeded = "First Aid kits, Torches";
    appState.shelters[2].status = "Open";
    appState.shelters[2].occupancy = 310;
    appState.shelters[2].itemsNeeded = "Bottled water, Blankets";

    // KEM hospital overloaded
    appState.hospitals[0].activeBeds = 245;
    appState.hospitals[0].status = "Crisis Mode";
    appState.hospitals[0].waitTime = "1h 10m";

    postSystemBroadcast("BMC WARNING: Tremors felt. Stay clear of old buildings in South Mumbai. Open relief camps at Shivaji Gym ground.");
    addAIChatResponse("⚠️ **EARTH TREMOR ALERT:** A **Magnitude 5.8 Tremor** has shaken the Mumbai area. Compounding hazards identified in old structures.\n\n- **Safety Protocol:** Do not run out during shaking. Take cover under heavy tables (**Drop, Cover, Hold On**).\n- Avoid brick structural overrides. Shivaji Ground Relief Camp is open and supplied with search equipment.");
  } 
  else if (type === "cyclone") {
    // Cyclone Nisarga Approaching Mumbai Coast
    scenarioPulse.classList.add("status-warning");
    scenarioLabel.innerText = "Cyclone Nisarga Alert";
    scenarioDesc.innerText = "Category 2 Cyclone approaching coastal belt. Winds up to 110 km/h. Sea docks evacuated. Evacuation in progress.";

    powerVal.innerText = "58%";
    powerIcon.className = "fa-solid fa-plug-circle-bolt status-icon text-amber";
    commVal.innerText = "Stable";
    commIcon.className = "fa-solid fa-tower-cell status-icon text-cyan";
    weatherVal.innerText = "Storm / Extreme Wind";
    weatherIcon.className = "fa-solid fa-wind status-icon text-amber";

    // Close Worli coastal camp, shift to Malabar hill heights
    appState.shelters[1].status = "Closed (Evacuated)";
    appState.shelters[1].occupancy = 0;
    appState.shelters[2].status = "Open";
    appState.shelters[2].occupancy = 385; // Malabar hill full
    appState.shelters[2].itemsNeeded = "Lamps, Rations, Dry Milk Packets";

    postSystemBroadcast("NDRF FORCE BROADCAST: Coastal Worli docks closed. Hurricane shelter operational at Malabar Hill. Lock windows.");
    addAIChatResponse("🌀 **CYCLONE NISARGA INCOMING:** Category 2 Storm is making landfall on the coast. \n\n- All coastal residents in **Marine Drive / Worli** must relocate immediately to **Malabar Hill (Uplands)** or **Bandra / Andheri**.\n- Secure loose windows and balcony items immediately.\n- Keep emergency phone lines charged. Power lines will be disconnected as a precaution.");
  }

  // Redraw map with updated assets
  drawMapAssets();
  renderState();
}

// ==========================================================================
// 4. Data State Rendering & DOM Generation
// ==========================================================================
function renderState() {
  // Update Dashboard Shelters Capacity Lists
  const shelterContainer = document.getElementById("shelterCapacityList");
  shelterContainer.innerHTML = "";
  
  appState.shelters.forEach(shelter => {
    const percent = Math.round((shelter.occupancy / shelter.capacity) * 100);
    let barColor = "bar-green";
    if (percent > 85) barColor = "bar-red";
    else if (percent > 60) barColor = "bar-amber";
    
    let percentValText = "";
    if (shelter.status === "Closed (Evacuated)") {
      percentValText = "EVACUATED";
      barColor = "bar-red";
    } else {
      percentValText = `${shelter.occupancy}/${shelter.capacity} Beds`;
    }

    const item = document.createElement("div");
    item.className = "capacity-item";
    item.innerHTML = `
      <div class="capacity-item-header">
        <span>${shelter.name}</span>
        <span class="capacity-nums">${percentValText}</span>
      </div>
      <div class="capacity-bar-bg">
        <div class="capacity-bar-fill ${barColor}" style="width: ${shelter.status.startsWith('Closed') ? '0' : percent}%"></div>
      </div>
      <div class="capacity-meta">
        <span>Ward: <strong>${shelter.sector}</strong> | Status: <strong class="${shelter.status === 'Open' ? 'text-green' : 'text-amber'}">${shelter.status}</strong></span>
        <span>Needs: ${shelter.itemsNeeded}</span>
      </div>
    `;
    shelterContainer.appendChild(item);
  });

  // Update Dashboard Hospital ER units capacity lists
  const hospitalContainer = document.getElementById("hospitalCapacityList");
  hospitalContainer.innerHTML = "";

  appState.hospitals.forEach(h => {
    const percent = Math.round((h.activeBeds / h.capacity) * 100);
    let barColor = "bar-blue";
    if (percent > 90) barColor = "bar-red";
    else if (percent > 70) barColor = "bar-amber";

    const item = document.createElement("div");
    item.className = "capacity-item";
    item.innerHTML = `
      <div class="capacity-item-header">
        <span>${h.name}</span>
        <span class="capacity-nums">${h.activeBeds}/${h.capacity} Occupied</span>
      </div>
      <div class="capacity-bar-bg">
        <div class="capacity-bar-fill ${barColor}" style="width: ${percent}%"></div>
      </div>
      <div class="capacity-meta">
        <span>Ward: <strong>${h.sector}</strong> | Status: <strong class="${h.status === 'Operational' ? 'text-cyan' : 'text-red'}">${h.status}</strong></span>
        <span>Avg ER Wait: <strong>${h.waitTime}</strong></span>
      </div>
    `;
    hospitalContainer.appendChild(item);
  });

  // Global Statistics counters
  document.getElementById("statShelters").innerText = appState.shelters.filter(s => s.status === "Open").length;
  document.getElementById("statHospitals").innerText = appState.hospitals.filter(h => h.status !== "Offline").length;
  
  let blockedCount = 0;
  if (appState.activeScenario === "flood") blockedCount = 2;
  else if (appState.activeScenario === "earthquake") blockedCount = 1;
  else if (appState.activeScenario === "cyclone") blockedCount = 1;
  document.getElementById("statRoads").innerText = blockedCount;
  
  document.getElementById("statSOS").innerText = appState.incidents.length;

  // Render subboards
  renderIncidentFeed();
  renderBulletinBoard("all", "");
  renderVolunteerBoard();
  renderSurvivalSection();
}

function renderIncidentFeed() {
  const container = document.getElementById("incidentLog");
  const placeholder = document.getElementById("emptyFeedPlaceholder");
  
  // Clean all incidents but keep placeholder reference
  container.querySelectorAll(".incident-item").forEach(item => item.remove());

  if (appState.incidents.length === 0) {
    placeholder.style.display = "flex";
    document.getElementById("liveFeedCount").innerText = "0 Active";
    return;
  }

  placeholder.style.display = "none";
  document.getElementById("liveFeedCount").innerText = `${appState.incidents.length} Active`;

  appState.incidents.forEach(inc => {
    const item = document.createElement("div");
    item.className = `incident-item severity-${inc.severity}`;
    item.innerHTML = `
      <div class="incident-item-header">
        <span class="incident-title">${inc.type}</span>
        <span class="incident-time">${inc.time}</span>
      </div>
      <p class="incident-desc">${inc.desc}</p>
      <div class="incident-meta">
        <span><i class="fa-solid fa-user"></i> ${inc.name}</span>
        <span><i class="fa-solid fa-map-pin"></i> ${inc.sector}</span>
        <span><i class="fa-solid fa-phone"></i> ${inc.phone}</span>
      </div>
    `;
    container.insertBefore(item, container.firstChild); // Prepend so new shows top
  });
}

function renderBulletinBoard(filterType, searchQuery) {
  const container = document.getElementById("bulletinList");
  container.innerHTML = "";

  const cleanQuery = searchQuery.trim().toLowerCase();
  
  // Build master list of bulletin items
  let masterList = [];
  
  if (filterType === "all" || filterType === "safe") {
    appState.safePersons.forEach(p => {
      masterList.push({ name: p.name, text: `Mobile: ${p.phone} | Ward: ${p.location}`, subtext: p.status, type: "Safe", badge: "status-safe" });
    });
  }

  if (filterType === "all" || filterType === "missing") {
    appState.missingPersons.forEach(m => {
      masterList.push({ name: m.name, text: `Age: ${m.age} | Last Seen: ${m.lastSeen}`, subtext: `Reporter: ${m.reporter} | Notes: ${m.details}`, type: "Missing", badge: "status-missing" });
    });
  }

  // Filter with query
  let filtered = masterList.filter(item => {
    return item.name.toLowerCase().includes(cleanQuery) || 
           item.text.toLowerCase().includes(cleanQuery) || 
           item.subtext.toLowerCase().includes(cleanQuery);
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-feed-placeholder"><i class="fa-solid fa-folder-open"></i><p>No bulletin records match "${searchQuery}"</p></div>`;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "bulletin-item";
    card.innerHTML = `
      <div class="bulletin-details">
        <span class="bulletin-name">${item.name}</span>
        <span class="bulletin-info">${item.text}</span>
        <span class="bulletin-info" style="color: var(--text-muted); font-size: 11px;">${item.subtext}</span>
      </div>
      <span class="bulletin-status-badge ${item.badge}">${item.type}</span>
    `;
    container.appendChild(card);
  });
}

function renderVolunteerBoard() {
  // Render aid offers
  const offersList = document.getElementById("aidOffersList");
  offersList.innerHTML = "";
  appState.volunteerOffers.forEach(off => {
    const card = document.createElement("div");
    card.className = "aid-card-item";
    card.innerHTML = `
      <div class="aid-card-header">
        <span class="aid-card-title">${off.name}</span>
        <span class="aid-card-badge text-green">${off.type.split(" ")[0]}</span>
      </div>
      <p class="aid-card-desc">${off.details}</p>
      <span class="aid-card-contact"><i class="fa-solid fa-address-book"></i> Contact: ${off.contact}</span>
    `;
    offersList.appendChild(card);
  });

  // Render aid requests (from SOS)
  const reqList = document.getElementById("aidRequestsList");
  reqList.innerHTML = "";
  
  if (appState.incidents.length === 0) {
    reqList.innerHTML = `<div class="empty-feed-placeholder" style="padding: 30px 0;"><p>No active field needs posted.</p></div>`;
    return;
  }

  appState.incidents.forEach(inc => {
    const card = document.createElement("div");
    card.className = "aid-card-item";
    card.innerHTML = `
      <div class="aid-card-header">
        <span class="aid-card-title">${inc.type}</span>
        <span class="aid-card-badge text-red">${inc.severity}</span>
      </div>
      <p class="aid-card-desc">${inc.desc}</p>
      <span class="aid-card-contact"><i class="fa-solid fa-address-book"></i> ${inc.name} (Ward: ${inc.sector})</span>
    `;
    reqList.appendChild(card);
  });

  document.getElementById("matchCounter").innerText = `${appState.incidents.length} Mutual Matches Identified`;
}

function renderSurvivalSection() {
  const type = appState.activeChecklistType;
  
  // Set Handbook guides
  const tipsBox = document.getElementById("handbookTips");
  let tipsHTML = "";
  
  if (type === "flood") {
    tipsHTML = `
      <h4>🌊 Monsoon Flood Survival Protocol</h4>
      <ul>
        <li>Store drinking water only in clean closed containers. Consume boiled/filtered water with ORS to prevent cholera.</li>
        <li>Do NOT attempt to wade or cross open roads. Subways in Hindmata, Kurla, Milan can have open sewer vents.</li>
        <li>Watch out for hanging power lines/earthing leaks in waterlogged streets.</li>
        <li>Follow IMD alerts and local BMC disaster control cell announcements.</li>
      </ul>
    `;
  } else if (type === "earthquake") {
    tipsHTML = `
      <h4>🏢 Earth Tremor Survival Protocol</h4>
      <ul>
        <li><strong>DROP:</strong> Get onto your knees immediately.</li>
        <li><strong>COVER:</strong> Hide beneath a solid desk, cot, or bed frame.</li>
        <li><strong>HOLD ON:</strong> Grip the desk leg and protect your head.</li>
        <li>If living in structurally weak chawls or old masonry constructs, evacuate to open grounds like Shivaji Ground.</li>
      </ul>
    `;
  } else if (type === "cyclone") {
    tipsHTML = `
      <h4>🌀 Coastal Cyclone Safety Protocol</h4>
      <ul>
        <li>Stay indoors and anchor glass window frames securely.</li>
        <li>Charge powerbanks and emergency lanterns ahead of landfall.</li>
        <li>Shut down electricity mains if heavy storm winds begin.</li>
        <li>Keep dry food items (khichdi grains, biscuits, parched rice) ready.</li>
      </ul>
    `;
  } else if (type === "firstaid") {
    tipsHTML = `
      <h4>🩹 Emergency Trauma First Aid</h4>
      <ul>
        <li><strong>Severe Bleeding:</strong> Apply firm cloth wrap pressure directly. Elevate the leg or arm.</li>
        <li><strong>Burns:</strong> Hold clean cool running water over it for 10 min. Do not put ice or oily creams.</li>
        <li><strong>ORS Recovery:</strong> Mix 1 ORS packet in 1 liter of clean water for dehydration recovery.</li>
        <li><strong>Helplines:</strong> Call 108 for Government Ambulances, 112 for Police dispatch.</li>
      </ul>
    `;
  }
  tipsBox.innerHTML = tipsHTML;

  // Set title description
  const checklistTitle = document.getElementById("checklistTitle");
  const checklistSubtitle = document.getElementById("checklistSubtitle");
  
  let formattedTitle = type.charAt(0).toUpperCase() + type.slice(1);
  if (type === "firstaid") formattedTitle = "Basic First Aid Kit";
  checklistTitle.innerHTML = `<i class="fa-solid fa-list-check icon-accent"></i> Interactive ${formattedTitle} Checklist`;
  checklistSubtitle.innerText = `Tick off compiled emergency items before evacuation. Saved locally.`;

  // Render list items
  const itemsContainer = document.getElementById("checklistItems");
  itemsContainer.innerHTML = "";

  const items = appState.checklists[type];
  let checkedCount = 0;

  items.forEach(item => {
    if (item.checked) checkedCount++;

    const row = document.createElement("div");
    row.className = `checklist-item ${item.checked ? 'checked' : ''}`;
    row.innerHTML = `
      <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleChecklistItem('${type}', '${item.id}')">
      <span>${item.text}</span>
    `;
    itemsContainer.appendChild(row);
  });

  // Render progress bar
  const progressPercent = items.length === 0 ? 0 : Math.round((checkedCount / items.length) * 100);
  document.getElementById("checklistProgressText").innerText = `${checkedCount}/${items.length} Checked`;
  document.getElementById("checklistProgressFill").style.width = `${progressPercent}%`;
}

// Handles checking/unchecking checklist items
window.toggleChecklistItem = function(type, itemId) {
  const item = appState.checklists[type].find(i => i.id === itemId);
  if (item) {
    item.checked = !item.checked;
    renderSurvivalSection();
  }
};

function addCustomChecklistItem() {
  const input = document.getElementById("customItemInput");
  const text = input.value.trim();
  if (text === "") return;

  const type = appState.activeChecklistType;
  const newId = "custom-" + Date.now();
  
  appState.checklists[type].push({
    id: newId,
    text: text,
    checked: false
  });

  input.value = "";
  renderSurvivalSection();
}

// ==========================================================================
// 5. Emergency Form Submission Handling
// ==========================================================================
function handleSOSSubmission(e) {
  e.preventDefault();
  
  const name = document.getElementById("sosName").value.trim();
  const phone = document.getElementById("sosPhone").value.trim();
  const sector = document.getElementById("sosSector").value;
  const severity = document.querySelector('input[name="sosSeverity"]:checked').value;
  const type = document.getElementById("sosRequestType").value;
  const desc = document.getElementById("sosDetails").value.trim();

  // Create unique coordinates offsetting slightly from sector base
  const newIncident = {
    id: appState.incidents.length + 101,
    name,
    phone,
    sector,
    severity,
    type,
    desc,
    offsetX: (Math.random() - 0.5) * 0.015,
    offsetY: (Math.random() - 0.5) * 0.015,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  appState.incidents.push(newIncident);
  
  // Reset form
  document.getElementById("sosReportForm").reset();

  // Redraw, update states, and alert user
  postSystemBroadcast(`🚨 SOS INCIDENT REGISTERED: ${type} reported by ${name} in ${sector}. Relief units notified.`);
  drawMapAssets();
  renderState();

  // Highlight dashboard log
  switchTab("dashboard");

  // AI Chat responds automatically
  setTimeout(() => {
    addAIChatResponse(`🚨 **NDRF DISPATCH WARNING:** An emergency alert has been compiled for a **${severity}** severity **${type}** in **${sector}** from citizen **${name}** (${phone}). \n\n**Action Dispatch Protocol:**\n- Custom GPS location mapped to NDRF disaster console.\n- Alert dispatched to nearby municipal relief teams.\n- Recommended Nearest Relief Shelter: **${getNearestShelterName(sector)}**.\n\n*Incident Notes: "${desc}"*`);
  }, 1000);
}

function handleSafeRegister(e) {
  e.preventDefault();

  const name = document.getElementById("safeName").value.trim();
  const phone = document.getElementById("safePhone").value.trim();
  const location = document.getElementById("safeLocation").value;
  const status = document.getElementById("safeStatus").value.trim() || "Safe, status nominal.";

  appState.safePersons.unshift({
    name,
    phone,
    location,
    status
  });

  document.getElementById("registerSafeForm").reset();
  renderState();

  // Success alert
  alert(`Thank you, ${name}. Your safety record has been published to the public bulletin board.`);
}

function handleVolunteerSubmission(e) {
  e.preventDefault();

  const name = document.getElementById("volunteerName").value.trim();
  const contact = document.getElementById("volunteerContact").value.trim();
  const type = document.getElementById("volunteerType").value;
  const details = document.getElementById("volunteerDetails").value.trim();

  appState.volunteerOffers.unshift({
    name,
    contact,
    type,
    details
  });

  document.getElementById("volunteerForm").reset();
  renderState();
  
  alert("Volunteer aid card added. Thank you for supporting community relief!");
}

function handleMissingSubmission(e) {
  e.preventDefault();

  const name = document.getElementById("missingName").value.trim();
  const age = document.getElementById("missingAge").value;
  const lastSeen = document.getElementById("missingLastSeen").value.trim();
  const details = document.getElementById("missingDetails").value.trim();
  const reporter = document.getElementById("reporterContact").value.trim();

  appState.missingPersons.unshift({
    name,
    age: age || "Unknown",
    lastSeen,
    details: details || "No descriptions available",
    reporter
  });

  document.getElementById("missingPersonForm").reset();
  document.getElementById("missingModal").classList.remove("active");
  renderState();
}

// Utility: Find nearest shelter based on Sector Wards
function getNearestShelterName(sector) {
  if (sector.includes("Colaba")) return "NDRF Relief Camp A (Shivaji Ground Gym)";
  if (sector.includes("Worli") || sector.includes("Marine")) return "BMC Relief Shelter B (Worli Koliwada Center)";
  if (sector.includes("Malabar")) return "BMC Camp C (Malabar Hill Gymkhana)";
  if (sector.includes("Dharavi") || sector.includes("Kurla")) return "Dharavi Municipal School Relief Point";
  return "NDRF Relief Camp A (Shivaji Ground Gym)";
}

// ==========================================================================
// 6. Broadcast Marquee ticker controller
// ==========================================================================
function postSystemBroadcast(text) {
  const marquee = document.getElementById("broadcastText");
  marquee.innerText = text;
}

// ==========================================================================
// 7. Low-Bandwidth Simulated Offline Mode
// ==========================================================================
function toggleLowBandwidth() {
  appState.offlineMode = !appState.offlineMode;
  
  const body = document.body;
  const btn = document.getElementById("networkModeBtn");
  const icon = document.getElementById("networkModeIcon");
  const text = document.getElementById("networkModeText");

  if (appState.offlineMode) {
    body.classList.add("offline-mode");
    icon.className = "fa-solid fa-wifi-slash text-red";
    text.innerText = "Offline Mode";
    
    // Alert the user via marquee
    postSystemBroadcast("GRID WARNING: Low signal bandwidth mode active. Satellite maps disabled. SMS emergency hotlines loaded.");
    
    addAIChatResponse("⚠️ **LOW-BANDWIDTH MODE ENGAGED:** \nInteractive satellite maps are suspended to avoid mobile data drain. Cached municipal survival handbooks and primary NDRF SMS numbers are loaded below.");
  } else {
    body.classList.remove("offline-mode");
    icon.className = "fa-solid fa-wifi text-green";
    text.innerText = "Online Mode";
    
    postSystemBroadcast("Telemetry active. Interactive Mumbai mapping online. Dynamic coordinates synchronization active.");
    addAIChatResponse("🟢 **ONLINE MODE ENGAGED:** Real-time IMD data synchronization and live hospital ER metrics have been restored.");
  }

  // Redraw map assets
  drawMapAssets();
  renderState();
}

// ==========================================================================
// 8. LifeBridge AI Chatbot response engine
// ==========================================================================
function handleChatSend() {
  const input = document.getElementById("chatInputField");
  const query = input.value.trim();
  if (query === "") return;

  // Add User message
  addChatBubble(query, "user");
  input.value = "";

  // Mock AI processing typing indicators
  const history = document.getElementById("chatHistory");
  const typingBubble = document.createElement("div");
  typingBubble.className = "chat-message ai typing-bubble";
  typingBubble.innerHTML = `<div class="msg-bubble"><i class="fa-solid fa-ellipsis fa-bounce"></i> Thinking...</div>`;
  history.appendChild(typingBubble);
  history.scrollTop = history.scrollHeight;

  setTimeout(() => {
    typingBubble.remove();
    processAIResponse(query);
  }, 1000);
}

function addChatBubble(text, sender) {
  const history = document.getElementById("chatHistory");
  const message = document.createElement("div");
  message.className = `chat-message ${sender}`;
  message.innerHTML = `
    <div class="msg-bubble">${formatMarkdownToHTML(text)}</div>
    <span class="msg-timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
  `;
  history.appendChild(message);
  history.scrollTop = history.scrollHeight;
}

function addAIChatResponse(text) {
  addChatBubble(text, "ai");
}

function processAIResponse(query) {
  if (appState.offlineMode) {
    addAIChatResponse("⚠️ **System Offline:** The AI engine requires active cellular signal. Check the *Survival Guides* tab for pre-loaded offline instructions.");
    return;
  }

  const q = query.toLowerCase();

  // 1. Shelter queries
  if (q.includes("shelter") || q.includes("relief camp") || q.includes("safe place") || q.includes("evacuate")) {
    let openShelters = appState.shelters.filter(s => s.status === "Open");
    let response = "🏠 **Active Emergency Relief Camps:** \nHere are the operational relief hubs accepting citizens: \n\n";
    openShelters.forEach(s => {
      response += `- **${s.name}** (${s.sector}): Occupancy is at **${s.occupancy}/${s.capacity} beds**. Needs: *${s.itemsNeeded}*.\n`;
    });
    response += "\nTo evacuate, avoid coastal roads (Colaba -> Worli) which are under tidal waves.";
    addAIChatResponse(response);
  }
  // 2. Road safety queries
  else if (q.includes("road") || q.includes("highway") || q.includes("flood") || q.includes("traffic") || q.includes("waterlog")) {
    let blockedInfo = "🛣️ **Mumbai Corridor Safety Status:** \n";
    if (appState.activeScenario === "none") {
      blockedInfo += "All arterial roads (LBS Road, Western Express Highway) are currently **CLEAR & FUNCTIONAL**.";
    } else if (appState.activeScenario === "flood") {
      blockedInfo += "- **Colaba to Worli Coastal Road:** ❌ **BLOCKED** due to high rising tides.\n- **Dharavi to Bandra Link:** ❌ **BLOCKED** due to deep water logging near Kurla.\n- Alternate route: Use the flyover links on the Eastern Express Highway.";
    } else if (appState.activeScenario === "earthquake") {
      blockedInfo += "- **Colaba to Malabar Hill Road:** ❌ **BLOCKED** due to pavement cracks.\n- Other roads: Safe, but stay clear of flyovers and old structures.";
    } else if (appState.activeScenario === "cyclone") {
      blockedInfo += "- **Worli Coastal Road:** ❌ **CLOSED** (Extreme sea swell wind risk).\n- BMC advises citizens to stay indoors and avoid sea promenades.";
    }
    addAIChatResponse(blockedInfo);
  }
  // 3. First Aid instructions
  else if (q.includes("first aid") || q.includes("cpr") || q.includes("wound") || q.includes("bleed") || q.includes("call") || q.includes("ambulance")) {
    addAIChatResponse("🩹 **Primary Trauma Aid Instructions:**\n\n1. **Severe Bleeding:** Apply clean cloth directly. Wrap tightly, elevate wound, and wait for government ambulance (**Call 108**).\n2. **CPR:** Push center chest hard & fast at 100 compressions/min. 30 compressions, then 2 breaths.\n3. **Dehydration/Cholera:** Supply ORS solution (1 packet in 1L water) immediately to prevent shock.\n\n*Emergency SOS signals logged in the SOS panel notify nearby NGOs and NDRF cells.*");
  }
  // 4. National Helplines
  else if (q.includes("helpline") || q.includes("ndrf") || q.includes("bmc") || q.includes("number")) {
    addAIChatResponse("📞 **Emergency Helplines (India):**\n- **National Disaster Helpline:** 112\n- **NDRF Control Room:** 1078 or +91-11-23438091\n- **BMC Disaster Management:** 1916\n- **Ambulance Services:** 108\n- **Fire Department:** 101");
  }
  // 5. Basic disaster guidelines
  else if (q.includes("monsoon") || q.includes("rain") || q.includes("mumbai")) {
    addAIChatResponse("🌊 **Monsoon Flood Guidelines:**\n- Get to upper floor rooms immediately.\n- Keep away from open drains, manholes, or waterlogged subways.\n- Pack water bottle, parched rice, matches, and dry batteries.\n- Nearest Shelter: **NDRF Relief Camp A (Shivaji Ground Gym)**.");
  }
  else if (q.includes("earthquake") || q.includes("tremor")) {
    addAIChatResponse("🏢 **Earthquake Safety Guidelines:**\n- Take cover under cots/tables (**Drop, Cover, Hold On**).\n- Check gas stove valves for leakage before switching lamps.\n- Avoid building stairs or elevators during tremors.");
  }
  else if (q.includes("cyclone") || q.includes("nisarga") || q.includes("storm")) {
    addAIChatResponse("🌀 **Cyclone Safety Guidelines:**\n- Lock windows and move to wind-shielded rooms.\n- Disconnect power supply systems to prevent lightning grounding issues.\n- Avoid moving out until municipal authorities declare storm eye has crossed.");
  }
  // Fallback AI responder
  else {
    addAIChatResponse(`🤖 **LifeBridge Command Intelligence:** \nI have analyzed your query: *"${query}"*.\n\nCurrently, the system is in **${appState.activeScenario.toUpperCase()}** disaster mode. If you are in distress, please log an SOS signal immediately. You can check shelters by typing "Where is the nearest relief camp?" or review safe roads by typing "Check roads". Stay safe!`);
  }
}

// Utility: Super simple regex formatter to replace ** and * with bold/italics
function formatMarkdownToHTML(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

// ==========================================================================
// 9. Real-time Incident Ticker Simulator (Indian Incidents)
// ==========================================================================
function startRealTimeSim() {
  const events = [
    { name: "Inspector Patil (Patrol 4)", type: "Shortage (Water / Food)", sector: "Dharavi / Kurla", severity: "MINOR", desc: "Dharavi relief school requests additional chlorine tablets and baby milk.", phone: "98200 11002" },
    { name: "BMC Control Room", type: "Medical Emergency", sector: "Colaba / Fort", severity: "CRITICAL", desc: "Old structure wall crack collapse in Fort. 2 people rescued, requiring urgent trauma care.", phone: "1916" },
    { name: "Worli Koliwada Volunteers", type: "Flooding Water Trapped", sector: "Marine Drive / Worli", severity: "MEDIUM", desc: "Low-lying fishing community lanes flooded. 5 families require relocation to BMC Relief Shelter B.", phone: "98920 44005" }
  ];

  let index = 0;
  setInterval(() => {
    // Only push simulated events if a disaster is active and we are online
    if (appState.activeScenario !== "none" && !appState.offlineMode && index < events.length) {
      const e = events[index];
      
      const newInc = {
        id: appState.incidents.length + 101,
        name: e.name,
        phone: e.phone,
        sector: e.sector,
        severity: e.severity,
        type: e.type,
        desc: e.desc,
        offsetX: (Math.random() - 0.5) * 0.015,
        offsetY: (Math.random() - 0.5) * 0.015,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      appState.incidents.push(newInc);
      
      postSystemBroadcast(`🚨 LIVE FIELD REPORT: ${e.type} reported in ${e.sector}. Dispatching volunteers.`);
      drawMapAssets();
      renderState();

      index++;
    }
  }, 25000); // Trigger every 25 seconds
}
