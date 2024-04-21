let map;
let markers = [];
let marker;

function loadGoogleMaps() {
  fetch('/api/maps-api-key')
    .then(response => response.text())
    .then(apiKey => {
      if (!apiKey) {
        console.error('Failed to load the Google Maps API key.');
        return;
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.onerror = () => console.error('Failed to load the Google Maps script.');
      document.head.appendChild(script);
    })
    .catch(err => console.error('Error loading the Google Maps script:', err));
}

function initMap() {
  const mapContainer = document.getElementById("map");
  map = new google.maps.Map(mapContainer, {
    center: { lat: 41.8781, lng: -87.6298 },
    zoom: 12,
  });

  marker = new google.maps.Marker({
    position: { lat: 41.8781, lng: -87.6298 },
    map: map,
    draggable: true
  });
  markers.push(marker);

  google.maps.event.addListener(map, 'click', function(event) {
    marker.setPosition(event.latLng);
    updateLocationInput(marker.getPosition());
  });

  marker.addListener('dragend', function() {
    updateLocationInput(marker.getPosition());
  });
}

function updateLocationInput(location) {
  document.getElementById('latitude').value = location.lat().toFixed(9);
  document.getElementById('longitude').value = location.lng().toFixed(9);
}

function searchLocation(event) {
  event.preventDefault();
  const latitude = parseFloat(document.getElementById('latitude').value);
  const longitude = parseFloat(document.getElementById('longitude').value);
  const radius = parseInt(document.getElementById('radius').value, 10);
  const email = document.getElementById('email').value;

  const dataToSend = {
    latitude,
    longitude,
    radius,
    email_address: email,
    crimeType: 'THEFT',
    crimeYear: new Date().getFullYear()
  };

  fetch('/submitSearch', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(dataToSend)
  })
  .then(response => response.json())
  .then(data => {
      console.log('Data submitted successfully:', data);
  })
  .catch(error => console.error('Failed to submit data:', error));
}

document.addEventListener('DOMContentLoaded', () => {
  loadGoogleMaps();
  document.getElementById('searchForm').addEventListener('submit', searchLocation);
});
