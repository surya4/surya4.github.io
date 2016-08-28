var map;
var clientID;
var clientSecret;
var markers = [];

// stating init map
function initMap(){
  map = new google.maps.Map(document.getElementById('map'),{
    center : {lat: 12.938533, lng:77.630817 },

  });

  var locations = [
    {title: 'Oasis Center', location: {lat: 12.9375433,lng: 77.6280165}},
    {title: 'Barleyz', location: {lat: 12.9376218,lng: 77.6269792}},
    {title: 'HDFC Bank ATM', location: {lat: 12.9386243,lng: 77.6304922}},
    {title: 'Food Affairs', location: {lat: 12.9383949,lng: 77.6304051}},
    {title: 'Bak Bak Bar', location: {lat: 12.9380433,lng: 77.6277269}},
  ];

var largeinfowindow = new google.maps.InfoWindow();
var bounds = new google.maps.LatLngBounds();

for (var i = 0; i < locations.length; i++) {
  var position = locations[i].location;
  var title = locations[i].title;
  var marker = new google.maps.Marker({
    map: map,
    position: position,
    title: title,
    animation: google.maps.Animation.DROP,
    id: i
  });
  markers.push(marker);
  marker.addListener('click', function(){
    populateInfoWindow(this, largeinfowindow)
  });
  bounds.extend(markers[i].position);
}
map.fitBounds(bounds);
//closing initmap function
}

// function populate window
function populateInfoWindow(marker, infowindow){
  if (infowindow.marker!=marker) {
    infowindow.marker = marker;
    infowindow.setContent(marker.title);
    infowindow.open(map,marker);
    infowindow.addListener('closeclick', function(){
      infowindow.marker(null);
    });
  }
}
