import {level1} from "./levels/level1.js";
import {level2} from "./levels/level2.js";
import { level3 } from "./levels/level3.js";
import {menuBackground, cars, settingsBackground, level1Door, loadingScreenImg} from "./loadImages/others.js";
import { tiles } from "./loadImages/loadTiles.js";
import { cyclopsImage, mushroomImage} from "./loadImages/loadEnemies.js";
import { playerIdleLvl1, playerWalkLvl1, playerJumpLvl1, playerWalkLvl2 } from "./loadImages/loadPlayer.js";

// Using spread operator [...] creates a shallow copy of the arrays
let map1 = level1.map(row => [...row]), map2 = level2.map(row => [...row]);

window.onerror = function(message, source, lineno, colno, error){
    const log = document.createElement("div");
    log.style.position = "fixed";
    log.style.top = "0";
    log.style.left = "0";
    log.style.width = "100%";
    log.style.backgroundColor = "red";
    log.style.color = "white";
    log.style.fontSize = "14px";
    log.style.zIndex = 9999;
    log.style.padding = "5px";
    log.textContent = message + " at " + lineno + ": " + colno;
    document.body.appendChild(log);
    return false;
};

const jumpBtn = document.getElementById("jumpBtn"); // Get the button from HTML, created in index.html
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

const canvas = document.getElementById("gameCanvas"); // Access canvas
const draw = canvas.getContext("2d");

draw.imageSmoothingEnabled = false; // Sprites will look blurry after resizing if this is true

// Determine if game is being ran on a computer or a touch screen like a phone
// ontouchstart in window = true if device supports touch
// navigator.maxTouchPoints = number of touch points
const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if(isMobile){
    document.querySelector(".controls").style.display = "flex";
}

let volume = 0.5;
const level1Music = new Audio("music/sources/alexgrohl-energetic-action-sport-500409.mp3");
const level2Music = new Audio("music/sources/denys_brodovskyi-tell-me-what-379638.mp3");
const level3Music = new Audio("music/sources/alexgrohl-sad-soul-hip-hop-185750.mp3");
const level4Music = new Audio("music/sources/monume-summer-509512.mp3");
const level5Music = new Audio("music/sources/nastelbom-suspense-487702.mp3");
level1Music.loop = true;
level1Music.volume = volume;
level2Music.loop = true;
level2Music.volume = volume;
level3Music.loop = true;
level3Music.volume = volume;
level4Music.loop = true;
level4Music.volume = volume;
level5Music.loop = true;
level5Music.volume = volume;

let gravity = 0.8; // what changes the speed in how fast you fall each frame
let velocityY = 0; // how fast your moving
let resets = 0;

const tileSize = 64;
let canMove = true, onJumpPad = false, onGround = false;

// what screen is active for the buttons to be usable
let startMenuActive = true, diedScreenActive = false, settingActive = false;

// Buttons
let startButton = { x: canvas.width/2-50, y: 200, width: 150, height: 50};
let settingButton = { x: canvas.width/2-50, y: 300, width: 150, height: 50};
let backButton = {x: canvas.width/2 - 75, y: 400, width: 150, height: 50};

let volumeRect = {x: canvas.width/2 - 75, y: 140, width: 150, height: 50};
let volumeBarOutline = {x: canvas.width/2 - 50, y: 200, width: 100, height: 50};
let volumeBar = {x: canvas.width/2 - 50, y: 200, width: 50, height: 50};
let volumeDown = {x: canvas.width/2 - 45, y: 255, width: 40, height: 40};
let volumeUp = {x: canvas.width/2 + 5, y: 255, width: 40, height: 40};
let muteButton = {x: canvas.width/2 - 75, y: 300, width: 150, height: 50};

let restartButton = { x: 205, y: 275, width: 170, height: 50};
let mainMenuButton = { x: 425, y: 275, width: 170, height: 50};

let camera = { x : 0, y : 0};

let screenActive = {mainMenu: true, settings: false, died: false, 
                level1Active: false, level2Active: false, level3Active: false, level4Active: false, level5Active: false};
let player = { x: 64, y: 512, width: 96, height: 84, speed: 3};
let hitboxX = 0, hitboxY = 0;

let hitBoxWidth = 50;  // Slightly thinner than tile to avoid snagging
let hitBoxHeight = 64; // Height of the box

const renderedWidth = 192; 
const renderedHeight = 168;

// These determine where the sprite sits relative to the hitbox
let offsetX = (renderedWidth - hitBoxWidth) / 2;
let offsetY = (renderedHeight - hitBoxHeight) / 2;

let jumped = false;
let levelLoaded = false;

let keys = {
    left: false,
    right: false,
    jump: false
};
let state = "idle";
let goingRight = true;
// Keyboard input
document.addEventListener("keydown", (e) => {
    if(e.key == "ArrowLeft") {
        keys.left = true;
        goingRight = false; 
        state = "walk";
    }
    else if(e.key == "ArrowRight") {
        keys.right = true;
        goingRight = true;
        state = "walk";
    }
    else if(e.key == "ArrowUp") keys.jump = true;
    else if(e.key == " ") {
        keys.jump = true;
        //state = "jump";
    }
    else if(e.key == "w"){
        keys.jump = true;
    }
    else if(e.key == "a"){
        keys.left = true;
        goingRight = false; 
        state = "walk";
    }
    else if(e.key == "d"){
        keys.right = true;
        goingRight = true;
        state = "walk";
    }
});

document.addEventListener("keyup", (e) => {
    if(e.key == "ArrowLeft") {
        keys.left = false;
        goingRight = false;
        state = "idle";
    }
    else if(e.key == "ArrowRight") {
        keys.right = false; 
        goingRight = true;
        state = "idle";
    }
    else if(e.key == "ArrowUp") {
        keys.jump = false; 
        jumped = false; // jumped = player can only jump again if they let go of the key
    } 
    else if(e.key == " ") {
        keys.jump = false; 
        jumped = false;
        //state = "idle";
    }
    else if(e.key == "w"){
        keys.jump = false; 
        jumped = false; 
    }
    else if(e.key == "a"){
        keys.left = false;
        goingRight = false;
        state = "idle";
    }
    else if(e.key == "d"){
        keys.right = false; 
        goingRight = true;
        state = "idle";
    }
});

// Mobile buttons, anything changed in the above listeners needs to be  added here for mobile
function setupButtons(btn, keyName){
    btn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        keys[keyName] = true;

        // --- ADD ANIMATION STATE HERE ---
        if (keyName === "left") {
            goingRight = false;
            state = "walk";
        } else if (keyName === "right") {
            goingRight = true;
            state = "walk";
        }
    });
    btn.addEventListener("touchend", (e) => {
        e.preventDefault();
        keys[keyName] = false;
        jumped = false;

        // --- RESET TO IDLE HERE ---
        if (keyName === "left" || keyName === "right") {
            state = "idle";
        }
    });
    btn.addEventListener("mousedown", (e) => {
        e.preventDefault();
        keys[keyName] = true;
        if (keyName === "left") { goingRight = false; state = "walk"; }
        if (keyName === "right") { goingRight = true; state = "walk"; }
    });
    btn.addEventListener("mouseup", (e) => {
        e.preventDefault();
        keys[keyName] = false;
        if (keyName === "left" || keyName === "right") state = "idle";
    });
}

setupButtons(leftBtn, "left");
setupButtons(rightBtn, "right");
setupButtons(jumpBtn, "jump");

canvas.addEventListener("click", (e) =>{
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left; // X relative to canvas
    const mouseY = e.clientY - rect.top; // Y relative to canvas
    //console.log("X:", player.x, "Y:", player.y);
    if(startMenuActive){
        if(mouseX >= startButton.x && mouseX <= startButton.x + startButton.width && mouseY >= startButton.y && mouseY <= startButton.y + startButton.height){
            level1Music.play().catch(err => console.log(err)); // catch prevents errors if autoplay is blocked
            player.x = 64;
            player.y = 512;
            screenActive.mainMenu = false;
            screenActive.level1Active = true;
            startMenuActive = false;     
        }
        if(mouseX >= settingButton.x && mouseX <= settingButton.x + settingButton.width && mouseY >= settingButton.y && mouseY <= settingButton.y + settingButton.height){
            screenActive.mainMenu = false;
            screenActive.settings = true;
            settingActive = true;
            startMenuActive = false;
        }
    }
    if(settingActive){   
        if(mouseX >= volumeDown.x && mouseX <= volumeDown.x + volumeDown.width && mouseY >= volumeDown.y && mouseY <= volumeDown.y + volumeDown.height){
            volumeBar.width-=10;
            volume -= 0.1;
            if(volumeBar.width <= 0){
                volumeBar.width = 0;
            }
            if(volume <= 0){
                volume = 0;
            }
            level1Music.volume = volume;
        }
        if(mouseX >= volumeUp.x && mouseX <= volumeUp.x + volumeUp.width && mouseY >= volumeUp.y && mouseY <= volumeUp.y + volumeUp.height){                
           
            volumeBar.width+=10;
            volume += 0.1;
            if(volumeBar.width >= 100){
                volumeBar.width = 100;
            }
            if(volume >= 1){
                volume = 1;
            }
            level1Music.volume = volume;                    
        }
        if(mouseX >= muteButton.x && mouseX <= muteButton.x + muteButton.width && mouseY >= muteButton.y && mouseY <= muteButton.y + muteButton.height){                   
            volumeBar.width = 0;
            volume = 0;
            level1Music.volume = volume;
                             
        }
        if(mouseX >= backButton.x && mouseX <= backButton.x + backButton.width && mouseY >= backButton.y && mouseY <= backButton.y + backButton.height){                   
            startMenuActive = true;
            screenActive.mainMenu = true;
            screenActive.settings = false;
            settingActive = false;                  
        }
    }
    if(diedScreenActive){
        if(mouseX >= restartButton.x && mouseX <= restartButton.x + restartButton.width && mouseY >= restartButton.y && mouseY <= restartButton.y + restartButton.height){
            level1Music.pause(); // Pause it so it doesnt keep playing on the menu screen
            level1Music.currentTime = 0; // Resets the music to the beginning
            level2Music.pause(); // Pause it so it doesnt keep playing on the menu screen
            level3Music.currentTime = 0; // Resets the music to the beginning
            resets++;
            console.log("resets:", resets);
            screenActive.died = false;
            screenActive.level1Active = true;
            screenActive.level2Active = false;
            diedScreenActive = false;
            resetLevels();
        }
        if(mouseX >= mainMenuButton.x && mouseX <= mainMenuButton.x + mainMenuButton.width && mouseY >= mainMenuButton.y && mouseY <= mainMenuButton.y + mainMenuButton.height){                
            level1Music.pause(); // Pause it so it doesnt keep playing on the menu screen
            level1Music.currentTime = 0; // Resets the music to the beginning
            screenActive.mainMenu = true; 
            screenActive.died = false;
            diedScreenActive = false;
                                
        }
    }
});

function updateCamera(){
    const offsetX = 200;
    const offsetY = 200;

    camera.x = player.x - offsetX;
    camera.y = player.y - offsetY;

    let activeMap = screenActive.level1Active ? map1 : map2; // Add this line
    
    camera.x = Math.max(0, Math.min(camera.x, activeMap[0].length * tileSize - canvas.width));
    camera.y = Math.max(0, Math.min(camera.y, activeMap.length * tileSize - canvas.height));
}

function changeLevel(previousLevel){
    player.x = 64;
    player.y = 512;
    canMove = true;
    velocityY = 0;

    camera.x = 0; 
    camera.y = 0;

    map1 = level1.map(row => [...row]);
    map2 = level2.map(row => [...row]);

    enemies = []; // Clears the array so it can be empty for next level
    levelLoaded = false;
    if(previousLevel == 1){
        level1Music.pause();
        level2Music.play().catch(err => console.log(err));   
        console.log(levelLoaded);
        console.log("Activate level 2"); 
        screenActive.level1Active = false;   
        screenActive.level2Active = true;   
    }else if(previousLevel == 2){
        level2Music.pause();
        level3Music.play().catch(err => console.log(err));
        screenActive.level2Active = false;
        screenActive.level3Active = true;
    }else if(previousLevel == 3){
        level3Music.pause();
        level4Music.play().catch(err => console.log(err));
        screenActive.level3Active = false;
        screenActive.level4Active = true;
    }else if(previousLevel == 4){
        level4Music.pause();
        level5Music.play().catch(err => console.log(err));
        screenActive.level4Active = false;
        screenActive.level5Active = true;
    }else if(previousLevel == 5){
        screenActive.level5Active = false;
        //screenActive.level2Active = false;
    }
}

function drawGrid(){
    for(let x = 0; x < 800; x ++){
        for(let y = 0; y < 600; y++){
            draw.fillRect(x*tileSize,y*tileSize, 50,2);
            draw.fillRect(x*tileSize,y*tileSize, 2,50);
        }
    }
}
function updateNPC(npc, moveState, levelMap) {
    // 1. Calculate the tile position directly in front of the NPC
    // We check slightly ahead of the NPC's center
    let checkX = npc.x + (moveState.movingLeft ? -5 : hitBoxWidth + 5);
    let checkY = npc.y + hitBoxHeight + 5; // Look 5 pixels below feet

    let tileCol = Math.floor(checkX / tileSize);
    let tileRow = Math.floor(checkY / tileSize);
    let wallRow = Math.floor(npc.y / tileSize);

    // 2. Check for "Cliff" (No floor) or "Wall" (Solid tile in front)
    let floorTile = (levelMap[tileRow] && levelMap[tileRow][tileCol]);
    let wallTile = (levelMap[wallRow] && levelMap[wallRow][tileCol]);

    // If there's no floor OR there is a wall, turn around
    if (floorTile !== 4 || wallTile === 4) {
        moveState.movingLeft = !moveState.movingLeft;
        moveState.movingRight = !moveState.movingRight;
    }

    // 3. Move based on the state
    if (moveState.movingLeft) {
        npc.x -= 1;
    } else {
        npc.x += 1;
    }
}

// 1. Update your registry at the top of your code
const enemyRegistry = {
    10: 'cyclops',
    11: 'mushroom'
};

// 2. Update your images dictionary
const enemySprites = {
    'cyclops': cyclopsImage,    // Your cyclops sprite sheet
    'mushroom': mushroomImage   // Your mushroom sprite sheet
};

let enemies = [];
function spawnEnemies(levelMap) {
    enemies = []; 

    for (let row = 0; row < levelMap.length; row++) {
        for (let col = 0; col < levelMap[row].length; col++) {
            let tile = levelMap[row][col];

            // 1. Check if this tile number exists in our Registry
            if (enemyRegistry[tile]) { 
                let typeName = enemyRegistry[tile];

                // REPLACE the push with this:
                enemies.push({
                    type: typeName,
                    x: col * tileSize,
                    y: row * tileSize,
                    image: enemySprites[typeName], // Give it the right sheet
                    
                    // --- ANIMATION KIT FOR EACH ENEMY ---
                    frameIndex: 0,
                    tickCount: 0,
                    ticksPerFrame: 15, // Speed (Adjust this for each enemy if you want!)
                    
                    moveState: { movingLeft: true, movingRight: false }
                });

                levelMap[row][col] = 0;
            }
        }
    }
}

let idleFrame = 0;
let walkFrame = 0;
let jumpFrame = 0;
let idleTimer = 0;
let walkTimer = 0;
let jumpTimer = 0;

function animate(level){
    // BLUE: The Sprite Anchor (player.x, player.y)
    //draw.strokeStyle = "blue";
    //draw.strokeRect(player.x - camera.x, player.y - camera.y, renderedWidth, renderedHeight);

    // RED: The actual Collision Hitbox (hitboxX, hitboxY)
    //draw.strokeStyle = "red";
    //draw.strokeRect(player.x - camera.x, player.y - camera.y, hitBoxWidth, hitBoxHeight);
    // This is where the sprite should be drawn to surround the hitbox
    let drawX = 0;
    let drawY = 0;
    switch(level){
        case 1:
            drawX = player.x - offsetX - camera.x;
            drawY = player.y - offsetY - camera.y;
            const frameWidth = 96;
            const frameHeight = 84;
            const totalIdleFrames = 7;
            const totalWalkFrames = 8;
            const totalJumpFrames = 5;
            const frameSpeed = 10; // higher = slower animation
            switch(state){
                case "idle":
                    // calculate source position in sprite sheet
                    const sxidle = idleFrame * frameWidth;
                    idleTimer++;

                    if (idleTimer >= frameSpeed) {
                        idleFrame = (idleFrame + 1) % totalIdleFrames;
                        idleTimer = 0;
                    } 
                    // Apply flipping to idle too if you want!
                    if (goingRight) {
                        draw.drawImage(playerIdleLvl1, sxidle, 0, frameWidth, frameHeight, 
                                    drawX, drawY, renderedWidth, renderedHeight);
                    } else {
                        draw.save();
                        draw.translate(drawX + renderedWidth, drawY);
                        draw.scale(-1, 1);
                        draw.drawImage(playerIdleLvl1, sxidle, 0, frameWidth, frameHeight, 
                                    0, 0, renderedWidth, renderedHeight);
                        draw.restore();
                    }
                    break;   
                case "walk":
                    const sxwalk = walkFrame * frameWidth;
                    walkTimer++;

                    if (walkTimer >= frameSpeed) {
                        walkFrame = (walkFrame + 1) % totalWalkFrames;
                        walkTimer = 0;
                    }
                    
                    // draw frame
                    if(goingRight){
                        draw.drawImage(playerWalkLvl1, walkFrame * frameWidth, 0, frameWidth, frameHeight, 
                            drawX, drawY, renderedWidth, renderedHeight);
                    }else if(!goingRight){
                        // FLIPPING LOGIC
                        draw.save();
                        // Move the "pen" to the right side of where the sprite WILL be
                        draw.translate(drawX + renderedWidth, drawY);
                        // Flip the horizontal axis
                        draw.scale(-1, 1);
                        // Draw at 0,0 because we translated to the destination
                        draw.drawImage(playerWalkLvl1, sxwalk, 0, frameWidth, frameHeight, 
                                    0, 0, renderedWidth, renderedHeight);
                        draw.restore();
                    }
                    break;
                case "jump":
                    const sxjump = jumpFrame * frameWidth;
                    jumpTimer++;

                    if (jumpTimer >= frameSpeed) {
                        jumpFrame = (jumpFrame + 1) % totalJumpFrames;
                        jumpTimer = 0;
                    }
                    // Apply flipping to idle too if you want!
                    if (goingRight) {
                        draw.drawImage(playerJumpLvl1, sxjump, 0, frameWidth, frameHeight, 
                                    drawX, drawY, renderedWidth, renderedHeight);
                    } else {
                        draw.save();
                        draw.translate(drawX + renderedWidth, drawY);
                        draw.scale(-1, 1);
                        draw.drawImage(playerJumpLvl1, sxjump, 0, frameWidth, frameHeight, 
                                    0, 0, renderedWidth, renderedHeight);
                        draw.restore();
                    }
                    break;
            }
            break;
        case 2:
            drawX = player.x - camera.x;
            drawY = player.y - camera.y;
            const dogWidth = 32;
            const dogHeight = 32;
            const dogWidthInc = 88;
            const dogHeightInc = 88;
            const dogTotalFrames = 4;
            const dogSpeed = 20;
            switch(state){
                case "idle":
                    const dogIdleTotalFrames = 2;
                    const sxidle = idleFrame * dogWidth;
                    idleTimer++;

                    if (idleTimer >= dogSpeed) {
                        idleFrame = (idleFrame + 1) % dogIdleTotalFrames;
                        idleTimer = 0;
                    } 
                    
                    if (goingRight) {
                        // Draw normally at drawX, drawY
                        draw.drawImage(playerWalkLvl2, sxidle, 128, dogWidth, dogHeight, drawX, drawY, dogWidthInc, dogHeightInc);
                    } else {
                        draw.save();
                        // Move to the right edge of the sprite's destination
                        // The Translation: draw.translate(drawX + width, drawY) sets the top-left corner 
                        // of your "new" coordinate system to where the player's right side should be.
                        draw.translate(drawX + dogWidthInc, drawY);
                        // The Scale: draw.scale(-1, 1) flips the world horizontally from that point
                        draw.scale(-1, 1);
                        // Draw at 0, 0 because the "paper" was moved to drawX, drawY
                        draw.drawImage(playerWalkLvl2, sxidle, 128, dogWidth, dogHeight, 
                                        0, 0, dogWidthInc, dogHeightInc);
                        draw.restore();
                    }
                    break;   
                case "walk":
                    const sxwalk = walkFrame * 32;
                    walkTimer++;

                    if (walkTimer >= dogSpeed) {
                        walkFrame = (walkFrame + 1) % dogTotalFrames;
                        walkTimer = 0;
                    }
                    
                    if (goingRight) {
                        // Use drawX and drawY so the dog follows the player hitbox
                        draw.drawImage(playerWalkLvl2, sxwalk, 250, 32, 32, 
                                        drawX, drawY, dogWidthInc, dogHeightInc);
                    } else {
                        draw.save();
                        // Use 88 here because that is the width you are drawing
                        draw.translate(drawX + dogWidthInc, drawY); 
                        draw.scale(-1, 1);
                        // Draw at 0,0
                        draw.drawImage(playerWalkLvl2, sxwalk, 250, 32, 32, 
                                        0, 0, dogWidthInc, dogHeightInc);
                        draw.restore();
                    }
                    break;
                case "jump":
                    const sxjump = jumpFrame * 32;
                    jumpTimer++;
                    if (jumpTimer >= dogSpeed) {
                        jumpFrame = (jumpFrame + 1) % dogTotalFrames;
                        jumpTimer = 0;
                    }
                    if (goingRight) {
                        draw.drawImage(playerWalkLvl2, sxjump, 250, 32, 32, 
                                        drawX, drawY, dogWidthInc, dogHeightInc);
                    } else {
                        draw.save();
                        draw.translate(drawX + dogWidthInc, drawY);
                        draw.scale(-1, 1);
                        draw.drawImage(playerWalkLvl2, sxjump, 250, 32, 32, 0, 0, dogWidthInc, dogHeightInc);
                        draw.restore();
                    }
                    break;
            }
    }
}

function updateAndDrawEnemy(npc) {
    // 1. Update the animation timer
    npc.tickCount++;
    if (npc.tickCount > npc.ticksPerFrame) {
        npc.tickCount = 0;
        npc.frameIndex++;
        if (npc.frameIndex >= 4) { npc.frameIndex = 0; }
    }

    // 2. Determine which column to use based on direction
    let sw = npc.image.width / 4;
    let sh = npc.image.height / 4;
    
    let columnIndex;
    if (npc.moveState.movingRight) {
        columnIndex = 3; // 3rd Column
    } else {
        columnIndex = 2; // 2nd Column (Adjust this index to match your sheet!)
    }

    let sx = columnIndex * sw; 
    let sy = npc.frameIndex * sh;

    // 3. Draw to screen
    draw.drawImage( npc.image, sx, sy, sw, sh, npc.x - camera.x, npc.y - camera.y, tileSize, tileSize );
}

function resetLevels(){
    // reset player location 
    player.x = 64;
    player.y = 512;
    velocityY = 0;
    camera.x = 0;
    camera.y = 0;

    // reset flags
    levelLoaded = false;
    canMove = true;
    diedScreenActive = false;

    // Re-copy the original map so any 0's for the enemies are replaced with original value and they can be redrawn
    map1 = level1.map(row => [...row]);
    map2 = level2.map(row => [...row]);

    // Clear the existing enemies so they dont double up
    enemies = [];
    level1Music.play().catch(err => console.log(err));;
}
let lastTime = 0;
function gameLoop(timestamp){   
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    //console.log(deltaTime);
    updateCamera(); 
    // Player movement
    if(canMove){
        if(keys.jump && onGround && !jumped){ 
            state = "jump";
            if(onJumpPad){
                velocityY = -25;     
            }else{
                velocityY = -20;
            }
            jumped = true;
            onJumpPad = false;
            onGround = false;
        }  
    }
    if (onGround && state === "jump") {
        state = keys.left || keys.right ? "walk" : "idle";
    }

    if(screenActive.mainMenu){
        //console.log("We in the menu");
        
        startMenuActive = true; // Makes sure the buttons are only clickable if in this screen
        // Background color
        //draw.fillStyle = "black";
        //draw.fillRect(0,0,canvas.width, canvas.height);    
        
        draw.drawImage(menuBackground, 0, 0);
    
        // Draw the rectangles for the button
        //draw.fillStyle = "red";
        //draw.fillRect(startButton.x, startButton.y, startButton.width, startButton.height);
        //draw.fillRect(settingButton.x, settingButton.y, settingButton.width, settingButton.height);

        draw.strokeRect(startButton.x, startButton.y, startButton.width, startButton.height);
        draw.strokeRect(settingButton.x, settingButton.y, settingButton.width, settingButton.height);
        
        // Draw the writing inside the buttons
        draw.fillStyle = "white";
        draw.font = "35px Arial";
        draw.fillText("START", startButton.x+20, startButton.y+38);                 
        draw.fillText("SETTING", settingButton.x, settingButton.y+38);  
    }
    if(screenActive.settings){
        draw.drawImage(settingsBackground, 0, 0);
        // Draw the rectangles for the button
        draw.fillStyle = "red";
        draw.fillRect(volumeRect.x, volumeRect.y, volumeRect.width, volumeRect.height);
        draw.fillRect(muteButton.x, muteButton.y, muteButton.width, muteButton.height);
        draw.strokeStyle = "blue";
        draw.strokeRect(volumeBarOutline.x, volumeBarOutline.y, volumeBarOutline.width, volumeBarOutline.height);
        draw.fillRect(volumeBar.x, volumeBar.y, volumeBar.width, volumeBar.height);
        draw.fillRect(volumeDown.x, volumeDown.y, volumeDown.width, volumeDown.height);
        draw.fillRect(volumeUp.x, volumeUp.y, volumeUp.width, volumeUp.height);
        draw.fillRect(backButton.x, backButton.y, backButton.width, backButton.height);

        // Draw the writing inside the buttons
        draw.fillStyle = "white";
        draw.font = "35px Arial";
        draw.fillText("Volume", volumeRect.x + 15, volumeRect.y + 38);                 
        draw.fillText("Mute", muteButton.x + 35, muteButton.y + 38);
        draw.fillText("Back", backButton.x+35, backButton.y+38);
        draw.font = "50px Arial";
        draw.fillText("-", volumeDown.x + 10, volumeDown.y + 32);                 
        draw.fillText("+", volumeUp.x + 5, volumeUp.y + 37);
        
    }
    
    if(screenActive.died){
        diedScreenActive = true;
        velocityY = 0;
        draw.fillStyle = "black";
        draw.fillRect(0,0,canvas.width, canvas.height);

        draw.font = "50px Arial";
        draw.fillStyle = "white";
        draw.fillText("Game Over!", 260,250);

        draw.fillStyle = "red";
        draw.fillRect(restartButton.x, restartButton.y, restartButton.width, restartButton.height);
        draw.fillRect(mainMenuButton.x, mainMenuButton.y, mainMenuButton.width, mainMenuButton.height);

        draw.fillStyle = "white";
        draw.font = "35px Arial";
        draw.fillText("RESTART", restartButton.x+5, restartButton.y+38);                 
        draw.fillText("MENU", mainMenuButton.x+30, mainMenuButton.y+38);

        // Will call function after the set time. 3000 = 3 seconds
        //setTimeout(changeState, 3000);
    }
    if(screenActive.level1Active){
        // Erase EVERYTHING before drawing the new frame
        draw.clearRect(0, 0, canvas.width, canvas.height);
        // --- NEW: ONLY SPAWN ONCE ---
        if (!levelLoaded) {
            spawnEnemies(map1); 
            levelLoaded = true; // This prevents it from running again next frame
        }
        // 1. Reset Ground State (Crucial: Assume in air until proven otherwise)
        onGround = false;

        // 1. Capture Old Position (Before movement)
        let pOldX = player.x;
        let pOldY = player.y;

        // 2. Apply Physics
        velocityY += gravity;
        player.y += velocityY;
        
        // Update Hitbox Y after moving Y
        hitboxY = player.y + offsetY;
        
        // Calculate the total width of the game world (not the screen)
        // So: total world width = number of tiles * tile size
        const worldWidth = map1[0].length * tileSize; // 6144
        //console.log(worldWidth);

        // 3. Move Horizontally
        if (keys.right && player.x + player.width < worldWidth && canMove) {        
            player.x += player.speed;
        } else if (keys.left && player.x + offsetX >= 0 && canMove) {
            player.x -= player.speed;
        }

        // Update Hitbox X after moving X
        hitboxX = player.x + offsetX;
        
        // Draw tiles
        for(let row = 0; row < map1.length; row++){
            for(let col = 0; col < map1[row].length; col++){
                const tileIndex = map1[row][col]; // Get number from map1
                const tileImage = tiles[tileIndex]; // Get the corresponding image from the images[]
                const screenX = col * tileSize - camera.x;
                const screenY = row * tileSize - camera.y;
                
                // ONLY draw if the image actually exists
                if (tileImage) {
                    draw.drawImage(tileImage, screenX, screenY, tileSize, tileSize);
                } else if (tileIndex !== 0) {
                    // This tells you exactly which tile is broken without crashing the game
                    console.warn("Level 1 draw failure - Row:", row, "Col:", col, "Index:", tileIndex);
                }
            }   
        }
        
        // Check collisions with tiles
        for(let row = 0; row < map1.length; row++){
            for(let col = 0; col < map1[row].length; col++){
                let tileX = col * tileSize;
                let tileY = row * tileSize;
                //  Prevents player from falling through floor while gravity if constantly active
                if(map1[row][col] == 4){
                    // Check overlap using HITBOX coordinates
                    // Standard AABB check: Is the player's HITBOX touching the tile?
                    if (player.x < tileX + tileSize && player.x + hitBoxWidth > tileX && player.y < tileY + tileSize && player.y + hitBoxHeight > tileY) {
                        // Resolve Vertical (Top/Bottom)
                        if (pOldY + hitBoxHeight <= tileY) { // Landed on Top
                            player.y = tileY - hitBoxHeight;
                            velocityY = 0;
                            onGround = true;
                        } 
                        else if (pOldY >= tileY + tileSize) { // Hit Head
                            player.y = tileY + tileSize;
                            velocityY = 0;
                        }
                        // Resolve Horizontal (Sides)
                        else if (pOldX + hitBoxWidth <= tileX) { // Left Wall
                            player.x = tileX - hitBoxWidth;
                        }
                        else if (pOldX >= tileX + tileSize) { // Right Wall
                            player.x = tileX + tileSize;
                        }
                    }
                }
                if (map1[row][col] == 5) {
                    // If the bottom of the hitbox is below the top of the pit tile
                    if (player.y + hitBoxHeight > tileY + 1) {
                        canMove = false;
                    } else {
                        canMove = true;
                    }

                    // Death trigger: If hitbox is fully inside/below the pit tile
                    if (player.x < tileX + tileSize && player.x + hitBoxWidth > tileX && player.y < tileY + tileSize && player.y + hitBoxHeight > tileY + tileSize) {      
                        screenActive.died = true;
                        screenActive.level1Active = false;
                    }
                }
                if (map1[row][col] == 6) {
                    if (player.x < tileX + tileSize && 
                        player.x + hitBoxWidth > tileX && 
                        player.y < tileY + tileSize && 
                        player.y + hitBoxHeight > tileY) {
                        
                        onJumpPad = true;
                        //console.log(onJumpPad);
                    }
                    else{
                        onJumpPad = false;
                    }
                }
            }
        }
        
        // --- NEW: DRAW AND UPDATE ALL ENEMIES ---
        // Instead of calling ogre1, ogre2, etc., we loop through the array
        enemies.forEach(npc => {
            // 1. Logic (Turn around at walls/cliffs)
            updateNPC(npc, npc.moveState, map1);

            // 2. Animation & Drawing
            // This function now uses npc.image, npc.frameIndex, etc.
            updateAndDrawEnemy(npc); 

            // 3. Collision
            if (player.x < npc.x + 37 && 
                player.x + hitBoxWidth > npc.x + 13 && 
                player.y < npc.y + tileSize && 
                player.y + hitBoxHeight > npc.y) {
                
                screenActive.died = true;
                screenActive.level1Active = false;
            }
        });

        //draw.fillRect(400, 200, 64, 64);
        draw.drawImage(level1Door, 6016-camera.x, 448-camera.y);
        animate(1);
        
        if(player.x == 6049){
            console.log("Beat level 1");
            draw.fillStyle = "black";
            draw.fillRect(0, 0, canvas.width, canvas.height);

            draw.fillStyle = "green";
            draw.font = ("50px Arial");
            draw.fillText("You beat level 1!", 215, 300);

            screenActive.level1Active = false;
            setTimeout(changeLevel, 3000, 1);
        }
    }
    if(screenActive.level2Active){
        // Erase EVERYTHING before drawing the new frame
        draw.clearRect(0, 0, canvas.width, canvas.height);
        // --- NEW: ONLY SPAWN ONCE ---
        if (!levelLoaded) {
            console.log("did i spawn enemies?");
            spawnEnemies(map2); 
            levelLoaded = true; // This prevents it from running again next frame
        }
        // 1. Reset Ground State (Crucial: Assume in air until proven otherwise)
        onGround = false;

        // 1. Capture Old Position (Before movement)
        let pOldX = player.x;
        let pOldY = player.y;

        // 2. Apply Physics
        velocityY += gravity;
        player.y += velocityY;
        
        // Update Hitbox Y after moving Y
        hitboxY = player.y + offsetY;
        
        // Calculate the total width of the game world (not the screen)
        // So: total world width = number of tiles * tile size
        const worldWidth = map2[0].length * tileSize; // 6144
        //console.log(worldWidth);

        // 3. Move Horizontally
        // Consistency: By checking player.x > 0, you are checking the left edge of the hitbox regardless of which level or sprite you are using.
        // Hitbox Width: On the right side, using player.x + hitBoxWidth ensures that the actual physical box stops at the edge, rather 
        // than the invisible "empty space" around the sprite.
        if (keys.right && player.x + hitBoxWidth < worldWidth && canMove) {        
            player.x += player.speed;
        } else if (keys.left && player.x > 0 && canMove) { // Use player.x directly
            player.x -= player.speed;
        }

        // Update Hitbox X after moving X
        hitboxX = player.x + offsetX;
        
        // Draw tiles
        for(let row = 0; row < map2.length; row++){
            for(let col = 0; col < map2[row].length; col++){
                const tileIndex = map2[row][col]; // Get number from map1
                const tileImage = tiles[tileIndex]; // Get the corresponding image from the images[]
                const screenX = col * tileSize - camera.x;
                const screenY = row * tileSize - camera.y;
                
                if (tileImage) {
                    draw.drawImage(tileImage, screenX, screenY, tileSize, tileSize);
                } else {
                    console.warn(`Tile image missing for index: ${tileIndex}`);
                }
    
                draw.drawImage(tileImage, screenX, screenY, tileSize, tileSize);
            }   
        }
        
        // Check collisions with tiles
        for(let row = 0; row < map2.length; row++){
            for(let col = 0; col < map2[row].length; col++){
                let tileX = col * tileSize;
                let tileY = row * tileSize;
                //  Prevents player from falling through floor while gravity if constantly active
                if(map2[row][col] == 4){
                    // Check overlap using HITBOX coordinates
                    // Standard AABB check: Is the player's HITBOX touching the tile?
                    if (player.x < tileX + tileSize && player.x + hitBoxWidth > tileX && player.y < tileY + tileSize && player.y + hitBoxHeight > tileY) {
                        // Resolve Vertical (Top/Bottom)
                        if (pOldY + hitBoxHeight <= tileY) { // Landed on Top
                            player.y = tileY - hitBoxHeight;
                            velocityY = 0;
                            onGround = true;
                        } 
                        else if (pOldY >= tileY + tileSize) { // Hit Head
                            player.y = tileY + tileSize;
                            velocityY = 0;
                        }
                        // Resolve Horizontal (Sides)
                        else if (pOldX + hitBoxWidth <= tileX) { // Left Wall
                            player.x = tileX - hitBoxWidth;
                        }
                        else if (pOldX >= tileX + tileSize) { // Right Wall
                            player.x = tileX + tileSize;
                        }
                    }
                }
                if (map2[row][col] == 5) {
                    // If the bottom of the hitbox is below the top of the pit tile
                    if (player.y + hitBoxHeight > tileY + 1) {
                        canMove = false;
                    } else {
                        canMove = true;
                    }

                    // Death trigger: If hitbox is fully inside/below the pit tile
                    if (player.x < tileX + tileSize && player.x + hitBoxWidth > tileX && player.y < tileY + tileSize && player.y + hitBoxHeight > tileY + tileSize) {      
                        screenActive.died = true;
                        screenActive.level2Active = false;
                    }
                }
                if (map2[row][col] == 6) {
                    if (player.x < tileX + tileSize && 
                        player.x + hitBoxWidth > tileX && 
                        player.y < tileY + tileSize && 
                        player.y + hitBoxHeight > tileY) {
                        
                        onJumpPad = true;
                        //console.log(onJumpPad);
                    }
                    else{
                        onJumpPad = false;
                    }
                }
            }
        }
       
        // DRAW AND UPDATE ALL ENEMIES ---
        // 1. enemies.forEach(npc => { ... })
        //enemies: This is your array (the "list") of all NPCs.
        //.forEach: This is a loop. It tells JavaScript: "Take every single item inside the enemies list, one by one, and do the following stuff to it."
        //npc: This is a temporary nickname. For the first loop, npc is Ogre 1. For the second loop, npc is mushroom 1. It saves you from having to type specific names.
        enemies.forEach(npc => {
            // 1. Logic (Turn around at walls/cliffs)
            updateNPC(npc, npc.moveState, map2);

            // 2. Animation & Drawing
            // This function now uses npc.image, npc.frameIndex, etc.
            updateAndDrawEnemy(npc); 

            // 3. Collision
            if (player.x < npc.x + 37 && 
                player.x + hitBoxWidth > npc.x + 13 && 
                player.y < npc.y + tileSize && 
                player.y + hitBoxHeight > npc.y) {
                
                screenActive.died = true;
                screenActive.level2Active = false;
            }
        });

        animate(2);
        if(player.x == 6049){
            draw.fillStyle = "black";
            draw.fillRect(0, 0, canvas.width, canvas.height);

            draw.fillStyle = "green";
            draw.font = ("50px Arial");
            draw.fillText("You beat level 1!", 215, 300);

            screenActive.level2Active = false;
            setTimeout(changeLevel, 3000, 2);
        }
    }

    if(screenActive.level3Active){
        draw.fillStyle = "purple";
        draw.fillRect(0,0,canvas.width, canvas.height);

        for(let row = 0; row < level3.length; row++){
            for(let col = 0; col < level3[row].length; col++){
                if(level2[row][col] == 0){
                    draw.fillStyle = "darkblue";
                    draw.fillRect(col*tileSize, row*tileSize, tileSize,tileSize);
                }
                if(level2[row][col] == 1){
                    draw.fillStyle = "yellow";
                    draw.fillRect(col*tileSize, row*tileSize, tileSize,tileSize);
                }
                if(level2[row][col] == 2){
                    draw.fillStyle = "red";
                    draw.fillRect(col*tileSize, row*tileSize, tileSize,tileSize);
                }
                if(level2[row][col] == 3){
                    draw.fillStyle = "orange";
                    draw.fillRect(col*tileSize, row*tileSize, tileSize,tileSize);
                }
                if(level2[row][col] == 4){
                    draw.fillStyle = "violet";
                    draw.fillRect(col*tileSize, row*tileSize, tileSize,tileSize);
                }
                if(level2[row][col] == 5){
                    draw.fillStyle = "lightblue";
                    draw.fillRect(col*tileSize, row*tileSize, tileSize,tileSize);
                }
            }
        }
    }
    if(screenActive.level4Active){

    }
    if(screenActive.level5Active){

    }
    //drawGrid();
    // Redraw frames
    requestAnimationFrame(gameLoop);
    
}
gameLoop();