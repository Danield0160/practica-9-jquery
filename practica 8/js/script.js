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
                    this.comprobarCampo($("#password_repeat").val(), "password_repeat")
                    return this.comprobantes["pass"].test(texto)
                }.bind(this)
        },

        "password_repeat": {
            test:
                function (texto) {
                    if (!this.comprobantes["pass"].test(texto)) {
                        return false
                    } else {
                        return $("#password").val() == texto
                    }
                }.bind(this)
        }
    }
    // inicar la escucha de los inputs y poner funcionalidad en los botnoes
    constructor() {
        let hijos = [...$("#formulario").find(".formulario")]
        for (let hijo of hijos) {
            if (!hijo.id) { continue }
            $(hijo).on("input", function (e) {
                this.comprobarCampo(e.target.value, $(e.target).attr("id"))
            }.bind(this))
        }

        // document.getElementById("guardar").onclick = function () { this.guardar() }.bind(this)
        // document.getElementById("recuperar").onclick = function () { this.recuperar() }.bind(this)
    }

    //comprueba si un campo esta bien, y lo colorea en base a ello
    comprobarCampo(texto, id_formulario) {
        if (this.comprobantes[id_formulario].test(texto)) {
            $("#" + id_formulario).addClass("valido")
            $("#" + id_formulario).removeClass("no_valido")
            return true
        } else {
            $("#" + id_formulario).addClass("no_valido")
            $("#" + id_formulario).removeClass("valido")
            return false
        }
    }
    comprobarTodosLosCampos() {
        let resultado = true
        let hijos = $("#formulario").find(".formulario")
        hijos.each(function (index, hijo) {
            if (!this.comprobarCampo($(hijo).val(), $(hijo).attr("id"))) {
                resultado = false
            }
        }.bind(this))
        return resultado
    }

    // guarda los datos en el localstorage
    guardar() {
        let hijos = $("#formulario").find(".formulario")
        let comprobacionTodos = true
        hijos.each(function (index, hijo) {
            if (!this.comprobarCampo($(hijo).val(), $(hijo).attr("id"))) {
                comprobacionTodos = false
            }
        }.bind(this))
        if (comprobacionTodos) {
            let json = {}
            hijos.each(function (index, hijo) {
                json[$(hijo).attr("id")] = $(hijo).val()
            })
            localStorage["persona"] = JSON.stringify(json)
        }
    }

    // pone los datos del localstorage en el formulario html y los comprueba
    recuperar(datos = localStorage.persona) {
        if (datos) {
            let datosjson = JSON.parse(datos)
            for (let dato of Object.keys(datosjson)) {
                $("#" + dato).val(datosjson[dato])
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
    let params = sesion ? "?sesion=" + sesion : ""
    let mi_url = url + params
    $.ajax({
        type: 'GET',
        url: mi_url,
        dataType: 'json'
    }).done(function (data) {
        formulario.recuperar(JSON.stringify(data));
    });
}

//poner dato en el php
function guardarDatoEnElServer(url) {
    if (!formulario.comprobarTodosLosCampos()) {
        return
    }
    let hijos = $("#formulario").find(".formulario")

    let params = ""
    for (const hijo of hijos) {
        params += $(hijo).attr("id") + "=" + $(hijo).val() + "&"
        $(hijo).val("")
        $(hijo).removeClass(["valido", "no_valido"])
    }
    params = params.slice(0, -1)
    $.ajax({
        type: 'POST',
        url: url,
        data: params
    }).done(function (data) {
        sesion = data
    })

}


//cojer datos de la bbdd en base al dni
function cogerUsuarioDelBBDD(url, dni) {
    let mi_url = url + "?q=" + dni
    $.ajax({
        type: 'GET',
        url: mi_url,
        dataType: 'json'
    }).done(function (data) {
        formulario.recuperar(JSON.stringify(data));
    });
}

//guarda el usuario en la base de datos
function guardarUsuarioEnBBDD(url) {
    if (!formulario.comprobarTodosLosCampos()) {
        return
    }
    let hijos = $("#formulario").find(".formulario")

    let params = ""
    for (const hijo of hijos) {
        params += $(hijo).attr("id") + "=" + $(hijo).val() + "&"
        $(hijo).removeClass(["valido", "no_valido"])
        $(hijo).val("")
    }
    params = params.slice(0, -1)

    $.ajax({
        type: 'POST',
        url: url,
        data: params
    }).done(function (data) {
        sesion = data
    })
}



// asignacion de los onclick a los botones
$("#recuperarJson").on("click", function () {
    let direccion = $("body").find('input[name="direccion_server"]:checked').val();
    cogerDatoDelServer(urls[direccion]["json"])
})

$("#recuperarPhp").on("click", function () {
    let direccion = $("body").find('input[name="direccion_server"]:checked').val();
    cogerDatoDelServer(urls[direccion]["php"])
})
$("#guardarPhp").on("click", function () {
    let direccion = $("body").find('input[name="direccion_server"]:checked').val();
    guardarDatoEnElServer(urls[direccion]["php"])
})

$("#recuperarBBDD").on("click", function () {
    let direccion = $("body").find('input[name="direccion_server"]:checked').val();
    cogerUsuarioDelBBDD(urls[direccion]["bd"], $("body").find("#bbdd>input").val())
})
$("#guardarBBDD").on("click", function () {
    let direccion = $("body").find('input[name="direccion_server"]:checked').val();
    guardarUsuarioEnBBDD(urls[direccion]["bd"],)
})