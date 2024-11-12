/**
 * Visual composer Map
 * ===================================
 *
 *  Init
 *
 *  Initial map
 *
 *  Add markes in map
 *
 *  Info message in map
 *
 */
;(function ($, window, document, undefined) {

    "use strict";

    if ($('.ugm-map-wrapper').length) {
        $('.ugm-map-wrapper > div').each(function () {
            initializeMap(this);
        });
    }

    /**
     * Initial map
     */
    function initializeMap(_this) {
        var mapId = $(_this).attr("data-id-map");
        var optionsMap = vc_gm_map[mapId - 1];
        var bounds = new google.maps.LatLngBounds();
        var geocoder = new google.maps.Geocoder();

        // default coords
        var maplat = -34.397;
        var maplng = 150.644;

        //map initial options
        var map = new google.maps.Map(_this, {

            center: { lat: maplat, lng: maplng },

            //Zoom tab
            //======================================================
            // Enable Zoom Control
            zoomControl: Boolean(optionsMap.zoom_control),
            zoomControlOptions: {
                // Zoom Control Position
                position: google.maps.ControlPosition[optionsMap.zoom_control_position],
                style: google.maps.ZoomControlStyle.SMALL,
            },

            //Zoom map
            zoom: Number(optionsMap.zoom_map),

            // Scroll Wheel
            scrollwheel: Boolean(optionsMap.is_scroll_wheel),

            // dragable Map
            draggable: Boolean(optionsMap.is_dragable_map),

            //CONTROLS
            //==================================================
            panControl: Boolean(optionsMap.is_pan_controls),
            panControlOptions: {
                position: google.maps.ControlPosition[optionsMap.pan_control_position],
            },

            // scale control
            scaleControl: Boolean(optionsMap.is_scale_control),

            //Street view control position
            streetViewControl: Boolean(optionsMap.is_street_view),
            streetViewControlOptions: {
                position: google.maps.ControlPosition[optionsMap.street_view_control_position],
            },

            //Map type control
            mapTypeControl: optionsMap.is_map_type_control,
            // Map type control position
            mapTypeControlOptions: {
                position: google.maps.ControlPosition[optionsMap.map_type_control_position],
                style: google.maps.MapTypeControlStyle[optionsMap.map_type_control_style],
            },
            //Map type
            mapTypeId: google.maps.MapTypeId[optionsMap.map_type],

            //STYLE
            //============================================================
            styles: $.parseJSON(optionsMap.json_style),

        });

        if ( Boolean(optionsMap.is_search) == true ) {
            
            //get location from address
            if (geocoder) {
                geocoder.geocode({
                    'address': String(optionsMap.searsh_line)
                }, function (results, status) {

                    if (status == google.maps.GeocoderStatus.OK) {
                        if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
                            google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
				                map.setCenter(results[0].geometry.location);
				            });
                        } else {
                            console.log( "No results found" );
                        }
                    } else {
                        console.log( "Geocode was not successful for the following reason: " + status );
                    }
                });
            }
        }

        //Reload on resize
        if (Boolean(optionsMap.is_reload_on_resize) === true) {
            google.maps.event.addDomListener(window, "resize", function () {
                var center = map.getCenter();
                google.maps.event.trigger(map, "resize");
                map.setCenter(center);
            });
        }

        //MARKERS
        //=========================================
        if ( optionsMap.markers ){
            addMarkers(optionsMap.markers, map, bounds, optionsMap);
        }

        if ( optionsMap.center_map === 'yes' ||  Boolean(optionsMap.is_search) == false) {
            google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
                map.fitBounds( bounds );
                map.setOptions({ zoom: Number(optionsMap.zoom_map) });
            });
        }

        //Set 3d map
        if ( optionsMap.is_3d_mode === 'true' ){
            google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
                map.setTilt(45);
            });
        }


        //BROWSER GEOLOCATION
        //=========================================
        if (optionsMap.activate_geo === 'browser_location') {

            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    var marker = new google.maps.Marker({
                        position: pos,
                        map: map,
                        draggable: false,
                        title: "You are location",
                        // icon: item.marker,
                    });

                    map.setCenter(pos);


                }, function () {
                    handleLocationError(true);
                });
            } else {
                // Browser doesn't support Geolocation
                handleLocationError(false);
            }

        } else if (optionsMap.activate_geo === 'ip_location') {

            var marker = new google.maps.Marker({
                position: optionsMap.ip_coords,
                map: map,
                draggable: false,
                title: "You are location",
            });

            map.setCenter({lat: optionsMap.ip_coords.lat, lng: optionsMap.ip_coords.lng});
        }
    }

    /**
     * Message Error Geolocation
     *
     */
    function handleLocationError(browserHasGeolocation) {
        console.log(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    }

    /**
     * Add markes in map
     */
    function addMarkers(itemMarker, map, bounds, optionsMap) {
        var countsMarker = itemMarker.length;

        var origin = '';
        var destination = '';
        var waypoints = [];

        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;

        itemMarker.forEach( function (item, i) {
            var geocoder = new google.maps.Geocoder();

            if (item.marker_address !== "" && optionsMap.type_chortcode === "single_markers") {

                //get location from address
                if (geocoder) {
                    geocoder.geocode({
                        'address': String(item.marker_address)
                    }, function (results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {

                                    var marker = new google.maps.Marker({
                                        position: {
                                            lat: results[0].geometry.location.lat(),
                                            lng: results[0].geometry.location.lng(),
                                        },
                                        map: map,
                                        draggable: false,
                                        title: item.direction_link,
                                        icon: item.marker,
                                    });

                                    bounds.extend(marker.position);

                                    //animation makrer and view message on click
                                    if (item.icon_animation !== 'none') {
                                        if ( item.icon_animation === 'BOUNCE' ) {
                                            marker.setAnimation(google.maps.Animation.BOUNCE);
                                        } 
                                    }

                                    //view message on click if default open yes
                                    if (item.default_open_in_window !== 'no') {
                                        attachInfoMessage(map, marker, item.text);
                                    }
                                    marker.addListener('click', function () {
                                        attachInfoMessage(map, marker, item.text);
                                    });

                                } else {
                                    console.log("No results found");
                                }
                            } else {
                                console.log("Geocode was not successful for the following reason: " + status);
                            }
                        
                    });
                }
            }

            //direction markers
            if ( item.marker_address !== "" && optionsMap.type_chortcode == "directions" ) {

                //get location from address

                if ( geocoder ) {
                    geocoder.geocode({
                        'address': String(item.marker_address)
                    }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
                                bounds.extend( results[0].geometry.location );

                                new google.maps.Marker({
                                    position: {
                                        lat: results[0].geometry.location.lat(),
                                        lng: results[0].geometry.location.lng(),
                                    },
                                    map: map,
                                    draggable: false,
                                    title: item.direction_link,
                                    icon: item.marker,
                                });
                            }
                            else {
                                console.log("No results found");
                            }
                        } else {
                            console.log("Geocode was not successful for the following reason: " + status);
                        }
                    });
                }

                if (i == 0) {
                    origin = item.marker_address;

                } else if (i == ( countsMarker - 1)) {
                    destination = item.marker_address;

                } else {
                    waypoints.push({
                        location: item.marker_address,
                        stopover: true
                    });
                }
            }
        });

        if( optionsMap.type_chortcode === "directions" ){
            var route_options = {
                origin: origin,
                destination: destination,

                waypoints: waypoints,
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.DRIVING
            };
            var directionsDisplay_options = {
                polylineOptions: {
                    strokeColor: optionsMap.color_route_line,
                },
                suppressMarkers: true,
            };

            directionsService.route( route_options, function (response, status ) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                } else {
                    console.log('Directions request failed due to ' + status);
                }
            });

            directionsDisplay.setMap(map);
            directionsDisplay.setOptions(directionsDisplay_options);
        }
    }

    /**
     * Info message in map
     *
     * @marker marker in map
     * @message message
     */
    function attachInfoMessage(map, marker, message) {

        if ( message.length ) {
            var infowindow = new google.maps.InfoWindow({
                content: message,
            });
            infowindow.open(map, marker);  
        }
        
    }

})(jQuery, window, document);