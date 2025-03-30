// متغيرات اللعبة
const gameArea = document.getElementById('gameArea');
const joystick = document.getElementById('joystick');
const shootArea = document.getElementById('shootArea');
const arrowPower = document.getElementById('arrowPower');
const startScreen = document.getElementById('startScreen');
const endScreen = document.getElementById('endScreen');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const playerLevelElement = document.getElementById('playerLevel');
const timeLeftElement = document.getElementById('timeLeft');
const playersCountElement = document.getElementById('playersCount');
const endTitle = document.getElementById('endTitle');
const endMessage = document.getElementById('endMessage');

// إعدادات اللعبة
const gameSettings = {
    playerSpeed: 3,
    bubbleRadius: 25,
    arrowSpeed: 8,
    colorChangeInterval: 10000,
    gameDuration: 30000,
    maxPlayers: 10
};

// مستويات اللعبة
const levels = [
    { name: 'قوس خشبي', emoji: '🏹', color: 'level-1', requiredDefeats: 10 },
    { name: 'قوس حديدي', emoji: '🏹', color: 'level-2', requiredDefeats: 100 },
    { name: 'سيف حديدي', emoji: '⚔', color: 'level-3', requiredDefeats: 1000 },
    { name: 'سيف ذهبي', emoji: '⚔✨', color: 'level-4', requiredDefeats: 10000 },
    { name: 'تاج', emoji: '👑', color: 'level-5', requiredDefeats: 1000000 }
];

// حالة اللعبة
let gameState = {
    player: null,
    bubbles: [],
    arrows: [],
    joystickActive: false,
    shootActive: false,
    startX: 0,
    startY: 0,
    joystickX: 0,
    joystickY: 0,
    shootStartX: 0,
    shootStartY: 0,
    currentColor: 'level-1',
    gameActive: false,
    timeLeft: gameSettings.gameDuration / 1000,
    colorChangeTimer: null,
    gameTimer: null,
    playerLevel: 1,
    playersDefeated: 0
};

// تهيئة اللعبة
function initGame() {
    setupJoystick();
    setupShootArea();
    
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
}

// إعداد عصا التحكم
function setupJoystick() {
    joystick.addEventListener('touchstart', handleJoystickStart);
    joystick.addEventListener('touchmove', handleJoystickMove);
    joystick.addEventListener('touchend', handleJoystickEnd);
    
    joystick.addEventListener('mousedown', handleJoystickStart);
    document.addEventListener('mousemove', handleJoystickMove);
    document.addEventListener('mouseup', handleJoystickEnd);
}

// إعداد منطقة الإطلاق
function setupShootArea() {
    shootArea.addEventListener('touchstart', handleShootStart);
    shootArea.addEventListener('touchmove', handleShootMove);
    shootArea.addEventListener('touchend', handleShootEnd);
    
    shootArea.addEventListener('mousedown', handleShootStart);
    document.addEventListener('mousemove', handleShootMove);
    document.addEventListener('mouseup', handleShootEnd);
}

// بدء اللعبة
function startGame() {
    gameState = {
        player: null,
        bubbles: [],
        arrows: [],
        joystickActive: false,
        shootActive: false,
        startX: 0,
        startY: 0,
        joystickX: 0,
        joystickY: 0,
        shootStartX: 0,
        shootStartY: 0,
        currentColor: 'level-1',
        gameActive: true,
        timeLeft: gameSettings.gameDuration / 1000,
        playerLevel: 1,
        playersDefeated: 0
    };
    
    playerLevelElement.textContent = gameState.playerLevel;
    timeLeftElement.textContent = gameState.timeLeft;
    playersCountElement.textContent = gameSettings.maxPlayers;
    
    startScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    
    gameArea.innerHTML = '';
    
    createPlayer();
    createBubbles();
    startTimers();
    
    requestAnimationFrame(gameLoop);
}

// إنشاء اللاعب
function createPlayer() {
    const bubble = document.createElement('div');
    bubble.className = `bubble player-bubble ${gameState.currentColor}`;
    bubble.style.width = `${gameSettings.bubbleRadius * 2}px`;
    bubble.style.height = `${gameSettings.bubbleRadius * 2}px`;
    
    const gameRect = gameArea.getBoundingClientRect();
    const centerX = gameRect.width / 2 - gameSettings.bubbleRadius;
    const centerY = gameRect.height / 2 - gameSettings.bubbleRadius;
    
    bubble.style.left = `${centerX}px`;
    bubble.style.top = `${centerY}px`;
    bubble.innerHTML = levels[gameState.playerLevel - 1].emoji;
    
    gameArea.appendChild(bubble);
    gameState.player = {
        element: bubble,
        x: centerX,
        y: centerY,
        dx: 0,
        dy: 0,
        color: gameState.currentColor,
        level: gameState.playerLevel
    };
}

// إنشاء الفقاعات الأخرى
function createBubbles() {
    const gameRect = gameArea.getBoundingClientRect();
    const radius = gameSettings.bubbleRadius;
    
    for (let i = 0; i < gameSettings.maxPlayers - 1; i++) {
        const bubble = document.createElement('div');
        const level = Math.floor(Math.random() * 5) + 1;
        const colorClass = `level-${level}`;
        
        bubble.className = `bubble ${colorClass}`;
        bubble.style.width = `${radius * 2}px`;
        bubble.style.height = `${radius * 2}px`;
        
        let x, y;
        do {
            x = Math.random() * (gameRect.width - radius * 2);
            y = Math.random() * (gameRect.height - radius * 2);
        } while (Math.sqrt(Math.pow(x - gameRect.width/2, 2) + Math.pow(y - gameRect.height/2, 2)) < 100);
        
        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;
        bubble.innerHTML = levels[level - 1].emoji;
        
        gameArea.appendChild(bubble);
        
        const speed = 1 + Math.random() * 2;
        const angle = Math.random() * Math.PI * 2;
        
        gameState.bubbles.push({
            element: bubble,
            x: x,
            y: y,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            color: colorClass,
            level: level
        });
    }
}

// بدء المؤقتات
function startTimers() {
    gameState.colorChangeTimer = setInterval(changeColors, gameSettings.colorChangeInterval);
    
    gameState.gameTimer = setInterval(() => {
        gameState.timeLeft--;
        timeLeftElement.textContent = gameState.timeLeft;
        
        if (gameState.timeLeft <= 0) {
            endGame(false, "انتهى الوقت!");
        }
    }, 1000);
}

// تغيير الألوان
function changeColors() {
    if (!gameState.gameActive) return;
    
    const newColorIndex = Math.floor(Math.random() * 5);
    gameState.currentColor = `level-${newColorIndex + 1}`;
    
    gameState.player.element.className = `bubble player-bubble ${gameState.currentColor}`;
    gameState.player.element.innerHTML = levels[gameState.playerLevel - 1].emoji;
    gameState.player.color = gameState.currentColor;
    
    gameState.bubbles.forEach(bubble => {
        const newEnemyColorIndex = Math.floor(Math.random() * 5);
        const newEnemyColor = `level-${newEnemyColorIndex + 1}`;
        
        bubble.element.className = `bubble ${newEnemyColor}`;
        bubble.element.innerHTML = levels[bubble.level - 1].emoji;
        bubble.color = newEnemyColor;
    });
}

// حلقة اللعبة الرئيسية
function gameLoop() {
    if (!gameState.gameActive) return;
    
    movePlayer();
    moveBubbles();
    moveArrows();
    checkCollisions();
    
    requestAnimationFrame(gameLoop);
}

// تحريك اللاعب
function movePlayer() {
    if (!gameState.player) return;
    
    const player = gameState.player;
    const gameRect = gameArea.getBoundingClientRect();
    const radius = gameSettings.bubbleRadius;
    
    player.x += player.dx;
    player.y += player.dy;
    
    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x > gameRect.width - radius * 2) player.x = gameRect.width - radius * 2;
    if (player.y > gameRect.height - radius * 2) player.y = gameRect.height - radius * 2;
    
    player.element.style.left = `${player.x}px`;
    player.element.style.top = `${player.y}px`;
}

// تحريك الفقاعات
function moveBubbles() {
    const gameRect = gameArea.getBoundingClientRect();
    const radius = gameSettings.bubbleRadius;
    
    gameState.bubbles.forEach(bubble => {
        bubble.x += bubble.dx;
        bubble.y += bubble.dy;
        
        if (bubble.x < 0 || bubble.x > gameRect.width - radius * 2) {
            bubble.dx *= -1;
            bubble.x = Math.max(0, Math.min(bubble.x, gameRect.width - radius * 2));
        }
        
        if (bubble.y < 0 || bubble.y > gameRect.height - radius * 2) {
            bubble.dy *= -1;
            bubble.y = Math.max(0, Math.min(bubble.y, gameRect.height - radius * 2));
        }
        
        bubble.element.style.left = `${bubble.x}px`;
        bubble.element.style.top = `${bubble.y}px`;
    });
}

// تحريك السهام
function moveArrows() {
    const gameRect = gameArea.getBoundingClientRect();
    
    gameState.arrows.forEach((arrow, index) => {
        arrow.x += arrow.dx;
        arrow.y += arrow.dy;
        
        if (arrow.x < -20 || arrow.x > gameRect.width || 
            arrow.y < -20 || arrow.y > gameRect.height) {
            arrow.element.remove();
            gameState.arrows.splice(index, 1);
            return;
        }
        
        arrow.element.style.left = `${arrow.x}px`;
        arrow.element.style.top = `${arrow.y}px`;
    });
}

// التحقق من التصادمات
function checkCollisions() {
    const radius = gameSettings.bubbleRadius;
    
    gameState.arrows.forEach((arrow, arrowIndex) => {
        gameState.bubbles.forEach((bubble, bubbleIndex) => {
            const dx = (arrow.x + 10) - (bubble.x + radius);
            const dy = (arrow.y + 2.5) - (bubble.y + radius);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < radius) {
                bubble.element.classList.add('hit-animation');
                setTimeout(() => {
                    bubble.element.classList.remove('hit-animation');
                }, 300);
                
                arrow.element.remove();
                gameState.arrows.splice(arrowIndex, 1);
                
                if (bubble.color === gameState.currentColor) {
                    bubble.element.remove();
                    gameState.bubbles.splice(bubbleIndex, 1);
                    
                    gameState.playersDefeated++;
                    checkLevelUp();
                    playersCountElement.textContent = gameState.bubbles.length + 1;
                    
                    if (gameState.bubbles.length === 0) {
                        endGame(true, "لقد فزت! أقصيت جميع الخصوم.");
                    }
                } else {
                    endGame(false, "أصبت الفقاعة الخطأ!");
                }
            }
        });
    });
}

// ترقية المستوى
function checkLevelUp() {
    const currentLevel = levels[gameState.playerLevel - 1];
    
    if (gameState.playersDefeated >= currentLevel.requiredDefeats && gameState.playerLevel < 5) {
        gameState.playerLevel++;
        playerLevelElement.textContent = gameState.playerLevel;
        
        gameState.player.element.className = `bubble player-bubble level-${gameState.playerLevel}`;
        gameState.player.element.innerHTML = levels[gameState.playerLevel - 1].emoji;
        gameState.player.level = gameState.playerLevel;
    }
}

// إنهاء اللعبة
function endGame(win, message) {
    gameState.gameActive = false;
    
    clearInterval(gameState.colorChangeTimer);
    clearInterval(gameState.gameTimer);
    
    endScreen.classList.remove('hidden');
    endTitle.textContent = win ? "فوز!" : "هزيمة!";
    endMessage.textContent = message;
}

// معالجات عصا التحكم
function handleJoystickStart(e) {
    e.preventDefault();
    gameState.joystickActive = true;
    
    const touch = e.type === 'touchstart' ? e.touches[0] : e;
    const joystickRect = joystick.getBoundingClientRect();
    
    gameState.startX = touch.clientX;
    gameState.startY = touch.clientY;
    gameState.joystickX = joystickRect.left + joystickRect.width / 2;
    gameState.joystickY = joystickRect.top + joystickRect.height / 2;
}

function handleJoystickMove(e) {
    if (!gameState.joystickActive) return;
    e.preventDefault();
    
    const touch = e.type === 'touchmove' ? e.touches[0] : e;
    const dx = touch.clientX - gameState.startX;
    const dy = touch.clientY - gameState.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 40;
    
    let moveX = dx;
    let moveY = dy;
    
    if (distance > maxDistance) {
        moveX = (dx / distance) * maxDistance;
        moveY = (dy / distance) * maxDistance;
    }
    
    joystick.style.transform = `translate(${moveX}px, ${moveY}px)`;
    
    if (gameState.player) {
        gameState.player.dx = (moveX / maxDistance) * gameSettings.playerSpeed;
        gameState.player.dy = (moveY / maxDistance) * gameSettings.playerSpeed;
    }
}

function handleJoystickEnd(e) {
    if (!gameState.joystickActive) return;
    e.preventDefault();
    
    gameState.joystickActive = false;
    joystick.style.transform = 'translate(0, 0)';
    
    if (gameState.player) {
        gameState.player.dx = 0;
        gameState.player.dy = 0;
    }
}

// معالجات منطقة الإطلاق
function handleShootStart(e) {
    if (!gameState.gameActive) return;
    e.preventDefault();
    
    gameState.shootActive = true;
    const touch = e.type === 'touchstart' ? e.touches[0] : e;
    const shootRect = shootArea.getBoundingClientRect();
    
    gameState.shootStartX = touch.clientX;
    gameState.shootStartY = touch.clientY;
    gameState.shootCenterX = shootRect.left + shootRect.width / 2;
    gameState.shootCenterY = shootRect.top + shootRect.height / 2;
}

function handleShootMove(e) {
    if (!gameState.shootActive) return;
    e.preventDefault();
    
    const touch = e.type === 'touchmove' ? e.touches[0] : e;
    const dx = touch.clientX - gameState.shootStartX;
    const dy = touch.clientY - gameState.shootStartY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 50;
    
    let power = Math.min(distance / maxDistance, 1);
    arrowPower.style.transform = `scale(${0.6 + power * 0.4})`;
}

function handleShootEnd(e) {
    if (!gameState.shootActive || !gameState.gameActive) return;
    e.preventDefault();
    
    gameState.shootActive = false;
    arrowPower.style.transform = 'scale(1)';
    
    const touch = e.type === 'touchend' ? e.changedTouches[0] : e;
    const dx = touch.clientX - gameState.shootStartX;
    const dy = touch.clientY - gameState.shootStartY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 10) {
        shootArrow(dx, dy, distance);
    }
}

// إطلاق السهم
function shootArrow(dx, dy, distance) {
    if (!gameState.player) return;
    
    const maxDistance = 50;
    const power = Math.min(distance / maxDistance, 1);
    const angle = Math.atan2(dy, dx);
    
    const arrow = document.createElement('div');
    arrow.className = 'arrow';
    
    const arrowX = gameState.player.x + gameSettings.bubbleRadius;
    const arrowY = gameState.player.y + gameSettings.bubbleRadius;
    
    arrow.style.left = `${arrowX}px`;
    arrow.style.top = `${arrowY}px`;
    arrow.style.transform = `rotate(${angle}rad)`;
    
    gameArea.appendChild(arrow);
    
    gameState.arrows.push({
        element: arrow,
        x: arrowX,
        y: arrowY,
        dx: Math.cos(angle) * gameSettings.arrowSpeed * power,
        dy: Math.sin(angle) * gameSettings.arrowSpeed * power
    });
}

// بدء اللعبة عند تحميل الصفحة
window.addEventListener('load', initGame);
