//objeto encargado de detectar errores en el formulario html
class Formulario {
    //dicionario con las comprobaciones del formulario
    comprobantes = {
        "nombre": /^([A-Z][a-z]+\s?){1,2}$/,
        "apellidos": /^[A-Z][a-z]+\s[A-Z][a-z]+$/,
        "dni": /^[a-zA-z][1-9]{7}[A-Z]{1}$|^[1-9]{8}[A-Z]{1}$/,
        "nacimiento": {
            test:
                function (texto) {
                    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
                        return false
                    }
                    let textoLista = texto.split("/")
                    let fecha = new Date(textoLista[1] + "/" + textoLista[0] + "/" + textoLista[2])
                    if (fecha.getDate() == Number(textoLista[0])) {
                        return fecha < new Date()
                    } else {
                        return false
                    }
                }
        },
        "postal": /^[0-9]{5}$/,
        "email": /^[A-z.1-9]+@[A-z.1-9]+\.[A-z]{1,3}$/,
        "fijo": /^[89][0-9]{8}$/,
        "movil": /^[67][0-9]{8}$/,
        "iban": /^ES[0-9]{22}$/,
        "credito": /^[0-9]{12}$/,

        "pass": /(?=.*[0-9])(?=.*[A-z])(?=.*[!-\/:-@\[-_\{-~]).{12,}/,
        "password": {
            test:
                function (texto) {
                    this.comprobarCampo(document.getElementById("password_repeat").value, "password_repeat")
                    return this.comprobantes["pass"].test(texto)
                }.bind(this)
        },

        "password_repeat": {
            test:
                function (texto) {
                    if (!this.comprobantes["pass"].test(texto)) {
                        return false
                    } else {
                        return document.getElementById("password").value == texto
                    }
                }.bind(this)
        }
    }
    // inicar la escucha de los inputs y poner funcionalidad en los botnoes
    constructor() {
        let hijos = [...document.getElementById("formulario").querySelectorAll(".formulario")]
        for (let hijo of hijos) {
            if (!hijo.id) { continue }
            hijo.addEventListener("input", function (e) {
                this.comprobarCampo(e.target.value, e.target.id)
            }.bind(this))
        }

        // document.getElementById("guardar").onclick = function () { this.guardar() }.bind(this)
        // document.getElementById("recuperar").onclick = function () { this.recuperar() }.bind(this)
    }

    //comprueba si un campo esta bien, y lo colorea en base a ello
    comprobarCampo(texto, id_formulario) {
        if (this.comprobantes[id_formulario].test(texto)) {
            document.getElementById(id_formulario).classList.add("valido")
            document.getElementById(id_formulario).classList.remove("no_valido")
            return true
        } else {
            document.getElementById(id_formulario).classList.add("no_valido")
            document.getElementById(id_formulario).classList.remove("valido")
            return false
        }
    }
    comprobarTodosLosCampos(){
        let resultado = true
        let hijos = [...document.getElementById("formulario").querySelectorAll("#formulario>.formulario")]
        hijos.forEach(function (hijo) {
            if(!this.comprobarCampo(hijo.value,hijo.id)){
                resultado = false
            }
        }.bind(this))
        return resultado
    }

    // guarda los datos en el localstorage
    guardar() {
        let hijos = [...document.getElementById("formulario").querySelectorAll("#formulario>.formulario")]
        let comprobacionTodos = true
        hijos.forEach(function (hijo) {
            if (!this.comprobarCampo(hijo.value, hijo.id)) {
                comprobacionTodos = false
            }
        }.bind(this))
        if (comprobacionTodos) {
            let json = {}
            hijos.forEach(function (hijo) {
                json[hijo.id] = hijo.value
            })
            localStorage["persona"] = JSON.stringify(json)
        }
    }

    // pone los datos del localstorage en el formulario html y los comprueba
    recuperar(datos = localStorage.persona) {
        if (datos) {
            let datosjson = JSON.parse(datos)
            for (let dato of Object.keys(datosjson)) {
                document.getElementById(dato).value = datosjson[dato]
                this.comprobarCampo(datosjson[dato], dato)
            }
        }
    }
}
formulario = new Formulario()






//direccion del server
urls = {
    server: {
        json: 'http://danieldawdns.ddns.net/datos.json',
        php: 'http://danieldawdns.ddns.net/',
        bd: 'http://danieldawdns.ddns.net/bbdd.php'
    },
    clase: {
        json: '192.168.216.139/datos.json',
        php: '192.168.216.139/',
        bd: '192.168.216.139/bbdd.php'
    },
    localhost: {
        json: "http://localhost/datos.json",
        php: "http://localhost/",
        bd: "http://localhost/bbdd.php"
    }
}
var sesion;



// cojer datos del php o json
function cogerDatoDelServer(url) {
    let ourRequest = new XMLHttpRequest();
    let params = sesion ? "?sesion="+sesion : ""
    ourRequest.open('GET', url +params, true);
    // ourRequest.withCredentials = true;
    // ourRequest.setRequestHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500")
    ourRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");


    ourRequest.onload = function () {
        if (ourRequest.status >= 200 && ourRequest.status < 400) {
            console.log(this.responseText);
            formulario.recuperar(ourRequest.responseText);
        } else {
            console.log("We connected to the server, but it returned an error.");
        }
    };

    ourRequest.onerror = function () {
        console.log("Connection error");
    };
    ourRequest.send(params);
}

//poner dato en el php
function guardarDatoEnElServer(url) {
    if(!formulario.comprobarTodosLosCampos()){
        return
    }
    let hijos = [...document.getElementById("formulario").querySelectorAll("#formulario>.formulario")]

    let params = ""
    for (const hijo of hijos) {
        params += hijo.id + "=" + hijo.value + "&"
        hijo.value = ""
        hijo.classList.remove("valido", "no_valido")
    }
    params = params.slice(0, -1)

    let xhr = new XMLHttpRequest();
    xhr.withCredentials = false;


    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        console.log(this.responseText);
        sesion = this.responseText
    }

    xhr.send(params);
}





//cojer datos de la bbdd en base al dni
function cogerUsuarioDelBBDD(url, dni) {
    let ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', url + "?q=" + dni, true);
    // ourRequest.withCredentials = false;
    // ourRequest.setRequestHeader("Access-Control-Allow-Origin", "*")
    ourRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    ourRequest.onload = function () {
        if (ourRequest.status >= 200 && ourRequest.status < 400) {
            console.log(ourRequest.responseText)
            formulario.recuperar(ourRequest.responseText);
        } else {
            console.log("We connected to the server, but it returned an error.");
        }
    };

    ourRequest.onerror = function () {
        console.log("Connection error");
    };

    ourRequest.send();
}

//guarda el usuario en la base de datos
function guardarUsuarioEnBBDD(url) {
    if(!formulario.comprobarTodosLosCampos()){
        return
    }
    let hijos = [...document.getElementById("formulario").querySelectorAll("#formulario>.formulario")]

    let params = ""
    for (const hijo of hijos) {
        params += hijo.id + "=" + hijo.value + "&"
        hijo.classList.remove("valido", "no_valido")
        hijo.value = ""
    }
    params = params.slice(0, -1)


    let xhr = new XMLHttpRequest();
    // ourRequest.withCredentials = true;

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        console.log(this.responseText);
    }

    xhr.send(params);

}




// asignacion de los onclick a los botones
document.getElementById("recuperarJson").onclick = function () {
    let direccion = document.querySelector('input[name="direccion_server"]:checked').value;
    cogerDatoDelServer(urls[direccion]["json"])
}

document.getElementById("recuperarPhp").onclick = function () {
    let direccion = document.querySelector('input[name="direccion_server"]:checked').value;
    cogerDatoDelServer(urls[direccion]["php"])
}
document.getElementById("guardarPhp").onclick = function () {
    let direccion = document.querySelector('input[name="direccion_server"]:checked').value;
    guardarDatoEnElServer(urls[direccion]["php"])
}

document.getElementById("recuperarBBDD").onclick = function () {
    let direccion = document.querySelector('input[name="direccion_server"]:checked').value;
    cogerUsuarioDelBBDD(urls[direccion]["bd"], document.querySelector("#bbdd>input").value)
}
document.getElementById("guardarBBDD").onclick = function () {
    let direccion = document.querySelector('input[name="direccion_server"]:checked').value;
    guardarUsuarioEnBBDD(urls[direccion]["bd"],)
}