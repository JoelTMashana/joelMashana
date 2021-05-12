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


// functions
const kelvinToCelcius = (kelvin) => {
    return Math.floor(kelvin - 273.15);
} 


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
                //convert weather data from kelvin to celcius
                //panel one data
                let weatherPanelOneTempDay = kelvinToCelcius(result['data'][0]['temp']['day']);
                   
                //panel two data
                let weatherPanelTwoHigh = kelvinToCelcius(result['data'][1]['temp']['max']);
                let weatherPanelTwoLow = kelvinToCelcius(result['data'][1]['temp']['min']);
                
                //panel three data
                let weatherPanelThreeHigh = kelvinToCelcius(result['data'][2]['temp']['max']);
                let weatherPanelThreeLow = kelvinToCelcius(result['data'][2]['temp']['min']);
                
                //panel four data
                let weatherPanelFourHigh = kelvinToCelcius(result['data'][3]['temp']['max']);
                let weatherPanelFourLow = kelvinToCelcius(result['data'][3]['temp']['min']);

                //panel five data
                let weatherPanelFiveHigh = kelvinToCelcius(result['data'][4]['temp']['max']);
                let weatherPanelFiveLow = kelvinToCelcius(result['data'][4]['temp']['min']);

                if (result.status.name == "ok") {
                    //panel one
                    $('#weatherPanelOneDescriptionText').html(result['data'][0]['weather'][0]['description']);
                    $('#weatherPanelOneTemp').html(`${weatherPanelOneTempDay}<span>°</span>`);
                    $('#weatherPanelOneIcon').html(`<img src="http://openweathermap.org/img/wn/${result['data'][0]['weather'][0]['icon']}@2x.png">`);
                    //panel two
                    $('#weatherPanelTwoIcon').html(`<img src="http://openweathermap.org/img/wn/${result['data'][1]['weather'][0]['icon']}@2x.png">`);
                    $('#weatherPanelTwoTemp').html(`H:${weatherPanelTwoHigh}<span>°</span> L:${weatherPanelTwoLow}<span>°</span>`); 
                    //panel three
                    $('#weatherPanelThreeIcon').html(`<img src="http://openweathermap.org/img/wn/${result['data'][2]['weather'][0]['icon']}@2x.png">`);
                    $('#weatherPanelThreeTemp').html(`H:${weatherPanelThreeHigh}<span>°</span> L:${weatherPanelThreeLow}<span>°</span>`);
                    
                    //panel four
                    $('#weatherPanelFourIcon').html(`<img src="http://openweathermap.org/img/wn/${result['data'][3]['weather'][0]['icon']}@2x.png">`);
                    $('#weatherPanelFourTemp').html(`H:${weatherPanelFourHigh}<span>°</span> L:${weatherPanelFourLow}<span>°</span>`);

                    //panel five
                    $('#weatherPanelFiveIcon').html(`<img src="http://openweathermap.org/img/wn/${result['data'][4]['weather'][0]['icon']}@2x.png">`);
                    $('#weatherPanelFiveTemp').html(`H:${weatherPanelFiveHigh }<span>°</span> L:${weatherPanelFiveLow}<span>°</span>`);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
                console.log("There was an error peforming the AJAX call!");
    
            }
        });
    });

});
