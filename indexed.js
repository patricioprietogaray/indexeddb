let cajadatos, db;


function iniciar() {
    cajadatos = document.getElementById("cajadatos");
    let boton = document.getElementById("grabar");
    boton.addEventListener("click", agregarobjeto);
    let solicitud = indexedDB.open("baseDeDatos");
    // alert(solicitud);
    solicitud.addEventListener("error", mostrarerror);
    solicitud.addEventListener("success", comenzar);
    solicitud.addEventListener("upgradeneeded", creardb);
}

function mostrarerror(evento) {
    alert("Error: " + evento.code + " " + evento.message);
}

function comenzar(evento) {
    db = evento.target.result;
    mostrar();
}

function creardb(evento) {
    let basededatos = evento.target.result;
    let almacen = basededatos.createObjectStore("peliculas", {keyPath: "id"});
    almacen.createIndex("BuscarFecha", "fecha", {unique: false});
}

function agregarobjeto() {
    let clave = document.getElementById("clave").value;
    let titulo = document.getElementById("texto").value;
    let fecha = document.getElementById("fecha").value;

    let transaccion = db.transaction(["peliculas"], "readwrite");
    let almacen = transaccion.objectStore("peliculas");
    // transaccion.addEventListener("complete", function() {
    //     mostrar(clave);
    // });
    transaccion.addEventListener("complete", mostrar);

    let solicitud = almacen.add({id: clave, nombre: titulo, fecha: fecha});

    document.getElementById("clave").value = "";
    document.getElementById("texto").value = "";
    document.getElementById("fecha").value = "";
}

function mostrar(clave) {
    cajadatos.innerHTML = "";
    let transaccion = db.transaction(["peliculas"]);
    let almacen = transaccion.objectStore("peliculas");
    // let solicitud = almacen.get(clave);
    // solicitud.addEventListener("success", mostrarlista);

    // let puntero = almacen.openCursor();
    // puntero.addEventListener("success", mostrarlista);
 
    //Busqueda
    let indice = almacen.index("BuscarFecha");
    let puntero = indice.openCursor(null, "prev");
    puntero.addEventListener("success", mostrarlista);
}

function mostrarlista(evento) {
    let puntero = evento.target.result;
    if (puntero) {
        cajadatos.innerHTML += "<div>" + puntero.value.id + " - " + puntero.value.nombre +
        " - " + puntero.value.fecha + ' <input type="button" onclick="removeobjeto(\'' + 
        puntero.value.id + '\')" value="Remover"></div>';        
        puntero.continue();
    }
}

function removeobjeto(clave) {
    // alert("El objeto es " + clave);
    if (confirm("¿Está seguro?")) {
        let transaccion = db.transaction(["peliculas"], "readwrite");
        let almacen = transaccion.objectStore("peliculas");
        transaccion.addEventListener("complete", mostrar);
        let solicitud = almacen.delete(clave);

    }
}

window.addEventListener("load", iniciar);