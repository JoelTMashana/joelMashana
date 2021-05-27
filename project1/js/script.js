//initialises an instance of the map class and sets the view to fit world
$(window).on('load', function(){
    $('.loader-wrapper').fadeOut('slow');
});


let osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>',
    thunLink = '<a href="http://thunderforest.com/">Thunderforest</a>';


let osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = '&copy; ' + osmLink + ' Contributors',
    landUrl = 'https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=6d9911c3c07e404eaa8dd1c1067b8c7e',
    thunAttrib = '&copy; '+osmLink+' Contributors & '+thunLink
    worldUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    worldAtrrib = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';


let osmMap = L.tileLayer(osmUrl, {attribution: osmAttrib}),
    landMap = L.tileLayer(landUrl, {attribution: thunAttrib})
    worldMap = L.tileLayer(worldUrl, {attribution: worldAtrrib});

const mymap = L.map('mapid',
{
    layers: [osmMap],
    minZoom: 3,
    maxZoom: 19,
    zoomSnap: 0.1
}).fitWorld();

mymap.locate({setView: true, maxZoom: 16});
//error message if locating user fails
function onLocationError(e) {
    alert(e.message);
}
mymap.on('locationerror', onLocationError);    


//set max bounds so map does not infinitely pan in different directions
const southWest = L.latLng(-89.98155760646617, -180),
northEast = L.latLng(89.99346179538875, 180);
const bounds = L.latLngBounds(southWest, northEast);

mymap.setMaxBounds(bounds);
mymap.on('drag', function() {
    mymap.panInsideBounds(bounds, { animate: false });
});

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


//finds users location and set marker
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


//dates for weather panels
let currDate = new Date();
let ddPlusTwo = String(currDate.getDate() + 2).padStart(2, '0'),
    ddPlusThree = String(currDate.getDate() + 3).padStart(2, '0'),
    ddPlusFour = String(currDate.getDate() + 4).padStart(2, '0');
//openweather data conversion
const kelvinToCelcius = (kelvin) => {
    return Math.floor(kelvin - 273.15);
} 

//func which calls on doc load
$(document).ready(function getUserLocationData() {
    //store users current lat and long so its accessible for all calls        
    navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;

        
        //openweather api ajax call
        $.ajax({
            url: "./php/getLocationWeatherData.php",
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
            url: "./php/getLocationOpenCageDataReverseGeo.php",
            type: 'POST',
            dataType: 'json',
            data: {
                latitude: lat,
                longitude: long
            },
            success: function(result) {
                    //writes locations using data from opencage to html
                    $('#cityLocationTxt').html(result['data'][0]['components']['town']);
                    $('#countryNameTxt').html(result['data'][0]['components']['country']);
                    
                     
                    let isoCode = result['data'][0]['components']['ISO_3166-1_alpha-3'];
        
                    $.ajax({
                         url: "./php/getCountryBordersGeoData.php",
                         type: 'POST',
                         dataType: 'json',
                         success: function(result){
                            countryBordersGeoJsonLayer.clearLayers();
                             let features = result['data'];
                             features.forEach(feature =>{
                                 if(isoCode == feature.properties.iso_a3){
                                    countryBordersGeoJsonLayer.addData(feature);
                                 }
                             });
                         }
                    });
                    
                    //next ajax calls which depends on data from previous
                     /*openexchangerates ajax call
                     let isoCode = result['data'][0]['annotations']['currency']['iso_code'];
                     $.ajax({
                        url: "./php/getLocationExchangeData.php",
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
                        url: "./php/getLocationNewsData.php",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                           isocode: result['data'][0]['components']['ISO_3166-1_alpha-2']
                        },
                        success: function(result){                       
                                $('#newsHeadlineIconImgOne').html(`<a href="${result['data'][0]['url']}" target="_blank"><img src="${result['data'][0]['urlToImage']}" alt="headline image"></a>`);
                                $('#newsHeadlineTxtOne').html(`<b>${result['data'][0]['description']}</b>`);
                                
                                $('#newsHeadlineIconImgTwo').html(`<a href="${result['data'][1]['url']}" target="_blank"><img src="${result['data'][1]['urlToImage']}" alt="headline image"></a>`);
                                $('#newsHeadlineTxtTwo').html(`<b>${result['data'][1]['description']}</b>`);
                                
                                $('#newsHeadlineIconImgThree').html(`<a href="${result['data'][2]['url']}" target="_blank"><img src="${result['data'][2]['urlToImage']}" alt="headline image"></a>`);
                                $('#newsHeadlineTxtThree').html(`<b>${result['data'][2]['description']}</b>`);  
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log("There was an error peforming the AJAX call!");  
                        } 
                    });

                    //RESTCountries ajax call 
                    $.ajax({
                        url: "./php/getLocationCountryInfoData.php",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                           isocode: result['data'][0]['components']['ISO_3166-1_alpha-2']
                        },
                        success: function(result) {
                           
                             if (result.status.name == "ok") {
                                  $('#countryFlagImg').html(`<img src="${result['data'][0]['flag']}" alt="flag image">`);
                                  $('#populationTxt').html(result['data'][0]['population']);
                                  $('#capitalCityNameTxt').html(`Capital city: ${result['data'][0]['capital']}`);
                                  
                                  //geonames ajax call
                                  $.ajax({
                                      url: "./php/getLocationWikiData.php",
                                      type: 'POST',
                                      dataType: 'json',
                                      data: {
                                        placename: result['data'][0]['capital']
                                      },
                                      success: function(result){
                                          if (result.status.name == "ok") {
                                            //https needs to be concatinated for url to work
                                            let wikiUrlString = 'https://' + result['data'][0]['wikipediaUrl']; 
                                            $('#capitalCitySummaryTxt').html(`${result['data'][0]['summary']} <a href=${wikiUrlString}>more</a>`);
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

let businessMarkers = L.markerClusterGroup();
mymap.addLayer(businessMarkers);

let areaOfInterestMarkers = L.markerClusterGroup();
mymap.addLayer(areaOfInterestMarkers);

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


let countryBordersGeoJsonLayer = L.geoJSON().addTo(mymap);

// ajax calls for when user selects country
$('#btnRun').click(function(){
    $.ajax({
        url: "./php/getLocationOpenCageDataForwardGeo.php",
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

        
      
        let isoCode = result['data'][0]['components']['ISO_3166-1_alpha-3'];
        
        $.ajax({
             url: "./php/getCountryBordersGeoData.php",
             type: 'POST',
             dataType: 'json',
             success: function(result){
                countryBordersGeoJsonLayer.clearLayers();
                 let features = result['data'];
                 features.forEach(feature =>{
                     if(isoCode == feature.properties.iso_a3){
                        countryBordersGeoJsonLayer.addData(feature);
                     }
                 });
             }
        });
        
        
        
        //next ajax calls all depend on data from the opencage php routine/ajax call
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
                areaOfInterestMarkers.clearLayers();
                console.log(result['data']);
                let areasOfInterest = result['data'];               
                areasOfInterest.forEach(area => {
                    let areaLat = area.lat;
                    let areaLng = area.lng;
                    let areaOfInterestMarker = L.marker(
                        [areaLat, areaLng],
                        {icon: greenIcon}
                        );
                        areaOfInterestMarkers.addLayer(areaOfInterestMarker);
                    let wikipediaUrl = 'https://' + area.wikipediaUrl;    
                    areaOfInterestMarker.bindPopup(`<a href="${wikipediaUrl}" target="_blank"><h6 style="color: black;">${area.title}</h6></a>`);
                
                });           
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("There was an error peforming the AJAX call!");  
            }                          
         }); 
            

       /*openexchangerates ajax call
       let isoCode = result['data'][0]['annotations']['currency']['iso_code'];
       
       $.ajax({
          url: "./php/getLocationExchangeData.php",
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
            url: "./php/getLocationNewsData.php",
            type: 'POST',
            dataType: 'json',
            data: {
               isocode: result['data'][0]['components']['ISO_3166-1_alpha-2']
            },
            success: function(result){
                if (result.data[0] != undefined) {
                    $('#newsHeadlineIconImgOne').html(`<a href="${result['data'][0]['url']}" target="_blank"><img src="${result['data'][0]['urlToImage']}" alt="headline image"></a>`);
                    $('#newsHeadlineTxtOne').html(`<b>${result['data'][0]['description']}</b>`);
                    
                    $('#newsHeadlineIconImgTwo').html(`<a href="${result['data'][1]['url']}" target="_blank"><img src="${result['data'][1]['urlToImage']}" alt="headline image"></a>`);
                    $('#newsHeadlineTxtTwo').html(`<b>${result['data'][1]['description']}</b>`);
                    
                    $('#newsHeadlineIconImgThree').html(`<a href="${result['data'][2]['url']}" target="_blank"><img src="${result['data'][2]['urlToImage']}" alt="headline image"></a>`);
                    $('#newsHeadlineTxtThree').html(`<b>${result['data'][2]['description']}</b>`); 
                }                    
                   
            },
            error: function(jqXHR, textStatus, errorThrown){
                $('#newsHeadlineIconImgOne').html(`<img src="./img/news_placeholder.png">`);
                $('#newsHeadlineTxtOne').html("News data currnetly unavailable");
                $('#newsHeadlineIconImgTwo').html(`<img src="./img/news_placeholder.png">`);
                $('#newsHeadlineTxtTwo').html("News data currnetly unavailable");
                $('#newsHeadlineIconImgThree').html(`<img src="./img/news_placeholder.png">`);
                $('#newsHeadlineTxtThree').html("News data currnetly unavailable");
            }
        }); 
        
        $.ajax({
            url: "./php/getLocationCountryInfoData.php",
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
                             businessMarkers.clearLayers(); 
                             let businesses = result['data'];
                             console.log(result['data']);
                             businesses.forEach(f => {
                                let lat = f.coordinates.latitude;
                                let long = f.coordinates.longitude;
                                let businessMarker = L.marker(
                                    [lat, long],
                                    {icon: goldIcon}
                                    );
                                businessMarkers.addLayer(businessMarker);
                                
                                
                                let popup = L.popup({
                                    maxWidth: 400
                                })
                                   .setLatLng([lat,long])
                                   .setContent(`                                  
                                   <a href="${f.url}" target="_blank"><h6>${f.name}</h6></a>
                                   `)
                                   .openOn(mymap);

                                businessMarker.bindPopup(popup);
                             });
                        },
                        error: function(jqXHR, textStatus, errorThrown){
                            alert("Bussiness data currently unavailable");
                        }
                     });
                      
                      //geonames ajax call
                      $.ajax({
                          url: "./php/getLocationWikiData.php",
                          type: 'POST',
                          dataType: 'json',
                          data: {
                            placename: result['data'][0]['capital']
                          },
                          success: function(result){
                              if (result.status.name == "ok") {
                                let wikiUrlString = 'https://' + result['data'][0]['wikipediaUrl']; 
                                $('#capitalCitySummaryTxt').html(`${result['data'][0]['summary']} <a href=${wikiUrlString}>more</a>`);
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
            url: "./php/getLocationWeatherData.php",
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
            console.log("There was an error peforming the AJAX call!");
        }
        
    });
});


//nav buttons
//locate user, set view and run ajax calls to write data to html and place markers around user local area

$('#locate').click(function (){
    
    navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;  
    
    //set view
    mymap.setView(
        [lat, long,],
        16
    );
    //ajax call to open cage
    $.ajax({
        url: "./php/getLocationOpenCageDataReverseGeo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            latitude: lat,
            longitude: long       
        },
        //all ajax calls dependent on openage results are within the success func
        success: function(result){
             console.log(result.data);
            //write coutry name to country name header 
            $('#countryNameTxt').html(result['data'][0]['components']['country']); 
            $('#cityLocationTxt').html(result['data'][0]['components']['town']);

            //country borders ajax 
            let isoCode = result['data'][0]['components']['ISO_3166-1_alpha-3'];
            $.ajax({
                 url: "./php/getCountryBordersGeoData.php",
                 type: 'POST',
                 dataType: 'json',
                 success: function(result){
                    countryBordersGeoJsonLayer.clearLayers();
                     let features = result['data'];
                     features.forEach(feature =>{
                         if(isoCode == feature.properties.iso_a3){
                            countryBordersGeoJsonLayer.addData(feature);
                         }
                     });
                 }
            });      
            
               
            /*openexchangerates ajax call
               let isoCode = result['data'][0]['annotations']['currency']['iso_code'];
       
               $.ajax({
                    url: "./php/getLocationExchangeData.php",
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
                
                //news ajax call
                $.ajax({
                    url: "./php/getLocationNewsData.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                       isocode: result['data'][0]['components']['ISO_3166-1_alpha-2']
                    },
                    success: function(result){
                        if (result.data[0] != undefined) {
                            $('#newsHeadlineIconImgOne').html(`<a href="${result['data'][0]['url']}" target="_blank"><img src="${result['data'][0]['urlToImage']}" alt="headline image"></a>`);
                            $('#newsHeadlineTxtOne').html(`<b>${result['data'][0]['description']}</b>`);
                            
                            $('#newsHeadlineIconImgTwo').html(`<a href="${result['data'][1]['url']}" target="_blank"><img src="${result['data'][1]['urlToImage']}" alt="headline image"></a>`);
                            $('#newsHeadlineTxtTwo').html(`<b>${result['data'][1]['description']}</b>`);
                            
                            $('#newsHeadlineIconImgThree').html(`<a href="${result['data'][2]['url']}" target="_blank"><img src="${result['data'][2]['urlToImage']}" alt="headline image"></a>`);
                            $('#newsHeadlineTxtThree').html(`<b>${result['data'][2]['description']}</b>`); 
                        }                    
                           
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        $('#newsHeadlineIconImgOne').html(`<img src="./img/news_placeholder.png">`);
                        $('#newsHeadlineTxtOne').html("News data currnetly unavailable");
                        $('#newsHeadlineIconImgTwo').html(`<img src="./img/news_placeholder.png">`);
                        $('#newsHeadlineTxtTwo').html("News data currnetly unavailable");
                        $('#newsHeadlineIconImgThree').html(`<img src="./img/news_placeholder.png">`);
                        $('#newsHeadlineTxtThree').html("News data currnetly unavailable");
                    }
                });

                $.ajax({
                    url: "./php/getLocationCountryInfoData.php",
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
                                  url: "./php/getLocationWikiData.php",
                                  type: 'POST',
                                  dataType: 'json',
                                  data: {
                                    placename: result['data'][0]['capital']
                                  },
                                  success: function(result){
                                      if (result.status.name == "ok") {
                                        let wikiUrlString = 'https://' + result['data'][0]['wikipediaUrl']; 
                                        $('#capitalCitySummaryTxt').html(`${result['data'][0]['summary']} <a href=${wikiUrlString}>more</a>`);
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

                $.ajax({
                    url: "./php/getLocationWeatherData.php",
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
            console.log("There was an error peforming the AJAX call!");
        }
    });

  });  
});


// for layer control 
let baseMaps = {
    "Open street": osmMap,
	"Landscape": landMap,
    "World": worldMap
};

let dataLayer = {
    "Businesses": businessMarkers,
    "Areas of Interest": areaOfInterestMarkers
};

// add layer control which allows user to toggle data
L.control.layers(baseMaps, dataLayer).addTo(mymap);


