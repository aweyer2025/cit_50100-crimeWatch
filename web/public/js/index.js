let map;
let markers = [];

function loadGoogleMaps() {
    fetch('/api/maps-api-key')
        .then(response => response.text())
        .then(apiKey => {
            if (!apiKey) {
                console.error('Failed to load the Google Maps API key.');
                return;
            }

            // Create a new script element for Google Maps API
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        })
        .catch(err => {
            console.error('Error loading the Google Maps script:', err);
        });
}

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 41.8781, lng: -87.6298 },
        zoom: 12,
    });

// data changes as you zoom in
map.addListener('zoom_changed',()=>{

let zoom = map.getZoom();
markers.forEach(marker =>{
  if(zoom>15){
    marker.setMap(map);
  }else{
    marker.setMap(null);
  }
});
});
}

function searchLocation() {
  const location = document.getElementById('location').value || 'Chicago, IL';
  const radius = document.getElementById('radius').value;
  const email = document.getElementById('email').value;

    
  const db = firebase.firestore();
  db.collection('userSearches').add({
    email: email,
    location: location,
    radius: radius,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
}


document.addEventListener('DOMContentLoaded', () => {
    loadGoogleMaps(); 
    document.getElementById('submit').addEventListener('click', searchLocation);

});
