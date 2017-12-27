var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');
var width = 250,
    height = 400;
canvas.width = width;
canvas.height = height;



var platforms = [],
    image = document.getElementById("sprite"),
    player, platformCount = 5,
    position = 0,
    
    gravity = 0.2,
    animloop,
    flag = 0,
    menuloop, broken = 0,
    dir, score = 0,
    firstRun = true;




window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();



var Base = function() {
    this.height = 5;
    this.width = width;

    
    
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



var Player = function() {
    this.vy = 11;
    this.vx = 0;

    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.isDead = false;

    this.width = 55;
    this.height = 40;

    
    this.cx = 0;
    this.cy = 0;
    this.cwidth = 110;
    this.cheight = 80;

    this.dir = "left";

    this.x = width / 2 - this.width / 2;
    this.y = height;

    
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

    
    
    

};
player = new Player();



function Platform() {
    this.width = 70;
    this.height = 17;

    this.x = Math.random() * (width - this.width);
    this.y = position;

    position += (height / platformCount);

    this.flag = 0;
    this.state = 0;

    
    
    this.cx = 0;
    this.cy = 0;
    this.cwidth = 105;
    this.cheight = 31;

    
    
    this.draw = function() {
        try {

            if (this.type == 1) this.cy = 0;
            else if (this.type == 2) this.cy = 61;
            
            
            
            

            ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
        } catch (e) {}
    };

    
    
    
    
    
    
    
    if (score >= 5000) this.types = [2, 2, 2, 2, 2];
    else if (score >= 2000 && score < 5000) this.types = [1, 2, 2, 2, 2];
    else if (score >= 1000 && score < 2000) this.types = [1, 1, 2, 2, 2];
    else if (score >= 500 && score < 1000) this.types = [1, 1, 1, 2, 2];
    else if (score >= 100 && score < 500) this.types = [1, 1, 1, 1, 2];
    else this.types = [1];

    this.type = this.types[Math.floor(Math.random() * this.types.length)];

    
    
    
    
    
    
    
    

    this.moved = 0;
    this.vx = 1;
}
for (var i = 0; i < platformCount; i++) {
    platforms.push(new Platform());
}


























































function init() {
    
    
    var dir = "left",
        jumpCount = 0;

    firstRun = false;

    
    

    function paintCanvas() {
        ctx.clearRect(0, 0, width, height);
    }

    
    

    function playerCalc() {
        if (dir == "left") {
            player.dir = "left";
            if (player.vy < -7 && player.vy > -15) player.dir = "left_land";
        } else if (dir == "right") {
            player.dir = "right";
            if (player.vy < -7 && player.vy > -15) player.dir = "right_land";
        }

        
        
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
                if (firstRun === true)
                    init();
                else
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

        
        
        if (player.vx > 8)
            player.vx = 8;
        else if (player.vx < -8)
            player.vx = -8;

        
        
        
        if ((player.y + player.height) > base.y && base.y < height) player.jump();

        
        
        if (base.y > height && (player.y + player.height) > height && player.isDead != "lol") player.isDead = true;

        
        
        if (player.x > width) player.x = 0 - player.width;
        else if (player.x < 0 - player.width) player.x = width;

        
        
        if (player.y >= (height / 2) - (player.height / 2)) {
            player.y += player.vy;
            player.vy += gravity;
        }

        
        
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

        
        
        collides();

        if (player.isDead === true) gameOver();
    }

    
    

    
    
    

    
    
    

    

    
    
    
    
    
    

    
    

    function platformCalc() {
        

        platforms.forEach(function(p, i) {
            if (p.type == 2) {
                if (p.x < 0 || p.x + p.width > width) p.vx *= -1;

                p.x += p.vx;
            }

            
            
            
            

            
            

            p.draw();
        });

        
        
        
        

        
    }

    function collides() {
        
        platforms.forEach(function(p, i) {
            if (player.vy > 0 && p.state === 0 && (player.x + 15 < p.x + p.width) && (player.x + player.width - 15 > p.x) && (player.y + player.height > p.y) && (player.y + player.height < p.y + p.height)) {

                
                
                
                
                
                
                
                
                
                    player.jump();
                
            }
        });

        
        
        
        
        
        

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

    
    

    function update() {
        paintCanvas();
        platformCalc();

        

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








































function reset() {
    hideGoMenu();
    showScore();
    player.isDead = false;

    flag = 0;
    position = 0;
    score = 0;

    base = new Base();
    player = new Player();
    
    

    platforms = [];
    for (var i = 0; i < platformCount; i++) {
        platforms.push(new Platform());
    }
}



function hideMenu() {
    var menu = document.getElementById("mainMenu");
    menu.style.zIndex = -1;
}



function showGoMenu() {
    var menu = document.getElementById("gameOverMenu");
    menu.style.zIndex = 1;
    menu.style.visibility = "visible";

    var scoreText = document.getElementById("go_score");
    scoreText.innerHTML = "你的得分" + score ;
}



function hideGoMenu() {
    var menu = document.getElementById("gameOverMenu");
    menu.style.zIndex = -1;
    menu.style.visibility = "hidden";
}



function showScore() {
    var menu = document.getElementById("scoreBoard");
    menu.style.zIndex = 1;
}



function hideScore() {
    var menu = document.getElementById("scoreBoard");
    menu.style.zIndex = -1;
}


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

    
    
    if ((player.y + player.height) > base.y && base.y < height) player.jump();

    
    
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