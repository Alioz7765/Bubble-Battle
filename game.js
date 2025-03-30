const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// إعدادات الحركة
let joystickX = 0;
let joystickY = 0;
let isShooting = false;
let shootDirection = null;

// فقاعة اللاعب
class Bubble {
    constructor(x, y, color, id) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.id = id;
        this.radius = 30;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.stroke();
    }
}

// إنشاء الفقاعات (الأهداف)
let bubbles = [];
const colors = ["red", "blue", "green", "yellow", "purple"];
for (let i = 0; i < 10; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let color = colors[i % colors.length];
    bubbles.push(new Bubble(x, y, color, i));
}

// إعدادات الحركة عند استخدام عصا التحكم
document.getElementById("joystick").addEventListener("mousemove", (e) => {
    const joystick = document.getElementById("joystick");
    const joystickRect = joystick.getBoundingClientRect();
    const x = e.clientX - joystickRect.left;
    const y = e.clientY - joystickRect.top;

    const angle = Math.atan2(y - 50, x - 50);
    const distance = Math.min(Math.sqrt(Math.pow(x - 50, 2) + Math.pow(y - 50, 2)), 40);

    joystickX = Math.cos(angle) * distance;
    joystickY = Math.sin(angle) * distance;

    document.getElementById("joystickHandle").style.transform = `translate(${joystickX}px, ${joystickY}px)`;
});

// إعدادات زر إطلاق السهام
document.getElementById("shootButton").addEventListener("click", () => {
    isShooting = true;
    shootDirection = Math.atan2(joystickY, joystickX);
});

// تحديث اللعبة في حلقة متكررة
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // تحريك الفقاعة
    if (joystickX !== 0 || joystickY !== 0) {
        // تحرك اللاعب بناءً على عصا التحكم
        const playerBubble = bubbles[0];
        playerBubble.x += joystickX / 5;
        playerBubble.y += joystickY / 5;
    }

    // رسم الفقاعات
    bubbles.forEach(bubble => bubble.draw());

    // إطلاق السهام إذا كان الزر مضغوطًا
    if (isShooting && shootDirection !== null) {
        const playerBubble = bubbles[0];
        const arrowLength = 10;
        ctx.beginPath();
        ctx.moveTo(playerBubble.x, playerBubble.y);
        ctx.lineTo(playerBubble.x + Math.cos(shootDirection) * arrowLength, playerBubble.y + Math.sin(shootDirection) * arrowLength);
        ctx.strokeStyle = "white";
        ctx.stroke();
        isShooting = false;  // إعادة تعيين بعد إطلاق السهم
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
