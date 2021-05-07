//initialises an instance of the map class and sets the view to fit world
const mymap = L.map('mapid',{
    zoomSnap: 0.5,
      
}).setView([51.505, -0.09], 13);
//add the tile layer on the class, in this case i used thunderforest
L.tileLayer('https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=6d9911c3c07e404eaa8dd1c1067b8c7e',).addTo(mymap);

// find users location and set marker on doc ready
$(document).ready(function findLocation () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
        map.fitBounds(position.coords.latitude, position.coords.longitude);
    } else {
        alert('Geolocation is not supported by browser');
    }

});

// creates marker at users positon.
const showPosition = position => {
    var marker = L.marker( [position.coords.latitude, position.coords.longitude]).addTo(mymap)
}
var marker2 = L.marker([51.5, -0.09]).addTo(mymap);

//locate user
$('#locate').click(function (){
    navigator.geolocation.getCurrentPosition(showPosition);
});
