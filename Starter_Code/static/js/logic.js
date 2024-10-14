// Create the map
let map = L.map("map").setView([40.000, -110.0000], 5);
// Initialize tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 15,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
// Define the URL for earthquake data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
// Fetch the GeoJSON data
fetch(url)
    .then(response => response.json())
    .then(data => {
        // Loop through each earthquake feature
        data.features.forEach(feature => {
            // Get coordinates and properties
            let coords = feature.geometry.coordinates;
            let magnitude = feature.properties.mag;
            let location = feature.properties.place;
            let depth = coords[2]; // Depth in km
            let depthColor = getDepthColor(depth); // Color based on depth
            // Create a marker for each earthquake
            L.circleMarker([coords[1], coords[0]], {
                radius: magnitude * 4,
                color: depthColor,
                fillOpacity: 0.5
            })
            .bindPopup(`<strong>Magnitude: ${magnitude}</strong><br>Depth: ${depth} km<br>${location}`)
            .addTo(map);
        });
    })
    .catch(error => console.error('Error fetching earthquake data:', error));
// Function to determine color based on depth
function getDepthColor(depth) {
    return depth > 70 ? '#FF0000' : // red for deep earthquakes (> 70 km)
           depth > 30 ? '#FFA500' : // orange for medium depth (30-70 km)
           depth > 0  ? '#FFFF00' : // yellow for shallow (0-30 km)
           '#00FF00'; // green for no depth 
}
// Function to create and add the legend to the map
function addLegend() {
    let legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend');
        div.innerHTML += '<h4>Earthquake Magnitude & Depth</h4>';
        div.innerHTML += '<i style="background: #FF0000;"></i> Depth > 70 km <br>';
        div.innerHTML += '<i style="background: #FFA500;"></i> Depth 30 - 70 km <br>';
        div.innerHTML += '<i style="background: #FFFF00;"></i> Depth 0 - 30 km <br>';
        div.innerHTML += '<i style="background: #00FF00;"></i> Depth < 0 km <br>';
        return div;
    };
    legend.addTo(map);
}
// Call the function to add the legend
addLegend();










