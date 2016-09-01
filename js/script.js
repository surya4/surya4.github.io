// global variable declaration
'use strict';
var map;

// spliting up the foursquare url
var fs = 'https://api.foursquare.com/v2/venues/search?client_id=' +
    'RXTKNR13PAJ1HTJ5C0S5G0FR4OANS3A3XFWNLIGDGNN3Q0VX' +
    '&client_secret=OZSMXEMARDPACMGMTUEXHVGLG1QDD123JB4TLHD0SYYCKFP0';

// initialize map
function initMap() {
    var mapOptions = {
        zoom: 17,
        // center long and lat. of map
        center: new google.maps.LatLng(12.9382328, 77.6289805)
    };
    // calling map
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
    name: 'Legends of Rock',
    lat: 12.9390234,
    long: 77.6259692
}, {
    name: 'Bak Bak Bar',
    lat: 12.9380433,
    long: 77.6277269
}];

// setting up value for info Window
var Attributes = function(value) {
    var filteredList = placeArray;
    var self = this;
    this.name = value.name;
    this.lat = value.lat;
    this.long = value.long;
    this.URL = "";
    this.address = this.street + this.city;
    // this.category = "";
    // var tempaddress = "";
    this.phone = "";
    this.visibleMarker = ko.observable(true);

    // set up foursquare url
    var fsurl = fs +
        '&v=20140806' + '&ll=' + value.lat + ',' +
        value.long + '&query=\'' + value.name + '\'&limit=1';

    // puuling up data from foursquareURL
    $.getJSON(fsurl).done(function(value) {
        var results = value.response.venues[0];
        if (results.url !== null && results.url !== undefined) {
            self.URL = results.url;
        }

        if ((results.location.formattedAddress[0] !== null && results.location.formattedAddress[0] !== undefined) &&
            (results.location.formattedAddress[1] !== null && results.location.formattedAddress[1] !== undefined)
        ) {
            self.address = results.location.formattedAddress[0] + ', ' +
                results.location.formattedAddress[1];
        } else if ((results.location.formattedAddress[0] !== null && results.location.formattedAddress[0] !== undefined) &&
            (results.location.formattedAddress[1] === null || results.location.formattedAddress[1] === undefined)
        ) {
            self.address = results.location.formattedAddress[0];
        } else if ((results.location.formattedAddress[1] !== null && results.location.formattedAddress[1] !== undefined) &&
            (results.location.formattedAddress[0] === null || results.location.formattedAddress[0] === undefined)
        ) {
            self.address = results.location.formattedAddress[1];
        }
        if (results.contact.phone !== null && results.contact.phone !== undefined) {
            self.phone = results.contact.phone;
        }
        // self.phone = results.contact.phone;
        console.log(results.contact.phone);
        if (venue.categories.shortName !== null && venue.categories.shortName !== undefined) {
            self.category = venue.categories.shortName;
        }
    });
    // passing content to the infoWindow
    this.infoWindow = new google.maps.InfoWindow({
        content: self.contentString
    });



    // setting up marker for varioys locations
    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(value.lat, value.long),
        map: map,
        title: value.name,
        animation: google.maps.Animation.DROP,
    });



    // making condition with marker so make it visible only when items
    // particular keyword are selected
    this.filterMarker = ko.computed(function() {
        if (this.visibleMarker() === true) {
            this.marker.setMap(map);
        } else {
            this.marker.setMap(null);
        }
        return true;
    }, this);


    // event creating to pass the content string in info window
    this.marker.addListener('click', function() {
        self.contentString = '<div class="info-window-content"><div class="title"><b>' + value.name + "</b></div>" +
            '<div class="content"><a href="' + self.URL + '">' + self.URL + "</a></div>" +
            '<div class="content">' + self.address + "</div>" +
            '<div class="content"><a href="tel:' + self.phone + '">' + self.phone + "</a></div></div>";

        self.infoWindow.setContent(self.contentString);
        self.marker.setAnimation(google.maps.Animation.BOUNCE);
        self.infoWindow.open(map, this);

    });

    // puuling up info window after click on marker
    this.toggle = function(place) {
        google.maps.event.trigger(self.marker, 'click');
    };
};


// controler or viewmodel of app
function AppViewModel() {
    var self = this;
    self.locationList = ko.observableArray([]);

    placeArray.forEach(function(locationItem) {
        self.locationList.push(new Attributes(locationItem));
    });

    self.searchItem = ko.observable("");

    // creating filter and so finding text on basis of particular text
    self.filteredList = this.filteredList = ko.computed(function() {
        var filter = self.searchItem().toLowerCase().trim();
        var fileteredArr = [];
        self.locationList().forEach(function(locationItem) {
            if (!filter) {
                locationItem.visibleMarker(true);
                fileteredArr.push(locationItem);
            } else if (locationItem.name.toLowerCase().search(filter) >= 0) {
                locationItem.visibleMarker(true);
                fileteredArr.push(locationItem);
            } else {
                locationItem.visibleMarker(false);
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
