let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 41.8781, lng: -87.6298 },
    zoom: 12,
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

google.maps.event.addDomListener(window, 'load', initMap);