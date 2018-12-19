// 设置画布
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d")
var width = 750,
    height = 1200
canvas.width = width
canvas.height = height

//设置游戏参数
var platforms = [],

    //    贴图
    z1 = document.getElementById("z1"),
    z2 = document.getElementById("z2"),
    cloud1 = document.getElementById("cloud1"),
    base1 = document.getElementById("base1"),
    music1 = document.getElementById("music1"),
    music2 = document.getElementById("music2"),
    video1 = document.getElementById("video1"),
    player = undefined,
    platformCount = 3,
    position = 0,
    gravity = 0.3,
    animloop = undefined,
    flag = 0,
    menuloop = undefined,
    broken = 0,
    cloud_v = 1,
    score = 0,
    i = 0,
    firstRun = true,
    restart = 0
//浏览器流畅动画 api
//setTimeout和setInterval不同，requestAnimationFrame不需要设置时间间隔。这有什么好处呢？为什么requestAnimationFrame被称为神器呢？
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60)
    }
})()
//地板对象
function Base() {
    this.height = 5
    this.width = width
    this.cx = 0
    this.cy = 0
    this.cwidth = 40
    this.cheight = 5
    this.moved = 0
    this.x = 0
    this.y = height - this.height
    this.draw = function () {
        try {
            ctx.drawImage(base1, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height)
        } catch (e) { }
    }
}
var base = new Base()

//人物对象
function Player() {
    this.vy = 11
    this.vx = 0
    this.isMoving = 0
    this.isDead = false
    this.width = 180
    this.height = 310
    this.cx = 20
    this.cy = 0
    this.cwidth = 90
    this.cheight = 155
    this.x = width / 2 - this.width / 2
    this.y = height
    this.draw = function () {
        try {
            if (this.vy > 0) {
                ctx.drawImage(z2, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height)
            } else {
                ctx.drawImage(z1, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height)
            }
        } catch (e) { }
    }
    this.jump = function () {
        if ($('.music_btn').hasClass('music_btn_type1')) {
            music2.play();
        } else {

        }

        this.vy = -18

    }
}
player = new Player()
//跳台对象
function Platform() {
    this.width = 220
    this.height = 60
    this.x = Math.random() * (width - this.width)
    this.y = position
    position += (height / platformCount)
    this.flag = 0
    this.state = 0
    this.cx = 0
    this.cy = 0
    this.cwidth = 220
    this.cheight = 60
    this.draw = function () {
        try {
            ctx.drawImage(cloud1, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height)
        } catch (e) {

        }
    }
    if (score > 3000) {
        this.types = [1, 2, 3]
    } else if (score > 1000) {
        this.types = [1, 2]
    } else {
        this.types = [1]
    }
    this.type = this.types[Math.floor(Math.random() * this.types.length)]
    this.moved = 0
    if (score > 1000) {
        cloud_v = parseInt(String(score).slice(0, -3))
    }
    this.vx = Math.round(Math.random() * cloud_v) + 1
}
for (var i = 0; i < platformCount; i++) {
    platforms.push(new Platform())
}
//初始化
function init() {
    var jumpCount = 0
    firstRun = false
    music1.play();
    $('.music_btn').addClass('music_btn_type1');
    $('.music_btn').css("animation", 'spin 2s infinite linear');
    $('.img_box img').attr('src', sessionStorage.user_avatar);

    function paintCanvas() {
        ctx.clearRect(0, 0, width, height)
    }
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", DeviceOrientationHandler, false)
    } else {
        console.log("DeviceOrientationEvent不支持!")
    }

    function DeviceOrientationHandler(event) {
        var alpha = event.alpha,
            beta = event.beta,
            gamma = event.gamma

        player.isMoving = 0
        if (gamma != null) {
            player.isMoving = Math.floor(gamma / 3)
        } else {
            console.log("重力感应不支持!")
        }
        $('#info .test1').text(gamma)
        $('#info .test2').text(player.vx)
        $('#info .test3').text(player.x)


    }
    document.onkeydown = function (e) {
        var key = e.keyCode
        if (key == 37) {
            player.isMoving = -9
        } else {
            if (key == 39) {
                player.isMoving = 9
            }
        }
        if (key == 32) {
            if (firstRun === true) {
                init()
            } else {
                reset()
            }
        }
    }

    document.onkeyup = function (e) {
        var key = e.keyCode
        if (key == 37) {

            player.isMoving = 0
        } else {
            if (key == 39) {

                player.isMoving = 0
            }
        }
    }

    function playerCalc() {

        //主角动作
        player.x += player.vx
        player.vx = player.isMoving
        if (player.vx > 20) {
            player.vx = 20
        } else {
            if (player.vx < -20) {
                player.vx = -20
            }
        }

        //跟地板关系
        if ((player.y + player.height) > base.y && base.y < height) {
            player.jump()
        }
        // 分数低保命
        if (score < 200 && player.y > 850) {
            player.jump()
            hint()
        }

        //结束判定
        if (base.y > height && (player.y + player.height) > height && player.isDead != 'playing') {
            player.isDead = true
        }

        //角色运动(区间控制)
        if (player.x > width) {
            player.x = 0 - player.width
        } else if (player.x < 0 - player.width) {
            player.x = width
        } else {
        }

        //上下变化
        if (player.y >= (height / 2) - (player.height / 2)) {
            player.y += player.vy
            player.vy += gravity
        } else {
            platforms.forEach(function (p, i) {
                if (player.vy < 0) {
                    p.y -= player.vy
                }
                if (p.y > height) {
                    platforms[i] = new Platform()
                    platforms[i].y = p.y - height
                }
            })
            base.y -= player.vy
            player.vy += gravity
            if (player.vy >= 0) {
                player.y += player.vy
                player.vy += gravity
            }
            score++
        }

        //接触平台跳跃
        platforms.forEach(function (p, i) {
            if (player.vy > 0 && p.state === 0 && (player.x + 60 < p.x + p.width) && (player.x + player.width - 60 > p.x) && (player.y + player.height > p.y) && (player.y + player.height < p.y + p.height)) {
                player.jump()
            }
        })

        //判定结束
        if (player.isDead === true) {
            gameOver()
        }
    }


    //平台运动

    function platformCalc() {
        platforms.forEach(function (p, i) {
            if (p.type == 2) {
                if (p.x < 0 || p.x + p.width > width) {
                    p.vx *= -1
                }
                p.x += p.vx
            } else if (p.type == 3) {
                if (p.x < 0 || p.x + p.width > width) {
                    p.vx *= -1.1
                }
                p.x += p.vx
            } else {

            }
            p.draw()
        })
    }


    // 更新分数
    function updateScore() {
        var scoreText = document.getElementById("score")
        scoreText.innerHTML = String(score)
    }

    //游戏结束
    function gameOver() {
        platforms.forEach(function (p, i) {
            p.y = -50
        })
        if (player.y > height / 2 && flag === 0) {
            player.y -= 8
            player.vy = 0
        } else if (player.y < height / 2) {
            flag = 1
        } else if (player.y + player.height > height) {
            showGoMenu()
            hideScore()
            player.isDead = 'playing'
        } else { }


    }

    function update() {
        paintCanvas()
        platformCalc()
        playerCalc()
        player.draw()
        base.draw()
        updateScore()
    }
    menuLoop = function () {
        return
    }
    animloop = function () {
        update()
        requestAnimFrame(animloop)
    }
    animloop()
    hideMenu()
    showScore()
}












//重置
function reset() {
    hideGoMenu()
    showScore()
    player.isDead = false
    flag = 0
    position = 0
    score = 0
    base = new Base()
    player = new Player()
    platforms = []
    for (var i = 0; i < platformCount; i++) {
        platforms.push(new Platform())
    }
}
//隐藏主菜单
function hideMenu() {
    var menu = document.getElementById("mainMenu")
    menu.style.zIndex = -1
}
//显示得分菜单
function showGoMenu() {
    if (score < 100) {
        $('.start_pop').show()
    } else {
        var menu = document.getElementById("gameOverMenu")
        menu.style.zIndex = 1
        menu.style.visibility = "visible"
        var scoreText = document.getElementById("go_score")
        scoreText.innerHTML = "你的得分" + String(score)
        sessionStorage.score = score
        sessionStorage.gamed = true
    }
}
//隐藏得分菜单
function hideGoMenu() {
    var menu = document.getElementById("gameOverMenu")
    menu.style.zIndex = -1
    menu.style.visibility = "hidden"
}
//显示得分
function showScore() {
    var menu = document.getElementById("scoreBoard")
    menu.style.zIndex = 1
}
//隐藏得分
function hideScore() {
    var menu = document.getElementById("scoreBoard")
    menu.style.zIndex = -1
}
//跳跃计算
function playerJump() {
    player.y += player.vy
    player.vy += gravity
    if (player.vy > 0 && (player.x + 15 < 260) && (player.x + player.width - 15 > 155) && (player.y + player.height > 475) && (player.y + player.height < 500)) {
        player.jump()
    }
    player.x += player.vx
    player.vx = player.isMoving


    if ((player.y + player.height) > base.y && base.y < height) {
        player.jump()
    }
    if (player.x > width) {
        player.x = 0 - player.width
    } else {
        if (player.x < 0 - player.width) {
            player.x = width
        }
    }
    player.draw()
}

//提示
function hint() {
    $('#hint').show()
    setTimeout(function () {
        $('#hint').hide()
    }, 1000)
}
//更新绘图
function update() {
    ctx.clearRect(0, 0, width, height)
    playerJump()
}
// 更新 
menuLoop = function () {
    update()
    requestAnimFrame(menuLoop)
}
menuLoop()
//画布尺寸重置
function get_hfs() {
    $(".container").css("height", $(window).height())
    $(".container").css("width", $(window).width())
    $("#canvas").css("height", $(window).height())
    $("#canvas").css("width", $(window).width())
}
function throttle(method, context) {
    clearTimeout(method.timer)
    method.timer = setTimeout(function () {
        method.call(context)
    }, 100)
}
window.onresize = function () {
    throttle(get_hfs)
}
get_hfs()

//开始绑定
$('.start_pop').on('click', function () {
    $('.start_pop').hide()
    if (restart == 0) {
        init()
        restart = 1
    } else {
        reset()
    }
})
//音乐
$('.music_btn').on('click', function (e) {
    if ($('.music_btn').hasClass('music_btn_type1')) {
        music1.pause();
        $('.music_btn').css("animation", 'spin 1s linear');
        $('.music_btn').removeClass('music_btn_type1');
        $('.music_btn').addClass('music_btn_type2');
    } else {
        music1.play();
        $('.music_btn').css("animation", 'spin 2s infinite linear');
        $('.music_btn').removeClass('music_btn_type2');
        $('.music_btn').addClass('music_btn_type1');
    }
})

//跳转预备
function get_award() {
    location.reload()
}