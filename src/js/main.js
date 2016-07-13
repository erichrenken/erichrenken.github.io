var map;
var markers = [];

function initMap() {
    // TODO: use a constructor to create a new map JS object. You can use the coordinates
    // we used, 40.7413549, -73.99802439999996 or your own!
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 33.783083, lng: -84.298788}, zoom: 16
    });

    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    for (i=0; i < ViewModel.Listings().length; i++){
        var marker = new google.maps.Marker({
            position: ViewModel.Listings()[i].address,
            map: map,
            animation: google.maps.Animation.DROP,
            title: ViewModel.Listings()[i].name
        });
        markers.push(marker);
        marker.setMap(map);
        bounds.extend(marker.position);
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });
    }
    map.fitBounds(bounds);
}

function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
        infowindow.setContent('<div>' + marker.title + '</div>');
    }
}

var Listing = function(name, address, yelpId){
    var self = this;
    self.name = name;
    self.address = address;
    self.yelpId = yelpId;
    self.openInfoWindow = function(listing){
        var index = markers.findIndex(x => x.title == listing.name);
        google.maps.event.trigger(markers[index], 'click');
    }
};

var ListingModel = function(Listings){
    var self = this;
    self.userInput = ko.observable("");
    self.Listings = ko.observableArray(Listings);
    self.availableLocations = ko.computed(function(){
        return ko.utils.arrayFilter(self.Listings(), function(point){
            return point.name.toLowerCase().indexOf(self.userInput().toLowerCase()) >= 0;
        });
    });
    self.availableLocations.subscribe(function(){
       for(i=0; i<markers.length; i++){
           markers[i].setMap(null);
       }
       for(i=0; i < self.availableLocations().length; i++){
            var index = markers.findIndex(x => x.title == self.availableLocations()[i].name);
            markers[index].setMap(map);
       }
    });
};

var ViewModel = new ListingModel([
    new Listing("Taqueria del Sol", {lat: 33.775916, lng: -84.30209710000003}, "taqueria-del-sol-decatur"),
    new Listing("Dancing Goats", {lat: 33.7759096, lng: -84.30326880000001}, "dancing-goats-coffee-bar-decatur-2"),
    new Listing("Iberian Pig", {lat: 33.774389, lng: -84.29600299999998}, "the-iberian-pig-decatur"),
    new Listing("Victory Sandwich Bar", {lat: 33.7742212, lng: -84.2951521}, "victory-sandwich-bar-decatur"),
    new Listing("Raging Burrito", {lat: 33.774423, lng: -84.29547589999999}, "raging-burrito-and-taco-decatur")
]);


ko.applyBindings(ViewModel);
