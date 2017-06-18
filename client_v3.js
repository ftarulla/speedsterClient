
var asyncQuery = function(url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            // parseamos el resultado para obtener el objeto JavaScript
            resObj = JSON.parse(xhttp.responseText)
            // llamamos a la función callback con el objeto parseado como parámetro.
            callback(resObj);
        }
    };
    xhttp.open("GET", url, true);
    var ret = xhttp.send();
    return ret;
}

// https://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
// function getRandomColor() {
//     var letters = '0123456789ABCDEF';
//     var color = '#';
//     for (var i = 0; i < 6; i++ ) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// }
var colors = ["#787", "#00F", "#0F0", "#F00"];
var getRandomColor = function() {
    return colors.pop();
}

/******************************************************************************
 * Inicio.
 */
var bootstrap = function() {
    var url = Config.url;
    var map = createMap('mapid');
    var drawer = new Drawer();

    // request track 42
    asyncQuery(url + "/tracks/42", function(response) {
        drawer.drawTrackInMap(response.track, map, "#777");

        // request runners
        asyncQuery(url + "/runners", function(response) {
            var runners = response.runners;
            drawer.drawRunnersInList(runners, 'runnersList');

            // Para cada corredor pedimos sus positions
            runners.forEach(function(runner) {
                var runnerLayer = L.layerGroup().addTo(map);
                var runnerColor = getRandomColor();

                // request positions
                asyncQuery(url + "/positions/" + runner.id, function(response) {
                    var runnerPosition = response.position;
                    console.log("Marcando en el mapa las posiciones del corredor: " + 
                        runnerPosition.runner + " en color: " + runnerColor);

                    // Dibujamos todas sus posiciones a la vez
                    var positions = runnerPosition.positions;
                    positions.forEach(function(position) {
                        var options = { radius: 7,
                                        fillColor: runnerColor,
                                        color: "#DDD",
                                        weight: 1,
                                        opacity: 1,
                                        fillOpacity: 0.3 };
                        runnerLayer.addLayer(L.circleMarker(position, options));
                    });
                });
            });
        });
    });
};

$(bootstrap);