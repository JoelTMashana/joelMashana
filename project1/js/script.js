//initialises an instance of the map class and sets the view to fit world
const mymap = L.map('mapid').fitWorld();

//add the tile layer on the class, in this case i used thunderforest
L.tileLayer('https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=6d9911c3c07e404eaa8dd1c1067b8c7e', {
}).addTo(mymap);

