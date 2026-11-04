# Juego Snake

Juego del Snake clásico hecho con HTML, CSS y JavaScript (sin librerías externas).

## Estructura del proyecto

```
snake/
├── index.html   -> estructura de la página (marcador, canvas, botones)
├── style.css    -> estilos y diseño
└── script.js    -> lógica del juego
```

## Cómo ejecutarlo

1. Descarga los tres archivos y guárdalos en la misma carpeta.
2. Abre `index.html` con el navegador (doble clic o botón derecho > Abrir con).
3. Pulsa **¡EMPEZAR!** y a jugar.

No hace falta instalar nada ni usar servidor.

## Controles

| Acción | Teclado | Móvil |
|---|---|---|
| Arriba | Flecha arriba / W | Botón ▲ |
| Abajo | Flecha abajo / S | Botón ▼ |
| Izquierda | Flecha izquierda / A | Botón ◀ |
| Derecha | Flecha derecha / D | Botón ▶ |
| Pausar / reanudar | Barra espaciadora | Botón "Pausar" |

## Cómo se juega

- Mueve la serpiente para comerte las manzanas rojas.
- Cada manzana da **10 puntos** y hace crecer la serpiente.
- Cada 50 puntos la serpiente va un poco más rápido.
- Pierdes si chocas con una pared o con tu propio cuerpo.
- El **récord** se guarda en el navegador con `localStorage`, así que no se pierde al cerrar la página.

## Cómo funciona (resumen)

- El tablero es un `canvas` de 400x400 píxeles dividido en una cuadrícula de 20x20 celdas.
- La serpiente es un array de objetos `{x, y}` y la cabeza es la posición 0.
- En cada paso se añade una nueva cabeza al principio (`unshift`) y se quita la cola (`pop`), salvo que haya comido.
- El juego se repite con `setInterval`, y al subir de nivel se reinicia el intervalo con la nueva velocidad.
- Para evitar que la serpiente se dé la vuelta sobre sí misma, se guarda la siguiente dirección y se comprueba que no sea la contraria a la actual.

## Posibles mejoras

- Añadir sonidos al comer y al perder.
- Poder elegir la dificultad.
- Añadir obstáculos en el tablero.
- Controlar la serpiente deslizando el dedo en el móvil.

## Tecnologías

- HTML5
- CSS3
- JavaScript (canvas y `localStorage`)

## Link de la web (hosteado desde Netlify)

- https://vocal-nougat-a99c8f.netlify.app/
