var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

// 初始画布大小（调整为适合 1080p 分辨率）
var canvasWidth = 640; // 画布宽度调整为 640
var canvasHeight = 960; // 画布高度调整为 960

// 设置画布大小
function resizeCanvas() {
    var container = document.getElementById("game-container");
    var containerWidth = container.clientWidth;
    var containerHeight = container.clientHeight;

    // 计算缩放比例
    var scale = Math.min(
        containerWidth / canvasWidth,
        containerHeight / canvasHeight
    );

    // 设置画布的实际像素大小（根据缩放比例调整）
    cvs.width = canvasWidth * scale;
    cvs.height = canvasHeight * scale;

    // 设置画布的显示大小（CSS 样式）
    cvs.style.width = canvasWidth * scale + "px";
    cvs.style.height = canvasHeight * scale + "px";

    // 调整绘制逻辑以适应新的画布大小
    ctx.scale(scale, scale);
}

// 初始化画布大小
resizeCanvas();

// 监听窗口大小变化
window.addEventListener("resize", resizeCanvas);

// 加载图片和音频
var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();

bird.src = "images/bird.png";
bg.src = "images/bg.png";
fg.src = "images/fg.png";
pipeNorth.src = "images/pipeNorth.png";
pipeSouth.src = "images/pipeSouth.png";

// 游戏变量
var gap = 170; // 间隙调整为原来的 2 倍
var constant;
var bX = 20; // 鸟的初始位置调整为原来的 2 倍
var bY = 300; // 鸟的初始位置调整为原来的 2 倍
var gravity = 3; // 重力调整为原来的 2 倍
var score = 0;
var gameOverFlag = false;

// 音频文件
var fly = new Audio();
var scor = new Audio();

fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";

// 事件监听
document.addEventListener("keydown", moveUp);

function moveUp() {
    if (!gameOverFlag) {
        bY -= 50; // 鸟的移动距离调整为原来的 2 倍
        fly.play();
    }
}

// 管道坐标
var pipe = [];
// 初始化管道坐标
pipe[0] = {
    x: canvasWidth, // 使用原始分辨率宽度
    y: 0
};

function draw() {
    if (gameOverFlag) {
        ctx.fillStyle = "#000";
        ctx.font = "60px Verdana";
        ctx.fillText("Game Over!", canvasWidth / 2 - 160, canvasHeight / 2); // 使用原始分辨率坐标
        ctx.fillText("Score: " + score, canvasWidth / 2 - 120, canvasHeight / 2 + 80);
        return;
    }

    ctx.drawImage(bg, 0, 0, canvasWidth, canvasHeight); // 使用原始分辨率尺寸

    for (var i = 0; i < pipe.length; i++) {
        // 绘制上方管道
        const pipeNorthHeight = pipe[i].y + pipeNorth.height;
        ctx.drawImage(
            pipeNorth,
            pipe[i].x,
            pipe[i].y,
            pipeNorth.width,
            pipeNorthHeight
        );

        // 绘制下方管道
        const pipeSouthY = pipe[i].y + pipeNorthHeight + gap;
        const pipeSouthHeight = canvasHeight - pipeSouthY - fg.height;
        ctx.drawImage(
            pipeSouth,
            pipe[i].x,
            pipeSouthY,
            pipeSouth.width,
            pipeSouthHeight
        );

        pipe[i].x -= 2;

        if (pipe[i].x === 250) {
            pipe.push({
                x: canvasWidth,
                y: -Math.floor(Math.random() * (pipeNorth.height - gap))
            });
        }

        if (pipe[i].x + pipeNorth.width < 0) {
            pipe.splice(i, 1);
        }

        // 碰撞检测（复用已计算的 pipeNorthHeight 和 pipeSouthY）
        const birdX = bX;
        const birdY = bY;
        const birdWidth = bird.width;
        const birdHeight = bird.height;

        const pipeX = pipe[i].x;
        const pipeWidth = pipeNorth.width;

        if (
            (birdX + birdWidth > pipeX &&
                birdX < pipeX + pipeWidth &&
                (birdY < pipe[i].y + pipeNorthHeight ||
                    birdY + birdHeight > pipeSouthY)) ||
            birdY + birdHeight >= canvasHeight - fg.height
        ) {
            gameOverFlag = true;
        }

        if (pipe[i].x === 10) {
            score++;
            scor.play();
        }
    }

    ctx.drawImage(fg, 0, canvasHeight - fg.height, canvasWidth, fg.height);
    ctx.drawImage(bird, bX, bY);

    bY += gravity;

    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score: " + score, 20, canvasHeight - 20); // 使用原始分辨率坐标

    requestAnimationFrame(draw);
}

draw();
