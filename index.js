const canvas = document.getElementById('drawing-board');
const toolbar = document.getElementById('toolbar');
const increment = document.getElementById("increment");
const decrement = document.getElementById("decrement");
const inputfield = document.getElementById("lineWidth");
const undoButton = document.getElementById("undo");
const ctx = canvas.getContext('2d');
const canvasHistory = [];

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;

let isPainting = false;
let lineWidth = 5;
let startX;
let startY;

function inc(element) {
    let el = document.querySelector(`[name="${element}"]`);
    el.value = parseInt(el.value) + 1;
    lineWidth = el.value;
}

function dec(element) {
    let el = document.querySelector(`[name="${element}"]`);
    if (parseInt(el.value) > 0) {
        el.value = parseInt(el.value) - 1;
        lineWidth = el.value;
    }
}

toolbar.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

toolbar.addEventListener('change', e => {
    if (e.target.id === 'stroke') {
        ctx.strokeStyle = e.target.value;
    }

    if (e.target.id === 'lineWidth') {
        lineWidth = e.target.value;
    }
});

const draw = (e) => {
    if (!isPainting) {
        return;
    }

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    if (e.touches) {
        // Handle touch events
        const touch = e.touches[0];
        ctx.lineTo(touch.clientX - canvasOffsetX, touch.clientY - canvasOffsetY);
    } else {
        // Handle mouse events
        ctx.lineTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY);
    }

    ctx.stroke();
}

canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;
});

canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    isPainting = true;
    startX = touch.clientX;
    startY = touch.clientY;
});

canvas.addEventListener('mouseup', e => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
    canvasHistory.push(canvas.toDataURL())
});

canvas.addEventListener('touchend', e => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
    canvasHistory.push(canvas.toDataURL())
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchmove', draw);

undoButton.addEventListener("click", () => {
    canvasHistory.pop();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log(canvasHistory);
    canvasHistory.forEach((path) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        };
    })
});

document.querySelector('.screen').addEventListener('click', function() {
    html2canvas(document.querySelector('.drawing-board'), {
        onrendered: function(canvas) {
            return Canvas2Image.saveAsPNG(canvas);
        }
    });
});
