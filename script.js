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
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.47389, 42.72917] },
    properties:{ title:'Gungun — Baker Hall', description:'Baker Hall (source: topoquest.com)', time:'2023/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.487943, 42.728184] },
    properties:{ title:'Kiera — IM West', description:'IM West (spartancash.msu.edu)', time:'2024/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.48194, 42.72778] },
    properties:{ title:'Ritesh — Wells Hall', description:'Wells Hall (source: LatLong)', time:'2023/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.48174, 42.73489] },
    properties:{ title:'Gungun — Potbelly (233 E Grand River Ave)', description:'Potbelly (source: MapQuest)', time:'2023/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.479515, 42.725117] },
    properties:{ title:'Kiera — MSU Dairy Store (Anthony Hall, 474 S Shaw Ln)', description:'MSU Dairy Store (whereorg.com)', time:'2024/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.52883, 42.73587] },
    properties:{ title:'Ritesh — Olga’s Kitchen (Frandor, 354 Frandor Ave)', description:'Olga’s Kitchen – Frandor', time:'2023/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.50445, 42.768278] },
    properties:{ title:'Gungun — Meijer (1350 W Lake Lansing Rd)', description:'Meijer – Lake Lansing (maps.msu.edu)', time:'2023/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.483208, 42.730869] },
    properties:{ title:'Kiera — Main Library (366 W Circle Dr)', description:'Main Library (LatLong)', time:'2024/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.52633, 42.73479] },
    properties:{ title:'Ritesh — Staples (3003 E Michigan Ave)', description:'Staples (stores.staples.com)', time:'2023/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.482842, 42.702165] },
    properties:{ title:'Gungun — Sansu (4750 S Hagadorn Rd)', description:'Sansu (Yelp)', time:'2023/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.49543, 42.73149] },
    properties:{ title:'Kiera — Brody Square', description:'Brody Square (Mapcarta)', time:'2024/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.551557, 42.734973] },
    properties:{ title:'Ritesh — Summit Comics & Games (216 S Washington Sq)', description:'Summit Comics & Games (downtownlansing.org)', time:'2023/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.48253, 42.73586] },
    properties:{ title:'Gungun — Jolly Pumpkin (218 Albert Ave)', description:'Jolly Pumpkin (MapQuest)', time:'2023/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.47928, 42.72708] },
    properties:{ title:'Kiera — Erickson Hall', description:'Erickson Hall (Mapcarta)', time:'2024/09' } },
  { type:'Feature', geometry:{ type:'Point', coordinates:[-84.47899, 42.72529] },
    properties:{ title:'Ritesh — MSU Tech Store (Computer Center, 450 Auditorium Rd)', description:'MSU Tech Store (maps.msu.edu)', time:'2023/09' } }
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

// 4) Marker rendering
var group1 = L.geoJSON(dataset1, {
  onEachFeature: onEachFeature,
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng);
  }
}).addTo(map);

// 5) Slider logic — group markers by season+year and toggle visibility per bucket
var buckets = {};       // e.g., { "Fall 2023": [L.Marker, ...], "Fall 2024":[...] }
var labels = [];

group1.eachLayer(function (layer) {
  var t = layer.feature && layer.feature.properties && layer.feature.properties.time;
  if (!t) return;
  var parts = String(t).split('/'); // ['YYYY','MM']
  var y = parts[0];
  var m = parseInt(parts[1], 10) || 1;

  // Season rules
  var season;
  if (m >= 3 && m <= 5) season = "Spring";
  else if (m >= 6 && m <= 8) season = "Summer";
  else if (m >= 9 && m <= 11) season = "Fall";
  else season = "Winter";

  var label = season + " " + y;

  if (!buckets[label]) { buckets[label] = []; labels.push(label); }
  buckets[label].push(layer);
});

// Sort labels chronologically by year then season order
var seasonOrder = { "Winter": 0, "Spring": 1, "Summer": 2, "Fall": 3 };
labels.sort(function(a, b){
  var ay = parseInt(a.split(' ')[1], 10);
  var by = parseInt(b.split(' ')[1], 10);
  if (ay !== by) return ay - by;
  var as = a.split(' ')[0], bs = b.split(' ')[0];
  return (seasonOrder[as] - seasonOrder[bs]);
});

if (!labels.length) {
  console.error("No time labels computed from dataset. Check your 'time' values (expect 'YYYY/MM').");
}

// 6) Slider control (jQuery UI) as a Leaflet control
var SliderCtl = L.Control.extend({
  options: { position: 'bottomleft' },
  onAdd: function (m) {
    this._map = m;
    // Important: include Leaflet control classes
    var div = L.DomUtil.create('div', 'leaflet-control leaflet-bar sliderctl');
    // Raise above map/fixed footer if needed
    div.style.zIndex = 1000;

    div.innerHTML =
      '<div class="label">Period: <span class="date" id="slider-date"></span></div>' +
      '<div id="slider-ui"></div>';

    L.DomEvent.disableClickPropagation(div);
    return div;
  },
  startSlider: function () {
    if (!labels.length) {
      console.warn("Slider has no labels; not initializing.");
      return;
    }
    var that = this;

    // init jQuery UI slider
    var $ui = $('#slider-ui');
    if (!$ui.length || typeof $ui.slider !== 'function') {
      console.error("jQuery UI slider not found. Make sure jQuery UI CSS/JS are included before script.js.");
      return;
    }

    $ui.slider({
      min: 0,
      max: labels.length - 1,
      value: 0,
      step: 1,
      slide: function (_, ui) { that._update(ui.value); },
      change: function (_, ui) { that._update(ui.value); }
    });

    // initial render
    this._update(0);
  },
  _update: function (idx) {
    var label = labels[idx];
    if (!label) return;

    // Update label
    $('#slider-date').text(label);

    // Hide all visible markers
    group1.eachLayer(function (l) { if (map.hasLayer(l)) map.removeLayer(l); });

    // Show chosen period markers
    var list = buckets[label] || [];
    list.forEach(function (l) { l.addTo(map); });

    // Fit bounds to visible markers for this period
    var fg = L.featureGroup(list);
    if (fg.getBounds && fg.getBounds().isValid()) {
      map.fitBounds(fg.getBounds().pad(0.15));
    }
  }
});

var sliderControl1 = new SliderCtl();
map.addControl(sliderControl1);
sliderControl1.startSlider();

// 7) Extra sanity checks in console
if (L.version && /^1\.7\./.test(L.version)) {
  console.warn('Leaflet 1.7.x detected. Remove 1.7.1 CSS/JS from <head> and keep only 1.9.4.');
}
if (typeof jQuery === 'undefined') {
  console.error('jQuery is not loaded.');
} else if (typeof jQuery.ui === 'undefined') {
  console.error('jQuery UI is not loaded (required for the slider).');
}
console.log('Slider labels:', labels);
