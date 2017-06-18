
var Drawer = function() {
    return {
        drawTrackInMap: drawTrackInMap,
        drawRunnersInList: drawRunnersInList
    }

    /******************************************************************************
     * Función para dibujar una pista en un mapa.
     */
    function drawTrackInMap(track, map, color) {
        console.log(track);
        console.log("Dibujando la pista: " + track.id);

        var coordinates = track.coordinates.map(function(coordinate) {
            return L.latLng(coordinate.lat, coordinate.lon);
        });

        // Creamos un circuito.
        L.polyline(coordinates, {color: color}).addTo(map);
    }

    /******************************************************************************
     * Función para listar los corredores en la página.
     */
    function drawRunnersInList(runners, nodeId) {
        runners.forEach(function(runner) {
            var li = $('<li>');
            li.append(runner.name + " " + runner.surname);
            $("#"+nodeId).append(li);
        });
    }
}
