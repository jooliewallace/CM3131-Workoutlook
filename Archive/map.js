
let polyline = null;
let path = [];

document.getElementById('draw-route-btn').addEventListener('click', () => {
  polyline = new google.maps.Polyline({
    map: map,
    path: path,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 3
  });

  map.addListener('click', (event) => {
    path.push(event.latLng);
    polyline.setPath(path);
  });
});

function initMap() {
  const mapElement = document.getElementById('map');
  const map = new google.maps.Map(mapElement, {
    center: {lat: 37.7749, lng: -122.4194},
    zoom: 10
  });
}




  