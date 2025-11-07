// Mapping East Lansing Memories — main JS
// Works with your HTML (#map) and CSS. No external slider plugin required.

// 1) Map + tiles
var map = L.map('map').setView([42.7347, -84.4856], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// --- custom image markers that scale with zoom ---
const OWNER_IMAGE = {
  'Gungun': 'images/GungunMarker.png',
  'Kiera': 'images/KieraMarker.png',
  'Ritesh': 'images/RiteshMarker.png'
};

// pick a marker image by owner (from "Owner — Place")
function ownerFromTitle(title) {
  return (title || '').split('—')[0].trim();
}

// size for the current zoom (tweak numbers to taste)
function sizeForZoom(z) {
  // clamps between 22–56 px, grows roughly with zoom
  const s = 10 + (z * 3);
  return Math.max(22, Math.min(56, Math.round(s)));
}

// build a DivIcon that wraps your PNG (lets us add CSS drop-shadow easily)
function buildImageIcon(owner, zoom) {
  const src = OWNER_IMAGE[owner] || 'Assets/gungunMarker.png'; // fallback
  const size = sizeForZoom(zoom);

  return L.divIcon({
    className: 'mem-img-marker',
    html: `<img src="${src}" alt="${owner} marker" style="width:${size}px;height:${size}px;display:block;filter:drop-shadow(0 1px 2px rgba(0,0,0,.45))"/>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2], // center the image
    popupAnchor: [0, -size / 2]
  });
}


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
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-84.47389, 42.72917] },
    properties: {
      title: 'Gungun — Baker Hall',
      description: 'Baker Hall was where it all began, the first time I met my cohort and the professors in the Department of Anthropology. We introduced ourselves and shared our research interests—realizing how our diverse experiences connected us in unexpected ways.',
      time: '2023/09',
      img: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/MSU_Baker_Hall.jpg?20060113185803',
      link: 'https://virtualtour.msu.edu/tour/social-cultural-studies/baker-hall/',
      linkText: 'Read more'
    }
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-84.48174, 42.73489] },
    properties: {
      title: 'Gungun — Potbelly (233 E Grand River Ave)',
      description: 'My first meal in East Lansing was at Potbelly. A senior picked me up from the airport and brought me here—over sandwiches, the unfamiliar began to feel welcoming.',
      time: '2023/09',
      img: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSyriJxkCBFYUINrt1kHiNrVGuzmitF5fIuKN4rNj45Xi4_Flbks7r_6zefd_3rsHCYiQ8tGsukirWHxp01VD9-YS-hE7UFYHf_5rKQSbXVmrPGoYlVJkzxfqhN9SFxGMI4D4qBg-Q=s1360-w1360-h1020-rw',
      link: 'https://www.potbelly.com/locations/michigan/msu',
      linkText: 'Read more'
    }
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-84.50445, 42.768278] },
    properties: {
      title: 'Gungun — Meijer (1350 W Lake Lansing Rd)',
      description: 'My first grocery trip to Meijer felt like an adventure—the store seemed endless. I bought more than I could carry and learned to shop smarter next time!',
      time: '2023/09',
      img: 'https://s3-media0.fl.yelpcdn.com/bphoto/1g5swHCqk7GbaY7lBIKPSA/348s.jpg',
      link: 'https://www.meijer.com/shopping/store-locator/52.html',
      linkText: 'Read more'
    }
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-84.482842, 42.702165] },
    properties: {
      title: 'Gungun — Sansu (4750 S Hagadorn Rd)',
      description: 'Sansu was where I tried sushi for the first time with the first friend I made in my cohort—lots of laughter over chopsticks and stories of home.',
      time: '2023/09',
      img: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxvE9PX7Rxo6bOQXHqJ4uJ3u57sWtuvbckSW8uTXrw4e2hj8XxUesVxPkC9RHCdU6MeVW8yftHzHGpuPUidPWtJ-SaITuXLnZJ7uPrOkUs6w_eTcSg0k3tqPErwba6gFk-bMtRllA=s1360-w1360-h1020-rw',
      link: 'https://sansu-sushi.com/',
      linkText: 'Read more'
    }
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-84.48253, 42.73586] },
    properties: {
      title: 'Gungun — Jolly Pumpkin (218 Albert Ave)',
      description: 'I met my supervisors here during my first week in East Lansing. Over good food and easy conversation, I felt supported and excited for the journey ahead.',
      time: '2023/09',
      img: 'https://www.lansingstatejournal.com/gcdn/presto/2023/05/26/PLSJ/ae41ee1e-2368-435d-9a6b-dc9612496ec2-230526_el_business_015a.JPG',
      link: 'https://www.jollypumpkin.com/',
      linkText: 'Read more'
    }
  },

  // Ritesh — 2023
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-84.48194, 42.72778] },
    properties: {
      title: 'Ritesh — Wells Hall',
      description: 'Wells Hall, home to English and the humanities, was the first building I visited on campus—nervous and thrilled to finally be at MSU.',
      time: '2023/09',
      img: 'https://virtualtour.msu.edu/wp-content/uploads/2020/08/wells-hall-3-featured.jpg',
      link: 'https://virtualtour.msu.edu/tour/social-cultural-studies/wells-hall/',
      linkText: 'Read more'
    }
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-84.52883, 42.73587] },
    properties: {
      title: 'Ritesh — Olga’s Kitchen (Frandor, 354 Frandor Ave)',
      description: 'One of the first restaurants I tried with my cohort and seniors—simple conversations that made the start of grad life feel exciting.',
      time: '2023/09',
      img: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSx4_EuCAJpCL-7ME5ouTVFPt_Sv55T2nP0z-oN8KsloMOOTmEuyZ2my4mkMBT1o3G2lGQDYek_5dicEdkniuC1gER21oaoF8ObVjjjS8GNEDqEAefUIM50Ww9PF-g8m9AOF4Yrb8Q=s1360-w1360-h1020-rw',
      link: 'https://en.wikipedia.org/wiki/Olga%27s_Kitchen',
      linkText: 'Read more'
    }
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-84.52633, 42.73479] },
    properties: {
      title: 'Ritesh — Staples (3003 E Michigan Ave)',
      description: 'I first visited Staples in my first week. Browsing notebooks and pens became a small ritual that brightened tough days.',
      time: '2023/09',
      img: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxeUJekaChwS29IXqrO6dmmpVnFeHpnIFff6VBuFibr08pxXgn-h5MsK8e78TfPzMlgxt0LnA2dbPgF2KOOdU27cD5dQ7h-1KrboMTo7OubUoSCrUMkXZXmt3yAaamqRFI53ao=w243-h203-n-k-no-nu',
      link: 'https://stores.staples.com/mi/lansing/3003-east-michigan-ave',
      linkText: 'Read more'
    }
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-84.551557, 42.734973] },
    properties: {
      title: 'Ritesh — Summit Comics & Games (216 S Washington Sq)',
      description: 'As a comics fan, this was a priority in my first week. The shelves felt like a familiar world—art, stories, and community.',
      time: '2023/09',
      img: 'https://www.lansingstatejournal.com/gcdn/presto/2020/11/20/PLSJ/bc2ee93d-2e84-4cea-83f1-aee3d5f9014a-201119_summit_comics_022a.JPG',
      link: 'https://www.summitlansing.com/',
      linkText: 'Read more'
    }
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-84.47899, 42.72529] },
    properties: {
      title: 'Ritesh — MSU Tech Store (Computer Center, 450 Auditorium Rd)',
      description: 'I first visited to compare laptops and student discounts. Two years later, finally getting one felt like a small full-circle win.',
      time: '2023/09',
      img: 'https://tech.msu.edu/wp-content/uploads/2015/06/banner-technology-services-2015.jpg',
      link: 'https://techstore.msu.edu/',
      linkText: 'Read more'
    }
  },

  // Kiera — 2024
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-84.487943, 42.728184] },
    properties: {
      title: 'Kiera — IM West',
      description: 'On my first day of the fall semester, I went to IM West determined to start fresh. Senior students showed me around—what began as a quick visit turned into stories, laughter, and a sense of community.',
      time: '2024/09',
      img: 'https://ipf.msu.edu/sites/default/files/styles/full_width_1300px_/public/MSU%20Cam%20003.jpg?itok=f4HHdvqr',
      link: 'https://recsports.msu.edu/facilities/im-west',
      linkText: 'Read more'
    }
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-84.479515, 42.725117] },
    properties: {
      title: 'Kiera — MSU Dairy Store (Anthony Hall, 474 S Shaw Ln)',
      description: 'A favorite early memory: visiting the MSU Dairy Store with a new friend. Big cones, long conversations—East Lansing started to feel like home.',
      time: '2024/09',
      img: 'https://spartanyouth.msu.edu/media/vsbnmwaj/msu-dairy-store.jpg',
      link: 'https://msudairystore.com/',
      linkText: 'Read more'
    }
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-84.483208, 42.730869] },
    properties: {
      title: 'Kiera — Main Library (366 W Circle Dr)',
      description: 'During an OISS scavenger hunt, I explored the library’s corners, got a little lost, found new study spots, and met friends.',
      time: '2024/09',
      img: 'https://lib.msu.edu/sites/default/files/news-article/msu-libraries-and-taylor-francis-announce-new-open-access-partnership-news-article/Michigan-State-University-Library-scaled.jpg',
      link: 'https://virtualtour.msu.edu/tour/campus-highlights-tour/msu-library/',
      linkText: 'Read more'
    }
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-84.49543, 42.73149] },
    properties: {
      title: 'Kiera — Brody Square',
      description: 'Brody Square was the first dining hall I tried and quickly a favorite. The pizza really did live up to the hype!',
      time: '2024/09',
      img: 'https://liveon.msu.edu/sites/default/files/2018-03/Brody-Neigh.png',
      link: 'https://eatatstate.msu.edu/menu/Brody%20Square',
      linkText: 'Read more'
    }
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-84.47928, 42.72708] },
    properties: {
      title: 'Kiera — Erickson Hall',
      description: 'Erickson Hall was the first building I stepped into at MSU. Waiting in the lobby, I recognized names from emails—this was the start of our cohort.',
      time: '2024/09',
      img: 'https://create4stem.msu.edu/sites/default/files/2024-08/erickson.jpg',
      link: 'https://virtualtour.msu.edu/tour/education-public-services/erickson-hall/',
      linkText: 'Read more'
    }
  }
];



// 3) Popup templating — styled version
function onEachFeature(feature, layer) {
  const p = feature.properties || {};
  const place = (p.title || '').replace(/^[^—]+—\s*/, '').trim();

  // (1) description
  const descHtml = p.description
    ? `<p class="pp-desc">${p.description}</p>`
    : '';

  // (2) image (optional)
  const imgHtml = p.img
    ? `<figure class="pp-media">
         <img src="${p.img}" alt="${place} (photo)" loading="lazy">
       </figure>`
    : '';

  // (3) custom link (wiki / gmaps)
  // allow custom label; fall back to smart defaults
  let label = p.linkText;
  if (!label && p.link) {
    if (/wikipedia\.org/i.test(p.link)) label = 'View on Wikipedia';
    else if (/google\.[^/]+\/maps/i.test(p.link)) label = 'Open in Google Maps';
    else label = 'Learn more';
  }
  const linkHtml = p.link
    ? `<p class="pp-link">
         <a href="${p.link}" target="_blank" rel="noopener">${label} ↗</a>
       </p>`
    : '';

  const html = `
    <article class="popup-card">
      <header class="pp-header">
        <h4 class="pp-title">${place}</h4>
        ${p.time ? `<span class="pp-time">${p.time}</span>` : ''}
      </header>
      ${descHtml}
      ${imgHtml}
      ${linkHtml}
    </article>
  `;

  layer.bindPopup(html, { className: 'custom-popup', closeButton: true, autoClose: true });
}



// 4) Marker rendering (do NOT add to map yet — the slider controls visibility)
var group1 = L.geoJSON(dataset1, {
  onEachFeature: onEachFeature,
  pointToLayer: function (feature, latlng) {
    const owner = ownerFromTitle(feature.properties && feature.properties.title);
    return L.marker(latlng, {
      icon: buildImageIcon(owner, map.getZoom()),
      alt: (feature.properties?.title || 'Memory')
    });
  }
});

function updateMarkerSizes() {
  const z = map.getZoom();
  group1.eachLayer(function (marker) {
    if (!map.hasLayer(marker)) return; // only update visible markers
    const owner = ownerFromTitle(marker.feature?.properties?.title);
    marker.setIcon(buildImageIcon(owner, z));
  });
}

map.on('zoomend', updateMarkerSizes);


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
      this._visibleFGs.forEach(function (fg) { that._map.removeLayer(fg); });
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
    // keep icons sized correctly after we (re)add layers
    updateMarkerSizes();
  }



});

var sliderControl1 = new SliderCtl();
map.addControl(sliderControl1);
sliderControl1.startSlider();
// End of script.js