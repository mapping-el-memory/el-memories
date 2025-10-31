// 1) Map + tiles
var map = L.map('map').setView([42.7347, -84.4856], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// 2) Data (unchanged)
var dataset1 = [
    {
        type: 'Feature', geometry: { type: 'Point', coordinates: [-84.47389, 42.72917] },
        properties: { title: 'Gungun — Baker Hall', description: 'Baker Hall (source: topoquest.com)', time: '2023/09' }
    },
    {
        type: 'Feature', geometry: { type: 'Point', coordinates: [-84.487943, 42.728184] },
        properties: { title: 'Kiera — IM West', description: 'IM West (spartancash.msu.edu)', time: '2024/09' }
    },
    {
        type: 'Feature', geometry: { type: 'Point', coordinates: [-84.48194, 42.72778] },
        properties: { title: 'Ritesh — Wells Hall', description: 'Wells Hall (source: LatLong)', time: '2023/09' }
    },
    {
        type: 'Feature', geometry: { type: 'Point', coordinates: [-84.48174, 42.73489] },
        properties: { title: 'Gungun — Potbelly (233 E Grand River Ave)', description: 'Potbelly (source: MapQuest)', time: '2023/09' }
    },
    {
        type: 'Feature', geometry: { type: 'Point', coordinates: [-84.479515, 42.725117] },
        properties: { title: 'Kiera — MSU Dairy Store (Anthony Hall, 474 S Shaw Ln)', description: 'MSU Dairy Store (whereorg.com)', time: '2024/09' }
    },
    {
        type: 'Feature', geometry: { type: 'Point', coordinates: [-84.52883, 42.73587] },
        properties: { title: 'Ritesh — Olga’s Kitchen (Frandor, 354 Frandor Ave)', description: 'Olga’s Kitchen – Frandor', time: '2023/09' }
    },
    {
        type: 'Feature', geometry: { type: 'Point', coordinates: [-84.50445, 42.768278] },
        properties: { title: 'Gungun — Meijer (1350 W Lake Lansing Rd)', description: 'Meijer – Lake Lansing (maps.msu.edu)', time: '2023/09' }
    },
    {
        type: 'Feature', geometry: { type: 'Point', coordinates: [-84.483208, 42.730869] },
        properties: { title: 'Kiera — Main Library (366 W Circle Dr)', description: 'Main Library (LatLong)', time: '2024/09' }
    },
    {
        type: 'Feature', geometry: { type: 'Point', coordinates: [-84.52633, 42.73479] },
        properties: { title: 'Ritesh — Staples (3003 E Michigan Ave)', description: 'Staples (stores.staples.com)', time: '2023/09' }
    },
    {
        type: 'Feature', geometry: { type: 'Point', coordinates: [-84.482842, 42.702165] },
        properties: { title: 'Gungun — Sansu (4750 S Hagadorn Rd)', description: 'Sansu (Yelp)', time: '2023/09' }
    },
    {
        type: 'Feature', geometry: { type: 'Point', coordinates: [-84.49543, 42.73149] },
        properties: { title: 'Kiera — Brody Square', description: 'Brody Square (Mapcarta)', time: '2024/09' }
    },
    {
        type: 'Feature', geometry: { type: 'Point', coordinates: [-84.551557, 42.734973] },
        properties: { title: 'Ritesh — Summit Comics & Games (216 S Washington Sq)', description: 'Summit Comics & Games (downtownlansing.org)', time: '2023/09' }
    },
    {
        type: 'Feature', geometry: { type: 'Point', coordinates: [-84.48253, 42.73586] },
        properties: { title: 'Gungun — Jolly Pumpkin (218 Albert Ave)', description: 'Jolly Pumpkin (MapQuest)', time: '2023/09' }
    },
    {
        type: 'Feature', geometry: { type: 'Point', coordinates: [-84.47928, 42.72708] },
        properties: { title: 'Kiera — Erickson Hall', description: 'Erickson Hall (Mapcarta)', time: '2024/09' }
    },
    {
        type: 'Feature', geometry: { type: 'Point', coordinates: [-84.47899, 42.72529] },
        properties: { title: 'Ritesh — MSU Tech Store (Computer Center, 450 Auditorium Rd)', description: 'MSU Tech Store (maps.msu.edu)', time: '2023/09' }
    }
];

// 3) Popup templating
var optionsObject = { onEachFeature: onEachFeature };
function onEachFeature(feature, layer) {
    var content = "<div style='clear: both'></div>" +
        "<div><h4>" + feature.properties.title + "</h4>" +
        "<p>" + feature.properties.time + "</p>" +
        "<p>" + feature.properties.description + "</p></div>";
    layer.bindPopup(content, { closeButton: true });
}

// 4) Group 1
var group1 = L.geoJSON(dataset1, optionsObject);

// 5) Load external data for group2, then build the slider
$.getJSON("data/popups.json")
    .done(function (json) {
        console.log("Loaded data/popups.json");
        var group2 = L.geoJSON(json, optionsObject);

        // Group-level times for the multi-group slider
        group1.options.time = "2023";
        group2.options.time = "2024";

        var multiLayers = L.layerGroup([group1, group2]);

        if (!L.control || !L.control.sliderControl) {
            console.error("Leaflet sliderControl plugin is missing.");
            return;
        }

        var sliderControl1 = L.control.sliderControl({
            layer: multiLayers,
            alwaysShowDate: true,
            showAllPopups: false,
            showPopups: false
        });

        map.addControl(sliderControl1);
        sliderControl1.startSlider();           // <-- REQUIRED
        console.log("Slider started (multiLayers).");
    })
    .fail(function (err) {
        console.warn("Could not load data/popups.json; falling back to group1 only.", err);

        group1.options.time = "2023";

        if (!L.control || !L.control.sliderControl) {
            console.error("Leaflet sliderControl plugin is missing.");
            return;
        }

        var sliderControl1 = L.control.sliderControl({
            layer: group1,
            alwaysShowDate: true,
            showAllPopups: false,
            showPopups: false
        });

        map.addControl(sliderControl1);
        sliderControl1.startSlider();           // <-- REQUIRED
        console.log("Slider started (group1 fallback).");
    });
