/**
 ** diccionario de clave-valor: "formato" => "iconoHTML"
 ** Aqui se define los tipos y sus iconos que habra
 * @type {{String:String}}
*/
var iconos = {
    "txt": '<i class="fa-solid fa-note-sticky fa-2xl icon"></i>',
    "ERROR": '<i class="fa-solid fa-triangle-exclamation  fa-2xl icon"></i>',
    "folder": '<i class="fa-solid fa-folder fa-2xl icon"></i>',
    "img": '<i class="fa-solid fa-image fa-2xl icon"></i>',
    "mp3": '<i class="fa-solid fa-music fa-2xl icon"></i>'
}

/**
 ** Clase que representa una carpeta o un "ul", contiene toda la logica relacioanada con los directorios
 ** Realiza las acciones añadir un elemento y quitarlo, ademas de desplegar las carpetas
 */
class Folder {

    /**
     * Crea un ul, le agrega el icono, el nombre y los botones, y lo engancha al ulPadre  si hay
     * @param {String} nombre nombre de la carpeta
     * @param {?HTMLUListElement} ulPadre ul en el que se enganchara la carpeta
     */
    constructor(nombre, ulPadre) {
        this.ul = $(document.createElement("ul"))
            .html(iconos["folder"] + nombre)
        if (ulPadre) {
            // this.ul.fadeOut(0)
            ulPadre.append(this.ul)
            // setTimeout(10,this.ul.slideDown(300))
            // setTimeout(1,this.ul.fadeIn("slow"))
        }
        this.anhadirBotonDeAnhadir()
        this.anhadirBotonEliminar()
        this.anhadirBotonExpandir()
    }

    /**
     * Añade un elemento al ul, dependiendo de si tiene una extension o no, creara un elemento o una carpeta
     * @param {String} nombre nombre del elemento, si no tiene punto, creara una carpeta 
     */
    anhadirElemento(nombre) {
        // Comprueba si hay un elemento en el nivel que se va a añadir, si existe no lo crea
        let existeElemento = false
        this.ul.children().each(function (hijo) {
            if (["UL", "LI"].includes(hijo.tagName)) {
                if (hijo.childNodes[1].data == nombre) {
                    existeElemento = true
                }
            }
        })
        if (existeElemento) {
            return
        }
        if (nombre.split(".").length == 2 && nombre.split(".")[1]) { // Comprueeba si tiene una extension
            let archivo = $(document.createElement("li"))
                .html((iconos[nombre.split(".")[1]] || iconos["ERROR"]) + nombre) //añade el icono de la extension, si no hay, añade el icono de error 
                archivo.fadeOut(0)
                this.ul.append(archivo)
                archivo.fadeIn("slow")
            this.anhadirBotonEliminar(archivo)
        } else if (nombre.split(".").length == 1) { // si no tiene extension, significa que es una carpeta
            new Folder(nombre, this.ul)
        }
        buscador() //actualiza el buscador para que si el nuevo elemento coincide con la busqueda, aparezca tambien
    }

    /**
     * añade el boton de añadir a la carpeta, que se usara para indicar que el texto introducido en el input se use para 
     * crear un archivo o carpeta, en esta carpeta
     */
    anhadirBotonDeAnhadir() {
        let botonAnhadir = document.createElement("button")
        botonAnhadir.innerHTML = "+"
        botonAnhadir.onclick = function () { this.anhadirElemento(document.getElementById("nombre").value) }.bind(this)
        this.ul.append(botonAnhadir)
    }

    /**
     * Añade el boton de elminar a la carpeta o a un archivo, que eliminara el elemento actual, en el caso de que no tenga carpetas o arhivos hijos
     * @param {HTMLUListElement}  elemento 
     */
    anhadirBotonEliminar(elemento = this.ul) {
        if (!elemento.parentElement || elemento.parentElement.tagName == "DIV") {
            return
        }
        let buttonEliminar = document.createElement("button")
        buttonEliminar.innerHTML = "X"
        buttonEliminar.addEventListener("click", function (e) {
            if (e.target.parentElement.querySelectorAll("ul, li").length == 0 && e.target.parentElement.parentElement.tagName != "DIV") {
                e.target.parentElement.remove()
                buscador()
            }
        })
        elemento.appendChild(buttonEliminar)
    }

    /**
     * añade un boton a la carpeta para ocultar o mostrar sus elementos
     */
    anhadirBotonExpandir() {
        let botonExpandir = document.createElement("button")
        botonExpandir.innerText = "^"
        botonExpandir.onclick = function () {
            this.ul.classList.toggle("contraer")
            if (botonExpandir.innerText == "v") {
                botonExpandir.innerText = "^"
            } else {
                botonExpandir.innerText = "v"
            }
        }.bind(this)

        this.ul.append(botonExpandir)
    }


    /**
     * Exporta, de forma recursiva, la ul pasado como parametro en un diccionario que entendera el metodo importar
     * @param {HTMLUListElement} listaUl 
     * @returns {{"nombre":String,"elementos":[...String, ...{"nombre":String,"elementos":[]}]}} diccionario que representa el arbol de la ul pasada
     */
    exportar(listaUl) {
        let diccionario = {}
        diccionario["nombre"] = listaUl.childNodes[1].data

        diccionario["elementos"] = []
        Array.from(listaUl.children).forEach(function (elemento) {
            if (elemento.tagName == "LI") {
                diccionario["elementos"].push(elemento.innerText.slice(0, -1)) // si es un archivo lo mete como una string en la lista "elementos"
            } else if (elemento.tagName == "UL") {
                diccionario["elementos"].push(this.exportar(elemento)) // si es una carpeta, lo mete como un diccionario en la lista "elementos"
            }
        }, this)
        return diccionario
    }
    //importa el arbol pasado como diccionario al objeto folder

    /**
     * Transforma la carpeta actual en la carpeta pasada como parametro en formato diccionario, obtenida mediante exportacion, de forna recursiva
     * @param {Diccionario} diccionario 
     */
    importar(diccionario) {
        this.ul.innerHTML = iconos["folder"]
        this.ul.innerHTML += diccionario["nombre"]
        this.anhadirBotonDeAnhadir()
        this.anhadirBotonEliminar()
        this.anhadirBotonExpandir()
        for (const archivo of diccionario["elementos"]) {
            if (typeof archivo == "string") {
                this.anhadirElemento(archivo)
            } else {
                new Folder(archivo["nombre"], this.ul).importar(archivo)
            }
        }
    }
}


// boton para generar un directorio de ejemplo
let botonCreador = $(document.createElement("button")).text("crear arbol de ejemplo")
    .on("click", function () { home.importar(dicc)})
$("#directorio").append(botonCreador)


//boton para eliminar el arbol actual
let botonEliminador = document.createElement("button");
botonEliminador.innerHTML = "Eliminar arbol"
$("#directorio").append(botonEliminador)
botonEliminador.onclick = function () {
    home.ul.children().each(function (index,hijo) {
        if (["UL", "LI"].includes(hijo.tagName)) {
            hijo.remove()
        }
        buscador()
    })
}



// Carpeta raiz
let home = new Folder("/")
$("#directorio").append(home.ul)



// comprueba si existe un arbol guardado en localStorage, y si lo hay, lo importa
if (localStorage.arbol) {
    home.importar(JSON.parse(localStorage["arbol"]))
}

// Cuando se cierra la pagina o se recarga, guarda el arbol en localStorage
window.onbeforeunload = function () {
    localStorage["arbol"] = JSON.stringify(home.exportar(home.ul))
}


/**
 * busca de forma recursiva dentro de un ul los archivos o carpetas que coincidan con el nombre
 * @param {String} nombre 
 * @param {HTMLUListElement} ulEnElQueBuscar 
 * @returns {[...HTMLUListElement]}
 */
function buscar(nombre, ulEnElQueBuscar) {
    let resultado = []
    for (elemento of Array.from(ulEnElQueBuscar.children)) {
        if (!["UL", "LI"].includes(elemento.tagName)) {
            continue
        }
        if (elemento.childNodes[1].data.includes(nombre)) {
            resultado.push(elemento)
        }
        if (elemento.tagName == "UL") {
            resultado.push(...buscar(nombre, elemento)) //si es un ul, hace un buscar() dentro de el
        }
    }
    return resultado
}

// aqui se guarda el resultado de la busqueda, se actualiza cada vez que el input busqueda se actualiza
var resultadoDeBuscar = []

// funcion usada para el evento input del cuadro de busqueda, usa buscar() con el texto del input busqueda
// y añade los elementos encontrados al div resultadoBusqueda
function buscador() {
    document.getElementById("resultadoBusqueda").innerHTML = ""
    let textoIntroducido = document.getElementById("busqueda").value
    if (textoIntroducido) {
        resultadoDeBuscar = buscar(textoIntroducido, document.getElementById("directorio"))
    } else {
        resultadoDeBuscar = []
    }
    resultadoDeBuscar.forEach(function (value) {
        let nodo = value.cloneNode()
        nodo.appendChild(value.firstChild.cloneNode())
        nodo.innerHTML += value.childNodes[1].data

        document.getElementById("resultadoBusqueda").appendChild(nodo)
    })
}

// //funcion alternativa para el buscador
// function buscadorAlternativo(){
//     let textoIntroducido = document.getElementById("busqueda").value
//     if (textoIntroducido) {
//         resultadoDeBuscar = buscar(textoIntroducido, document.getElementById("directorio"))
//         Array.from(document.querySelectorAll("ul,li")).forEach(function(elemento){
//             elemento.classList.add("oculto")
//         })
//         resultadoDeBuscar.forEach(function(elemento){
//             elemento.classList.remove("oculto")
//         })
//     } else {
//         resultadoDeBuscar = []
//         let ocultos = document.querySelectorAll(".oculto")
//         Array.from(ocultos).forEach(function(elemento){
//             elemento.classList.remove("oculto")
//         })
//     }
// }



// buscador de archivos y carpetas 
$("#busqueda").on("input", buscador)



// el autocompletado del input de busqueda para cuando solo existe una coincidencia

$("#busqueda").on("keydown", function (e) {
    if (e.key == "Tab") {
        e.preventDefault()
        if (resultadoDeBuscar.length == 1) {
            busqueda.value = resultadoDeBuscar[0].childNodes[1].data
        }
    }
})





// diccionario directorio de ejemplo 
let dicc = {
    "nombre": "/",
    "elementos": [
        "error.log",
        "console.log",
        "startup.log",
        {
            "nombre": "imagenes",
            "elementos": [
                "pato.img",
                "perro.img",
                "gato.img",
                "ornitorrinco.img",
                "loro.img"
            ]
        },
        {
            "nombre": "musica",
            "elementos": [
                "wrecking ball.mp3",
                "Ganga style.mp3",
                "darude sandstorm.mp3"
            ]
        },
        {
            "nombre": "notas",
            "elementos": [
                "nota1.txt",
                "nota2.txt",
                "nota3.txt",
                "nota4.txt",
                "nota5.txt",
                {
                    "nombre": "notas importantes",
                    "elementos": [
                        "nota importante 1.txt",
                        "nota importante 2.txt",
                        "nota importante 3.txt",
                        "nota imporante 4.txt",
                        "nota importante 5.txt",
                        {
                            "nombre": "notas super importantes",
                            "elementos": [
                                "receta de la cangreburguer.txt"
                            ]
                        }
                    ]
                }
            ]
        },
        "shutdown.log",
        "stadistics.log"
    ]
}
