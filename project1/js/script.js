//initialises an instance of the map class and sets the view to fit world
const mymap = L.map('mapid',
{
    
}).fitWorld();

mymap.locate({setView: true, maxZoom: 16});
//add the tile layer on the class, in this case i used thunderforest
let osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 3,
    maxZoom: 19,
    zoomSnap: 0.1,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

function onLocationError(e) {
    alert(e.message);
}

mymap.on('locationerror', onLocationError);


// populate datalist with country list on load
$(document).ready(function getCountryNameData(){
    $.ajax({
        url: "./php/getCountryBordersGeoData.php",
        type: 'POST',
        dataType: 'json',
        success: function(result){
            
             let countryOptions; 
             let features = result['data'];
             features.forEach( f => {
               countryOptions+="<option value='"
               +f.properties.name+
               "'>"
               +f.properties.name+
               "</option>";
             
             });
             $('#selCountry').html(countryOptions);            
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log("There was an error with the getCountryNameData Ajax call");
        }        
    });
});


// find users location and set marker on doc ready
$(document).ready(function findLocation () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    } else {
        alert('Geolocation is not supported by browser');
    }
});

const showPosition = position => {
    var userLocationMarker = L.marker( [position.coords.latitude, position.coords.longitude]).addTo(mymap);
    //remember to style properly in style sheet
    userLocationMarker.bindPopup('<p style="color: black;">You are here!</p>');
}



//nav buttons
//ajax calls when 
$('#locate').click(function (){
    navigator.geolocation.getCurrentPosition(showPosition);
});



//dates for weather panels
let currDate = new Date();
let ddPlusTwo = String(currDate.getDate() + 2).padStart(2, '0'),
    ddPlusThree = String(currDate.getDate() + 3).padStart(2, '0'),
    ddPlusFour = String(currDate.getDate() + 4).padStart(2, '0');
//openweather data conversion
const kelvinToCelcius = (kelvin) => {
    return Math.floor(kelvin - 273.15);
} 

// ajax for weather information on load
$(document).ready(function getUserLocationData() {
            
    navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;

        
        //openweather api ajax call
        $.ajax({
            url: "./php/getUserLocationWeatherData.php",
            type: 'POST',
            dataType: 'json',
            data: {
                latitude: lat,
                longitude: long
            },
            success: function(result) {

                if (result.status.name == "ok") {
                    //panel one
                    $('#weatherPanelOneDescriptionText').html(result['data'][0]['weather'][0]['description']);
                    $('#weatherPanelOneTemp').html(`${kelvinToCelcius(result['data'][0]['temp']['day'])}<span>°</span>`);
                    $('#weatherPanelOneIcon').html(`<img src="http://openweathermap.org/img/wn/${result['data'][0]['weather'][0]['icon']}@2x.png">`);
                    //panel two
                    $('#weatherPanelTwoIcon').html(`<img src="http://openweathermap.org/img/wn/${result['data'][1]['weather'][0]['icon']}@2x.png">`);
                    $('#weatherPanelTwoTemp').html(`H:${kelvinToCelcius(result['data'][1]['temp']['max'])}<span>°</span> L:${kelvinToCelcius(result['data'][1]['temp']['min'])}<span>°</span>`); 
                    //panel three
                    $('#weatherPanelThreeIcon').html(`<img src="http://openweathermap.org/img/wn/${result['data'][2]['weather'][0]['icon']}@2x.png">`);
                    $('#weatherPanelThreeTemp').html(`H:${kelvinToCelcius(result['data'][2]['temp']['max'])}<span>°</span> L:${kelvinToCelcius(result['data'][2]['temp']['min'])}<span>°</span>`);
                    $('#currDatePlusTwo').html(`${ddPlusTwo}th`);
                    //panel four
                    $('#weatherPanelFourIcon').html(`<img src="http://openweathermap.org/img/wn/${result['data'][3]['weather'][0]['icon']}@2x.png">`);
                    $('#weatherPanelFourTemp').html(`H:${kelvinToCelcius(result['data'][3]['temp']['max'])}<span>°</span> L:${kelvinToCelcius(result['data'][3]['temp']['min'])}<span>°</span>`);
                    $('#currDatePlusThree').html(`${ddPlusThree}th`); 
                    //panel five
                    $('#weatherPanelFiveIcon').html(`<img src="http://openweathermap.org/img/wn/${result['data'][4]['weather'][0]['icon']}@2x.png">`);
                    $('#weatherPanelFiveTemp').html(`H:${kelvinToCelcius(result['data'][4]['temp']['max'])}<span>°</span> L:${kelvinToCelcius(result['data'][4]['temp']['min'])}<span>°</span>`);
                    $('#currDatePlusFour').html(`${ddPlusFour}th`);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("There was an error peforming the AJAX call!");  
            }
        });
        //opencage ajax call
        $.ajax({
            url: "./php/getUserLocationOpenCageData.php",
            type: 'POST',
            dataType: 'json',
            data: {
                latitude: lat,
                longitude: long
            },
            success: function(result) {
                    //writes locations using data of opencage to html
                    $('#cityLocationTxt').html(result['data'][0]['components']['town']);
                    $('#countryNameTxt').html(result['data'][0]['components']['country']);
                    
                     //next ajax calls which depends on data from previous
                     /*openexchangerates ajax call
                     let isoCode = result['data'][0]['annotations']['currency']['iso_code'];
                     $.ajax({
                        url: "./php/getUserLocationExchangeData.php",
                        type: 'POST',
                        dataType: 'json',
                        success: function(result){
                        
                            let rates = result['data'];                           
                            for (let key in rates) {
                               if(key == isoCode){
                                   $('#exchangeRatesTxt').html(`1 USD = ${(rates[key])} ${isoCode}`);
                               } 
                            }

                            
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log("There was an error peforming the AJAX call!");  
                        }                          
                     });*/

                     //newsapi ajax call
                     $.ajax({
                        url: "./php/getUserLocationNewsData.php",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                           isocode: result['data'][0]['components']['ISO_3166-1_alpha-2']
                        },
                        success: function(result){                        
                                $('#newsHeadlineIconImgOne').html(`<a href="${result['data'][0]['url']}"><img src="${result['data'][0]['urlToImage']}" alt="headline image"></a>`);
                                $('#newsHeadlineTxtOne').html(`<b>${result['data'][0]['description']}</b>`);
                                
                                $('#newsHeadlineIconImgTwo').html(`<a href="${result['data'][1]['url']}"><img src="${result['data'][1]['urlToImage']}" alt="headline image"></a>`);
                                $('#newsHeadlineTxtTwo').html(`<b>${result['data'][1]['description']}</b>`);
                                
                                $('#newsHeadlineIconImgThree').html(`<a href="${result['data'][2]['url']}"><img src="${result['data'][2]['urlToImage']}" alt="headline image"></a>`);
                                $('#newsHeadlineTxtThree').html(`<b>${result['data'][2]['description']}</b>`);  
                        }
                    });
                    //RESTCountries ajax call 
                    $.ajax({
                        url: "./php/getUserLocationCountryInfoData.php",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                           isocode: result['data'][0]['components']['ISO_3166-1_alpha-2']
                        },
                        success: function(result) {
                           
                             if (result.status.name == "ok") {
                                  $('#countryFlagImg').html(`<img src="${result['data'][0]['flag']}" alt="country flag">`);
                                  $('#populationTxt').html(result['data'][0]['population']);
                                  $('#capitalCityNameTxt').html(`Capital city: ${result['data'][0]['capital']}`);
                                  
                                  //geonames ajax call
                                  $.ajax({
                                      url: "./php/getUserLocationWikiData.php",
                                      type: 'POST',
                                      dataType: 'json',
                                      data: {
                                        placename: result['data'][0]['capital']
                                      },
                                      success: function(result){
                                          if (result.status.name == "ok") {
                                            $('#capitalCitySummaryTxt').html(result['data'][0]['summary']);
                                          }
                                      },
                                      error: function(jqXHR, textStatus, errorThrown) {
                                        console.log("There was an error peforming the AJAX call!");  
                                      }
                                  });
                             }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log("There was an error peforming the AJAX call!");  
                        }  
                    });                   
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("There was an error peforming the AJAX call!");  
            }  
        });



    });

});



/*
$('#btnRun').click(function(){
     $.ajax({
         url: "./php/getCountryBordersGeoData.php",
         type: 'POST',
         dataType: 'json',
         success: function(result){
            let features = result['data'];
            let countryName = $('#val').val();
            
            features.forEach(feature => {
                
                if(countryName == feature.properties.name){
                    mymap.removeLayer(theLayer);
                    let theLayer = L.geoJSON(feature).addTo(mymap);
               }               
            });
            
         },
         error: function(jqXHR, textStatus, errorThrown){
            console.log("There was an error peforming the AJAX call!"); 
         }
     });
});
*/



let allMarkers = L.markerClusterGroup();
mymap.addLayer(allMarkers);

//temporary color marker until i find better alternative
let greenIcon = new L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

let goldIcon = new L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]    
})

// ajax calls for when user selects country
$('#btnRun').click(function(){
    $.ajax({
        url: "./php/getCountryOpenCageData.php",
        type: 'POST',
        dataType: 'json',
        data: {
           placename: $('#val').val(),  
        },
        success: function(result){              
        //write coutry name to country name header 
        $('#countryNameTxt').html(result['data'][0]['components']['country']); 
  

        //set view to selected country
        let lat = result['data'][0]['geometry']['lat'];
        let lng = result['data'][0]['geometry']['lng'];    
        mymap.setView([lat,lng], 4);

        //find near by ares of interst ajax call
        
        $.ajax({
            url: "./php/getCapitalAreasOfInterestData.php",
            type: 'POST',
            dataType: 'json',
            data: {
                latitude: lat,
                longitude: lng,
                isocode: result['data'][0]['components']['ISO_3166-1_alpha-2']
            },
            success: function(result){
                //create layer grough 
                // if the is more that 0 layers in the layer group cleare all layers in group
                // if not, add the the layer of markers to the map
                let areasOfInterest = result['data'];
                
                
                areasOfInterest.forEach(area => {
                    let areaLat = area.lat;
                    let areaLng = area.lng;
                    let areaOfInterestMarkers = L.marker(
                        [areaLat, areaLng],
                        {icon: greenIcon}
                        );
                    allMarkers.addLayer(areaOfInterestMarkers);
                    areaOfInterestMarkers.bindPopup(`<p style="color: black;">${area.title}</p>`);
                
                });           
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("There was an error peforming the AJAX call!");  
            }                          
         }); 
            

       /*openexchangerates ajax call
       let isoCode = result['data'][0]['annotations']['currency']['iso_code'];
       
       $.ajax({
          url: "./php/getUserLocationExchangeData.php",
          type: 'POST',
          dataType: 'json',
          success: function(result){
          
              let rates = result['data'];                           
              for (let key in rates) {
                 if(key == isoCode){
                     $('#exchangeRatesTxt').html(`1 USD = ${(rates[key])} ${isoCode}`);
                 } 
              }          
          },
          error: function(jqXHR, textStatus, errorThrown) {
              console.log("There was an error peforming the AJAX call!");  
          }                          
       }); */    
        
         //newsapi ajax call
         $.ajax({
            url: "./php/getUserLocationNewsData.php",
            type: 'POST',
            dataType: 'json',
            data: {
               isocode: result['data'][0]['components']['ISO_3166-1_alpha-2']
            },
            success: function(result){
                if (result.data[0] != undefined) {
                    $('#newsHeadlineIconImgOne').html(`<a href="${result['data'][0]['url']}"><img src="${result['data'][0]['urlToImage']}" alt="headline image"></a>`);
                    $('#newsHeadlineTxtOne').html(`<b>${result['data'][0]['description']}</b>`);
                    
                    $('#newsHeadlineIconImgTwo').html(`<a href="${result['data'][1]['url']}"><img src="${result['data'][1]['urlToImage']}" alt="headline image"></a>`);
                    $('#newsHeadlineTxtTwo').html(`<b>${result['data'][1]['description']}</b>`);
                    
                    $('#newsHeadlineIconImgThree').html(`<a href="${result['data'][2]['url']}"><img src="${result['data'][2]['urlToImage']}" alt="headline image"></a>`);
                    $('#newsHeadlineTxtThree').html(`<b>${result['data'][2]['description']}</b>`); 
                } else {
                    $('#newsHeadlineIconImgOne').html(`<img src="./img/news_placeholder.png">`);
                    $('#newsHeadlineTxtOne').html("News data currnetly unavailable");
                    $('#newsHeadlineIconImgTwo').html(`<img src="./img/news_placeholder.png">`);
                    $('#newsHeadlineTxtTwo').html("News data currnetly unavailable");
                    $('#newsHeadlineIconImgThree').html(`<img src="./img/news_placeholder.png">`);
                    $('#newsHeadlineTxtThree').html("News data currnetly unavailable");
                }                      
                   
            },
            error: function(jqXHR, textStatus, errorThrown){
                
            }
        }); 
        
        $.ajax({
            url: "./php/getUserLocationCountryInfoData.php",
            type: 'POST',
            dataType: 'json',
            data: {
               isocode: result['data'][0]['components']['ISO_3166-1_alpha-2']
            },
            success: function(result) {
               
                 if (result.status.name == "ok") {
                      $('#countryFlagImg').html(`<img src="${result['data'][0]['flag']}" alt="country flag">`);
                      $('#populationTxt').html(result['data'][0]['population']);
                      $('#capitalCityNameTxt').html(`Capital city: ${result['data'][0]['capital']}`);
                      $('#cityLocationTxt').html(result['data'][0]['capital']);
                      //yelp api search ajax call
                      $.ajax({
                        url: "./php/getCapitalCityBusinessData.php",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            placename: result['data'][0]['capital'],
                        },
                        success: function(result){
                           
                             let businesses = result['data'];
                             businesses.forEach(f => {
                                let lat = f.coordinates.latitude;
                                let long = f.coordinates.longitude;
                                let businessMarker = L.marker(
                                    [lat, long],
                                    {icon: goldIcon}
                                    );
                                allMarkers.addLayer(businessMarker);
                                 
                                let popup = L.popup({
                                    maxWidth: 400
                                })
                                   .setLatLng([lat,long])
                                   .setContent(`
                                   <img style="max-width: 190px;"src="${f.image_url}" alt="image of business">
                                   <br>
                                   <hr>
                                   <p>${f.name}</p>
                                   `)
                                   .openOn(mymap);

                                businessMarker.bindPopup(popup);
                             })
                        },
                        error: function(jqXHR, textStatus, errorThrown){
                            alert("Bussiness data currently unavailable");
                        }
                     });
                      
                      //geonames ajax call
                      $.ajax({
                          url: "./php/getUserLocationWikiData.php",
                          type: 'POST',
                          dataType: 'json',
                          data: {
                            placename: result['data'][0]['capital']
                          },
                          success: function(result){
                              if (result.status.name == "ok") {
                                $('#capitalCitySummaryTxt').html(result['data'][0]['summary']);
                              }
                          },
                          error: function(jqXHR, textStatus, errorThrown) {
                            $('#capitalCitySummaryTxt').html(`No information available for: ${result['data'][0]['capital']}`);  
                          }
                      });
                 }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("There was an error peforming the AJAX call!");  
            }  
        });        

        //openweather api ajax call       
        $.ajax({
            url: "./php/getUserLocationWeatherData.php",
            type: 'POST',
            dataType: 'json',
            data: {
                latitude: result['data'][0]['geometry']['lat'],
                longitude: result['data'][0]['geometry']['lng']
            },
            success: function(result) {
                if (result.status.name == "ok") {
                    //panel one
                    $('#weatherPanelOneDescriptionText').html(result['data'][0]['weather'][0]['description']);
                    $('#weatherPanelOneTemp').html(`${kelvinToCelcius(result['data'][0]['temp']['day'])}<span>°</span>`);
                    $('#weatherPanelOneIcon').html(`<img src="http://openweathermap.org/img/wn/${result['data'][0]['weather'][0]['icon']}@2x.png">`);
                    //panel two
                    $('#weatherPanelTwoIcon').html(`<img src="http://openweathermap.org/img/wn/${result['data'][1]['weather'][0]['icon']}@2x.png">`);
                    $('#weatherPanelTwoTemp').html(`H:${kelvinToCelcius(result['data'][1]['temp']['max'])}<span>°</span> L:${kelvinToCelcius(result['data'][1]['temp']['min'])}<span>°</span>`); 
                    //panel three
                    $('#weatherPanelThreeIcon').html(`<img src="http://openweathermap.org/img/wn/${result['data'][2]['weather'][0]['icon']}@2x.png">`);
                    $('#weatherPanelThreeTemp').html(`H:${kelvinToCelcius(result['data'][2]['temp']['max'])}<span>°</span> L:${kelvinToCelcius(result['data'][2]['temp']['min'])}<span>°</span>`);
                    $('#currDatePlusTwo').html(`${ddPlusTwo}th`);
                    //panel four
                    $('#weatherPanelFourIcon').html(`<img src="http://openweathermap.org/img/wn/${result['data'][3]['weather'][0]['icon']}@2x.png">`);
                    $('#weatherPanelFourTemp').html(`H:${kelvinToCelcius(result['data'][3]['temp']['max'])}<span>°</span> L:${kelvinToCelcius(result['data'][3]['temp']['min'])}<span>°</span>`);
                    $('#currDatePlusThree').html(`${ddPlusThree}th`); 
                    //panel five
                    $('#weatherPanelFiveIcon').html(`<img src="http://openweathermap.org/img/wn/${result['data'][4]['weather'][0]['icon']}@2x.png">`);
                    $('#weatherPanelFiveTemp').html(`H:${kelvinToCelcius(result['data'][4]['temp']['max'])}<span>°</span> L:${kelvinToCelcius(result['data'][4]['temp']['min'])}<span>°</span>`);
                    $('#currDatePlusFour').html(`${ddPlusFour}th`);

                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("There was an error peforming the AJAX call!");  
            }
        });      
        
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log("There was an error with the Ajax call");
        }
        
    });
});

// for layer control 
let baseMaps = {
    "Open Street Map": osm
};

let dataLayer = {
    "My Data": allMarkers
};

// add layer control
L.control.layers(baseMaps, dataLayer).addTo(mymap);