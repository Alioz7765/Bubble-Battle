// تحديد العناصر من HTML
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// إعدادات اللعبة
const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    size: 40,
    color: "red",
    speed: 5,
    arrow: null // السهم الحالي
};

const targets = [];
const colors = ["red", "green", "blue", "yellow", "orange"];
let currentColor = 0;

// إنشاء الأهداف العشوائية
function createTargets() {
    targets.length = 0;
    for (let i = 0; i < 5; i++) {
        targets.push({
            x: Math.random() * (canvas.width - 40) + 20,
            y: Math.random() * (canvas.height / 2),
            size: 30,
            color: colors[i]
        });
    }
}

// تحديث لون اللاعب كل 5 ثوانٍ
setInterval(() => {
    currentColor = (currentColor + 1) % colors.length;
    player.color = colors[currentColor];
}, 5000);

// رسم اللاعب
function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
}

// رسم الأهداف
function drawTargets() {
    targets.forEach(target => {
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.size, 0, Math.PI * 2);
        ctx.fillStyle = target.color;
        ctx.fill();
        ctx.closePath();
    });
}

// رسم السهم
function drawArrow() {
    if (player.arrow) {
        ctx.beginPath();
        ctx.rect(player.arrow.x, player.arrow.y, 5, 20);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
    }
}

// تحريك السهم
function moveArrow() {
    if (player.arrow) {
        player.arrow.y -= 7;
        if (player.arrow.y < 0) {
            player.arrow = null;
        }
    }
}

// فحص التصادم بين السهم والهدف
function checkCollision() {
    if (player.arrow) {
        targets.forEach((target, index) => {
            let dx = player.arrow.x - target.x;
            let dy = player.arrow.y - target.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < target.size) {
                if (target.color === player.color) {
                    console.log("إصابة صحيحة!");
                } else {
                    console.log("إصابة خاطئة! اللاعب خسر");
                }
                player.arrow = null;
                targets.splice(index, 1);
            }
        });
    }
}

// تحديث اللعبة
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawTargets();
    drawArrow();
    moveArrow();
    checkCollision();
    requestAnimationFrame(updateGame);
}

// التحكم في حركة اللاعب
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && player.x > player.size) {
        player.x -= player.speed;
    }
    if (event.key === "ArrowRight" && player.x < canvas.width - player.size) {
        player.x += player.speed;
    }
});

// إطلاق السهم عند الضغط على المسافة
document.addEventListener("keydown", (event) => {
    if (event.key === " " && !player.arrow) {
        player.arrow = { x: player.x, y: player.y - 20 };
    }
});

// بدء اللعبة
createTargets();
updateGame();
