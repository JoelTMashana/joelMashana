//initialises an instance of the map class and sets the view

const mymap = L.map('mapid').locate({setView: true, maxZoom: 16}).fitWorld();


//add the tile layer on the class, in this case i used thunderforest
L.tileLayer('https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=6d9911c3c07e404eaa8dd1c1067b8c7e', {
}).addTo(mymap);

const leafletIcon = L.icon ({
    iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
    shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
    iconSize: [38,95],
    iconAnchor: [22, 94],
    shadowAnchor: [4,62],
    popupAnchor: [12,-90]
})

//creates marker, sets its positition and to adds to the map
const marker = L.marker([51.5, -0.09], {icon: leafletIcon})

// same as above but with circle you can easily adjust the way it looks
const circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
})

const polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
])


const featureGroup = L.featureGroup([marker, circle, polygon]).addTo(mymap);

mymap.fitBounds(featureGroup.getBounds(), {
    padding: [20, 20]
})


// adds popup to markers already created above
// the maker is set to have its popup displaying by def
marker.bindPopup("<b>Joel Mashana</b><br><hr>I am a human").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

const shapes = L.layerGroup([marker, circle, polygon]);



// pop as layer usefull when dont want pop to be attched to object
const popup = L.popup()
    .setLatLng([51.5, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(mymap);

    function onMapClick(e) {
        popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
    }
    
    mymap.on('click', onMapClick);

    function onLocationFound(e) {
        var radius = e.accuracy;
    
        L.marker(e.latlng).addTo(mymap)
            .bindPopup("You are within " + radius + " meters from this point").openPopup();
    
        L.circle(e.latlng, radius).addTo(mymap);
    }
    
    mymap.on('locationfound', onLocationFound);

    function onLocationError(e) {
        alert(e.message);
    }
    
    mymap.on('locationerror', onLocationError);

    var geojsonFeature = {
        "type": "Feature",
        "properties": {
            "name": "Coors Field",
            "amenity": "Baseball Stadium",
            "popupContent": "This is where the Rockies play!"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-104.99404, 39.75621]
        }
    };

    L.geoJSON(geojsonFeature).addTo(mymap);

    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    
    L.geoJSON(geojsonFeature, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(mymap);
    



    var myLines = [{
        "type": "LineString",
        "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
    }, {
        "type": "LineString",
        "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
    }];
    
    var myStyle = {
        "color": "#ff7800",
        "weight": 5,
        "opacity": 0.65
    };
    
    L.geoJSON(myLines, {
        style: myStyle
    }).addTo(mymap);

    var states = [{
        "type": "Feature",
        "properties": {"party": "Republican"},
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [-104.05, 48.99],
                [-97.22,  48.98],
                [-96.58,  45.94],
                [-104.03, 45.94],
                [-104.05, 48.99]
            ]]
        }
    }, {
        "type": "Feature",
        "properties": {"party": "Democrat"},
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [-109.05, 41.00],
                [-102.06, 40.99],
                [-102.03, 36.99],
                [-109.04, 36.99],
                [-109.05, 41.00]
            ]]
        }
    }];
    
    L.geoJSON(states, {
        style: function(feature) {
            switch (feature.properties.party) {
                case 'Republican': return {color: "#ff0000"};
                case 'Democrat':   return {color: "#0000ff"};
            }
        }
    }).addTo(mymap);

    // on each 
    function onEachFeature(feature, layer) {
        // does this feature have a property named popupContent?
        if (feature.properties && feature.properties.popupContent) {
            layer.bindPopup(feature.properties.popupContent);
        }
    }
    
    
    L.geoJSON(geojsonFeature, {
        onEachFeature: onEachFeature
    }).addTo(mymap);