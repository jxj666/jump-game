// 设置画布
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d")
var width = 750,
    height = 1200
canvas.width = width
canvas.height = height
//设置游戏参数
var platforms = [],
    image = document.getElementById("sprite"),
    z1 = document.getElementById("z1"),
    z2 = document.getElementById("z2"),
    cloud = document.getElementById("cloud"),
    player, platformCount = 3,
    position = 0,
    gravity = 0.3,
    animloop, flag = 0,
    menuloop, broken = 0,
    dir, score = 0,
    i = 0,
    firstRun = true
//浏览器流畅动画 api
window.requestAnimFrame = (function() { return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) { window.setTimeout(callback, 1000 / 60) } })()
//地板对象
var Base = function() {
    this.height = 5
    this.width = width
    this.cx = 0
    this.cy = 614
    this.cwidth = 100
    this.cheight = 5
    this.moved = 0
    this.x = 0
    this.y = height - this.height
    this.draw = function() { try { ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height) } catch (e) {} }
}
var base = new Base()
//人物对象
var Player = function() {
    this.vy = 11
    this.vx = 0
    this.isMovingLeft = false
    this.isMovingRight = false
    this.isDead = false
    this.width = 240
    this.height = 320
    this.cx = 0
    this.cy = 0
    this.cwidth = 120
    this.cheight = 160
    this.dir = "left"
    this.x = width / 2 - this.width / 2
    this.y = height
    this.draw = function() { try { if (this.vy > 0) { ctx.drawImage(z2, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height) } else { ctx.drawImage(z1, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height) } } catch (e) {} }
    this.jump = function() { this.vy = -18 }
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
    this.draw = function() { try { if (this.type == 1) { this.cy = 0 } else { if (this.type == 2) { this.cy = 0 } } ctx.drawImage(cloud, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height) } catch (e) {} }
    if (score >= 5000) { this.types = [2, 2, 2, 2, 2] } else { if (score >= 2000 && score < 5000) { this.types = [1, 2, 2, 2, 2] } else { if (score >= 1000 && score < 2000) { this.types = [1, 1, 2, 2, 2] } else { if (score >= 500 && score < 1000) { this.types = [1, 1, 1, 2, 2] } else { if (score >= 100 && score < 500) { this.types = [1, 1, 1, 1, 2] } else { this.types = [1] } } } } } this.type = this.types[Math.floor(Math.random() * this.types.length)]
    this.moved = 0
    this.vx = 1
}
for (var i = 0; i < platformCount; i++) { platforms.push(new Platform()) }
//初始化
function init() {
    var dir = "left",
        jumpCount = 0
    firstRun = false

    function paintCanvas() { ctx.clearRect(0, 0, width, height) }
    if (window.DeviceOrientationEvent) { window.addEventListener("deviceorientation", DeviceOrientationHandler, false) } else { console.log("DeviceOrientationEvent不支持!") }

    function DeviceOrientationHandler(event) {
        var alpha = event.alpha,
            beta = event.beta,
            gamma = event.gamma
        if (alpha != null || beta != null || gamma != null) {
            var gamma_html = ""
            if (gamma < -10) {
                dir = "left"
                player.isMovingLeft = true
            } else {
                if (gamma > 10) {
                    dir = "right"
                    player.isMovingRight = true
                } else {
                    player.isMovingRight = false
                    player.isMovingLeft = false
                }
            }
        } else { console.log("设备不支持!") }
    }
    document.onkeydown = function(e) {
        var key = e.keyCode
        if (key == 37) {
            dir = "left"
            player.isMovingLeft = true
        } else {
            if (key == 39) {
                dir = "right"
                player.isMovingRight = true
            }
        }
        if (key == 32) { if (firstRun === true) { init() } else { reset() } }
    }
    document.onkeyup = function(e) {
        var key = e.keyCode
        if (key == 37) {
            dir = "left"
            player.isMovingLeft = false
        } else {
            if (key == 39) {
                dir = "right"
                player.isMovingRight = false
            }
        }
    }

    function playerCalc() {
        if (dir == "left") {
            player.dir = "left"
            if (player.vy < -7 && player.vy > -15) { player.dir = "left_land" }
        } else {
            if (dir == "right") {
                player.dir = "right"
                if (player.vy < -7 && player.vy > -15) { player.dir = "right_land" }
            }
        }
        console.log(i++ + "2")
        if (player.isMovingLeft === true) {
            player.x += player.vx
            player.vx -= 0.15
        } else {
            player.x += player.vx
            if (player.vx < 0) { player.vx += 0.1 }
        }
        if (player.isMovingRight === true) {
            player.x += player.vx
            player.vx += 0.15
        } else {
            player.x += player.vx
            if (player.vx > 0) { player.vx -= 0.1 }
        }
        if (player.vx > 3) { player.vx = 3 } else { if (player.vx < -3) { player.vx = -3 } }
        if ((player.y + player.height) > base.y && base.y < height) { player.jump() }
        if (base.y > height && (player.y + player.height) > height && player.isDead != "lol") { player.isDead = true }
        if (player.x > width) { player.x = 0 - player.width } else { if (player.x < 0 - player.width) { player.x = width } }
        if (player.y >= (height / 2) - (player.height / 2)) {
            player.y += player.vy
            player.vy += gravity
        } else {
            platforms.forEach(function(p, i) {
                if (player.vy < 0) { p.y -= player.vy }
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
        collides()
        if (player.isDead === true) { gameOver() }
    }

    function platformCalc() { platforms.forEach(function(p, i) { if (p.type == 2) { if (p.x < 0 || p.x + p.width > width) { p.vx *= -1 } p.x += p.vx } p.draw() }) }

    function collides() { platforms.forEach(function(p, i) { if (player.vy > 0 && p.state === 0 && (player.x + 15 < p.x + p.width) && (player.x + player.width - 15 > p.x) && (player.y + player.height > p.y) && (player.y + player.height < p.y + p.height)) { player.jump() } }) }

    function updateScore() {
        var scoreText = document.getElementById("score")
        scoreText.innerHTML = score
    }

    function gameOver() {
        platforms.forEach(function(p, i) { p.y -= 12 })
        if (player.y > height / 2 && flag === 0) {
            player.y -= 8
            player.vy = 0
        } else {
            if (player.y < height / 2) { flag = 1 } else {
                if (player.y + player.height > height) {
                    showGoMenu()
                    hideScore()
                    player.isDead = "lol"
                }
            }
        }
    }

    function update() {
        paintCanvas()
        platformCalc()
        playerCalc()
        player.draw()
        base.draw()
        updateScore()
    }
    menuLoop = function() { return }
    animloop = function() {
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
    for (var i = 0; i < platformCount; i++) { platforms.push(new Platform()) }
}
//隐藏主菜单
function hideMenu() {
    var menu = document.getElementById("mainMenu")
    menu.style.zIndex = -1
}
//显示得分菜单
function showGoMenu() {
    var menu = document.getElementById("gameOverMenu")
    menu.style.zIndex = 1
    menu.style.visibility = "visible"
    var scoreText = document.getElementById("go_score")
    scoreText.innerHTML = "你的得分" + score
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
//人物跳跃
function playerJump() {
    player.y += player.vy
    player.vy += gravity
    if (player.vy > 0 && (player.x + 15 < 260) && (player.x + player.width - 15 > 155) && (player.y + player.height > 475) && (player.y + player.height < 500)) { player.jump() }
    if (dir == "left") {
        player.dir = "left"
        if (player.vy < -7 && player.vy > -15) { player.dir = "left_land" }
    } else {
        if (dir == "right") {
            player.dir = "right"
            if (player.vy < -7 && player.vy > -15) { player.dir = "right_land" }
        }
    }
    console.log(i++ + "1")
    if (player.isMovingLeft === true) {
        player.x += player.vx
        player.vx -= 0.05
    } else {
        player.x += player.vx
        if (player.vx < 0) { player.vx += 0.1 }
    }
    if (player.isMovingRight === true) {
        player.x += player.vx
        player.vx += 0.05
    } else {
        player.x += player.vx
        if (player.vx > 0) { player.vx -= 0.1 }
    }
    if ((player.y + player.height) > base.y && base.y < height) { player.jump() }
    if (player.x > width) { player.x = 0 - player.width } else { if (player.x < 0 - player.width) { player.x = width } } player.draw()
}

//更新绘图
function update() {
    ctx.clearRect(0, 0, width, height)
    playerJump()
}
// 更新 
menuLoop = function() {
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
    method.timer = setTimeout(function() { method.call(context) }, 100)
}
window.onresize = function() { throttle(get_hfs) }
get_hfs()