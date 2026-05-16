const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let currentLevelIdx = 0, currentGameMode = 'standard';
let currentLevelData = null, imgLeft, imgRight;

function init() {
    Core.init();
    document.getElementById('musicToggle').onchange = (e) => {
        Core.isMusicOn = e.target.checked;
        Core.isMusicOn ? Core.bgMusic.play() : Core.bgMusic.pause();
    };
    canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
}

function quitGame() {
    if (confirm("确定要退出游戏吗？")) {
        window.close(); 
        setTimeout(() => { window.location.href = "about:blank"; }, 500);
    }
}

async function startGame(mode) {
    currentGameMode = mode;
    Core.ui.startScreen.style.display = 'none';
    if (Core.isMusicOn) {
        Core.bgMusic.play().catch(err => {
            console.warn("背景音乐被浏览器拦截，将在后续点击中重试", err);
        });
    }
    const inputEvent = 'ontouchstart' in window ? 'touchstart' : 'mousedown';
    canvas.addEventListener(inputEvent, handleInput);
    if (mode === 'standard') { loadStandardLevel(0); } 
    else { UniqueMode.init(0); }
}

function adjustCanvasSize() {
    const isMobile = window.innerWidth < 1000;
    if (isMobile) {
        canvas.width = 1000;
        canvas.height = 1210;
    } else {
        canvas.width = 1000;
        canvas.height = 300;
    }
    if (currentLevelData) renderStandard();
}

// 监听窗口缩放事件，实时调整
window.addEventListener('resize', adjustCanvasSize);

async function loadStandardLevel(idx) {
    const data = window.GAME_DATA.standard[idx];
    if (!data) { alert("恭喜通关所有关卡！"); backToMenu(); return; }

    // 载入关卡前先根据当前窗口初始化尺寸
    adjustCanvasSize();

    currentLevelIdx = idx;
    currentLevelData = JSON.parse(JSON.stringify(data));
    document.getElementById('currentLevelNum').innerText = idx + 1;
    initDots(currentLevelData.diffs.length);

    try {
        [imgLeft, imgRight] = await Promise.all([
            Core.loadImage(currentLevelData.imgA),
            Core.loadImage(currentLevelData.imgB)
        ]);
        updateUI(); 
        renderStandard();
        Core.startTimer(() => gameOver(false));
    } catch (e) { alert("资源加载失败，请检查路径"); }
}

function initDots(count) {
    Core.ui.dotContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.className = 'status-dot';
        Core.ui.dotContainer.appendChild(dot);
    }
}

function renderStandard() {
    if (!imgLeft || !imgRight) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isMobile = window.innerWidth < 1000;
    const lineWidth = 5; 
    ctx.fillStyle = "#FFFFFF";

    if (isMobile) {
        // 强制使用逻辑坐标绘制，不受 CSS 压缩影响
        ctx.drawImage(imgLeft, 0, 0, 1000, 600);
        ctx.drawImage(imgRight, 0, 610, 1000, 600);
        ctx.fillRect(0, 600 + 2.5, 1000, lineWidth); 

        currentLevelData.diffs.forEach(d => {
            if (d.found) {
                const s = 1000 / CONFIG.imgW; // 缩放倍率 (1000/500 = 2)
                Core.drawMark(ctx, d.x * s, d.y * s);
                Core.drawMark(ctx, d.x * s, (d.y * s) + 610);
            }
        });
    } else {
        ctx.drawImage(imgLeft, 0, 0, 500, 300);
        ctx.drawImage(imgRight, 500, 0, 500, 300);
        ctx.fillRect(500 - (lineWidth / 2), 0, lineWidth, 300);

        currentLevelData.diffs.forEach(d => {
            if (d.found) {
                Core.drawMark(ctx, d.x, d.y);
                Core.drawMark(ctx, d.x + 500, d.y);
            }
        });
    }
}

function handleInput(e) {
    const rect = canvas.getBoundingClientRect();
    const isMobile = window.innerWidth < 1000;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cX = (clientX - rect.left) * scaleX;
    const cY = (clientY - rect.top) * scaleY;

    let checkX, checkY;

    if (currentGameMode === 'standard') {
        if (isMobile) {
            const s = CONFIG.imgW / 1000; // 0.5
            checkX = cX * s;
            checkY = cY > 605 ? (cY - 610) * s : cY * s;
        } else {
            checkX = cX >= 500 ? cX - 500 : cX;
            checkY = cY;
        }
        const roundedX = Math.round(checkX);
        const roundedY = Math.round(checkY);
        console.log(`%c 点击坐标: { x: ${roundedX}, y: ${roundedY} }`, "color: #f1c40f; font-weight: bold;");
        // 如果是手机端，给判定半径增加 15 像素的额外宽限
        const mobileExtra = isMobile ? 15 : 0;
        const target = currentLevelData.diffs.find(d => 
            !d.found && Math.hypot(checkX - d.x, checkY - d.y) < (d.r || CONFIG.defaultRadius) + mobileExtra
        );

        if (target) {
            target.found = true;
            Core.playEffect(Core.successSound);
            renderStandard(); 
            updateUI();
            if (currentLevelData.diffs.every(d => d.found)) {
                clearInterval(Core.timer);
                setTimeout(() => loadStandardLevel(++currentLevelIdx), 500);
            }
        } else {
            Core.reduceTime(CONFIG.penaltyTime); // 使用封装的方法
        }
    } else {
        UniqueMode.checkClick(cX, cY, isMobile);
    }
}

function updateUI() {
    const found = currentLevelData.diffs.filter(d => d.found).length;
    // 更新圆点勾选状态
    const dots = document.querySelectorAll('.status-dot');
    dots.forEach((dot, index) => {
        if (index < found) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}

function gameOver(win) {
    alert(win ? "赢了！" : "时间到！游戏结束。");
    backToMenu();
}

function backToMenu() {
    clearInterval(Core.timer);
    Core.ui.startScreen.style.display = 'flex';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

init();