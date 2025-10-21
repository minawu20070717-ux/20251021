let t = 0.0;
let vel = 0.02;
let num;

let paletteSelected = ["#c9e6ee", "#faeee5", "#fad1d8", "#f2c4d6", "#dbc0e7"];
// https://colormagic.app/palette/67237e824f60984aec7357dc

let pg; // 用於噪聲疊加層

// **【狀態控制變數】**
// 'button': 按鈕介面
// 'art': 藝術介面
let gameState = 'button'; 
let buttonX, buttonY, buttonW, buttonH; // 按鈕屬性

function setup() {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(displayDensity());
    rectMode(CENTER);
    angleMode(DEGREES);
    num = random(100000);
    
    pg = createGraphics(width, height);
    pg.noStroke();
    regenPG();
    
    // **【初始化按鈕位置】**
    buttonW = 250;
    buttonH = 100;
    buttonX = width / 2;
    buttonY = height / 2;
}

function regenPG() {
    pg.clear();
    pg.noStroke();
    let particle_count = (width * height) * 0.05;
    particle_count = min(particle_count, 200000);
    for (let i = 0; i < particle_count; i++) {
        let x = random(width);
        let y = random(height);
        let n = noise(x * 0.01, y * 0.01) * ((width + height) / 2 * 0.002);
        pg.fill(255, 100);
        pg.rect(x, y, n, n);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    pg = createGraphics(width, height);
    pg.noStroke();
    regenPG();
    
    // **【更新按鈕位置】**
    buttonX = width / 2;
    buttonY = height / 2;
}

function draw() {
    randomSeed(num);
    
    if (gameState === 'button') {
        // **【狀態 1：按鈕介面】**
        background("#f4f1de"); // 淺色背景
        drawButton();
    } else if (gameState === 'art') {
        // **【狀態 2：藝術介面】**
        
        // 選擇一個不同的背景色，以示區分
        background("#355070"); 
        
        // 繪製你的藝術效果
        stroke("#f4f1de"); // 淺色邊框
        fill(255, 50); // 半透明矩形
        rect(width/2, height/2, width, height); 
        
        circlePacking();
        image(pg, 0, 0);
        t += vel;
    }
}


// **【按鈕繪製函數】**
function drawButton() {
    push();
    
    // 按鈕主體 (深藍色，居中)
    fill("#355070"); 
    noStroke();
    rect(buttonX, buttonY, buttonW, buttonH, 15); // 圓角矩形
    
    // 按鈕文字
    fill(255); // 白色文字
    textSize(36);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("嗨 我是吳湘湘", buttonX, buttonY - 15);
    textSize(20);
    text("（不同顏色介面）", buttonX, buttonY + 25);
    
    pop();
}

// **【滑鼠點擊事件處理】**
function mouseClicked() {
    if (gameState === 'button') {
        // 檢查滑鼠是否在按鈕範圍內 (使用 rect mode CENTER)
        let isOverButton = (
            mouseX > buttonX - buttonW / 2 &&
            mouseX < buttonX + buttonW / 2 &&
            mouseY > buttonY - buttonH / 2 &&
            mouseY < buttonY + buttonH / 2
        );

        if (isOverButton) {
            gameState = 'art'; // 切換到藝術介面
            t = 0; // 重設時間變數
            num = random(100000); // 重設隨機種子，讓圓形排版不同
        }
    } 
    // 【可選】如果你想點擊畫面的任何地方都能返回按鈕介面，取消下面這段註解：
    // else if (gameState === 'art') {
    //     gameState = 'button';
    // }
}

// **【圓形填色繪製函數】(使用修復後的漸變邏輯)**
function circlePacking() {
    noStroke();
    push();
    let points = [];
    let count = 10000;
    
    // 圓形填色邏輯 (保持不變)
    for (let i = 0; i < count; i++) {
        let s = random(15, 200);
        let x = random(width);
        let y = random(height);
        let add = true;
        for (let j = 0; j < points.length; j++) {
            let p = points[j];
            if (dist(x, y, p.x, p.y) < (s + p.z) * 0.6) {
                add = false;
                break;
            }
        }
        if (add) points.push(createVector(x, y, s));
    }
    
    // 繪製圓形
    for (let i = 0; i < points.length; i++) {
        let p = points[i];
        
        push();
        translate(p.x, p.y); 
        let r = p.z; 

        // 設置並應用漸變
        setCircleGradient(r); 
        ellipse(0, 0, r);

        pop(); 
    }
    pop();
}

// **【局部漸變應用函數】**
function setCircleGradient(r) {
    // 創建一個從左上角到右下角的線性漸變，座標相對於圓心 (0,0)
    let gradientFill = drawingContext.createLinearGradient(
        -r/2, 
        -r/2, 
        r/2,  
        r/2   
    );

    // 漸變顏色 (來自你的 paletteSelected)
    gradientFill.addColorStop(0, "#c9e6ee");
    gradientFill.addColorStop(0.25, "#faeee5");
    gradientFill.addColorStop(0.5, "#fad1d8");
    gradientFill.addColorStop(0.75, "#f2c4d6");
    gradientFill.addColorStop(1, "#dbc0e7");
    
    drawingContext.fillStyle = gradientFill;
}

function randomCol(){
    let randoms = int(random(0, paletteSelected.length));
    return color(paletteSelected[randoms]);
}
// 備註：原有的 gradient(r) 函數已被 setCircleGradient(r) 取代。

