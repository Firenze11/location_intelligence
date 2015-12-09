
//global variables 
var geocoder;
var map;
var month ="JAN 1-4";
var lines={"all":{"JAN 1-4":[], "JULY 1-4":[], "SEP 1-4":[],  "EASTER":[]},
           "spain":{"JAN 1-4":[], "JULY 1-4":[], "SEP 1-4":[],  "EASTER":[]},
           "france":{"JAN 1-4":[], "JULY 1-4":[], "SEP 1-4":[],  "EASTER":[]}}

var infowindow; 
var months =["JAN 1-4","EASTER","JULY 1-4","SEP 1-4"];
var DataType = 'france'
$(function() {
    $( "#slider" ).slider({
	animate: "fast",
	max:months.length,
	min: 0,
    change: MonthChange,
	});
  });
function setSliderTicks(){
    var $slider =  $('#slider');
    var max =  max
    var spacing =  100/(months.length);

    $slider.find('.ui-slider-tick-mark').remove();
    for (var i = 0; i < months.length ; i++) {
        $('<span class="ui-slider-tick-mark">'+(months[i])+'</span>').css('left', (spacing * i) +  '%').appendTo($slider); 
     }
}

var styles=[{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];

  		var mcircle1a = {
			path: 'M0,0m-2,0a2,2 0 1,0 4,0a2,2 0 1,0 -4,0',
			fillColor: 'white',
			fillOpacity: 1,
			scale: 2,
            strokeWeight: 0
		};
		
$(document).ready(function(){
    setSliderTicks();
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
for (mon in months){
  for(pair in pairs[months[mon]]){
    
        var edgeTo=pairs[months[mon]][pair]["Area1"];
        var edgeFrom=pairs[months[mon]][pair]["Area2"];
        weight = pairs[months[mon]][pair]["occurences"];
        type = 'all'
        addEdge(edgeTo,edgeFrom,weight,type,months[mon]) 
    }
      for(pair in spainPairs[months[mon]]){
        var edgeTo=spainPairs[months[mon]][pair]["Area1"];
        var edgeFrom=spainPairs[months[mon]][pair]["Area2"];
        weight = spainPairs[months[mon]][pair]["occurences"];
        type = 'spain'
        addEdge(edgeTo,edgeFrom,weight,type,months[mon]) 
    }
     for(pair in frenchPairs[months[mon]]){
        var edgeTo=frenchPairs[months[mon]][pair]["Area1"];
        var edgeFrom=frenchPairs[months[mon]][pair]["Area2"];
        weight = frenchPairs[months[mon]][pair]["occurences"];
        type = 'france'
        addEdge(edgeTo,edgeFrom,weight,type,months[mon]) 
    }
  for(region in regions){ 
        addRegion(region,regions[region])
    }
}
    show(DataType,true);
}

function addEdge(edgeTo,edgeFrom,weight,type,month) 
{
	if(regions[edgeFrom]&&regions[edgeTo] &&weight>50){
	 var coordinates = [
    regions[edgeTo],regions[edgeFrom]
  ];
    colors =["purple","darkblue","lightblue","darkgreen","yellowgreen","yellow","orange","darkorange","red","darkred"]
    opacities=[.1,.2,.3,.4,.5,.6,.7,.8,.9,1]
    zs=[0,1,2,3,4,5,6,7,8,9]
    var title = edgeFrom+","+edgeTo;
    var path = new google.maps.Polyline({
    path: coordinates,
    geodesic: true,
    strokeColor: colors[Math.round(weight/20)],
    zIndex: zs[Math.round(weight/20)],
    strokeWeight: 2,
    opacity:opacities[Math.round(weight/20)],
      title: title,
  });
		path.setMap(map);
        path.setVisible(true);
        lines[type][month].push(path);
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
          infowindow.setContent("<h3>"+regionName+"</h3>");
    infowindow.open(map, this);
    show(DataType,false);
       for (var i=0; i<lines[DataType][month].length; i++) {
           cities = lines[DataType][month][i].title.split(",");
           if (cities[0]===regionName ||cities[1]===regionName){
                 lines[DataType][month][i].setVisible(true);
           }
       }
    });
   google.maps.event.addListener(marker, 'mouseout', function() {
        show(DataType,true)
    });
}


google.maps.event.addDomListener(window, 'load', initialize);
});
function boxclick(box,type) {
        if (box.checked) {
          show(type,true);

        } else {
          show(type,false);
        }
      }

 function show(type,show) {
     DataType = type;
     for (var t in lines){
       for (var m=0; m<months.length; m++) {
           for(var i = 0; i<lines[t][months[m]].length;i++){
            lines[t][months[m]][i].setVisible((t===type && months[m]===month) && show);
           }
       }
     }
     }
function MonthChange(){
    console.log(month);
    month = months[$( "#slider" ).slider( "option", "value" )];
    show(DataType,true);
}
