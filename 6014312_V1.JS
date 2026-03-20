const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
const messageDiv = document.getElementById('message');


let points = [
    { x: 100, y: 300, color: '#ef4444' },
    { x: 400, y: 300, color: '#10b981' },
    { x: 250, y: 100, color: '#3b82f6' }
];
let draggingPoint = null;

//Para dibujar en el canva

function drawPixel(x, y, color = "#1e293b") {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), 2, 2);
}

/*ALGORITMO DDA: Concepto: Calcula la pendiente (m) y avanza en pasos de 1 unidad en el eje
 de mayor longitud, calculando el valor flotante del otro eje y redondeándolo.*/

function lineDDA(p1, p2) {
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    let steps = Math.max(Math.abs(dx), Math.abs(dy));
    let xInc = dx / steps;
    let yInc = dy / steps;
    let x = p1.x, y = p1.y;

    for (let i = 0; i <= steps; i++) {
        drawPixel(x, y);
        x += xInc; y += yInc;
    }
}

/*
 ALGORITMO DE BRESENHAM
 Concepto: Optimización que utiliza solo aritmética de enteros.
 Usa un "parámetro de decisión" para determinar si el siguiente píxel
 debe subir/bajar en el eje secundario, evitando divisiones y flotantes.
 */
function drawBresenham(x1, y1, x2, y2, size) {
    x1 = Math.round(x1); y1 = Math.round(y1);
    x2 = Math.round(x2); y2 = Math.round(y2);

    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    let sx = (x1 < x2) ? 1 : -1;
    let sy = (y1 < y2) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        drawPoint(ctx, x1, y1, size);
        if (x1 === x2 && y1 === y2) break;
        let e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x1 += sx; }
        if (e2 < dx) { err += dx; y1 += sy; }
    }
}

function drawLine(x1, y1, x2, y2, size, method) {
    ctx.fillStyle = "#2c3e50"; // Color de la línea
    if (method === 'dda') {
        drawDDA(x1, y1, x2, y2, size);
    } else {
        drawBresenham(x1, y1, x2, y2, size);
    }
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#e0e0e0";
    ctx.fillStyle = "#888";
    ctx.font = "10px Arial";

    // Ejes y medidas numéricas
    for (let i = 0; i <= canvas.width; i += 50) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        ctx.fillText(i, i + 2, 12); // Números en X
    }
    for (let j = 0; j <= canvas.height; j += 50) {
        ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke();
        ctx.fillText(j, 2, j - 2); // Números en Y
    }
}

function processTriangle() {
    drawGrid();
   
    const p1 = { x: parseInt(document.getElementById('x1').value), y: parseInt(document.getElementById('y1').value) };
    const p2 = { x: parseInt(document.getElementById('x2').value), y: parseInt(document.getElementById('y2').value) };
    const p3 = { x: parseInt(document.getElementById('x3').value), y: parseInt(document.getElementById('y3').value) };
    const method = document.getElementById('method').value;

    // Si el área es 0, los puntos son colineales (están en la misma línea)
    const area = Math.abs(p1.x*(p2.y - p3.y) + p2.x*(p3.y - p1.y) + p3.x*(p1.y - p2.y)) / 2;

    if (area > 0) {
        messageDiv.innerText = `RESULTADO: Se forma un triángulo válido. Método: ${method.toUpperCase()}`;
        messageDiv.style.color = "#27ae60";
       
        // Dibujar las 3 líneas del triángulo
        drawLine(p1.x, p1.y, p2.x, p2.y, 2, method);
        drawLine(p2.x, p2.y, p3.x, p3.y, 2, method);
        drawLine(p3.x, p3.y, p1.x, p1.y, 2, method);
    } else {
        messageDiv.innerText = "RESULTADO: No se forma un triángulo (puntos colineales o superpuestos).";
        messageDiv.style.color = "#e74c3c";
       
        // Dibujar solo los puntos para referencia visual
        ctx.fillStyle = "red";
        drawPoint(ctx, p1.x, p1.y, 6);
        drawPoint(ctx, p2.x, p2.y, 6);
        drawPoint(ctx, p3.x, p3.y, 6);
    }
}

drawBtn.addEventListener('click', processTriangle);

drawGrid();