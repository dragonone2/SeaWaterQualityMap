var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 37.775, lng: -122.434},
    mapTypeId: 'satellite'
  });
  
  var heatMapData = [
    {location: new google.maps.LatLng(37.782, -122.447), weight: 0.5},
    {location: new google.maps.LatLng(37.782, -122.445), weight: 2},
    {location: new google.maps.LatLng(37.782, -122.443), weight: 3},
    {location: new google.maps.LatLng(37.782, -122.441), weight: 2},
    {location: new google.maps.LatLng(37.782, -122.439), weight: 0.5}
  ];
  
  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatMapData
  });
  heatmap.setMap(map);
  