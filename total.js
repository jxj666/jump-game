var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');
var width = 250,
    height = 400;
canvas.width = width;
canvas.height = height;

//Variables for game
//游戏的变量
var platforms = [],
    image = document.getElementById("sprite"),
    player, platformCount = 5,
    position = 0,
    // 重力
    gravity = 0.2,
    animloop,
    flag = 0,
    menuloop, broken = 0,
    dir, score = 0,
    firstRun = true;


// RequestAnimFrame: a browser API for getting smooth animations
// RequestAnimFrame：用于获得流畅动画的浏览器API
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

//Base object
//地板对象
var Base = function() {
    this.height = 5;
    this.width = width;

    //Sprite clipping
    //精灵剪辑
    this.cx = 0;
    this.cy = 614;
    this.cwidth = 100;
    this.cheight = 5;

    this.moved = 0;

    this.x = 0;
    this.y = height - this.height;

    this.draw = function() {
        try {
            ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
        } catch (e) {}
    };
};
var base = new Base();

//Player object
//人物对象
var Player = function() {
    this.vy = 11;
    this.vx = 0;

    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.isDead = false;

    this.width = 55;
    this.height = 40;

    //Sprite clipping
    this.cx = 0;
    this.cy = 0;
    this.cwidth = 110;
    this.cheight = 80;

    this.dir = "left";

    this.x = width / 2 - this.width / 2;
    this.y = height;

    //Function to draw it
    this.draw = function() {
        try {
            if (this.dir == "right") this.cy = 121;
            else if (this.dir == "left") this.cy = 201;
            else if (this.dir == "right_land") this.cy = 289;
            else if (this.dir == "left_land") this.cy = 371;

            ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
        } catch (e) {}
    };

    this.jump = function() {
        this.vy = -8;
    };

    // this.jumpHigh = function() {
    //     this.vy = -16;
    // };

};
player = new Player();

//Platform class
//跳台对象
function Platform() {
    this.width = 70;
    this.height = 17;

    this.x = Math.random() * (width - this.width);
    this.y = position;

    position += (height / platformCount);

    this.flag = 0;
    this.state = 0;

    //Sprite clipping
    //精灵剪辑
    this.cx = 0;
    this.cy = 0;
    this.cwidth = 105;
    this.cheight = 31;

    //Function to draw it
    //绘制它的函数
    this.draw = function() {
        try {

            if (this.type == 1) this.cy = 0;
            else if (this.type == 2) this.cy = 61;
            // else if (this.type == 3 && this.flag === 0) this.cy = 31;
            // else if (this.type == 3 && this.flag == 1) this.cy = 1000;
            // else if (this.type == 4 && this.state === 0) this.cy = 90;
            // else if (this.type == 4 && this.state == 1) this.cy = 1000;

            ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
        } catch (e) {}
    };

    //Platform types
    //1: Normal
    //2: Moving
    //3: Breakable (Go through)
    //4: Vanishable 
    //Setting the probability of which type of platforms should be shown at what score
    //平台类型// 1：正常// 2：移动// 3：易碎（Go through）// 4：可变化//设置哪种类型的平台以什么得分显示的概率
    if (score >= 5000) this.types = [2, 2, 2, 2, 2];
    else if (score >= 2000 && score < 5000) this.types = [1, 2, 2, 2, 2];
    else if (score >= 1000 && score < 2000) this.types = [1, 1, 2, 2, 2];
    else if (score >= 500 && score < 1000) this.types = [1, 1, 1, 2, 2];
    else if (score >= 100 && score < 500) this.types = [1, 1, 1, 1, 2];
    else this.types = [1];

    this.type = this.types[Math.floor(Math.random() * this.types.length)];

    //We can't have two consecutive breakable platforms otherwise it will be impossible to reach another platform sometimes!
    //我们不能有两个连续的易碎平台，否则有时候不可能有另一个平台！
    // if (this.type == 3 && broken < 1) {
    //     broken++;
    // } else if (this.type == 3 && broken >= 1) {
    //     this.type = 1;
    //     broken = 0;
    // }

    this.moved = 0;
    this.vx = 1;
}
for (var i = 0; i < platformCount; i++) {
    platforms.push(new Platform());
}

//Broken platform object
//会破碎的平台 对象
// var Platform_broken_substitute = function() {
//     this.height = 30;
//     this.width = 70;

//     this.x = 0;
//     this.y = 0;

//     //Sprite clipping
//     this.cx = 0;
//     this.cy = 554;
//     this.cwidth = 105;
//     this.cheight = 60;

//     this.appearance = false;

//     this.draw = function() {
//         try {
//             if (this.appearance === true) ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
//             else return;
//         } catch (e) {}
//     };
// };
// var platform_broken_substitute = new Platform_broken_substitute();

//Spring Class
// 加速器类
// var spring = function() {
//     this.x = 0;
//     this.y = 0;

//     this.width = 26;
//     this.height = 30;

//     //Sprite clipping
//     //精灵剪辑
//     this.cx = 0;
//     this.cy = 0;
//     this.cwidth = 45;
//     this.cheight = 53;

//     this.state = 0;

//     this.draw = function() {
//         try {
//             if (this.state === 0) this.cy = 445;
//             else if (this.state == 1) this.cy = 501;

//             ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
//         } catch (e) {}
//     };
// };
// var Spring = new spring();


//初始化
function init() {
    //Variables for the game
    //游戏的变量
    var dir = "left",
        jumpCount = 0;

    firstRun = false;

    //Function for clearing canvas in each consecutive frame
    //在每个连续帧中清除画布的功能

    function paintCanvas() {
        ctx.clearRect(0, 0, width, height);
    }

    //Player related calculations and functions
    //玩家相关的计算和功能

    function playerCalc() {
        if (dir == "left") {
            player.dir = "left";
            if (player.vy < -7 && player.vy > -15) player.dir = "left_land";
        } else if (dir == "right") {
            player.dir = "right";
            if (player.vy < -7 && player.vy > -15) player.dir = "right_land";
        }

        // if (window.DeviceOrientationEvent) {
        //     window.addEventListener('deviceorientation', DeviceOrientationHandler, false);
        // } else {
        //     console.log('DeviceOrientationEvent不支持!');
        // }


        // function DeviceOrientationHandler(event) {
        //     var alpha = event.alpha,
        //         beta = event.beta,
        //         gamma = event.gamma;

        //     if (alpha != null || beta != null || gamma != null) {

        //         var gamma_html = "";
        //         if (gamma < -10) {
        //             dir = "left";
        //             player.isMovingLeft = true;
        //         } else if (gamma > 10) {
        //             dir = "right";
        //             player.isMovingRight = true;
        //         } else {
        //             player.isMovingRight = false;
        //             player.isMovingLeft = false;
        //         }

        //     } else {
        //         console.log('设备不支持!');
        //     }
        // }




        // //Adding keyboard controls
        // //添加键盘控件
        // document.onkeydown = function(e) {
        //     var key = e.keyCode;

        //     if (key == 37) {
        //         dir = "left";
        //         player.isMovingLeft = true;
        //     } else if (key == 39) {
        //         dir = "right";
        //         player.isMovingRight = true;
        //     }

        //     if (key == 32) {
        //         if (firstRun === true)
        //             init();
        //         else
        //             reset();
        //     }
        // };

        // document.onkeyup = function(e) {
        //     var key = e.keyCode;

        //     if (key == 37) {
        //         dir = "left";
        //         player.isMovingLeft = false;
        //     } else if (key == 39) {
        //         dir = "right";
        //         player.isMovingRight = false;
        //     }
        // };

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

        // Speed limits!
        // 速度限制！
        if (player.vx > 3)
            player.vx = 3;
        else if (player.vx < -3)
            player.vx = -3;

        //console.log(player.vx);
        //Jump the player when it hits the base
        //console.log(player.vx）; //当玩家击中基地时跳转
        if ((player.y + player.height) > base.y && base.y < height) player.jump();

        //Gameover if it hits the bottom 
        //如果触及底部，就会造成转换
        if (base.y > height && (player.y + player.height) > height && player.isDead != "lol") player.isDead = true;

        //Make the player move through walls
        //让玩家在墙上移动
        if (player.x > width) player.x = 0 - player.width;
        else if (player.x < 0 - player.width) player.x = width;

        //Movement of player affected by gravity
        //玩家受重力影响的运动
        if (player.y >= (height / 2) - (player.height / 2)) {
            player.y += player.vy;
            player.vy += gravity;
        }

        //When the player reaches half height, move the platforms to create the illusion of scrolling and recreate the platforms that are out of viewport...
        //当玩家达到一半的高度时，移动平台以创建滚动的错觉并重新创建视口外的平台。
        else {
            platforms.forEach(function(p, i) {

                if (player.vy < 0) {
                    p.y -= player.vy;
                }

                if (p.y > height) {
                    platforms[i] = new Platform();
                    platforms[i].y = p.y - height;
                }

            });

            base.y -= player.vy;
            player.vy += gravity;

            if (player.vy >= 0) {
                player.y += player.vy;
                player.vy += gravity;
            }

            score++;
        }

        //Make the player jump when it collides with platforms
        //让玩家在与平台相撞时跳跃
        collides();

        if (player.isDead === true) gameOver();
    }

    //Spring algorithms
    // Spring的算法

    // function springCalc() {
    //     var s = Spring;
    //     var p = platforms[0];

    //     if (p.type == 1 || p.type == 2) {
    //         s.x = p.x + p.width / 2 - s.width / 2;
    //         s.y = p.y - p.height - 10;

    //         if (s.y > height / 1.1) s.state = 0;

    //         s.draw();
    //     } else {
    //         s.x = 0 - s.width;
    //         s.y = 0 - s.height;
    //     }
    // }

    //Platform's horizontal movement (and falling) algo
    //平台的水平移动（和下降）算法

    function platformCalc() {
        // var subs = platform_broken_substitute;

        platforms.forEach(function(p, i) {
            if (p.type == 2) {
                if (p.x < 0 || p.x + p.width > width) p.vx *= -1;

                p.x += p.vx;
            }

            // if (p.flag == 1 && subs.appearance === false && jumpCount === 0) {
            //     subs.x = p.x;
            //     subs.y = p.y;
            //     subs.appearance = true;

            //     jumpCount++;
            // }

            p.draw();
        });

        // if (subs.appearance === true) {
        //     subs.draw();
        //     subs.y += 8;
        // }

        // if (subs.y > height) subs.appearance = false;
    }

    function collides() {
        //Platforms
        platforms.forEach(function(p, i) {
            if (player.vy > 0 && p.state === 0 && (player.x + 15 < p.x + p.width) && (player.x + player.width - 15 > p.x) && (player.y + player.height > p.y) && (player.y + player.height < p.y + p.height)) {

                // if (p.type == 3 && p.flag === 0) {
                //     p.flag = 1;
                //     jumpCount = 0;
                //     return;
                // } else if (p.type == 4 && p.state === 0) {
                //     player.jump();
                //     p.state = 1;
                // } else if (p.flag == 1) return;
                // else {
                player.jump();
                // }
            }
        });

        //Springs
        // var s = Spring;
        // if (player.vy > 0 && (s.state === 0) && (player.x + 15 < s.x + s.width) && (player.x + player.width - 15 > s.x) && (player.y + player.height > s.y) && (player.y + player.height < s.y + s.height)) {
        //     s.state = 1;
        //     player.jumpHigh();
        // }

    }

    function updateScore() {
        var scoreText = document.getElementById("score");
        scoreText.innerHTML = score;
    }

    function gameOver() {
        platforms.forEach(function(p, i) {
            p.y -= 12;
        });

        if (player.y > height / 2 && flag === 0) {
            player.y -= 8;
            player.vy = 0;
        } else if (player.y < height / 2) flag = 1;
        else if (player.y + player.height > height) {
            showGoMenu();
            hideScore();
            player.isDead = "lol";

        }
    }

    //Function to update everything
    //函数来更新一切

    function update() {
        paintCanvas();
        platformCalc();

        // springCalc();

        playerCalc();
        player.draw();

        base.draw();

        updateScore();
    }

    menuLoop = function() { return; };
    animloop = function() {
        update();
        requestAnimFrame(animloop);
    };

    animloop();
    hideMenu();
    showScore();
}







































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
    // Spring = new spring();
    // platform_broken_substitute = new Platform_broken_substitute();

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
    scoreText.innerHTML = "你的得分" + score;
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

    // if (window.DeviceOrientationEvent) {
    //     window.addEventListener('deviceorientation', DeviceOrientationHandler, false);
    // } else {
    //     console.log('DeviceOrientationEvent不支持!');
    // }


    // function DeviceOrientationHandler(event) {
    //     var alpha = event.alpha,
    //         beta = event.beta,
    //         gamma = event.gamma;

    //     if (alpha != null || beta != null || gamma != null) {

    //         var gamma_html = "";


    //     } else {
    //         console.log('设备不支持!');
    //     }
    // }

    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", function(event) {
            var gamma = event.gamma;
            console.log(gamma);
            if (gamma < -10) {
                dir = "left";
                player.isMovingLeft = true;
            } else if (gamma > 10) {
                dir = "right";
                player.isMovingRight = true;
            } else {
                player.isMovingRight = false;
                player.isMovingLeft = false;
            }
        }, true);
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
        player.vx -= 0.05;
    } else {
        player.x += player.vx;
        if (player.vx < 0) player.vx += 0.1;
    }

    if (player.isMovingRight === true) {
        player.x += player.vx;
        player.vx += 0.05;
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

// function resize() {
//     console.log($(window).width(), $(window).height());
//     $('.container').css('height', $(window).height());
//     $('.container').css('width', $(window).width());
// }
// resize();

function get_hfs() {
    $('.container').css('height', $(window).height());
    $('.container').css('width', $(window).width());
}
get_hfs();

function throttle(method, context) {
    clearTimeout(method.timer);
    method.timer = setTimeout(function() {
        method.call(context);
    }, 100);
}
window.onresize = function() {
    throttle(get_hfs);
}

menuLoop();