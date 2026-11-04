// ===== Referencias a los elementos del HTML =====
var lienzo = document.getElementById("lienzo");
var ctx = lienzo.getContext("2d");

var textoPuntos = document.getElementById("puntos");
var textoRecord = document.getElementById("record");
var textoPuntosFinales = document.getElementById("puntosFinales");
var textoMotivoFin = document.getElementById("motivoFin");

var pantallaInicio = document.getElementById("pantallaInicio");
var pantallaFin = document.getElementById("pantallaFin");
var tituloInicio = document.getElementById("tituloInicio");
var textoInicio = document.getElementById("textoInicio");

var botonEmpezar = document.getElementById("botonEmpezar");
var botonReintentar = document.getElementById("botonReintentar");
var botonPausa = document.getElementById("botonPausa");
var botonReiniciar = document.getElementById("botonReiniciar");

// ===== Configuración del tablero =====
var TAMANO_CELDA = 20; // cada cuadro mide 20px
var NUM_CELDAS = lienzo.width / TAMANO_CELDA; // 400 / 20 = 20 celdas por lado

// ===== Variables del juego =====
var serpiente = [];          // array de objetos {x, y} (posición en celdas)
var comida = { x: 0, y: 0 };

var direccionX = 1;          // hacia dónde se mueve ahora
var direccionY = 0;
var siguienteX = 1;          // dirección que quiere el jugador
var siguienteY = 0;

var puntos = 0;
var record = 0;
var velocidad = 120;         // milisegundos entre cada movimiento

var intervalo = null;        // aquí guardamos el temporizador del juego
var jugando = false;
var pausado = false;

// ===== Cargar el récord guardado =====
// Si no hay nada guardado, empezamos en 0
var recordGuardado = localStorage.getItem("snake_record");
if (recordGuardado !== null) {
    record = parseInt(recordGuardado);
}
textoRecord.textContent = record;

// ===== Empezar una partida nueva =====
function empezarJuego() {
    // La serpiente empieza con 3 cuadritos
    serpiente = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    // Empieza yendo hacia la derecha
    direccionX = 1;
    direccionY = 0;
    siguienteX = 1;
    siguienteY = 0;

    puntos = 0;
    velocidad = 120;
    textoPuntos.textContent = puntos;

    crearComida();

    jugando = true;
    pausado = false;
    botonPausa.textContent = "Pausar";

    // Escondemos las pantallas
    pantallaInicio.classList.add("oculto");
    pantallaFin.classList.add("oculto");

    // Paramos el temporizador anterior por si acaso y arrancamos uno nuevo
    clearInterval(intervalo);
    intervalo = setInterval(bucleJuego, velocidad);

    dibujar();
}

// ===== Esta función se repite continuamente =====
function bucleJuego() {
    if (pausado == true) {
        return; // si está pausado no hacemos nada
    }
    moverSerpiente();
    dibujar();
}

// ===== Mover la serpiente un paso =====
function moverSerpiente() {
    // Actualizamos la dirección con la que pidió el jugador
    direccionX = siguienteX;
    direccionY = siguienteY;

    // Calculamos dónde va a estar la cabeza
    var nuevaCabeza = {
        x: serpiente[0].x + direccionX,
        y: serpiente[0].y + direccionY
    };

    // 1. Comprobamos si choca con las paredes
    if (nuevaCabeza.x < 0 || nuevaCabeza.x >= NUM_CELDAS || nuevaCabeza.y < 0 || nuevaCabeza.y >= NUM_CELDAS) {
        terminarJuego("¡Has chocado contra la pared!");
        return;
    }

    // 2. Comprobamos si choca con su propio cuerpo
    for (var i = 0; i < serpiente.length; i++) {
        if (nuevaCabeza.x == serpiente[i].x && nuevaCabeza.y == serpiente[i].y) {
            terminarJuego("¡Te has mordido a ti mismo!");
            return;
        }
    }

    // Añadimos la nueva cabeza al principio del array
    serpiente.unshift(nuevaCabeza);

    // 3. Comprobamos si se ha comido la manzana
    if (nuevaCabeza.x == comida.x && nuevaCabeza.y == comida.y) {
        puntos = puntos + 10;
        textoPuntos.textContent = puntos;

        // Si supera el récord lo actualizamos y lo guardamos
        if (puntos > record) {
            record = puntos;
            textoRecord.textContent = record;
            localStorage.setItem("snake_record", record);
        }

        // Cada 50 puntos va un poco más rápido
        if (puntos % 50 == 0 && velocidad > 60) {
            velocidad = velocidad - 10;
            clearInterval(intervalo);
            intervalo = setInterval(bucleJuego, velocidad);
        }

        crearComida();
    } else {
        // Si no ha comido quitamos la cola para que no crezca
        serpiente.pop();
    }
}

// ===== Crear la comida en un sitio libre =====
function crearComida() {
    var posicionValida = false;

    while (posicionValida == false) {
        // Posición aleatoria dentro del tablero
        comida.x = Math.floor(Math.random() * NUM_CELDAS);
        comida.y = Math.floor(Math.random() * NUM_CELDAS);

        // Suponemos que está bien y comprobamos que no caiga encima de la serpiente
        posicionValida = true;
        for (var i = 0; i < serpiente.length; i++) {
            if (serpiente[i].x == comida.x && serpiente[i].y == comida.y) {
                posicionValida = false;
            }
        }
    }
}

// ===== Dibujar todo en el canvas =====
function dibujar() {
    // Borramos todo pintando el fondo
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, lienzo.width, lienzo.height);

    // Dibujamos la cuadrícula
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 1;
    for (var i = 0; i <= NUM_CELDAS; i++) {
        // línea vertical
        ctx.beginPath();
        ctx.moveTo(i * TAMANO_CELDA, 0);
        ctx.lineTo(i * TAMANO_CELDA, lienzo.height);
        ctx.stroke();

        // línea horizontal
        ctx.beginPath();
        ctx.moveTo(0, i * TAMANO_CELDA);
        ctx.lineTo(lienzo.width, i * TAMANO_CELDA);
        ctx.stroke();
    }

    dibujarComida();
    dibujarSerpiente();
}

// ===== Dibujar la manzana =====
function dibujarComida() {
    // Pasamos de celdas a píxeles
    var px = comida.x * TAMANO_CELDA;
    var py = comida.y * TAMANO_CELDA;

    // Círculo rojo
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(px + TAMANO_CELDA / 2, py + TAMANO_CELDA / 2, 8, 0, Math.PI * 2);
    ctx.fill();

    // Hojita verde arriba
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(px + 9, py + 1, 3, 4);
}

// ===== Dibujar la serpiente =====
function dibujarSerpiente() {
    for (var i = 0; i < serpiente.length; i++) {
        var px = serpiente[i].x * TAMANO_CELDA;
        var py = serpiente[i].y * TAMANO_CELDA;

        if (i == 0) {
            // La cabeza es de un verde más claro
            ctx.fillStyle = "#10b981";
            ctx.fillRect(px, py, TAMANO_CELDA, TAMANO_CELDA);
            dibujarOjos(px, py);
        } else {
            // El cuerpo es de un verde más oscuro y un poco más pequeño
            ctx.fillStyle = "#059669";
            ctx.fillRect(px + 1, py + 1, TAMANO_CELDA - 2, TAMANO_CELDA - 2);
        }
    }
}

// ===== Dibujar los ojos según la dirección =====
function dibujarOjos(px, py) {
    ctx.fillStyle = "white";

    if (direccionX == 1) {
        // mirando a la derecha
        ctx.fillRect(px + 12, py + 4, 4, 4);
        ctx.fillRect(px + 12, py + 12, 4, 4);
    } else if (direccionX == -1) {
        // mirando a la izquierda
        ctx.fillRect(px + 4, py + 4, 4, 4);
        ctx.fillRect(px + 4, py + 12, 4, 4);
    } else if (direccionY == -1) {
        // mirando hacia arriba
        ctx.fillRect(px + 4, py + 4, 4, 4);
        ctx.fillRect(px + 12, py + 4, 4, 4);
    } else {
        // mirando hacia abajo
        ctx.fillRect(px + 4, py + 12, 4, 4);
        ctx.fillRect(px + 12, py + 12, 4, 4);
    }
}

// ===== Fin de la partida =====
function terminarJuego(motivo) {
    jugando = false;
    clearInterval(intervalo);

    textoMotivoFin.textContent = motivo;
    textoPuntosFinales.textContent = puntos;
    pantallaFin.classList.remove("oculto");
}

// ===== Pausar / reanudar =====
function pausar() {
    // Si no estamos jugando no hace nada
    if (jugando == false) {
        return;
    }

    if (pausado == false) {
        pausado = true;
        botonPausa.textContent = "Reanudar";
        tituloInicio.textContent = "Juego pausado";
        textoInicio.textContent = "Pulsa Reanudar o la barra espaciadora para seguir.";
        botonEmpezar.textContent = "REANUDAR";
        pantallaInicio.classList.remove("oculto");
    } else {
        pausado = false;
        botonPausa.textContent = "Pausar";
        pantallaInicio.classList.add("oculto");
    }
}

// ===== Cambiar la dirección de la serpiente =====
function cambiarDireccion(x, y) {
    if (jugando == false || pausado == true) {
        return;
    }

    // Evitamos que se dé la vuelta sobre sí misma (se mataría al instante)
    if (x == -direccionX && x != 0) {
        return;
    }
    if (y == -direccionY && y != 0) {
        return;
    }

    siguienteX = x;
    siguienteY = y;
}

// ===== Eventos del teclado =====
document.addEventListener("keydown", function (evento) {
    // Evitamos que la página haga scroll con las flechas y el espacio
    if (evento.code == "ArrowUp" || evento.code == "ArrowDown" || evento.code == "ArrowLeft" || evento.code == "ArrowRight" || evento.code == "Space") {
        evento.preventDefault();
    }

    if (evento.code == "ArrowUp" || evento.code == "KeyW") {
        cambiarDireccion(0, -1);
    } else if (evento.code == "ArrowDown" || evento.code == "KeyS") {
        cambiarDireccion(0, 1);
    } else if (evento.code == "ArrowLeft" || evento.code == "KeyA") {
        cambiarDireccion(-1, 0);
    } else if (evento.code == "ArrowRight" || evento.code == "KeyD") {
        cambiarDireccion(1, 0);
    } else if (evento.code == "Space") {
        pausar();
    }
});

// ===== Botones del mando para móvil =====
document.getElementById("botonArriba").addEventListener("click", function () {
    cambiarDireccion(0, -1);
});
document.getElementById("botonAbajo").addEventListener("click", function () {
    cambiarDireccion(0, 1);
});
document.getElementById("botonIzquierda").addEventListener("click", function () {
    cambiarDireccion(-1, 0);
});
document.getElementById("botonDerecha").addEventListener("click", function () {
    cambiarDireccion(1, 0);
});

// ===== Botones de la interfaz =====
botonEmpezar.addEventListener("click", function () {
    if (jugando == false) {
        empezarJuego();
    } else if (pausado == true) {
        pausar();
    }
});

botonReintentar.addEventListener("click", empezarJuego);
botonReiniciar.addEventListener("click", empezarJuego);
botonPausa.addEventListener("click", pausar);

// ===== Al cargar la página dibujamos el tablero vacío =====
dibujar();
