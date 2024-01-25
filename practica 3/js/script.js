// objeto Teatro
var Teatro = function (id, fila, columna, pelicula, precio, url, asientosOcupados) {
    //atributos de teatro
    this.id = id
    this.fila = fila;
    this.columna = columna;
    this.pelicula = pelicula;
    this.precio = precio;
    this.url = url
    this.disponibilidadAsientosCine = Array(fila).fill(0) // 0 es libre, 1 es ocupado, 2 es resevado

    for (let i = 0; i < this.disponibilidadAsientosCine.length; i++) {
        let fila = Array(this.columna).fill(0);
        for (let index = 0; index < fila.length; index++) {
            if (asientosOcupados) {
                fila[index] = asientosOcupados[index + this.columna * i]
            } else {
                fila[index] = Math.floor(Math.random() * 1.1)
            }
        }
        this.disponibilidadAsientosCine[i] = fila
    }

    //metodos
    this.guardar = function (sistemaDeGuardado) {
        let datos = `${this.id};;${this.fila};;${this.columna};;${this.pelicula};;${this.precio};;${this.url};;${String(this.disponibilidadAsientosCine)}`
        sistemaDeGuardado.setItem(this.id, datos)
    }

    this.actualizar = function () {
        $("#precioTotal").text("Precio Total: " + (this.precio * this.obtenerDivsAsientoEscogido().length) + "€")
        let divAsientos = $("#asientos")
        let filas = divAsientos.children()
        for (let nFila = 0; nFila < filas.length; nFila++) {
            let fila = filas[nFila]
            for (let nAsiento = 0; nAsiento < fila.children.length; nAsiento++) {
                let asiento = $(fila.children[nAsiento])
                switch (this.disponibilidadAsientosCine[nFila][nAsiento]) {
                    case 0:asiento.attr("class","asiento libre")
                        break;
                    case 1:asiento.attr("class","asiento ocupado")
                        break;
                    case 2:asiento.attr("class","asiento escogido")
                        break;
                    default:break;
                }
            }
        }
        this.guardar(sessionStorage)
    }

    this.reservar = function (fila, columna) {
        if (this.disponibilidadAsientosCine[fila][columna] == 2) {
            return
        }
        if (this.disponibilidadAsientosCine[fila][columna] == 1) {
            return
        }
        this.disponibilidadAsientosCine[fila][columna] = 2;
        this.actualizar()
        return
    }

    this.liberar = function (fila, columna) {
        if (this.disponibilidadAsientosCine[fila][columna] == 0) {
            return
        }
        if (this.disponibilidadAsientosCine[fila][columna] == 1) {
            return
        }
        this.disponibilidadAsientosCine[fila][columna] = 0;
        this.actualizar()
    }

    this.cambiarEstado = function (i, j) {
        if (this.disponibilidadAsientosCine[i][j] == 0) {
            this.reservar(i, j)
        } else {
            this.liberar(i, j)
        }
    }
    this.representar = function () {
        let divCine = $(document.createElement("div")).attr("id", "cine")
        $("body").append(divCine)

        let pTitulo = $(document.createElement("p")).text(this.pelicula).attr("id", "titulo")
        divCine.append(pTitulo)

        let iframeVideo = $(document.createElement("iframe")).attr("src", this.url + "?autoplay=1&mute=1&controls=0&start=10&nocookie=1")
        divCine.append(iframeVideo)

        let pPrecio = $(document.createElement("p")).text("Precio por asiento " + this.precio + "€").attr("id", "precio")
        divCine.append(pPrecio)

        let divAsientos = $(document.createElement("div")).attr("id", "asientos")
        divCine.append(divAsientos)

        for (let i = 0; i < this.fila; i++) {
            let divFila = $(document.createElement("div")).attr("class", "fila")
            divAsientos.append(divFila)

            for (let j = 0; j < this.columna; j++) {
                let disponibilidad = "ocupado";
                if (this.disponibilidadAsientosCine[i][j] == 0) {
                    disponibilidad = "libre";
                } else if (this.disponibilidadAsientosCine[i][j] == 2) {
                    disponibilidad = "escogido";
                }
                let divAsiento = $(document.createElement("div"))
                    .attr("class", "asiento " + disponibilidad)
                    .text(i + "-" + j)
                    .click(function () { teatro.cambiarEstado(i, j) })
                    .on("mouseenter", function () { this.classList.add("encima") })
                    .on("mouseleave", function () { this.classList.remove("encima") })
                divFila.append(divAsiento)
            }
        }

        let pPrecioTotal = $(document.createElement("p"))
            .attr("id", "precioTotal")
            .text("Precio Total: " + (this.precio * this.obtenerDivsAsientoEscogido().length) + "€")
        divCine.append(pPrecioTotal)

        this.guardar(sessionStorage)
    }

    //metodo auxiliar para obtener los asientos escogidos por el usuario y su cantidad
    this.obtenerDivsAsientoEscogido = function () {
        let divAsientos = $("#asientos")
        let asientosEscogidos = []
        divAsientos.children().each(function (indexFila, fila, array) {
            $(fila).children().each(function (indexAsiento,asiento, array) {
                if (teatro.disponibilidadAsientosCine[indexFila][indexAsiento] == 2) {
                    asientosEscogidos.push(asiento)
                }
            })
        })
        return asientosEscogidos
    }


    //metodo para poner como ocupado los asientos escogidos
    this.comprarAsientosEscogidos = function () {

        this.obtenerDivsAsientoEscogido().forEach(function (asiento) {
            $(asiento).attr("class", "asiento ocupado")
            let coordenadas = $(asiento).text().split("-")
            teatro.disponibilidadAsientosCine[coordenadas[0]][coordenadas[1]] = 1
        })
        teatro.actualizar()
    }
}

//creacion de los objetos teatro
function iniciarStorage() {
    if (localStorage.length == 0) {
        let teatrosBase = [new Teatro(0, 10, 10, "Sonic", 5.0, "https://www.youtube-nocookie.com/embed/4mW9FE5ILJs"),
        new Teatro(1, 10, 15, "Pantera rosa", 7.25, "https://www.youtube-nocookie.com/embed/dKxgj5FxmZo"),
        new Teatro(2, 10, 20, "Sharknado 5", 7.5, "https://www.youtube-nocookie.com/embed/bAuIXCDd2Fw"),
        ]
        teatrosBase.forEach(function (value) {
            value.guardar(localStorage)
        })
    }
}

function obtenerTeatroDelStorage(id) {
    let sistemaDeGuardado = localStorage
    if (sessionStorage[id] != undefined) {
        sistemaDeGuardado = sessionStorage
    }
    let datos = sistemaDeGuardado.getItem(id).split(";;")
    return new Teatro(Number(datos[0]), Number(datos[1]), Number(datos[2]), datos[3], Number(datos[4]), datos[5], datos[6].split(","))
}

function crearCabecera() {
    let header = $(document.createElement("div")).attr("id", "header").text("Cartelera DEW")
    $("body").append(header)

    if (location.href.split("/").slice(-1) != "index.html") {
        let flecha = $(document.createElement("div")).attr("id", "flecha")
        header.append(flecha)

        let enlance = $(document.createElement("a")).attr("href", "../index.html")
        flecha.append(enlance)
    }
}

//iniciar cartelera 
function crearCartelera() {
    crearCabecera()
    iniciarStorage()

    let divCarteles = $(document.createElement("div")).attr("id", "carteles")
    $("body").append(divCarteles)

    for (let index = 0; index < localStorage.length; index++) {
        let pelicula = $(document.createElement("div"))
            .attr("class", "cartel")
            .on("click",function () { location.href = `html/sala${index + 1}.html` })
        divCarteles.append(pelicula)

        let texto = $(document.createElement("p")).text(`sala ${index + 1}`)
        pelicula.append(texto)

        let saltoDeLinea = $(document.createElement("br"))
        pelicula.append(saltoDeLinea)

        let imagen = $(document.createElement("img")).attr("src", `img/${obtenerTeatroDelStorage(index).pelicula}.png`)
        pelicula.append(imagen)
    }
}

//iniciar sala de cine             
function crearSala(id) {
    crearCabecera()
    iniciarStorage()
    teatro = obtenerTeatroDelStorage(id)
    teatro.representar()

    let divBoton = $(document.createElement("div")).attr("id", "botones")
    $("body").append(divBoton)

    let botonContinuar = $(document.createElement("div"))
        .text("Continuar")
        .on("mouseup", function () { continuar() })
    divBoton.append(botonContinuar)
}

// boton
function continuar() {
    console.log("realizando compra")
    if (teatro.obtenerDivsAsientoEscogido().length == 0) {
        return
    }
    teatro.comprarAsientosEscogidos()
}


