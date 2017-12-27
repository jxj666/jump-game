
//重置
function reset() {
    hideGoMenu();
    showScore();
    player.isDead = false;

    flag = 0;
    position = 0;
    score = 0;

    base = new Base();
    player = new Player();
    Spring = new spring();
    platform_broken_substitute = new Platform_broken_substitute();

    platforms = [];
    for (var i = 0; i < platformCount; i++) {
        platforms.push(new Platform());
    }
}

//Hides the menu
//隐藏菜单
function hideMenu() {
    var menu = document.getElementById("mainMenu");
    menu.style.zIndex = -1;
}

//Shows the game over menu
//在菜单上显示游戏
function showGoMenu() {
    var menu = document.getElementById("gameOverMenu");
    menu.style.zIndex = 1;
    menu.style.visibility = "visible";

    var scoreText = document.getElementById("go_score");
    scoreText.innerHTML = "你的得分" + score ;
}

//Hides the game over menu
//在菜单上隐藏游戏
function hideGoMenu() {
    var menu = document.getElementById("gameOverMenu");
    menu.style.zIndex = -1;
    menu.style.visibility = "hidden";
}

//Show ScoreBoard
//显示ScoreBoard
function showScore() {
    var menu = document.getElementById("scoreBoard");
    menu.style.zIndex = 1;
}

//Hide ScoreBoard
//隐藏ScoreBoard
function hideScore() {
    var menu = document.getElementById("scoreBoard");
    menu.style.zIndex = -1;
}

//动作控制
function playerJump() {
    player.y += player.vy;
    player.vy += gravity;

    if (player.vy > 0 &&
        (player.x + 15 < 260) &&
        (player.x + player.width - 15 > 155) &&
        (player.y + player.height > 475) &&
        (player.y + player.height < 500))
        player.jump();

    if (dir == "left") {
        player.dir = "left";
        if (player.vy < -7 && player.vy > -15) player.dir = "left_land";
    } else if (dir == "right") {
        player.dir = "right";
        if (player.vy < -7 && player.vy > -15) player.dir = "right_land";
    }

    //Adding keyboard controls
    //添加键盘控件
    document.onkeydown = function(e) {
        var key = e.keyCode;

        if (key == 37) {
            dir = "left";
            player.isMovingLeft = true;
        } else if (key == 39) {
            dir = "right";
            player.isMovingRight = true;
        }

        if (key == 32) {
            if (firstRun === true) {
                init();
                firstRun = false;
            } else
                reset();
        }
    };

    document.onkeyup = function(e) {
        var key = e.keyCode;

        if (key == 37) {
            dir = "left";
            player.isMovingLeft = false;
        } else if (key == 39) {
            dir = "right";
            player.isMovingRight = false;
        }
    };

    //Accelerations produces when the user hold the keys
    //当用户按住键时产生加速度
    if (player.isMovingLeft === true) {
        player.x += player.vx;
        player.vx -= 0.15;
    } else {
        player.x += player.vx;
        if (player.vx < 0) player.vx += 0.1;
    }

    if (player.isMovingRight === true) {
        player.x += player.vx;
        player.vx += 0.15;
    } else {
        player.x += player.vx;
        if (player.vx > 0) player.vx -= 0.1;
    }

    //Jump the player when it hits the base
    //当玩家击中基地时跳转
    if ((player.y + player.height) > base.y && base.y < height) player.jump();

    //Make the player move through walls
    //让玩家在墙上移动
    if (player.x > width) player.x = 0 - player.width;
    else if (player.x < 0 - player.width) player.x = width;

    player.draw();
}
function update() {
    ctx.clearRect(0, 0, width, height);
    playerJump();
}

menuLoop = function() {
    update();
    requestAnimFrame(menuLoop);
};

menuLoop();