const Core = {
    timer: null,
    timeLeft: 60,
    totalTime: 60,
    isMusicOn: true,
    bgMusic: new Audio('music/background.mp3'),
    successSound: new Audio('music/success.mp3'),
    errorSound: new Audio('music/error.mp3'), 
    ui: {},

    init() {
        this.ui = {
            timerText: document.getElementById('timerText'),
            timerBarInner: document.getElementById('timerBarInner'),
            dotContainer: document.getElementById('dotContainer'),
            levelTitle: document.getElementById('levelTitle'),
            startScreen: document.getElementById('startScreen'),
            canvas: document.getElementById('gameCanvas')
        };
        this.ctx = this.ui.canvas.getContext('2d'); // 统一 ctx
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.5;
    },
    // 统一处理时间扣除
    reduceTime(amount) {
        this.timeLeft = Math.max(0, this.timeLeft - amount);
        this.updateTimerUI();
        this.shake(this.ui.canvas);
    },
        playEffect(sound) {
        if (this.isMusicOn && sound) {
            sound.pause();        // 先停止当前播放
            sound.currentTime = 0; // 回到起点
            sound.play().catch(e => console.warn("音效播放被拦截或路径错误:", e));
        }
    },
    startTimer(onTimeUp) {
        clearInterval(this.timer);
        this.timeLeft = 60;
        this.updateTimerUI();
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerUI();
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                onTimeUp();
            }
        }, 1000);
    },
    updateTimerUI() {
        if (!this.ui.timerBarInner || !this.ui.timerText) return;
        this.ui.timerText.innerText = Math.max(0, this.timeLeft);
        const percentage = (this.timeLeft / this.totalTime) * 100;
        this.ui.timerBarInner.style.width = Math.max(0, percentage) + "%";
        if (this.timeLeft <= 15) {
            // 危险期：红色
            this.ui.timerText.style.color = "#e74c3c";
            this.ui.timerBarInner.style.backgroundColor = "#e74c3c";
        } else {
            // 初始期：绿色
            this.ui.timerText.style.color = "#f1c40f";
            this.ui.timerBarInner.style.backgroundColor = "#2ecc71";
        }
    },

    shake(element) {
        element.classList.add('shake-anim');
        this.playEffect(this.errorSound); // 抖动时同步响铃
        setTimeout(() => element.classList.remove('shake-anim'), 300);
    },

    drawMark(ctx, x, y, color = '#e74c3c') {
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.stroke();
    },

    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }
};
window.Core = Core;