
//global variables 
var geocoder;
var map;
var arrow =  {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        strokeOpacity: 1,
        scale: 1.5
    };
var infowindow; 
var edgesTo={};
var edgesFrom={};
var styles=[{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];

  		var mcircle1a = {
			path: 'M0,0m-2,0a2,2 0 1,0 4,0a2,2 0 1,0 -4,0',
			fillColor: 'white',
			fillOpacity: 1,
			scale: 2,
            strokeWeight: 0
		};
		
$(document).ready(function(){
function initialize() 
{
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(42.51, 1.593);
  var mapOptions = 
  {
    zoom: 12,
    styles: styles,
    center: latlng
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	  var trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map);
	 infowindow = new google.maps.InfoWindow();
  setup();//call the function
}
function setup(){  
    for (i in mapsTo){
    line =mapsTo[i]
        var edgeTo= new google.maps.LatLng(line["to"][0],line["to"][1]);
        var edgeFrom=new google.maps.LatLng(line["from"][0],line["from"][1]);
        type = 'all'
        addEdge(edgeTo,edgeFrom,type) 

}
    for(region in regions){ 
        addRegion(region,regions[region])
    }
}
    
    function fetchTowerData() {
      towers = JSON.parse(towerData);
		var keys = Object.keys(towers);
        for (var i=0; i < keys.length; i++)  {
			addTower(towers[keys[i]],keys[i]);
		}
	
}
        function addRegion(regionName,region) {
       var marker = new google.maps.Marker(
      {
          position: region,
		  title:regionName,
		  map: map
      });

    marker.setIcon(mcircle1a);
    google.maps.event.addListener(marker, 'mouseover', function() {
        console.log(edgesTo);
        for(e in edgesTo[regionName]){
            //console.log(e);
        }for(e in edgesFrom[regionName]){
            //console.log(e);
        }
          infowindow.setContent("<h3>"+regionName+"</h3>");
    infowindow.open(map, this);
    });
   google.maps.event.addListener(marker, 'mouseout', function() {
       infowindow.close(map,this);
    });
}

function addEdge(edgeTo,edgeFrom,type) 
{
var coordinates = [edgeTo,edgeFrom];
    pathx = new google.maps.Polyline({
    path: coordinates,
    strokeColor: 'lightblue',
    strokeWeight: 0.5,
        opacity: .002,
           icons: [{
            icon: arrow,
            repeat:'150px',
            offset: '100%'}]
  });
		pathx.setMap(map);
        pathx.setVisible(true);
    locTo=getLocationForValue(edgeTo);
    locFrom=getLocationForValue(edgeFrom);
        if (locTo in edgesTo){
            edgesTo[locTo].push(pathx);
        } else{
            edgesTo[locTo]=[pathx];
        }  
    if (locFrom in edgesFrom){
            edgesFrom[locFrom].push(pathx);
        } else{
            edgesFrom[locFrom]=[pathx];
        }
            
}
    
function getLocationForValue(value) {
  for (var name in regions) {
    if ((regions[name]["lat"] - value.lat() + regions[name]["lng"] -value.lng())<.1) {
        console.log(name);
      return name;
    }
  }
}

google.maps.event.addDomListener(window, 'load', initialize);
});
