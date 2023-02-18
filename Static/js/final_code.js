// Ensure JavaScript is working

console.log("Working");

// Create tile layer

let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});


let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

// Create maps variable
let baseMaps = {
    "Satellite": satelliteStreets,
    "Streets": streets
};

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
    center: [39.5, -98.5],
    zoom: 3,
    layers: [streets]
});

// Create the earthquake layer for our map.
let earthquakes = new L.layerGroup();

// Earthquake overlays
let overlays = {
    Earthquakes: earthquakes
};


L.control.layers(baseMaps, overlays).addTo(map);

// Retrieve the earthquake GeoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {


    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // The radius of an earthquake marker is 4 times its magnitude
    // If an earthquake has a magnitude of 0, its marker will have radius 1
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }

        return magnitude * 4;
    }

    // Get color based on magnitude

    function getColor(magnitude) {

        if (magnitude > 5) {
            return "#ea2c2c";
        }

        if (magnitude > 4) {
            return "#ea822c";
        }

        if (magnitude > 3) {
            return "#ee9c00";
        }

        if (magnitude > 2) {
            return "#eecc00";
        }

        if (magnitude > 1) {
            return "#d4ee00";
        }

        return "#98ee00";
    }

    // Creating a GeoJSON layer with the retrieved data.
    L.geoJSON(data, {
        // turn each feature into a CircleMarker
        pointToLayer: function (feature, latlng) {
            console.log(feature);
            return L.circleMarker(latlng);
        },
        // add style
        style: styleInfo,
        // add popup tooltips
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`Magnitude: ${feature.properties.mag} <br /> Location: ${feature.properties.place}`);
        }
    }).addTo(earthquakes);


    // add earthquakes layer to map
    earthquakes.addTo(map);

    var legend = L.control({
        position: 'bottomright'
    });


    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend');
        const magnitudes = [0, 1, 2, 3, 4, 5];
        const colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
        ];

        // loop through the colors and magnitudes arrays
        for (var i = 0; i < magnitudes.length; i++) {
            console.log(colors[i]);
            div.innerHTML +=
                "<i style='background: " + colors[i] + "'></i> " +
                magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
        }

        console.log(div.innerHTML);
        return div;
    };

    legend.addTo(map);


});