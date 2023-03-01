const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");
const paginacionDiv = document.querySelector("#paginacion");
let iterador;
const registroPorPagina = 40;
let totalPaginas;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener("submit", validarFormulario);
};

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector("#termino").value;

    if (terminoBusqueda === "") {
        mostrarAlerta("Agrega termino de busqueda");
        return;
    }

    buscarImagenes();
}

function mostrarAlerta(mensaje) {
    const alerta = document.createElement("p");

    const existeAlerta = document.querySelector(".bg-red-100");

    if (!existeAlerta) {
        alerta.classList.add(
            "bg-red-100",
            "border-red-400",
            "text-red-700",
            "px-4",
            "py-3",
            "rounded",
            "max-w-lg",
            "mx-auto",
            "mt-6",
            "text-center"
        );

        alerta.innerHTML = `
    <strong class="font-bold">Error!</strong>
    <span class="block">${mensaje}</span>
    `;

        formulario.appendChild(alerta);

        setTimeout(() => alerta.remove(), 3000);
    }
}

function buscarImagenes() {
    const termino = document.querySelector("#termino").value;
    const key = "33707487-d2ed634827ccd49a6f92ddabf";
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registroPorPagina}&page=${paginaActual}`;

    fetch(url)
        .then((response) => response.json())
        .then((resultado) => {
            totalPaginas = calcularPaginas(resultado.totalHits);
            mostrarImagenes(resultado.hits);
        });
}

//Generador que va a registrar la cantidad de elementos  de acuerdo a las paginas

function* crearPaginador(total) {
    //console.log(total);
    for (let i = 1; i <= total; i++) {
        yield i;
        //console.log(i);
    }
}

function mostrarImagenes(imagenes = []) {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    //Iterar sobre el array de imagenes que devuelve la API para agregar las imagenes al DOM
    imagenes.forEach((imagen) => {
        const { previewURL, likes, views, largeImageURL } = imagen;

        resultado.innerHTML += `
        <div class="w-1/2 md:1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white">
                <img class="w-full" src="${previewURL}" />
                <div class="p-4">
                    <p class="font-bold m-2"> <span class="font-light">${likes} Me gusta </span></p>
                    <p class="font-bold m-2"> <span class="font-light">${views} vistas </span></p>

                    <a 
                    class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                    href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Ver imagen</a>
                </div>
            </div>
        </div>
        `;
    });

    //Limpiar paginador previo
    while (paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }

    //Generar nuevo HTML para mostrarlos paginadores
    imprimirPaginador();
}

function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registroPorPagina));
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);

    while (true) {
        const { value, done } = iterador.next();

        if (done) return;

        //Caso contrario, genera un boton por cada "pagina"

        const boton = document.createElement("a");
        boton.href = "#";
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add(
            "siguiente",
            "bg-yellow-400",
            "px-4",
            "py-1",
            "mr-2",
            "font-bold",
            "mb-4",
            "rounded"
        );

        boton.onclick = () => {
            paginaActual = value;
            buscarImagenes();
        };
        paginacionDiv.appendChild(boton);
    }
}
