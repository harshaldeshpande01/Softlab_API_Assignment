// grab all elements needed
let latitudeText = document.querySelector('.latitude');
let longitudeText = document.querySelector('.longitude');
let timeText = document.querySelector('.time');
let speedText = document.querySelector('.speed');
let altitudeText = document.querySelector('.altitude');
let visibilityText = document.querySelector('.visibility');

/* default latitude and longitude. Here lat and long is for "London" */
let lat = 18.516726;
let long = 73.856255;
let zoomLevel = 4;

// set iss.png image as Marker
const icon = L.icon({
  iconUrl: './img/iss.png',
  iconSize: [90, 45],
  iconAnchor: [25, 94],
  popupAnchor: [20, -86]
});

// drawing map interface on #map-div
const map = L.map('map-div').setView([lat, long], zoomLevel);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/dark-v10',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: "pk.eyJ1IjoiaGFyc2hhbDEyIiwiYSI6ImNrbjRxemN0aDBsdG0ydm8wdzVpdHM3MXMifQ.Vn8l3j-1nNSd_tSR2CheqQ"
}).addTo(map);

// adding the Marker to map
const marker = L.marker([lat, long], { icon: icon }).addTo(map);

// findISS() function definition
function findISS() {
  fetch("https://api.wheretheiss.at/v1/satellites/25544")
  .then(response => response.json())
  .then(data => {
    lat = data.latitude.toFixed(2);
    long = data.longitude.toFixed(2);
    // console.log(data);
    // convert seconds to milliseconds, then to UTC format
    const timestamp = new Date(data.timestamp * 1000).toUTCString();
    const speed = data.velocity.toFixed(2);
    const altitude = data.altitude.toFixed(2);
    const visibility = data.visibility;

    // call updateISS() function to update things
    updateISS(lat, long, timestamp, speed, altitude, visibility);
  })
  .catch(e => console.log(e));
}

// updateISS() function definition
function updateISS(lat, long, timestamp, speed, altitude, visibility) {
  // updates Marker's lat and long on map
  marker.setLatLng([lat, long]);
  // updates map view according to Marker's new position
  map.setView([lat, long]);
  // updates other element's value
  latitudeText.innerText = lat;
  longitudeText.innerText = long;
  timeText.innerText = timestamp;
  speedText.innerText = `${speed} km/hr`;
  altitudeText.innerText = `${altitude} km`;
  visibilityText.innerText = visibility;
}

/* call findISS() initially to immediately set the ISS location */
findISS();

// call findISS() for every 2 seconds
setInterval(findISS, 500);
