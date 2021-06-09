//initialises an instance of the map class and sets the view to fit world
$(window).on('load', function(){
    $('.loader-wrapper').fadeOut('slow');
});

//multiple tile layer options for layer control 
let osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>',
    thunLink = '<a href="http://thunderforest.com/">Thunderforest</a>',
    owmLink = '<a href="https://tile.openweathermap.org">OpenWeatherMap</a>';


let osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = '&copy; ' + osmLink + ' Contributors',
    landUrl = 'https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=6d9911c3c07e404eaa8dd1c1067b8c7e',
    thunAttrib = '&copy; '+osmLink+' Contributors & '+thunLink
    worldUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    worldAtrrib = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    owmUrl = 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=4541ec3104d4b03ca4323bb3f54c4079',
    owmAttrib = '&copy; ' + owmLink + ' Contributors';


let osmMap = L.tileLayer(osmUrl, {attribution: osmAttrib}),
    landMap = L.tileLayer(landUrl, {attribution: thunAttrib})
    worldMap = L.tileLayer(worldUrl, {attribution: worldAtrrib})
    owmMap = L.tileLayer(owmUrl, {attribution: owmAttrib});



const mymap = L.map('mapid',
{
    layers: [osmMap],
    minZoom: 3,
    maxZoom: 19,
    zoomSnap: 0.01
}).fitWorld();

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

//populate select with country names
$(document).ready(function() {
    
    $.ajax({
         type: 'POST',
         url: './php/getCountryNameGeoData.php',
         dataType: 'json',
         success: function(result){
            
            $('#selCountry').html('');

            $.each(result.data, function(index) {
                 
                $('#selCountry').append($("<option>", {
                     value: result.data[index].code,
                     text: result.data[index].name
                }));
            });
         },
         error: function(jqXHR, textStatus, errorThrown){
            console.log("There was an error with the getCountryNameData Ajax call");
         }
    });
    // get user location and change value of select to country user currently in
    // then add border around the country 
    navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        
        $.ajax({
            type: 'POST',
            url: './php/getUserLocationCountryCode.php',
            dataType: 'json',
            data: {
                latitude: lat,
                longitude: long
            },
            success: function(result){
                 $('#selCountry').val(result.data);
                 $.ajax({
                    url: "./php/getCountryBordersGeoData.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        isocode: result.data
                    },
                    success: function(result){
                       countryBordersGeoJsonLayer.clearLayers();
                       countryBordersGeoJsonLayer.addData(result.data);
                       mymap.fitBounds(countryBordersGeoJsonLayer.getBounds()); 
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                       console.log("There was an error peforming the AJAX call!");
                    }
               });
            },
            error: function(jqXHR, textStatus, errorThrown){
               console.log("There was an error with the Ajax call");
            }
       });
        
    });    

});

//markers
let areaOfInterestMarkers = L.markerClusterGroup();
mymap.addLayer(areaOfInterestMarkers);

//temporary color marker until I find better alternative
const greenIcon = new L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const greyIcon = new L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]    
});

const violetIcon = new L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]    
});

const blackIcon = new L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]    
});

// for restaurants
const utensilsIcon = L.AwesomeMarkers.icon({
    icon: 'utensils',
    markerColor: 'red',
    prefix: 'fa'
  });
// for cocktail bars  
const cocktailIcon = L.AwesomeMarkers.icon({
    icon: 'cocktail',
    markerColor: 'orange',
    prefix: 'fa'
  });

const salonIcon = L.AwesomeMarkers.icon({
    icon: 'cut',
    markerColor: 'purple',
    prefix: 'fa'
  });

const weightsIcon = L.AwesomeMarkers.icon({
    icon: 'dumbbell',
    markerColor: 'blue',
    prefix: 'fa'
  });

const museumIcon = L.AwesomeMarkers.icon({
    icon: 'landmark',
    markerColor: 'cadetblue',
    prefix: 'fa'
  });



let restaurantMarkers = L.markerClusterGroup();
mymap.addLayer(restaurantMarkers);

let gymMarkers = L.markerClusterGroup();
mymap.addLayer(gymMarkers);

let salonMarkers = L.markerClusterGroup();
mymap.addLayer(salonMarkers);

let museumMarkers = L.markerClusterGroup();
mymap.addLayer(museumMarkers);

let cocktailBarMarkers = L.markerClusterGroup();
mymap.addLayer(cocktailBarMarkers);

let cityMarkers = L.markerClusterGroup();
mymap.addLayer(cityMarkers)

let theMarker = {};
mymap.on('click', function(e) {
    if (theMarker != undefined){
         mymap.removeLayer(theMarker);
    };
    theMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap);
    alertFuncTwo();
    $('.latLongTxt ').html(e.latlng.lat + ',' + e.latlng.lng);
    //ajax call to opencage
    $.ajax({
        url: "./php/getLocationOpenCageDataReverseGeo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            latitude: e.latlng.lat,
            longitude: e.latlng.lng
        },
        success: function(result){
            //writes to the alert box 
            if(result['data'][0]['components']['city'] != undefined){
                $('.townNameTxt').html(`${result['data'][0]['components']['city'] }, ${result['data'][0]['components']['road']}`);
            } else if(result['data'][0]['components']['town'] != undefined) {
                $('.townNameTxt').html(`${result['data'][0]['components']['town'] }, ${result['data'][0]['components']['road']}`);
            } else if(result['data'][0]['components']['state'] != undefined){
                $('.townNameTxt').html(`${result['data'][0]['components']['state'] }, ${result['data'][0]['components']['road']}`);
            }

            if(result['data'][0]['components']['county'] != undefined){
                $('.countyNameText').html(result['data'][0]['components']['county']);
            } else {
                $('.countyNameText').html(result['data'][0]['components']['country']);
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
             console.log("There was an error with the map click ajax call!");
        }
    });
});


//styled alert when user selects country with no business data
function functionAlert(msg, myYes) {
    var confirmBox = $("#confirm");
    confirmBox.find(".message").text(msg);
    confirmBox.find(".yes").unbind().click(function() {
       confirmBox.hide();
    });
    confirmBox.find(".yes").click(myYes);
    confirmBox.show();
 }
//style alert box when user click on any position on the map
function functionAlertTwo(msg, myYes) {
    var confirmBox = $("#confirmTwo");
    confirmBox.find(".messageTwo").text(msg);
    confirmBox.find(".yesTwo").unbind().click(function() {
       confirmBox.hide();
    });
    confirmBox.find(".yesTwo").click(myYes);
    confirmBox.show();
 } 

 //screen widths
 var widths = [0, 500, 850];

 //styles alert box only shows on small to medium screens
 //otherwise normal alert box 
 function alertFunc() {
 if (window.innerWidth>=widths[2]) {
    functionAlert();
    functionAlertTwo();
 } else {
    alert('Business data unavailable');
    }
 };

 function alertFuncTwo() {
    if (window.innerWidth>=widths[2]) {
       functionAlertTwo();
    } 
};
//dates for weather panels
let currDate = new Date();
let ddPlusTwo = String(currDate.getDate() + 2).padStart(2, '0'),
    ddPlusThree = String(currDate.getDate() + 3).padStart(2, '0'),
    ddPlusFour = String(currDate.getDate() + 4).padStart(2, '0');

    
//openweather data conversion
const kelvinToCelcius = (kelvin) => {
    return Math.floor(kelvin - 273.15);
} 

// dates for covid api endpoints
let today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); 
const yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;


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
                    $('#weatherPanelOneIcon').html(`<img src="https://openweathermap.org/img/wn/${result['data'][0]['weather'][0]['icon']}@2x.png">`);
                    //panel two
                    $('#weatherPanelTwoIcon').html(`<img src="https://openweathermap.org/img/wn/${result['data'][1]['weather'][0]['icon']}@2x.png">`);
                    $('#weatherPanelTwoTemp').html(`H:${kelvinToCelcius(result['data'][1]['temp']['max'])}<span>°</span> L:${kelvinToCelcius(result['data'][1]['temp']['min'])}<span>°</span>`); 
                    //panel three
                    $('#weatherPanelThreeIcon').html(`<img src="https://openweathermap.org/img/wn/${result['data'][2]['weather'][0]['icon']}@2x.png">`);
                    $('#weatherPanelThreeTemp').html(`H:${kelvinToCelcius(result['data'][2]['temp']['max'])}<span>°</span> L:${kelvinToCelcius(result['data'][2]['temp']['min'])}<span>°</span>`);
                    $('#currDatePlusTwo').html(`${ddPlusTwo}th`);
                    //panel four
                    $('#weatherPanelFourIcon').html(`<img src="https://openweathermap.org/img/wn/${result['data'][3]['weather'][0]['icon']}@2x.png">`);
                    $('#weatherPanelFourTemp').html(`H:${kelvinToCelcius(result['data'][3]['temp']['max'])}<span>°</span> L:${kelvinToCelcius(result['data'][3]['temp']['min'])}<span>°</span>`);
                    $('#currDatePlusThree').html(`${ddPlusThree}th`); 
                    //panel five
                    $('#weatherPanelFiveIcon').html(`<img src="https://openweathermap.org/img/wn/${result['data'][4]['weather'][0]['icon']}@2x.png">`);
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
                    $('#cityLocationNewsTxt').html(result['data'][0]['components']['country']);
                    $('#cityLocationCovidTxt').html(result['data'][0]['components']['country']);
                    
                    
                    let timeZone = result['data'][0]['annotations']['timezone']['name']; 
                    //next ajax calls which depends on data from previous

                    //covid news ajax call
                    $.ajax({
                        url: "./php/getLocationCovidNewsData.php",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                           isocode: result['data'][0]['components']['ISO_3166-1_alpha-2']
                        },
                        success: function(result){                       
                                $('#covidNewsHeadlineIconImgOne').html(`<a href="${result['data'][0]['url']}" target="_blank"><img src="${result['data'][0]['urlToImage']}" alt="headline image"></a>`);
                                $('#covidNewsHeadlineTxtOne').html(`<b>${result['data'][0]['description']}</b>`);
                                
                                $('#covidNewsHeadlineIconImgTwo').html(`<a href="${result['data'][1]['url']}" target="_blank"><img src="${result['data'][1]['urlToImage']}" alt="headline image"></a>`);
                                $('#covidNewsHeadlineTxtTwo').html(`<b>${result['data'][1]['description']}</b>`);
                                
                                $('#covidNewsHeadlineIconImgThree').html(`<a href="${result['data'][2]['url']}" target="_blank"><img src="${result['data'][2]['urlToImage']}" alt="headline image"></a>`);
                                $('#covidNewsHeadlineTxtThree').html(`<b>${result['data'][2]['description']}</b>`);  
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            $('#covidNewsHeadlineIconImgOne').html(`<img src="./img/news_placeholder.png">`);
                            $('#covidNewsHeadlineTxtOne').html("News data currently unavailable");
                            $('#covidNewsHeadlineIconImgTwo').html(`<img src="./img/news_placeholder.png">`);
                            $('#covidNewsHeadlineTxtTwo').html("News data currently unavailable");
                            $('#covidNewsHeadlineIconImgThree').html(`<img src="./img/news_placeholder.png">`);
                            $('#covidNewsHeadlineTxtThree').html("News data currently unavailable");
                            console.log("There was an error peforming the news AJAX call on load!");  
                        } 
                    });
                    //covid data ajax
                     $.ajax({
                        url: "./php/getCountryCovidData.php",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                             isocode: result['data'][0]['components']['ISO_3166-1_alpha-2'],
                        },
                        success: function(result){
                            //all time figures
                            $('#covidFigureRecovered').html(result['data']['latest_data']['recovered']);
                            $('#covidFigureConfirmed').html(result['data']['latest_data']['confirmed']);
                            $('#covidFigureDeaths').html(result['data']['latest_data']['deaths']);
                            
                            //calculated figures
                            $('#covidFigureCasesPerMilli').html(result['data']['latest_data']['calculated']['cases_per_million_population']);
                            $('#covidFigureDeathRate').html(`${Math.floor(result['data']['latest_data']['calculated']['death_rate'])}%`);
                            $('#covidFigureRecoveryRate').html(`${Math.floor(result['data']['latest_data']['calculated']['recovery_rate'])}%`);
                            //today
                            $('#covidFigureConfirmedToday').html(result['data']['today']['confirmed']);
                            $('#covidFigureDeathsToday').html(result['data']['today']['deaths']);
                             
                        },
                        error: function(jqXHR, textStatus, errorThrown){
                            console.log("There was an error peforming the AJAX call!"); 
                        }
                     });  

                     let isoCode = result['data'][0]['components']['ISO_3166-1_alpha-3'];
                     let isoCodeCurrency = result['data'][0]['annotations']['currency']['iso_code'];
                     $.ajax({
                        url: "./php/getLocationExchangeData.php",
                        type: 'POST',
                        dataType: 'json',
                        success: function(result){
                        
                            let rates = result['data'];                           
                            for (let key in rates) {
                               if(key == isoCodeCurrency){
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

                                $('#newsHeadlineIconImgFour').html(`<a href="${result['data'][3]['url']}" target="_blank"><img src="${result['data'][3]['urlToImage']}" alt="headline image"></a>`);
                                $('#newsHeadlineTxtFour').html(`<b>${result['data'][3]['description']}</b>`);

                                $('#newsHeadlineIconImgFive').html(`<a href="${result['data'][4]['url']}" target="_blank"><img src="${result['data'][4]['urlToImage']}" alt="headline image"></a>`);
                                $('#newsHeadlineTxtFive').html(`<b>${result['data'][4]['description']}</b>`);

                                $('#newsHeadlineIconImgSix').html(`<a href="${result['data'][5]['url']}" target="_blank"><img src="${result['data'][5]['urlToImage']}" alt="headline image"></a>`);
                                $('#newsHeadlineTxtSix').html(`<b>${result['data'][5]['description']}</b>`);
                                
                                $('#newsHeadlineIconImgSeven').html(`<a href="${result['data'][6]['url']}" target="_blank"><img src="${result['data'][6]['urlToImage']}" alt="headline image"></a>`);
                                $('#newsHeadlineTxtSeven').html(`<b>${result['data'][6]['description']}</b>`);
                                
                                $('#newsHeadlineIconImgEight').html(`<a href="${result['data'][7]['url']}" target="_blank"><img src="${result['data'][7]['urlToImage']}" alt="headline image"></a>`);
                                $('#newsHeadlineTxtEight').html(`<b>${result['data'][7]['description']}</b>`);  
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            $('#newsHeadlineIconImgOne').html(`<img src="./img/news_placeholder.png">`);
                            $('#newsHeadlineTxtOne').html("News data currently unavailable");
                            $('#newsHeadlineIconImgTwo').html(`<img src="./img/news_placeholder.png">`);
                            $('#newsHeadlineTxtTwo').html("News data currently unavailable");
                            $('#newsHeadlineIconImgThree').html(`<img src="./img/news_placeholder.png">`);
                            $('#newsHeadlineTxtThree').html("News data currently unavailable");
                            $('#newsHeadlineIconImgFour').html(`<img src="./img/news_placeholder.png">`);
                            $('#newsHeadlineTxtFour').html("News data currently unavailable");
                            $('#newsHeadlineIconImgFive').html(`<img src="./img/news_placeholder.png">`);
                            $('#newsHeadlineTxtFive').html("News data currently unavailable");
                            $('#newsHeadlineIconImgSix').html(`<img src="./img/news_placeholder.png">`);
                            $('#newsHeadlineTxtSix').html("News data currently unavailable");
                            $('#newsHeadlineIconImgSeven').html(`<img src="./img/news_placeholder.png">`);
                            $('#newsHeadlineTxtSeven').html("News data currently unavailable");
                            $('#newsHeadlineIconImgEight').html(`<img src="./img/news_placeholder.png">`);
                            $('#newsHeadlineTxtEight').html("News data currently unavailable");

                            console.log("There was an error peforming the news AJAX call on load!");  
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
                                  
                                  $.ajax({
                                    url: "./php/getTimezoneData.php",
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                        timezone: timeZone
                                    },
                                    success: function(result){
                                         let dateTimeRaw = result['data']['datetime'];
                                         let dateTimeSplit = dateTimeRaw.split('T');
                                         let timeInfoSplit = dateTimeSplit[1];
                                         let time = timeInfoSplit.split('.');
                                         let timeReal = time[0];
                                         let currTime = timeReal.substring(0, timeReal.length - 3);
                                         $('#weatherPanelOneTimezoneNameText').html(result['data']['timezone']);
                                         $('#weatherPanelOneTimeZoneTimeTxt').html(currTime);
                                         $('#weatherPanelOneTimeZoneAbbreviationTxt').html(result['data']['abbreviation']);

                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                      console.log("There was an error peforming the AJAX call!");  
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
                                            //https needs to be concatinated for url to work
                                            let wikiUrlString = 'https://' + result['data'][0]['wikipediaUrl']; 
                                            $('#capitalCitySummaryTxt').html(`${result['data'][0]['summary']} <a href=${wikiUrlString} target="_blank">more</a>`);
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


//places markers down on search 
$('#selCountry').change(function countryMarkersOnChange(){  
    $.ajax({
         url: "./php/getLocationCountryInfoData.php",
         type: 'POST',
         dataType: 'json',
         data: {
            isocode: $('#selCountry').val()
         },
         success: function(result){
            $.ajax({
                url: "./php/getLocationOpenCageDataForwardGeo.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    placename: result['data'][0]['name']
                },
                success: function(result){
                    $.ajax({
                        url: "./php/getLocationCountryInfoData.php",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            isocode: result['data'][0]['components']['ISO_3166-1_alpha-3']
                        },
                        success: function(result){
                            $.ajax({
                                url: "./php/getCapitalCityRestaurantsData.php",
                                type: 'POST',
                                dataType: 'json',
                                data: {
                                    placename: result['data'][0]['capital']
                                },
                                success: function(result){
                                    restaurantMarkers.clearLayers(); 
                                    let restaurants = result['data'];
                                    restaurants.forEach(r => {
                                       let lat = r.coordinates.latitude;
                                       let long = r.coordinates.longitude;
                                       let restaurantMarker = L.marker(
                                           [lat, long],
                                           {icon: utensilsIcon}
                                           );
                                           restaurantMarkers.addLayer(restaurantMarker);
                                       
                                       
                                       let popup = L.popup({
                                           maxWidth: 400
                                       })
                                          .setLatLng([lat,long])
                                          .setContent(`
                                            <div class="container-fluid">
                                              <div class="row">
                                                <div class="col-12">
                                                    <div class="card businessMarkerInfoIconCard mx-auto">
                                                    <a href="${r.url}" target="_blank"><img src="${r.image_url}" alt="image"></a> 
                                                    </div>
                                                    <hr>
                                                    <p>${r.name}</p>
                                                </div>
                                              </div>
                                            </div>
                                          `) 
                                          .openOn(mymap);
        
                                          restaurantMarker.bindPopup(popup);
                                    });
                                },
                                error: function(jqXHR, textStatus, errorThrown){
                                    alertFunc();
                                    console.log("Restaurant data not available");
                               }
                            });
                            
                                    //gym data ajax call 
                                    $.ajax({
                                        url: "./php/getCapitalCityGymData.php",
                                        type: 'POST',
                                        dataType: 'json',
                                        data: {
                                           placename: result['data'][0]['capital'] 
                                        }, 
                                        success: function(result){
                                           gymMarkers.clearLayers(); 
                                           let gyms = result['data'];
                                           gyms.forEach(g => {
                                              let lat = g.coordinates.latitude;
                                              let long = g.coordinates.longitude;
                                              let gymMarker = L.marker(
                                                  [lat, long],
                                                  {icon: weightsIcon}
                                                  );
                                                  gymMarkers.addLayer(gymMarker);
                                              
                                              
                                              let popup = L.popup({
                                                  maxWidth: 400
                                              })
                                                 .setLatLng([lat,long])
                                                 .setContent(`                                  
                                                 <div class="container-fluid">
                                                 <div class="row">
                                                   <div class="col-12">
                                                       <div class="card businessMarkerInfoIconCard mx-auto">
                                                       <a href="${g.url}" target="_blank"><img src="${g.image_url}" alt="image"></a> 
                                                       </div>
                                                       <hr>
                                                       <p>${g.name}</p>
                                                   </div>
                                                 </div>
                                               </div>
                                                 `)
                                                 .openOn(mymap);
               
                                                 gymMarker.bindPopup(popup);
                                           });
                                        },
                                        error: function(jqXHR, textStatus, errorThrown){
                                           console.log("Gym data not available");
                                       }
                                   });
                                   
                                     //salon data ajax call 
                                   $.ajax({
                                    url: "./php/getCapitalCitySalonData.php",
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                       placename: result['data'][0]['capital'] 
                                    }, 
                                    success: function(result){
                                       salonMarkers.clearLayers(); 
                                       let salons = result['data'];
                                       salons.forEach(s => {
                                          let lat = s.coordinates.latitude;
                                          let long = s.coordinates.longitude;
                                          let salonMarker = L.marker(
                                              [lat, long],
                                              {icon: salonIcon}
                                              );
                                              salonMarkers.addLayer(salonMarker);
                                          
                                          
                                          let popup = L.popup({
                                              maxWidth: 400
                                          })
                                             .setLatLng([lat,long])
                                             .setContent(`                                  
                                             <div class="container-fluid">
                                             <div class="row">
                                               <div class="col-12">
                                                   <div class="card businessMarkerInfoIconCard mx-auto">
                                                   <a href="${s.url}" target="_blank"><img src="${s.image_url}" alt="image"></a> 
                                                   </div>
                                                   <hr>
                                                   <p>${s.name}</p>
                                               </div>
                                             </div>
                                           </div>
                                             `)
                                             .openOn(mymap);
           
                                             salonMarker.bindPopup(popup);
                                       });
                                    },
                                    error: function(jqXHR, textStatus, errorThrown){
                                       console.log("Salon data not available");
                                   }
                                   });
        
                                   //museum data ajax call 
                                   $.ajax({
                                    url: "./php/getCapitalCityMuseumData.php",
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                       placename: result['data'][0]['capital'] 
                                    }, 
                                    success: function(result){
                                       museumMarkers.clearLayers(); 
                                       let museums = result['data'];
                                       museums.forEach(m => {
                                          let lat = m.coordinates.latitude;
                                          let long = m.coordinates.longitude;
                                          let museumMarker = L.marker(
                                              [lat, long],
                                              {icon: museumIcon}
                                              );
                                              museumMarkers.addLayer(museumMarker);
                                          
                                          
                                          let popup = L.popup({
                                              maxWidth: 400
                                          })
                                             .setLatLng([lat,long])
                                             .setContent(`                                  
                                             <div class="container-fluid">
                                             <div class="row">
                                               <div class="col-12">
                                                   <div class="card businessMarkerInfoIconCard mx-auto">
                                                   <a href="${m.url}" target="_blank"><img src="${m.image_url}" alt="image"></a> 
                                                   </div>
                                                   <hr>
                                                   <p>${m.name}</p>
                                               </div>
                                             </div>
                                           </div>
                                             `)
                                             .openOn(mymap);
           
                                             museumMarker.bindPopup(popup);
                                       });
                                    },
                                    error: function(jqXHR, textStatus, errorThrown){
                                       console.log("Museum data not availalbe");
                                   }
                                 });
        
                                    //cocktail bar data ajax call 
                                   $.ajax({
                                    url: "./php/getCapitalCityCocktailBarData.php",
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                       placename: result['data'][0]['capital'] 
                                    }, 
                                    success: function(result){
                                       cocktailBarMarkers.clearLayers(); 
                                       let cocktailBars = result['data'];
                                       cocktailBars.forEach(c => {
                                          let lat = c.coordinates.latitude;
                                          let long = c.coordinates.longitude;
                                          let cocktailBarMarker = L.marker(
                                              [lat, long],
                                              {icon: cocktailIcon}
                                              );
                                              cocktailBarMarkers.addLayer(cocktailBarMarker);
                                          
                                          
                                          let popup = L.popup({
                                              maxWidth: 400
                                          })
                                             .setLatLng([lat,long])
                                             .setContent(`                                  
                                             <div class="container-fluid">
                                             <div class="row">
                                               <div class="col-12">
                                                   <div class="card businessMarkerInfoIconCard mx-auto">
                                                   <a href="${c.url}" target="_blank"><img src="${c.image_url}" alt="image"></a> 
                                                   </div>
                                                   <hr>
                                                   <p>${c.name}</p>
                                               </div>
                                             </div>
                                           </div>
                                             `)
                                             .openOn(mymap);
           
                                             cocktailBarMarker.bindPopup(popup);
                                       });
                                    },
                                    error: function(jqXHR, textStatus, errorThrown){
                                       console.log("Cocktail bar data not available");
                                   }
                                 });
        
        
                        },
                        error: function(jqXHR, textStatus, errorThrown){
                           console.log("There was an error peforming the AJAX call!");
                       }
                    });
                },
                error: function(jqXHR, textStatus, errorThrown){
                   console.log("There was an error peforming the AJAX call!");
               }
            });
         },
         error: function(){

         }
    });
});

function style(feature) {
    return {
        fillColor: '#daa85d',
        fillOpacity: 0.1,
        weight: 2,
        opacity: 2,
        color: '#daa85d'
    };
}

//initiase country borders before usage below
let countryBordersGeoJsonLayer = L.geoJSON(null, {style: style}).addTo(mymap);
// ajax calls for when user selects country

$('#selCountry').change(function countryInfoOnChange(){
    
    $.ajax({
         url: "./php/getLocationCountryInfoData.php",
         type: 'POST',
         dataType: 'json',
         data: {
            isocode: $('#selCountry').val()
         },
         success: function(result){
            $.ajax({
                url: "./php/getLocationOpenCageDataForwardGeo.php",
                type: 'POST',
                dataType: 'json',
                data: {
                   placename: result['data'][0]['name'],  
                },
                success: function(result){              
                //write coutry name to country name header 
                $('#countryNameTxt').html(result['data'][0]['components']['country']);
                $('#cityLocationNewsTxt').html(result['data'][0]['components']['country']); 
        
                //set view to selected country
                let lat = result['data'][0]['geometry']['lat'];
                let lng = result['data'][0]['geometry']['lng'];    
                mymap.setView([lat,lng], 4, {animate:true, duration:3.0});
                let timeZone = result['data'][0]['annotations']['timezone']['name'];      
               //covid news ajax call
                    $.ajax({
                        url: "./php/getLocationCovidNewsData.php",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                           isocode: result['data'][0]['components']['ISO_3166-1_alpha-2']
                        },
                        success: function(result){                       
                                $('#covidNewsHeadlineIconImgOne').html(`<a href="${result['data'][0]['url']}" target="_blank"><img src="${result['data'][0]['urlToImage']}" alt="headline image"></a>`);
                                $('#covidNewsHeadlineTxtOne').html(`<b>${result['data'][0]['description']}</b>`);
                                
                                $('#covidNewsHeadlineIconImgTwo').html(`<a href="${result['data'][1]['url']}" target="_blank"><img src="${result['data'][1]['urlToImage']}" alt="headline image"></a>`);
                                $('#covidNewsHeadlineTxtTwo').html(`<b>${result['data'][1]['description']}</b>`);
                                
                                $('#covidNewsHeadlineIconImgThree').html(`<a href="${result['data'][2]['url']}" target="_blank"><img src="${result['data'][2]['urlToImage']}" alt="headline image"></a>`);
                                $('#covidNewsHeadlineTxtThree').html(`<b>${result['data'][2]['description']}</b>`);  
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            $('#covidNewsHeadlineIconImgOne').html(`<img src="./img/news_placeholder.png">`);
                            $('#covidNewsHeadlineTxtOne').html("News data currently unavailable");
                            $('#covidNewsHeadlineIconImgTwo').html(`<img src="./img/news_placeholder.png">`);
                            $('#covidNewsHeadlineTxtTwo').html("News data currently unavailable");
                            $('#covidNewsHeadlineIconImgThree').html(`<img src="./img/news_placeholder.png">`);
                            $('#covidNewsHeadlineTxtThree').html("News data currently unavailable");
                            console.log("There was an error peforming the news AJAX call on load!");  
                        } 
                    });
                    //covid data ajax
                     $.ajax({
                        url: "./php/getCountryCovidData.php",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                             isocode: result['data'][0]['components']['ISO_3166-1_alpha-2'],
                        },
                        success: function(result){
                            console.log(result.data);
                            //all time figures
                            $('#covidFigureRecovered').html(result['data']['latest_data']['recovered']);
                            $('#covidFigureConfirmed').html(result['data']['latest_data']['confirmed']);
                            $('#covidFigureDeaths').html(result['data']['latest_data']['deaths']);
                            
                            //calculated figures
                            $('#covidFigureCasesPerMilli').html(result['data']['latest_data']['calculated']['cases_per_million_population']);
                            $('#covidFigureDeathRate').html(`${Math.floor(result['data']['latest_data']['calculated']['death_rate'])}%`);
                            $('#covidFigureRecoveryRate').html(`${Math.floor(result['data']['latest_data']['calculated']['recovery_rate'])}%`);
                            //today
                            $('#covidFigureConfirmedToday').html(result['data']['today']['confirmed']);
                            $('#covidFigureDeathsToday').html(result['data']['today']['deaths']);
                             
                        },
                        error: function(jqXHR, textStatus, errorThrown){
                            console.log("There was an error peforming the AJAX call!"); 
                        }
                     }); 
              
                let isoCode = result['data'][0]['components']['ISO_3166-1_alpha-3'];
                console.log(isoCode)
                $.ajax({
                     url: "./php/getCountryBordersGeoData.php",
                     type: 'POST',
                     dataType: 'json',
                     data: {
                         isocode: $('#selCountry').val()
                     },
                     success: function(result){
                        countryBordersGeoJsonLayer.clearLayers();
                        countryBordersGeoJsonLayer.addData(result.data);
                        mymap.fitBounds(countryBordersGeoJsonLayer.getBounds()); 
                     },
                     error: function(jqXHR, textStatus, errorThrown){
                        console.log("There was an error peforming the AJAX call!");
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
                        let areasOfInterest = result['data'];               
                        areasOfInterest.forEach(area => {
                            let areaLat = area.lat;
                            let areaLng = area.lng;
                            let areaOfInterestMarker = L.marker(
                                [areaLat, areaLng],
                                {icon: blackIcon}
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
                    
        
               
               let isoCodeCurrency = result['data'][0]['annotations']['currency']['iso_code'];
               
               $.ajax({
                  url: "./php/getLocationExchangeData.php",
                  type: 'POST',
                  dataType: 'json',
                  success: function(result){
                  
                      let rates = result['data'];                           
                      for (let key in rates) {
                         if(key == isoCodeCurrency){
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
                        url: "./php/getLocationNewsData.php",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                           isocode: result['data'][0]['components']['ISO_3166-1_alpha-2']
                        },
                        success: function(result){   
                                console.log(result.data);                    
                                $('#newsHeadlineIconImgOne').html(`<a href="${result['data'][0]['url']}" target="_blank"><img src="${result['data'][0]['urlToImage']}" alt="headline image"></a>`);
                                $('#newsHeadlineTxtOne').html(`<b>${result['data'][0]['description']}</b>`);
                                
                                $('#newsHeadlineIconImgTwo').html(`<a href="${result['data'][1]['url']}" target="_blank"><img src="${result['data'][1]['urlToImage']}" alt="headline image"></a>`);
                                $('#newsHeadlineTxtTwo').html(`<b>${result['data'][1]['description']}</b>`);
                                
                                $('#newsHeadlineIconImgThree').html(`<a href="${result['data'][2]['url']}" target="_blank"><img src="${result['data'][2]['urlToImage']}" alt="headline image"></a>`);
                                $('#newsHeadlineTxtThree').html(`<b>${result['data'][2]['description']}</b>`);

                                $('#newsHeadlineIconImgFour').html(`<a href="${result['data'][3]['url']}" target="_blank"><img src="${result['data'][3]['urlToImage']}" alt="headline image"></a>`);
                                $('#newsHeadlineTxtFour').html(`<b>${result['data'][3]['description']}</b>`);

                                $('#newsHeadlineIconImgFive').html(`<a href="${result['data'][4]['url']}" target="_blank"><img src="${result['data'][4]['urlToImage']}" alt="headline image"></a>`);
                                $('#newsHeadlineTxtFive').html(`<b>${result['data'][4]['description']}</b>`);

                                $('#newsHeadlineIconImgSix').html(`<a href="${result['data'][5]['url']}" target="_blank"><img src="${result['data'][5]['urlToImage']}" alt="headline image"></a>`);
                                $('#newsHeadlineTxtSix').html(`<b>${result['data'][5]['description']}</b>`);
                                
                                $('#newsHeadlineIconImgSeven').html(`<a href="${result['data'][6]['url']}" target="_blank"><img src="${result['data'][6]['urlToImage']}" alt="headline image"></a>`);
                                $('#newsHeadlineTxtSeven').html(`<b>${result['data'][6]['description']}</b>`);
                                
                                $('#newsHeadlineIconImgEight').html(`<a href="${result['data'][7]['url']}" target="_blank"><img src="${result['data'][7]['urlToImage']}" alt="headline image"></a>`);
                                $('#newsHeadlineTxtEight').html(`<b>${result['data'][7]['description']}</b>`);  
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            $('#newsHeadlineIconImgOne').html(`<img src="./img/news_placeholder.png">`);
                            $('#newsHeadlineTxtOne').html("News data currently unavailable");
                            $('#newsHeadlineIconImgTwo').html(`<img src="./img/news_placeholder.png">`);
                            $('#newsHeadlineTxtTwo').html("News data currently unavailable");
                            $('#newsHeadlineIconImgThree').html(`<img src="./img/news_placeholder.png">`);
                            $('#newsHeadlineTxtThree').html("News data currently unavailable");
                            $('#newsHeadlineIconImgFour').html(`<img src="./img/news_placeholder.png">`);
                            $('#newsHeadlineTxtFour').html("News data currently unavailable");
                            $('#newsHeadlineIconImgFive').html(`<img src="./img/news_placeholder.png">`);
                            $('#newsHeadlineTxtFive').html("News data currently unavailable");
                            $('#newsHeadlineIconImgSix').html(`<img src="./img/news_placeholder.png">`);
                            $('#newsHeadlineTxtSix').html("News data currently unavailable");
                            $('#newsHeadlineIconImgSeven').html(`<img src="./img/news_placeholder.png">`);
                            $('#newsHeadlineTxtSeven').html("News data currently unavailable");
                            $('#newsHeadlineIconImgEight').html(`<img src="./img/news_placeholder.png">`);
                            $('#newsHeadlineTxtEight').html("News data currently unavailable");

                            console.log("There was an error peforming the news AJAX call on load!");  
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
                              $('#cityLocationNewsTxt').html(result['data'][0]['name']);
                              
                              $.ajax({
                                url: "./php/getTimezoneData.php",
                                type: 'POST',
                                dataType: 'json',
                                data: {
                                    timezone: timeZone
                                },
                                success: function(result){
                                     console.log(result.data);
                                     let dateTimeRaw = result['data']['datetime'];
                                     let dateTimeSplit = dateTimeRaw.split('T');
                                     let timeInfoSplit = dateTimeSplit[1];
                                     let time = timeInfoSplit.split('.');
                                     let timeReal = time[0];
                                     let currTime = timeReal.substring(0, timeReal.length - 3);
                                     $('#weatherPanelOneTimezoneNameText').html(result['data']['timezone']);
                                     $('#weatherPanelOneTimeZoneTimeTxt').html(currTime);
                                     $('#weatherPanelOneTimeZoneAbbreviationTxt').html(result['data']['abbreviation']);

                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                  console.log("There was an error peforming the AJAX call!");  
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
                                        $('#capitalCitySummaryTxt').html(`${result['data'][0]['summary']} <a href=${wikiUrlString} target="_blank">more</a>`);
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
                            $('#weatherPanelOneIcon').html(`<img src="https://openweathermap.org/img/wn/${result['data'][0]['weather'][0]['icon']}@2x.png">`);
                            //panel two
                            $('#weatherPanelTwoIcon').html(`<img src="https://openweathermap.org/img/wn/${result['data'][1]['weather'][0]['icon']}@2x.png">`);
                            $('#weatherPanelTwoTemp').html(`H:${kelvinToCelcius(result['data'][1]['temp']['max'])}<span>°</span> L:${kelvinToCelcius(result['data'][1]['temp']['min'])}<span>°</span>`); 
                            //panel three
                            $('#weatherPanelThreeIcon').html(`<img src="https://openweathermap.org/img/wn/${result['data'][2]['weather'][0]['icon']}@2x.png">`);
                            $('#weatherPanelThreeTemp').html(`H:${kelvinToCelcius(result['data'][2]['temp']['max'])}<span>°</span> L:${kelvinToCelcius(result['data'][2]['temp']['min'])}<span>°</span>`);
                            $('#currDatePlusTwo').html(`${ddPlusTwo}th`);
                            //panel four
                            $('#weatherPanelFourIcon').html(`<img src="https://openweathermap.org/img/wn/${result['data'][3]['weather'][0]['icon']}@2x.png">`);
                            $('#weatherPanelFourTemp').html(`H:${kelvinToCelcius(result['data'][3]['temp']['max'])}<span>°</span> L:${kelvinToCelcius(result['data'][3]['temp']['min'])}<span>°</span>`);
                            $('#currDatePlusThree').html(`${ddPlusThree}th`); 
                            //panel five
                            $('#weatherPanelFiveIcon').html(`<img src="https://openweathermap.org/img/wn/${result['data'][4]['weather'][0]['icon']}@2x.png">`);
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
         },
         error: function(jqXHR, textStatus, errorThrown) {
            console.log("There was an error peforming the AJAX call!");  
         }
    });   
});



$(document).ready(function(){
     
    $.ajax({
         url: "./php/getCountryBordersAllData.php",
         type: 'POST',
         dataType: 'json',
         success: function(result){
             console.log(result.data);

         },
         error: function(jqXHR, textStatus, errorThrown){
            console.log("There was an error peforming the AJAX call!"); 
         }
    });
});




// for layer control 
let baseMaps = {
    "Open street": osmMap,
	"Landscape": landMap,
    "Satellite": worldMap,
    "Temp": owmMap
};

let dataLayer = {
    "Restaurants": restaurantMarkers,
    "Cocktail Bars": cocktailBarMarkers,
    "Museums": museumMarkers,
    "Gyms": gymMarkers,
    "Salons": salonMarkers,
    "Areas of Interest": areaOfInterestMarkers
};

// add layer control which allows user to toggle data
L.control.layers(baseMaps, dataLayer).addTo(mymap);


