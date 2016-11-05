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
		title: 'Westminster College',
		category: 'Schools',
		location: {lat: 40.731974, lng: -111.854746}
	},
	{
		title: 'Highland High School',
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
		title: 'Patagonia Outlet',
		category: 'Stores',
		location: {lat: 40.720917, lng: -111.858308}
	},
	{
		title: 'Forest Dale Golf Course',
		category: 'Golf Courses',
		location: {lat: 40.718770, lng: -111.865046}
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

	this.isYelpVisible = ko.observable(false);

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
    	loadNYTimesArticle(current_marker.title)
    	console.log(self.isYelpVisible);
    	self.isYelpVisible(true);
    	toggleBounce(markers[clickedLocation.markerIndex()]);
    }
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
    toggleBounce(marker);
    selectedMarker = marker;
}

function toggleBounce(marker) {
	if (marker.getAnimation() !== null) {
  		marker.setAnimation(null);
	} else {
  		marker.setAnimation(google.maps.Animation.BOUNCE);
	}
}


function fillInfoWindow(marker, infowindow) {
	if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div class="info-window">' + marker.title + '</div>');
          infowindow.open(map, marker);
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
	}
}

function closeInfoWindowAndClearBounce(infowindow) {
	if (infowindow){
		infowindow.close();
		if (infowindow.marker){
			infowindow.marker.setAnimation(null);
			infowindow.marker = null;
		}
	}
	selectedMarker = null;
}


function loadNYTimesArticle(location) {
	if (location)
	{
		var $nytHeaderElem = $('#nytimes-header');
		var $nytElem = $('#nytimes-articles');
		$nytHeaderElem.text('Retrieving information about: ' + location);
		var nytimesSearch = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + location +
    	'&sort=newest&api-key=7749617247d34db7b99342ca8302b233';
	    console.log(nytimesSearch);
	    $.getJSON(nytimesSearch, function(data){
	    	$nytHeaderElem.text('New York Times Articles About ' + location);

	    	var articles = data.response.docs;
	    	for(var i = 0; i < articles.length; i++) {
	    		var article = articles[i];
	    		$nytElem.append('<li class="article">' +
	    			'<a href="' + article.web_url + '">' + article.headline.main+
	    				'</a>' +
	    			'<p>' + article.snippet + '</p>' +
	    			'</li>');
	    	}
	    }).error(function(e) {
	    	$nytHeaderElem.text('New York Times Articles Could Not Be Loaded.');
	    });
	}
}

function openNav() {
    document.getElementById("side-menu").style.height = "100%";
    //document.getElementById("map").style.height = "100%";
    //document.getElementById("map").style.top = "0%";
}

function closeNav() {
    document.getElementById("side-menu").style.height = "0";
    //document.getElementById("map").style.height = "92%";
    //document.getElementById("map").style.top = "8%";
}








