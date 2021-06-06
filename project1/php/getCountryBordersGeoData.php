<?php
    // remove for production
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);
	$executionStartTime = microtime(true);

    // get file contenes from json file 
    //convert to associative array
    $countryBordersDecode = json_decode(file_get_contents("../countryBorders.geo.json"), true);

	$countryBorder = []; 
	 
	$temp = null;
	foreach ($countryBordersDecode['features'] as $feature) {
		
		if ($feature['properties']['iso_a2'] == $_POST['isocode']) {
			 array_push($countryBorder, $feature);
		}
	}
    
    // this is the strucure of the output
	// status and data
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $countryBorder;

	header('Content-Type: application/json; charset=UTF-8');
    
	// echo prints the output via the json_encode func
	// which returns a string containing the JSON representation of the supplied value
	echo json_encode($output);
    
	?>