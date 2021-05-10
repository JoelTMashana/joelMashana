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

    } else {
        alert('Geolocation is not supported by browser');
    }

});



// creates marker at users positon.
const showPosition = position => {
    var userLocationMarker = L.marker( [position.coords.latitude, position.coords.longitude]).addTo(mymap)
}

//nav buttons
$('#locate').click(function (){
    navigator.geolocation.getCurrentPosition(showPosition);
});


// ajax for weather information on load
$(document).ready(function getUserLocationWeatherData() {
    
    navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        
        $.ajax({
            url: "./php/getUserLocationWeatherData.php",
            type: 'POST',
            dataType: 'json',
            data: {
                latitude: lat,
                longitude: long
            },
            success: function(result) {
                console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    //$('#temperature').html(result['main'][0]);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
                console.log("There was an error peforming the AJAX call!");
    
            }
        });
    });

});
