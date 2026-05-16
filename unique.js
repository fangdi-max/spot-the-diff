const UniqueMode = {
    currentLevel: 0,
    items: [],
    targetItem: null,
    bgImage: null,

    async  init(levelIdx) {
         this.currentLevel = levelIdx;
        const config = window.GAME_DATA.unique[levelIdx];

        if (!config) { 
            alert("恭喜！所有挑战模式已完成！"); 
            backToMenu(); 
            return; 
        }

        Core.ui.canvas.width = 800;
        Core.ui.canvas.height = 500;
        Core.ui.levelTitle.innerText = config.name;
        initDots(1); 
    
        try {
            const [imgN, imgT, imgBG] = await Promise.all([
                Core.loadImage(config.normalSrc),
                Core.loadImage(config.targetSrc),
                Core.loadImage('photo/bgphoto.png')
        ]);
        this.bgImage = imgBG;

        this.generateLevel(config, imgN, imgT);
        Core.startTimer(() => gameOver(false));
        this.render();
    } catch (e) { 
        console.error("资源加载失败:", e); 
    }
    },

    generateLevel(config, imgN, imgT) {
        this.items = [];
        const cols = 10;
        const rows = Math.ceil(config.count / cols);
        const cellW = canvas.width / cols;
        const cellH = canvas.height / rows;

        for (let i = 0; i < config.count; i++) {
            const c = i % cols;
            const r = Math.floor(i / cols);
            this.items.push({
            // 在格子内加入随机偏移
                x: c * cellW + Math.random() * (cellW * 0.8) + (cellW * 0.1),
                y: r * cellH + Math.random() * (cellH * 0.8) + (cellH * 0.1),
                img: imgN,
                rotation: Math.random() * Math.PI * 2
            });
        }
        const target = this.items[Math.floor(Math.random() * this.items.length)];
        target.isTarget = true; 
        target.img = imgT;
        this.targetItem = target;
    },

    render() {
        const ctx = Core.ctx; // 使用 Core 统一初始化的 context
        const config = window.GAME_DATA.unique[this.currentLevel]
        ctx.clearRect(0, 0, Core.ui.canvas.width, Core.ui.canvas.height);
        
        if(this.bgImage) {
            ctx.save(); 
            ctx.globalAlpha = 0.2;
            ctx.drawImage(this.bgImage, 0, 0, Core.ui.canvas.width, Core.ui.canvas.height);
            ctx.restore();
        }

        this.items.forEach(item => {
            ctx.save();
            ctx.translate(item.x, item.y);
            ctx.rotate(item.rotation);
            ctx.drawImage(item.img, -config.size/2, -config.size/2, config.size, config.size);
            ctx.restore();
        });
    },

    checkClick(x, y, isMobile){
        const mobileMode = (isMobile !== undefined) ? isMobile : (window.innerWidth < 1000);
        const dist = Math.hypot(x - this.targetItem.x, y - this.targetItem.y);
        const tolerance = mobileMode ? 60 : 40;
        if (dist < tolerance) { 
            Core.playEffect(Core.successSound);
            const dot = document.querySelector('.status-dot');
            if(dot) dot.classList.add('active');
            clearInterval(Core.timer);
            setTimeout(() => this.init(this.currentLevel + 1), 500);
        } else {
           Core.reduceTime(CONFIG.penaltyTime);
        }
    }
};