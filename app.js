var centerlat = 13.780542
var centerlon = 100.944431


var zoomLevel = 6;

var map = L.map('mapid').setView([centerlat, centerlon], zoomLevel);
var mapbox = L.tileLayer('//cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png', {
    attributions: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
}).addTo(map);

$.getJSON("hotspot.geojson", function (data) {
    var count = turf.count(hexagonGrid, data, "z", "z")
    L.geoJson(count, crimeGridStyle).addTo(map);
    L.geoJson(data, pointStyle).addTo(map);
})

var bbox = [105.637024930, 21.080008, 97.343701921, 5.192359]
var cellWidth = 45;
var units = 'kilometers';
var hexagonGrid = turf.hexGrid(bbox, cellWidth, units);

var pointStyle = {
    pointToLayer: function (feature, latlng) {
        return L.circle(latlng);
    },
    style: {
        "color": "#ff7800",
        "weight": 2,
        "opacity": 0.2
    }
}

var crimeGridStyle = {
    style: function style(feature) {
        return {
            fillColor: getColor(feature.properties.z),
            weight: 0,
            opacity: 1,
            color: 'white',
            fillOpacity: getopacity(feature.properties.z)
        };
    }
}

function getopacity(y) {
    return y == 0 ? 0 :
        .8;
}

function getColor(d) {
    return d > 24 ? '#800026' :
        d > 20 ? '#BD0026' :
        d > 16 ? '#E31A1C' :
        d > 8 ? '#FC4E2A' :
        d > 4 ? '#FD8D3C' :
        d > 2 ? '#FEB24C' :
        '#FFEDA0';
}

$(document).ready(function () {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [2, 4, 8, 16, 20, 24],
        labels = ['<strong>Point Count</strong>'],
        from, to;

    document.getElementById("custom-map-controls").innerHTML = labels;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];
        labels.push(
            '<i style="background:' + getColor(from + 0.5) + '"></i> ' + from + (to ? '&ndash;' + to : '+ '));
    }
    div.innerHTML = labels.join('<br>');

    document.getElementById("custom-map-controls").innerHTML = labels.join('<br>');

    return div;
});