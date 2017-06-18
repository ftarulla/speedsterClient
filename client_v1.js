
/******************************************************************************
 * Funciones para request asincrónico y sincrónico utilizando XMLHttpRequest
 */
var asyncQuery = function(url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        // https://stackoverflow.com/questions/13293617/why-is-my-ajax-function-calling-the-callback-multiple-times
        if (this.readyState === 4) {
            if (this.status === 200) {
                // parseamos el resultado para obtener el objeto JavaScript
                resObj = JSON.parse(xhttp.responseText)
                // llamamos a la función callback con el objeto parseado como parámetro.
                callback(resObj);
            }
        }
    };
    xhttp.open("GET", url, true);
    var ret = xhttp.send();
    return ret;
}

var syncQuery = function(url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    // El browser (Chrome) dispara una excepción:
    // [Deprecation] Synchronous XMLHttpRequest on the main thread is deprecated because of its detrimental
    // effects to the end user's experience.
    // For more help, check https://xhr.spec.whatwg.org/.
    xhttp.send();

    if (xhttp.status === 200) {
        resObj = JSON.parse(xhttp.responseText)
        return resObj;
    }
    return null;
}

/******************************************************************************
 * Inicio.
 */
var bootstrap = function() {
    var url = Config.url;
    var map = createMap('mapid');
    var drawer = new Drawer();

    // OPCIÓN 1: Request asincrónico. *****************************************
    // dibujar la pista 42 de manera asincrónica
    var callback = function(response) {
        drawer.drawTrackInMap(response.track, map, "#00F");

        // pedimos los corredores
        var callback2 = function(response) {
            drawer.drawRunnersInList(response.runners, 'runnersList');
        }
        asyncQuery(url + "/runners", callback2);
    };
    asyncQuery(url + "/tracks/42", callback);
    // Esta opción deriva en el callbackhell
    // Referencias:
    // 1. http://callbackhell.com/
    // 2. https://stackoverflow.com/questions/25098066/what-the-hell-is-callback-hell-and-how-and-why-rx-solves-it
    // FIN OPCIÓN 1 ***********************************************************

    // OPCIÓN 2: Request sincrónico.  *****************************************
    // dibujar la pista 80 de manera sincrónica
    var response = syncQuery(url + "/tracks/80", callback);
    if (response) {
        drawer.drawTrackInMap(response.track, map, "#F00");
    }
    // FIN OPCIÓN 2 ***********************************************************

};

$(bootstrap);