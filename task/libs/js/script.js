
//earthquakes ajax call

//on button click execute anon func
$('#btnSubmit').click(function(){

     $.ajax({
         url: "libs/php/getGeocodingAvailibility.php",
         type: 'POST',
         dataType: 'json',

         success: function(result) {
             
            console.log(JSON.stringify(result));

            if(result.status.name == 'ok') {

            
              $('#txtNumPostalCodes').html(result['data'][0]['numPostalCodes']);
              $('#txtCountryCode').html(result['data'][0]['countryCode']);
              $('#txtCountryName').html(result['data'][0]['countryName']);     
            }

         },
         error: function(jqXHR, textStatus, errorThrown) {
            console.log("There was an error peforming the AJAX call!");
			
         }

     });

});


	// when you click the button with an id of... run this function
	$('#btnSubmitNeighbours').click(function() {
    // this the ajax call
		$.ajax({
			url: "libs/php/getNeighboursInfo.php",
			type: 'POST',
			dataType: 'json',
			data: {
				country: $('#selCountry').val()
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {
				     //the data is written to the html here is the status name is "ok"
					 //the ids ensure that the correct data is outputed in the correct part of the table
					$('#txtName').html(result['data'][0]['countryName']);
					$('#txtCode').html(result['data'][0]['countryCode']);
					$('#txtPopulation').html(result['data'][0]['population']);

				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log("There was an error peforming the AJAX call!");
				
			}
		}); 
	
	});


		// when you click the button with an id of... run this function
		$('#btnSubmitSearch').click(function() {
			// this the ajax call
				$.ajax({
					url: "libs/php/getSearchTermInfo.php",
					type: 'POST',
					dataType: 'json',
					data: {
						name_equals: $('#searchTerm').val()
					},
					success: function(result) {
		
						console.log(JSON.stringify(result));
		
						if (result.status.name == "ok") {
							 //the data is written to the html here is the status name is "ok"
							 //the ids ensure that the correct data is outputed in the correct part of the table
							$('#txtAdminCode').html(result['data'][0]['adminCode1']);
							$('#txtFCodeName').html(result['data'][0]['fcodeName']);
							$('#txtToponymName').html(result['data'][0]['toponymName']);
		
						}
					
					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.log("There was an error peforming the AJAX call!");
						
					}
				}); 
			
			});
