<?php
	// remove for production
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);
	$executionStartTime = microtime(true);

   
	// these params are taken from the data part of the ajax call
	$url='https://api.opencagedata.com/geocode/v1/json?q=' . $_POST['latitude']. ',' . $_POST['longitude'] . '&key=ee756e3c37284a8db239a456ef2be343' . '&pretty=1';

	//curls obj initialised and stored in var
	// the API I use will speicfy what I need to copy
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $url);
	 
	//executed the curl obj and store it in a var
	$countryInfoDecode =curl_exec($ch);
	curl_close($ch);
    //converts the json encoded string and turns into pphp var
	// true ensures that JSON is returned as associative array
	$countryInfoDecode  = json_decode($countryInfoDecode ,true);	
    // this is the strucure of the output

	
	//vars for other apis
	$currencySymbol= $countryInfoDecode['results']['annotations']['currency']['symbol'];
	$countryName = $countryInfoDecode['results'][0]['components']['country'];
	$countryCode = $countryInfoDecode['results'][0]['components']['country_code'];


	// status and data
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $countryInfoDecode['results'];


	header('Content-Type: application/json; charset=UTF-8');
    
	// echo prints the output via the json_encode func
	// which returns a string containing the JSON representation of the supplied value
	echo json_encode($output); 
?>