
var bootstrap = function() {
    var url = Config.url;
    var map = createMap('mapid');
    var drawer = new Drawer();

    // OPCIÓN 3: Promises. Request asincrónico evitando el callbackhell.   ****
    var requestTrack = function() {
        return $.ajax(url + "/tracks/42");
    }
    var requestRunners = function() {
        return $.ajax(url + "/runners");
    }
    var responseExtract = function(attr, response) {
        console.log(response);
        return response[attr]
    }
    var extractTrack = function(response) {
        return responseExtract('track', response);
    }
    var extractRunners = function(response) {
        return responseExtract('runners', response);
    }
    var drawTrack = function(track) {
        drawer.drawTrackInMap(track, map, "#00F");
    }
    var drawRunners = function(runners) {
        drawer.drawRunnersInList(runners, 'runnersList');
    }

    // comenzamos la ejecución:
    requestTrack()              // pedimos la pista al servidor
        .then(extractTrack)     // extraemos la pista de la respuesta del servidor
        .then(drawTrack)        // dibujamos la pista
        .then(requestRunners)   // pedimos los corredores al servidor
        .then(extractRunners)   // extraemos los corredores de la respuesta del servidor
        .then(drawRunners)      // dibujamos los corredores
        .done(function() {
            console.log("Fin.");
        });
    // FIN OPCIÓN 3 ***********************************************************
};

$(bootstrap);