// إعدادات اللعبة
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ضبط حجم الـ canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// خصائص اللاعب
let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    color: 'blue',
    dx: 0,
    dy: 0
};

// خصائص السهام
let arrows = [];

// رسم الفقاعة
function drawBubble() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
}

// رسم السهام
function drawArrows() {
    arrows.forEach((arrow, index) => {
        arrow.x += arrow.dx;
        arrow.y += arrow.dy;

        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(arrow.x, arrow.y, 10, 0, Math.PI * 2);
        ctx.fill();

        // حذف السهم إذا خرج من الشاشة
        if (arrow.x < 0 || arrow.x > canvas.width || arrow.y < 0 || arrow.y > canvas.height) {
            arrows.splice(index, 1);
        }
    });
}

// تحديث اللعبة
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.x += player.dx;
    player.y += player.dy;

    drawBubble();
    drawArrows();

    requestAnimationFrame(updateGame);
}

// وظيفة تحريك الفقاعة
document.addEventListener('touchmove', (event) => {
    let touchX = event.touches[0].clientX;
    let touchY = event.touches[0].clientY;

    let dx = touchX - player.x;
    let dy = touchY - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 5) {
        player.dx = dx / distance * 5;
        player.dy = dy / distance * 5;
    }
});

// إطلاق السهام
function fireArrow() {
    let arrow = {
        x: player.x,
        y: player.y,
        dx: player.dx * 3,
        dy: player.dy * 3
    };
    arrows.push(arrow);
}

// إضافة حدث الضغط على زر الإطلاق
document.getElementById("fireButton").addEventListener("touchstart", fireArrow);

// بدء اللعبة
updateGame();
