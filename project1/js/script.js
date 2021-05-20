//initialises an instance of the map class and sets the view to fit world
const mymap = L.map('mapid',
{
    
}).setView([51.505, -0.09], 13);

//add the tile layer on the class, in this case i used thunderforest
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 3,
    maxZoom: 19,
    zoomSnap: 0.1,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);


// on load run ajax call to populate search bar with country options dynamically
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

// on load set the country user is currently in in focus
$(document).ready(function (){
    navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;

    $.ajax({
        url: "./php/getUserLocationOpenCageData.php",
        type: 'POST',
        dataType: 'json',
        data: {
           latitude: lat,
           longitude: long
         },
        success: function(result){           
          
            $.ajax({
                url: "./php/getUserLocationCountryInfoData.php",
                type: 'POST',
                dataType: 'json',
                data: {
                   isocode: result['data'][0]['components']['ISO_3166-1_alpha-2']
                },
                success: function(result) {
                    let lat = result['data'][0]['latlng'][0];
                    let lng = result['data'][0]['latlng'][1];    
            
                    mymap.setView([lat,lng], 4);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("There was an error peforming the AJAX call!");  
                }  
            });         
          
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log("There was an error peforming the AJAX call!");  
        }
    });
    
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
}

//nav buttons
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
                     //openexchangerates ajax call
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
                     });

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
let layer = L.geoJSON().addTo(mymap);
$('#btnRun').click(function (){
    $.ajax({
        url: "./php/getCountryBordersGeoData.php",
        type: 'POST',
        dataType: 'json',
        success: function(result){           


            let countryName = $('#val').val();
            let features = result['data'];
            console.log(features);
            for (i = 0; i < features.length; i++){
                if(countryName == features[i].properties.name){
                    let layer = L.geoJSON(features[i]).addTo(mymap);
                }      
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log("There was an error peforming the AJAX call!");  
        }
    });    
});
*/



// on country select set the view to currently selected map
$('#btnRun').click(function (){
    $.ajax({
        url: "./php/getCountryOpenCageData.php",
        type: 'POST',
        dataType: 'json',
        data: {
            placename: $('#val').val(),  
         },
        success: function(result){           
        
        
        let lat = result['data'][0]['geometry']['lat'];
        let lng = result['data'][0]['geometry']['lng'];    

        mymap.setView([lat,lng], 4);   
         
          
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log("There was an error peforming the AJAX call!");  
        }
    });    
});

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
            $('#countryNameTxt').html(result['data'][0]['components']['country']); 
        console.log(result.data);
       //openexchangerates ajax call
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
       });     
        
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