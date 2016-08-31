// global variable declaration
'use strict';
var map;
var markers = [];
var fs = 'https://api.foursquare.com/v2/venues/search?client_id=' +
    'RXTKNR13PAJ1HTJ5C0S5G0FR4OANS3A3XFWNLIGDGNN3Q0VX' +
    '&client_secret=OZSMXEMARDPACMGMTUEXHVGLG1QDD123JB4TLHD0SYYCKFP0';
// initialize map

function initMap() {
    var mapOptions = {
        zoom: 18,
        center: new google.maps.LatLng(12.9382328, 77.6289805)
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    console.log("calling apply bindings");
    ko.applyBindings(new AppViewModel());
}

// listing to be displayed

var placeArray = [{
    name: 'Oasis Center',
    lat: 12.9375433,
    long: 77.6280165
}, {
    name: 'Barleyz',
    lat: 12.9376218,
    long: 77.6269792
}, {
    name: 'HDFC Bank ATM',
    lat: 12.9386243,
    long: 77.6304922
}, {
    name: 'Food Affairs',
    lat: 12.9383949,
    long: 77.6304051
}, {
    name: 'Bak Bak Bar',
    lat: 12.9380433,
    long: 77.6277269
}];

// setting up data for info Window
var Location = function(data) {
    var filteredList = placeArray;
    var self = this;
    this.name = data.name;
    this.lat = data.lat;
    this.long = data.long;
    this.URL = "";
    this.address = this.street + this.city;
    this.phone = "";
    this.visible = ko.observable(true);

    // set up foursquare url

    var fsurl = fs +
        '&v=20140806' + '&ll=' + data.lat + ',' +
        data.long + '&query=\'' + data.name + '\'&limit=1';

    $.getJSON(fsurl).done(function(data) {
        var results = data.response.venues[0];
        self.URL = results.url;
        self.address = results.location.formattedAddress[0] +
            results.location.formattedAddress[1];
        self.phone = results.contact.phone;
    });

    this.infoWindow = new google.maps.InfoWindow({
        content: self.contentString
    });

    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.long),
        map: map,
        title: data.name
    });

    this.showMarker = ko.computed(function() {
        if (this.visible() === true) {
            this.marker.setMap(map);
        } else {
            this.marker.setMap(null);
        }
        return true;
    }, this);



    this.marker.addListener('click', function() {
        self.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>" +
            '<div class="content"><a href="' + self.URL + '">' + self.URL + "</a></div>" +
            '<div class="content">' + self.address + "</div>" +
            '<div class="content"><a href="tel:' + self.phone + '">' + self.phone + "</a></div></div>";

        self.infoWindow.setContent(self.contentString);

        self.infoWindow.open(map, this);
    });

    this.bounce = function(place) {
        google.maps.event.trigger(self.marker, 'click');
    };
};

function AppViewModel() {
    var self = this;
    self.locationList = ko.observableArray([]);

    placeArray.forEach(function(locationItem) {
        self.locationList.push(new Location(locationItem));
    });

    self.searchItem = ko.observable("");

    self.filteredList = this.filteredList = ko.computed(function() {
        var filter = self.searchItem().toLowerCase().trim();
        var fileteredArr = [];
        self.locationList().forEach(function(locationItem) {
          if(filter && locationItem.name.toLowerCase().search(filter) >= 0) {
            locationItem.visible(true);
            fileteredArr.push(locationItem);
          } else {
            locationItem.visible(false);
            if(!filter) {
              fileteredArr.push(locationItem);
            }
          }
        });
        return fileteredArr;

    }, self);

    //self.filteredList();

}

// initialize app
// exception handling

function googleError() {
    alert("Page has failed to load. Please check your internet connection and try again.");
}
