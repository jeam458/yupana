(function(module) {
	'use strict';

	
	module.factory('mapService', mapService);

	mapService.$inject = ['$q', '$rootScope', 'geolocation'];
	function mapService($q, $rootScope, geolocation) {
		
		function getHtml5Location() {

			return geolocation.getLocation().then(function(data) {

				var LatLng = {lat: data.coords.latitude, lng: data.coords.longitude};
				return LatLng;
			});
		}

		


		function bootstrapMap(domElement, config, coordinates, shouldListener) {
      console.log("el mapa")
			console.log(config.coordinates);
			google.maps.event.addDomListener(window, 'load', init(domElement, config));
      //init(domElement,config);
			function init(domElement, config) {
		var styledMapType = new google.maps.StyledMapType(
      [
        {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
        {
          featureType: 'administrative',
          elementType: 'geometry.stroke',
          stylers: [{color: '#c9b2a6'}]
        },
        {
          featureType: 'administrative.land_parcel',
          elementType: 'geometry.stroke',
          stylers: [{color: '#dcd2be'}]
        },
        {
          featureType: 'administrative.land_parcel',
          elementType: 'labels.text.fill',
          stylers: [{color: '#ae9e90'}]
        },
        {
          featureType: 'landscape.natural',
          elementType: 'geometry',
          stylers: [{color: '#dfd2ae'}]
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [{color: '#dfd2ae'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#93817c'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry.fill',
          stylers: [{color: '#a5b076'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#447530'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#f5f1e6'}]
        },
        {
          featureType: 'road.arterial',
          elementType: 'geometry',
          stylers: [{color: '#fdfcf8'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#f8c967'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#e9bc62'}]
        },
        {
          featureType: 'road.highway.controlled_access',
          elementType: 'geometry',
          stylers: [{color: '#e98d58'}]
        },
        {
          featureType: 'road.highway.controlled_access',
          elementType: 'geometry.stroke',
          stylers: [{color: '#db8555'}]
        },
        {
          featureType: 'road.local',
          elementType: 'labels.text.fill',
          stylers: [{color: '#806b63'}]
        },
        {
          featureType: 'transit.line',
          elementType: 'geometry',
          stylers: [{color: '#dfd2ae'}]
        },
        {
          featureType: 'transit.line',
          elementType: 'labels.text.fill',
          stylers: [{color: '#8f7d77'}]
        },
        {
          featureType: 'transit.line',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#ebe3cd'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'geometry',
          stylers: [{color: '#dfd2ae'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry.fill',
          stylers: [{color: '#b9d3c2'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#92998d'}]
        }
      ],
      {name: 'Estilo Andes'});
				var mapConfig = {
		                zoom: 15,
		                center: config.coordinates,
                        mapTypeControlOptions: {
                        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                                  'Estilo_Andes']
                        }

		            }

				var map = new google.maps.Map(domElement, mapConfig);
                 map.mapTypes.set('Estilo_Andes', styledMapType);
                 map.setMapTypeId('Estilo_Andes');
				if (config.addListener) {
					addMapListener(map);	
				}

				if (config.addMarker) {
					addMarker(map, config.coordinates);	
				}
			}
		}

		function addMarker(map, coordinates) {
			var marker = new google.maps.Marker({
                position: coordinates,
                draggable:true,
                animation: google.maps.Animation.BOUNCE,
                map: map,
                icon: '/img/garden.png'
            });

		}

		function addMapListener(map) {
			
			var lastMarker;
      var elevator = new google.maps.ElevationService();

			google.maps.event.addListener(map, 'click', function(e){

					console.log('map clicked!');
	          		var lat,
	          			lng;

	                var marker = new google.maps.Marker({
	                    position: e.latLng,
                      draggable:true,
	                    animation: google.maps.Animation.BOUNCE,
	                    map: map,
	                    icon: '/img/flowers.png'
	                });
	                
	                // When a new spot is selected, delete the old red bouncing marker
	                if(lastMarker){
	                    lastMarker.setMap(null);
	                }

	                // Create a new red bouncing marker and move to it
	                lastMarker = marker;
	                map.panTo(marker.position);

	                lat = marker.getPosition().lat();
                	lng = marker.getPosition().lng();
                  var elevacion;
                  
                  
                	console.log('lat: ' + lat);
                  
                	
                	var coordinates = [ lat, lng ]

	                $rootScope.$broadcast('map-clicked', coordinates);
			});
		}

    

		


		return {
			bootstrapMap: bootstrapMap,
			getHtml5Location: getHtml5Location,
			addMapListener: addMapListener
			
		}
	}
})(angular.module('myApp'));