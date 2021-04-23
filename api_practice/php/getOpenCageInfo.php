<?php

require "vendor/autoload.php";

$geocoder = new \OpenCage\Geocoder\Geocoder('ee756e3c37284a8db239a456ef2be343');
$result = $geocoder->geocode('82 Clerkenwell Road, London');
print_r($result);

# set optional parameters
# see the full list: https://opencagedata.com/api#forward-opt
#
$result = $geocoder->geocode('6 Rue Massillon, 30020 Nîmes', ['language' => 'fr', 'countrycode' => 'fr']);
if ($result && $result['total_results'] > 0) {
  $first = $result['results'][0];
  print $first['geometry']['lng'] . ';' . $first['geometry']['lat'] . ';' . $first['formatted'] . "\n";
  # 4.360081;43.8316276;6 Rue Massillon, 30020 Nîmes, Frankreich
}



?>