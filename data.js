// data.js
// --- 标准模式数据---
const LEVEL_DATA = [
    {
        title: "第一关",
        imgA: "photo/n1-o.png",
        imgB: "photo/n1-t.png",
        diffs: [
             { x: 125, y: 175, r: 29, found: false }, 
             { x: 235, y: 235, r: 30, found: false },
             { x: 321, y: 25, r: 20, found: false }, 
             { x: 415, y: 56,  r: 15, found: false }  
        ]
    },
    {
        title: "第二关",
        imgA: "photo/n2-o.png",
        imgB: "photo/n2-t.png",
        diffs: [
            { x: 278,  y: 197, r: 30, found: false },
            { x: 35, y: 116,  r: 25, found: false },
            { x: 119, y: 38,  r: 20, found: false },
            { x: 183, y: 150, r: 20, found: false }
        ]
    },
    {
        title: "第三关：",
        imgA: "photo/n3-o.png",
        imgB: "photo/n3-t.png",
        diffs: [
            { x: 88,  y: 115, r: 20, found: false },
            { x: 111, y: 220,  r: 20, found: false },
            { x: 332,  y: 135, r: 20, found: false },
            { x: 213, y: 277, r: 20, found: false }
        ]
    },
    {
        title: "第四关：",
        imgA: "photo/n4-o.png",
        imgB: "photo/n4-t.png",
        diffs: [
            { x: 152,  y: 200, r: 15, found: false },
            { x: 322, y: 7,  r: 15, found: false },
            { x: 342,  y: 96, r: 10, found: false },
            { x: 75,  y: 161, r: 30, found: false },
            { x: 229,  y: 201, r: 30, found: false },
            { x: 331, y: 230, r: 30, found: false }
        ]
    },
    {
        title: "第五关：",
        imgA: "photo/n5-o.png",
        imgB: "photo/n5-t.png",
        diffs: [
            { x: 98,  y: 84, r: 10, found: false },
            { x: 446, y: 246,  r: 30, found: false },
            { x: 456,  y: 47, r: 30, found: false },
            { x: 364,  y: 143, r: 15, found: false },
            { x: 280,  y: 106, r: 30, found: false },
            { x: 413,  y: 100, r: 20, found: false }
        ]
    },
    {
        title: "第六关：",
        imgA: "photo/n6-o.png",
        imgB: "photo/n6-t.png",
        diffs: [
            { x: 246,  y: 178, r: 15, found: false },
            { x: 461, y: 134,  r: 20, found: false },
            { x: 302,  y: 210, r: 20, found: false },
            { x: 33,  y: 97, r: 15, found: false },
            { x: 84,  y: 181, r: 30, found: false },
            { x: 193,  y: 123, r: 15, found: false }
        ]
    },
    {
        title: "第七关：",
        imgA: "photo/n7-o.png",
        imgB: "photo/n7-t.png",
        diffs: [
            { x: 96,  y: 158, r: 10, found: false },
            { x: 265, y: 284,  r: 20, found: false },
            { x: 468,  y: 200, r: 20, found: false },
            { x: 184,  y: 185, r: 15, found: false },
            { x: 219,  y: 123, r: 15, found: false },
            { x: 310,  y: 119, r: 15, found: false }
        ]
    },
];

// --- 万里挑一模式数据 ---
const UNIQUE_LEVELS = [
    { 
        name: "第一关：", 
        count: 60, 
        size: 45, 
        normalSrc: 'photo/u4-n.svg', 
        targetSrc: 'photo/u4-t.svg' 
    },
    { 
        name: "第二关：", 
        count: 80, 
        size: 45, 
        normalSrc: 'photo/u2-n.svg', 
        targetSrc: 'photo/u2-t.svg' 
    },
    { 
        name: "第三关：", 
        count: 90, 
        size: 40, 
        normalSrc: 'photo/u3-n.svg', 
        targetSrc: 'photo/u3-t.svg' 
    },
    { 
        name: "第四关：", 
        count: 110, 
        size: 50, 
        normalSrc: 'photo/u1-n.svg', 
        targetSrc: 'photo/u1-t.svg' 
    },
    { 
        name: "第五关：", 
        count: 160, 
        size: 35, 
        normalSrc: 'photo/u5-n.svg', 
        targetSrc: 'photo/u5-t.svg' 
    }
];

// 挂载到全局
window.GAME_DATA = {
    standard: LEVEL_DATA, 
    unique: UNIQUE_LEVELS
};