var map;
var infoWindow;
var markers = [];
var selectedMarker;
var LocationCategories = ['ALL', 'Parks', 'Schools', 'Stores', 'Restaurants', 'Golf Courses']
var interestingLocations = [
	{
		title: 'Sugar House Park',
		category: 'Parks',
		location: {lat: 40.725594, lng: -111.850862}
	},
	{
		title: 'Olive Garden',
		category: 'Restaurants',
		location: {lat: 40.721535, lng: -111.854360}
	},
	{
		title: 'Westminster College (Utah)',
		category: 'Schools',
		location: {lat: 40.731974, lng: -111.854746}
	},
	{
		title: 'Highland High School, Utah',
		category: 'Schools',
		location: {lat: 40.723519, lng: -111.843545}
	},
	{
		title: 'Nibley Park Golf Course',
		category: 'Golf Courses',
		location: {lat: 40.709938, lng: -111.874015}
	},
	{
		title: 'Red Lobster',
		category: 'Restaurants',
		location: {lat: 40.720543, lng: -111.853931}
	},
	{
		title: 'Whole Foods Market',
		category: 'Stores',
		location: {lat: 40.723638, lng: -111.858944}
	},
	{
		title: 'Forest Dale Golf Course',
		category: 'Golf Courses',
		location: {lat: 40.718770, lng: -111.85656}
	}
]

var Location = function(data, index) {
	this.title = ko.observable(data.title);
	this.category = ko.observable(data.category);
	this.location = ko.observable(data.location);
	this.isVisible = ko.observable(true);
	this.markerIndex = ko.observable(index);
}

var ViewModel = function() {
	var self = this;

	this.isFilterMenuVisible = ko.observable(true);

	this.Locations = ko.observableArray([]);

	interestingLocations.forEach(function(locationItem, index) {
		self.Locations.push(new Location(locationItem, index));
	});

	this.availableCategories = ko.observableArray(LocationCategories)

	this.currentFilter = ko.observable('All');
	this.currentFilter.subscribe(function(newValue) {
		closeInfoWindowAndClearBounce(infoWindow);
		var this_location;
		for(var i = 0; i < this.Locations().length; i++)
		{
			this_location = this.Locations()[i];
			this_location.isVisible((this_location.category() == newValue) || (newValue == 'ALL'));
			if (markers[i])	{
				markers[i].setVisible(this_location.isVisible());
			}
		};
    }, this);

    this.clickMapMarker = function(clickedLocation) {
    	var current_marker = markers[clickedLocation.markerIndex()];
    	fillInfoWindowAndToggleMarker(current_marker);
    };

    this.openSideMenu = function() {
    	self.isFilterMenuVisible(false);
    	document.getElementById("top-menu").style.height = "100%";
	};

	this.closeSideMenu = function() {
    	document.getElementById("top-menu").style.height = "0";
    	setTimeout(self.showFilterMenu, 600);
	};

	this.showFilterMenu = function() {
		self.isFilterMenuVisible(true);
	};
}

ko.applyBindings(new ViewModel());

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
        	center: {lat: 40.725864, lng: -111.850874},
        	zoom: 15,
        	mapTypeControl: false
        });

	infoWindow = new google.maps.InfoWindow();
	var mapBounds = new google.maps.LatLngBounds();

	for (var i = 0; i < interestingLocations.length; i++) {
      var marker = new google.maps.Marker({
          map: map,
          position: interestingLocations[i].location,
          title: interestingLocations[i].title,
          animation: google.maps.Animation.DROP,
          id: i
        });
      markers.push(marker);
      marker.addListener('click', function() {
      	fillInfoWindowAndToggleMarker(this);

      });
      mapBounds.extend(marker.position);
	}
	map.fitBounds(mapBounds);
}

function fillInfoWindowAndToggleMarker(marker) {
	if (selectedMarker) {
    	toggleBounce(selectedMarker);
    }
    fillInfoWindow(marker, infoWindow);
    selectedMarker = marker;
}

function toggleBounce(marker) {
	if (marker.getAnimation() !== null) {
  		marker.setAnimation(null);
	} else {
  		marker.setAnimation(google.maps.Animation.BOUNCE);
	}
}


function fillInfoWindow(marker, info_window) {
    loadMarkerWithWikipediaLinks(marker, info_window);
}

function closeInfoWindowAndClearBounce(info_window) {
	if (info_window){
		info_window.close();
		if (info_window.marker){
			info_window.marker.setAnimation(null);
			info_window.marker = null;
		}
	}
	selectedMarker = null;
}

function loadMarkerWithWikipediaLinks(marker, info_window) {
	if (info_window.marker != marker) {
		var $wikiElem = $('#wikipedia-header');
		var wikipediaSearchURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wiliCallback';

	    var wikiRequestTimeout = setTimeout(function(){
	    	$wikiElem.text("Request for Wikipedia Information failed!");
	    }, 8000);

	    $.ajax({
	    	url: wikipediaSearchURL,
	    	dataType: "jsonp",
	    	success: function(response) {
	    		var markerContent;
	    		var articleList = response[1];
	    		if (articleList.length > 0)
	    		{
		    		var url = response[3];
		    		var description = response[2]
		    		markerContent = '<div class="info-window">' +
						'<h5>' + marker.title + '</h5>' +
						'<p>' + description + '</p>' +
						'<div>Wikipedia page can be found <a href="' + url + '">here</a></div></div>';
		    	}
		    	else
		    	{
		    		markerContent = '<div class="info-window">' +
						'<h5>' + marker.title + '</h5>' +
						'<p>Wikipedia page not found</p>';
		    	}
 	   			clearTimeout(wikiRequestTimeout);
				info_window.marker = marker;
				info_window.setContent(markerContent);
				info_window.open(map, marker);
				info_window.addListener('closeclick', function() {
					info_window.marker = null;
				});
			    toggleBounce(marker);

	    	}
	    });
	}
}









