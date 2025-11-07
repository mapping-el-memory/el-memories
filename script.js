// Mapping East Lansing Memories — main JS
// Works with your HTML (#map) and CSS. No external slider plugin required.

// 1) Map + tiles
var map = L.map('map').setView([42.7347, -84.4856], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// 2) Data — add `img` (openly licensed) and `link` (authoritative)
function featurePt(title, lon, lat, time, desc, img, link) {
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [lon, lat] }, // [lon,lat]
    properties: {
      title: title,
      description: desc || '',
      time: time,                 // 'YYYY/MM' -> grouped by season+year
      img: img || '',
      link: link || ''            // authoritative URL
    }
  };
}

var dataset1 = [
  // Gungun — 2023
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.47389, 42.72917] },
    properties:{ title:'Gungun — Baker Hall', description:'Baker Hall (source: topoquest.com)', time:'2023/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.48174, 42.73489] },
    properties:{ title:'Gungun — Potbelly (233 E Grand River Ave)', description:'Potbelly (source: MapQuest)', time:'2023/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.50445, 42.768278] },
    properties:{ title:'Gungun — Meijer (1350 W Lake Lansing Rd)', description:'Meijer – Lake Lansing (maps.msu.edu)', time:'2023/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.482842, 42.702165] },
    properties:{ title:'Gungun — Sansu (4750 S Hagadorn Rd)', description:'Sansu (Yelp)', time:'2023/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.48253, 42.73586] },
    properties:{ title:'Gungun — Jolly Pumpkin (218 Albert Ave)', description:'Jolly Pumpkin (MapQuest)', time:'2023/09' } },

  // Ritesh — 2023
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.48194, 42.72778] },
    properties:{ title:'Ritesh — Wells Hall', description:'Wells Hall (source: LatLong)', time:'2023/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.52883, 42.73587] },
    properties:{ title:'Ritesh — Olga’s Kitchen (Frandor, 354 Frandor Ave)', description:'Olga’s Kitchen – Frandor', time:'2023/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.52633, 42.73479] },
    properties:{ title:'Ritesh — Staples (3003 E Michigan Ave)', description:'Staples (stores.staples.com)', time:'2023/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.551557, 42.734973] },
    properties:{ title:'Ritesh — Summit Comics & Games (216 S Washington Sq)', description:'Summit Comics & Games (downtownlansing.org)', time:'2023/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.47899, 42.72529] },
    properties:{ title:'Ritesh — MSU Tech Store (Computer Center, 450 Auditorium Rd)', description:'MSU Tech Store (maps.msu.edu)', time:'2023/09' } },

  // Kiera — 2024
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.487943, 42.728184] },
    properties:{ title:'Kiera — IM West', description:'IM West (spartancash.msu.edu)', time:'2024/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.479515, 42.725117] },
    properties:{ title:'Kiera — MSU Dairy Store (Anthony Hall, 474 S Shaw Ln)', description:'MSU Dairy Store (whereorg.com)', time:'2024/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.483208, 42.730869] },
    properties:{ title:'Kiera — Main Library (366 W Circle Dr)', description:'Main Library (LatLong)', time:'2024/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.49543, 42.73149] },
    properties:{ title:'Kiera — Brody Square', description:'Brody Square (Mapcarta)', time:'2024/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.47928, 42.72708] },
    properties:{ title:'Kiera — Erickson Hall', description:'Erickson Hall (Mapcarta)', time:'2024/09' } }
];


// 3) Popup templating — includes name, description, image, authoritative link.
// Popups open only on click (autoClose true; we never call openPopup on load).
function onEachFeature(feature, layer) {
  var p = feature.properties || {};
  var place = (p.title || '').replace(/^[^—]+—\s*/, '').trim();

  var imgHtml = p.img ? (
    '<div class="popup-media"><img src="' + p.img + '" alt="' + place +
    ' (photo)" style="width:100%;height:auto;max-height:200px;object-fit:cover;border-radius:8px"></div>'
  ) : '';

  var linkHtml = p.link ? (
    '<p><a href="' + p.link + '" target="_blank" rel="noopener">Learn more</a></p>'
  ) : '';

  var html =
    "<div>" +
      "<h4 style='margin:0 0 6px'>" + place + "</h4>" +
      (p.description ? "<p style='margin:0 0 8px;color:#444'>" + p.description + "</p>" : "") +
      imgHtml +
      linkHtml +
    "</div>";

  layer.bindPopup(html, { closeButton: true, autoClose: true });
}

// 4) Marker rendering (do NOT add to map yet — the slider controls visibility)
var group1 = L.geoJSON(dataset1, {
  onEachFeature: onEachFeature,
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng);
  }
});

// 5) Slider logic — group markers by YEAR only and toggle visibility
var yearBuckets = {};     // { "2023": [Marker, ...], "2024": [Marker, ...] }
var years = [];

group1.eachLayer(function (layer) {
  var t = layer.feature && layer.feature.properties && layer.feature.properties.time;
  if (!t) return;
  var y = String(t).split('/')[0]; // 'YYYY/MM' -> 'YYYY'
  if (!yearBuckets[y]) { yearBuckets[y] = []; years.push(y); }
  yearBuckets[y].push(layer);
});

// sort years ascending (e.g., ["2023","2024"])
years.sort();

if (!years.length) {
  console.error("No years computed from dataset. Check your 'time' values (expect 'YYYY/MM').");
}

// 6) Slider control (jQuery UI) as a Leaflet control
var SliderCtl = L.Control.extend({
  options: { position: 'bottomleft' },
  onAdd: function (m) {
    this._map = m;
    // include Leaflet control classes so it positions/stylizes like a control
    var div = L.DomUtil.create('div', 'leaflet-control leaflet-bar sliderctl');
    div.style.zIndex = 1000;
    div.innerHTML =
      '<div class="label">Year: <span class="date" id="slider-date"></span></div>' +
      '<div id="slider-ui"></div>';
    L.DomEvent.disableClickPropagation(div);
    return div;
  },
  startSlider: function () {
    if (!years.length) return;

    // Build a per-year FeatureGroup cache on the control instance
    this._fgCache = {};                 // { "2023": L.featureGroup([...]), ... }
    for (var i = 0; i < years.length; i++) {
      var y = years[i];
      this._fgCache[y] = L.featureGroup(yearBuckets[y] || []);
    }

    var that = this;
    var $ui = $('#slider-ui');
    if (!$ui.length || typeof $ui.slider !== 'function') {
      console.error("jQuery UI slider not found. Make sure jQuery UI CSS/JS are loaded before script.js.");
      return;
    }

    $ui.slider({
      min: 0,
      max: years.length - 1,
      value: 0,
      step: 1,
      slide: function (_, ui) { that._update(ui.value); },
      change: function (_, ui) { that._update(ui.value); }
    });

    // initial render
    this._update(0);
  },
  // cumulative display: show all markers up to and including the selected year
_update: function (idx) {
  var that = this;

  // guard
  if (!years.length || idx < 0 || idx >= years.length) return;

  var selectedYear = years[idx];
  $('#slider-date').text(selectedYear);

  // remove any FeatureGroup currently on the map
  if (this._visibleFGs && this._visibleFGs.length) {
    this._visibleFGs.forEach(function(fg){ that._map.removeLayer(fg); });
  }
  this._visibleFGs = [];

  // add all years up to selected index (cumulative)
  for (var i = 0; i <= idx; i++) {
    var y = years[i];
    var fg = this._fgCache && this._fgCache[y];
    if (fg) {
      fg.addTo(this._map);
      this._visibleFGs.push(fg);
    }
  }

  // fit bounds to everything currently visible
  if (this._visibleFGs.length) {
    var combined = L.featureGroup(this._visibleFGs);
    var b = combined.getBounds && combined.getBounds();
    if (b && b.isValid && b.isValid()) {
      this._map.fitBounds(b.pad(0.15));
    }
  }
}

});

var sliderControl1 = new SliderCtl();
map.addControl(sliderControl1);
sliderControl1.startSlider();
// End of script.js