<?php
	// remove for production
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);
	$executionStartTime = microtime(true);
    
    $API_KEY = 'C7s2Apq1D2ntgmQerVYSI_u7oRfEriTeZyzp-BFwqaRogpJqTv78J_m6sKZRm7rx2i8qYMLgrAHfeMlsp906XbAjlCjHSQxBwPUa9HXuC4MTrPoP1yRq4uDIzOmmYHYx';
   
	// these params are taken from the data part of the ajax call
	$url='https://api.yelp.com/v3/businesses/search?location=' . urlencode($_POST['placename']);

	//curls obj initialised and stored in var
	// the API I use will speicfy what I need to copy
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array (
        'Authorization: Bearer ' . $API_KEY 
    ));
    
	 
	//executed the curl obj and store it in a var
	$countryInfoDecode =curl_exec($ch);
	curl_close($ch);
    //converts the json encoded string and turns into pphp var
	// true ensures that JSON is returned as associative array
	$countryInfoDecode  = json_decode($countryInfoDecode ,true);	
    // this is the strucure of the output


	// status and data
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['status'] = $url;
	$output['data'] = $countryInfoDecode['businesses'];


	header('Content-Type: application/json; charset=UTF-8');
    
	// echo prints the output via the json_encode func
	// which returns a string containing the JSON representation of the supplied value
	echo json_encode($output); 