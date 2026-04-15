import { level1 } from "./levels/level1.js";
import { level2 } from "./levels/level2.js";
import { level3 } from "./levels/level3.js";
import { level4 } from "./levels/level4.js";
import { level5 } from "./levels/level5.js";

import { menuBackground, settingsBackground, level1Door, level1Background, level2Door,
        level3Door, level4Background, level4Door, level5Background, level5Door } from "./loadImages/others.js";
import { lvl1Tiles, level3Tiles, dancingApe, level3Background, level4Tiles, level5Tiles } from "./loadImages/loadTiles.js";

import { crabImage, mushroomImage, bearImage, robotImage} from "./loadImages/loadEnemies.js";

import { playerIdleLvl1, playerWalkLvl1, playerJumpLvl1, playerLvl2, playerIdleLvl3, playerIdleLvl4, playerIdleLvl5, playerJumpLvl3, 
    playerJumpLvl4, playerJumpLvl5, playerWalkLvl3, playerWalkLvl4, playerWalkLvl5 } from "./loadImages/loadPlayer.js";

    
// Using spread operator [...] creates a shallow copy of the arrays
let map1 = level1.map(row => [...row]), map2 = level2.map(row => [...row]), map3 = level3.map(row => [...row]);
let map4 = level4.map(row => [...row]), map5 = level5.map(row => [...row]);

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

// Set up to try and make my own tilemap editor
let editorMode = false; // Toggle this to 'true' when you want to build
let selectedTile = 3;  // The ID of the car tile you want to "paint"

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
    if (e.key === "p") { // Press 'P' to print
        let output = "export const level5 = [\n";
        map5.forEach(row => {
            output += "  [" + row.join(", ") + "],\n";
        });
        output += "];";
        
        console.log(output);
        alert("Level saved to Console! Press F12 to copy it.");
    }
    if(e.key == "0"){ // Background transparent
        selectedTile = 0;
        console.log(selectedTile);
    }else if(e.key == "1"){ // Tiles to walk on
        selectedTile = 1;
        console.log(selectedTile);
    }else if(e.key == "2"){ // death fall 
        selectedTile = 2;
        console.log(selectedTile);
    }else if(e.key == "3"){ // jumpad
        selectedTile = 3;
        console.log(selectedTile);
    }else if(e.key == "4"){ // random dancing monster
        selectedTile = 4;
        console.log(selectedTile);
    }
    else if(e.key == "5"){ // 
        selectedTile = 5;
        console.log(selectedTile);
    }
    else if(e.key == "6"){ // monster 1
        selectedTile = 6;
        console.log(selectedTile);
    }
    else if(e.key == "7"){ // monster 2
        selectedTile = 7;
        console.log(selectedTile);
    }
    else if(e.key == "8"){ // monster 3
        selectedTile = 8;
        console.log(selectedTile);
    }
    else if(e.key == "9"){ // monster 4
        selectedTile = 9;
        console.log(selectedTile);
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
    if(!editorMode){
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
                level2Music.currentTime = 0; // Resets the music to the beginning
                level3Music.pause(); // Pause it so it doesnt keep playing on the menu screen
                level3Music.currentTime = 0; // Resets the music to the beginning
                level4Music.pause(); // Pause it so it doesnt keep playing on the menu screen
                level4Music.currentTime = 0; // Resets the music to the beginning
                level5Music.pause(); // Pause it so it doesnt keep playing on the menu screen
                level5Music.currentTime = 0; // Resets the music to the beginning

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
    }else if(editorMode){
        // --- EDITOR LOGIC ---
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Convert pixels to Grid Coordinates
        // (We add camera.x so it knows where you are in the long level)
        let col = Math.floor((mouseX + camera.x) / tileSize); 
        let row = Math.floor(mouseY / tileSize);

        // This updates the array in the browser's memory
        if (map5[row] && col >= 0 && col < map5[row].length) {
            map5[row][col] = selectedTile;
            console.log(`Placed tile ${selectedTile} at row: ${row}, col: ${col}`);
        }
    }
});

// It checks if the page is hidden and pauses all active music
function pauseAllAudio() {
    // Mute then Pause
    [level1Music, level2Music, level3Music, level4Music, level5Music].forEach(track => {
        track.volume = 0; 
        track.pause();
    });
}

function resumeCurrentAudio() {
    // Determine which track SHOULD be playing
    let activeTrack = null;
    if (screenActive.level1Active) activeTrack = level1Music;
    else if (screenActive.level2Active) activeTrack = level2Music;
    else if (screenActive.level3Active) activeTrack = level3Music;
    else if (screenActive.level4Active) activeTrack = level4Music;
    else if (screenActive.level5Active) activeTrack = level5Music;

    if (activeTrack) {
        activeTrack.volume = volume; // Restore the global volume variable
        activeTrack.play().catch(err => console.log("Resume failed:", err));
    }
}

// 1. Handles tab switching and home screen on most phones
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        pauseAllAudio();
    } else {
        resumeCurrentAudio();
    }
});

// 2. Backup: Handles clicking out of the window or pulling down the notification bar
window.addEventListener("blur", pauseAllAudio);
window.addEventListener("focus", resumeCurrentAudio);

function updateCamera(){
    const offsetX = 200;
    const offsetY = 200;

    camera.x = player.x - offsetX;
    camera.y = player.y - offsetY;

    let activeMap; // Create the empty variable first

    if (screenActive.level1Active === true) {
        activeMap = map1;
    } 
    else if (screenActive.level2Active === true) {
        activeMap = map2;
    } 
    else if (screenActive.level3Active === true) {
        activeMap = map3;
    } 
    else if (screenActive.level4Active === true) {
        activeMap = map4;
    } 
    else if (screenActive.level5Active === true) {
        activeMap = map5;
    } 
    else {
        activeMap = map1; // This is your "Safety Fallback"
    }
    
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
    map3 = level3.map(row => [...row]);
    map4 = level3.map(row => [...row]);
    map5 = level3.map(row => [...row]);

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
        level5Music.pause();
        screenActive.level5Active = false;
        beatTheGame();
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
    if (floorTile !== 1 || wallTile === 1) {
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
    6: 'crab',
    7: 'mushroom',
    8: 'bear',
    9: 'robot'
};

// 2. Update your images dictionary
const enemySprites = {
    'crab': crabImage,    // Your cyclops sprite sheet
    'mushroom': mushroomImage,   // Your mushroom sprite sheet
    'bear': bearImage,
    'robot': robotImage
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

// Universal for all the sprites
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
                  
                    if (goingRight) {
                        draw.drawImage(playerIdleLvl1, sxidle, 0, frameWidth, frameHeight, drawX, drawY, renderedWidth, renderedHeight);
                    } else {
                        draw.save();
                        draw.translate(drawX + renderedWidth, drawY);
                        draw.scale(-1, 1);
                        draw.drawImage(playerIdleLvl1, sxidle, 0, frameWidth, frameHeight, 0, 0, renderedWidth, renderedHeight);
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
                        draw.drawImage(playerWalkLvl1, walkFrame * frameWidth, 0, frameWidth, frameHeight, drawX, drawY, renderedWidth, renderedHeight);
                    }else if(!goingRight){
                        // FLIPPING LOGIC
                        draw.save();
                        // Move the "pen" to the right side of where the sprite WILL be
                        draw.translate(drawX + renderedWidth, drawY);
                        // Flip the horizontal axis
                        draw.scale(-1, 1);
                        // Draw at 0,0 because we translated to the destination
                        draw.drawImage(playerWalkLvl1, sxwalk, 0, frameWidth, frameHeight, 0, 0, renderedWidth, renderedHeight);
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
                    
                    if (goingRight) {
                        draw.drawImage(playerJumpLvl1, sxjump, 0, frameWidth, frameHeight, drawX, drawY, renderedWidth, renderedHeight);
                    } else {
                        draw.save();
                        draw.translate(drawX + renderedWidth, drawY);
                        draw.scale(-1, 1);
                        draw.drawImage(playerJumpLvl1, sxjump, 0, frameWidth, frameHeight, 0, 0, renderedWidth, renderedHeight);
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
                        draw.drawImage(playerLvl2, sxidle, 128, dogWidth, dogHeight, drawX, drawY, dogWidthInc, dogHeightInc);
                    } else {
                        draw.save();
                        // Move to the right edge of the sprite's destination
                        // The Translation: draw.translate(drawX + width, drawY) sets the top-left corner 
                        // of your "new" coordinate system to where the player's right side should be.
                        draw.translate(drawX + dogWidthInc, drawY);
                        // The Scale: draw.scale(-1, 1) flips the world horizontally from that point
                        draw.scale(-1, 1);
                        // Draw at 0, 0 because the "paper" was moved to drawX, drawY
                        draw.drawImage(playerLvl2, sxidle, 128, dogWidth, dogHeight, 
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
                        draw.drawImage(playerLvl2, sxwalk, 250, 32, 32, 
                                        drawX, drawY, dogWidthInc, dogHeightInc);
                    } else {
                        draw.save();
                        // Use 88 here because that is the width you are drawing
                        draw.translate(drawX + dogWidthInc, drawY); 
                        draw.scale(-1, 1);
                        // Draw at 0,0
                        draw.drawImage(playerLvl2, sxwalk, 250, 32, 32, 
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
                        draw.drawImage(playerLvl2, sxjump, 250, 32, 32, 
                                        drawX, drawY, dogWidthInc, dogHeightInc);
                    } else {
                        draw.save();
                        draw.translate(drawX + dogWidthInc, drawY);
                        draw.scale(-1, 1);
                        draw.drawImage(playerLvl2, sxjump, 250, 32, 32, 0, 0, dogWidthInc, dogHeightInc);
                        draw.restore();
                    }
                    break;
            }
            break;
        case 3:
            drawX = player.x - camera.x;
            drawY = player.y - camera.y;
            const santaWidth = 934, santaHeight = 641;
            const santaAnimationSpeed = 10;
            const santaWidthInc = 112, santaHeightInc = 112;
            const totalIdleSantaFrames = 16;
            const totalWalkSantaFrames = 13;
            const totalJumpSantaFrames = 16;
            switch(state){
                case "idle":
                    const santaSourceXIdle = idleFrame * santaWidth;
                    idleTimer++;

                    if (idleTimer >= santaAnimationSpeed) {
                        idleFrame = (idleFrame + 1) % totalIdleSantaFrames;
                        idleTimer = 0;
                    } 
                    
                    if (goingRight) {
                        // Draw normally at drawX, drawY
                        draw.drawImage(playerIdleLvl3, santaSourceXIdle, 0, santaWidth, santaHeight, drawX, drawY-28, santaWidthInc, santaHeightInc);
                    } else {
                        draw.save();
                        // Move to the right edge of the sprite's destination
                        // The Translation: draw.translate(drawX + width, drawY) sets the top-left corner 
                        // of your "new" coordinate system to where the player's right side should be.
                        draw.translate(drawX + santaWidthInc, drawY);
                        // The Scale: draw.scale(-1, 1) flips the world horizontally from that point
                        draw.scale(-1, 1);
                        // Draw at 0, 0 because the "paper" was moved to drawX, drawY
                        draw.drawImage(playerIdleLvl3, santaSourceXIdle, 0, santaWidth, santaHeight, 0, 0-28, santaWidthInc, santaHeightInc);
                        draw.restore();
                    }
                    break;   
                case "walk":    
                    const santaSourceXWalk = walkFrame * santaWidth;
                    walkTimer++;

                    if (walkTimer >= santaAnimationSpeed) {
                        walkFrame = (walkFrame + 1) % totalWalkSantaFrames;
                        walkTimer = 0;
                    }
                    
                    if (goingRight) {
                        // Use drawX and drawY so the dog follows the player hitbox
                        draw.drawImage(playerWalkLvl3, santaSourceXWalk, 0, santaWidth, santaHeight, drawX, drawY-28, santaWidthInc, santaHeightInc);
                    } else {
                        draw.save();
                        // Use 88 here because that is the width you are drawing
                        draw.translate(drawX + santaWidthInc, drawY); 
                        draw.scale(-1, 1);
                        // Draw at 0,0
                        draw.drawImage(playerWalkLvl3, santaSourceXWalk, 0, santaWidth, santaHeight, 0, 0-28, santaWidthInc, santaHeightInc);
                        draw.restore();
                    }
                    break;
                case "jump":
                    const santaSourceXJump = jumpFrame * santaWidth;
                    jumpTimer++;
                    if (jumpTimer >= santaAnimationSpeed) {
                        jumpFrame = (jumpFrame + 1) % totalJumpSantaFrames;
                        jumpTimer = 0;
                    }
                    if (goingRight) {
                        draw.drawImage(playerJumpLvl3, santaSourceXJump, 0, santaWidth, santaHeight, drawX, drawY-28, santaWidthInc, santaHeightInc);
                    } else {
                        draw.save();
                        draw.translate(drawX + santaWidthInc, drawY);
                        draw.scale(-1, 1);
                        draw.drawImage(playerJumpLvl3, santaSourceXJump, 0, santaWidth, santaHeight, 0, 0-28, santaWidthInc, santaHeightInc);
                        draw.restore();
                    }
                    break;
            }
            break;
        case 4:
            drawX = player.x - camera.x;
            drawY = player.y - camera.y-24;
            const dinoWidth = 680, dinoHeight = 472;
            const dinoAnimationSpeed = 10;
            const dinoWidthInc = 100, dinoHeightInc = 100;
            const totalIdleDinoFrames = 10;
            const totalWalkDinoFrames = 10;
            const totalJumpDinoFrames = 12;
            switch(state){
                case "idle":
                    const dinoSourceXIdle = idleFrame * dinoWidth;
                    idleTimer++;

                    if (idleTimer >= dinoAnimationSpeed) {
                        idleFrame = (idleFrame + 1) % totalIdleDinoFrames;
                        idleTimer = 0;
                    } 
                    
                    if (goingRight) {
                        // Draw normally at drawX, drawY
                        draw.drawImage(playerIdleLvl4, dinoSourceXIdle, 0, dinoWidth, dinoHeight, drawX, drawY, dinoWidthInc, dinoHeightInc);
                    } else {
                        draw.save();
                        // Move to the right edge of the sprite's destination
                        // The Translation: draw.translate(drawX + width, drawY) sets the top-left corner 
                        // of your "new" coordinate system to where the player's right side should be.
                        draw.translate(drawX + dinoWidthInc, drawY);
                        // The Scale: draw.scale(-1, 1) flips the world horizontally from that point
                        draw.scale(-1, 1);
                        // Draw at 0, 0 because the "paper" was moved to drawX, drawY
                        draw.drawImage(playerIdleLvl4, dinoSourceXIdle, 0, dinoWidth, dinoHeight, 0, 0, dinoWidthInc, dinoHeightInc);
                        draw.restore();
                    }
                    break;   
                case "walk":    
                    const dinoSourceXWalk = walkFrame * dinoWidth;
                    walkTimer++;

                    if (walkTimer >= dinoAnimationSpeed) {
                        walkFrame = (walkFrame + 1) % totalWalkDinoFrames;
                        walkTimer = 0;
                    }
                    
                    if (goingRight) {
                        // Use drawX and drawY so the skin follows the player hitbox
                        draw.drawImage(playerWalkLvl4, dinoSourceXWalk, 0, dinoWidth, dinoHeight, drawX, drawY, dinoWidthInc, dinoHeightInc);
                    } else {
                        draw.save();
                        
                        draw.translate(drawX + dinoWidthInc, drawY); 
                        draw.scale(-1, 1);
                        // Draw at 0,0
                        draw.drawImage(playerWalkLvl4, dinoSourceXWalk, 0, dinoWidth, dinoHeight, 0, 0, dinoWidthInc, dinoHeightInc);
                        draw.restore();
                    }
                    break;
                case "jump":
                    const dinoSourceXJump = jumpFrame * dinoWidth;
                    jumpTimer++;
                    if (jumpTimer >= dinoAnimationSpeed) {
                        jumpFrame = (jumpFrame + 1) % totalJumpDinoFrames;
                        jumpTimer = 0;
                    }
                    if (goingRight) {
                        draw.drawImage(playerJumpLvl4, dinoSourceXJump, 0, dinoWidth, dinoHeight, drawX, drawY, dinoWidthInc, dinoHeightInc);
                    } else {
                        draw.save();
                        draw.translate(drawX + dinoWidthInc, drawY);
                        draw.scale(-1, 1);
                        draw.drawImage(playerJumpLvl4, dinoSourceXJump, 0, dinoWidth, dinoHeight, 0, 0, dinoWidthInc, dinoHeightInc);
                        draw.restore();
                    }
                    break;
            }
            break;
        case 5:
            drawX = player.x - camera.x;
            drawY = player.y - camera.y;
            const ninjaBoyIdleWidth = 232, ninjaBoyIdleHeight = 439;
            const ninjaBoyWalkWidth = 3630/10, ninjaBoyWalkHeight= 458;
            const ninjaBoyJumpWidth = 3630/10, ninjaBoyJumpHeight= 483;
            const ninjaBoyAnimationSpeed = 40;
            const ninjaBoyWidthInc = 64, ninjaBoyHeightInc = 64;
            const totalIdleninjaBoyFrames = 10;
            const totalWalkninjaBoyFrames = 10;
            const totalJumpninjaBoyFrames = 10;
            switch(state){
                case "idle":       
                    const ninjaBoySourceXIdle = idleFrame * ninjaBoyIdleWidth;
                    idleTimer++;

                    if (idleTimer >= ninjaBoyAnimationSpeed) {
                        idleFrame = (idleFrame + 1) % totalIdleninjaBoyFrames;
                        idleTimer = 0;
                    } 
                    
                    if (goingRight) {
                        // Draw normally at drawX, drawY
                        draw.drawImage(playerIdleLvl5, ninjaBoySourceXIdle, 0, ninjaBoyIdleWidth, ninjaBoyIdleHeight, drawX, drawY, ninjaBoyWidthInc, ninjaBoyHeightInc);
                    } else {
                        draw.save();
                        // Move to the right edge of the sprite's destination
                        // The Translation: draw.translate(drawX + width, drawY) sets the top-left corner 
                        // of your "new" coordinate system to where the player's right side should be.
                        draw.translate(drawX + ninjaBoyWidthInc, drawY);
                        // The Scale: draw.scale(-1, 1) flips the world horizontally from that point
                        draw.scale(-1, 1);
                        // Draw at 0, 0 because the "paper" was moved to drawX, drawY
                        draw.drawImage(playerIdleLvl5, ninjaBoySourceXIdle, 0, ninjaBoyIdleWidth, ninjaBoyIdleHeight, 0, 0, ninjaBoyWidthInc, ninjaBoyHeightInc);
                        draw.restore();
                    }
                    break;   
                case "walk":    
                    const ninjaBoySourceXWalk = walkFrame * ninjaBoyWalkWidth;
                    walkTimer++;

                    if (walkTimer >= ninjaBoyAnimationSpeed) {
                        walkFrame = (walkFrame + 1) % totalWalkninjaBoyFrames;
                        walkTimer = 0;
                    }
                    
                    if (goingRight) {
                        // Use drawX and drawY so the dog follows the player hitbox
                        draw.drawImage(playerWalkLvl5, ninjaBoySourceXWalk, 0, ninjaBoyWalkWidth, ninjaBoyWalkHeight, drawX, drawY, ninjaBoyWidthInc, ninjaBoyHeightInc);
                    } else {
                        draw.save();
                        // Use 88 here because that is the width you are drawing
                        draw.translate(drawX + ninjaBoyWidthInc, drawY); 
                        draw.scale(-1, 1);
                        // Draw at 0,0
                        draw.drawImage(playerWalkLvl5, ninjaBoySourceXWalk, 0, ninjaBoyWalkWidth, ninjaBoyWalkHeight, 0, 0, ninjaBoyWidthInc, ninjaBoyHeightInc);
                        draw.restore();
                    }
                    break;
                case "jump":
                    const ninjaBoySourceXJump = jumpFrame * ninjaBoyJumpWidth;
                    jumpTimer++;
                    if (jumpTimer >= ninjaBoyAnimationSpeed) {
                        jumpFrame = (jumpFrame + 1) % totalJumpninjaBoyFrames;
                        jumpTimer = 0;
                    }
                    if (goingRight) {
                        draw.drawImage(playerJumpLvl5, ninjaBoySourceXJump, 0, ninjaBoyJumpWidth, ninjaBoyJumpHeight, drawX, drawY, ninjaBoyWidthInc, ninjaBoyHeightInc);
                    } else {
                        draw.save();
                        draw.translate(drawX + ninjaBoyWidthInc, drawY);
                        draw.scale(-1, 1);
                        draw.drawImage(playerJumpLvl5, ninjaBoySourceXJump, 0, ninjaBoyJumpWidth, ninjaBoyJumpHeight, 0, 0, ninjaBoyWidthInc, ninjaBoyHeightInc);
                        draw.restore();
                    }
                    break;    
            }
            break;
    }
}

function updateAndDrawEnemy(npc) {
    // 1. Animation Logic (Stay the same)
    npc.tickCount++;
    if (npc.tickCount > npc.ticksPerFrame) {
        npc.tickCount = 0;
        npc.frameIndex++;
        if (npc.frameIndex >= 4) { npc.frameIndex = 0; }
    }

    let sw = npc.image.width / 4; 
    let sh = npc.image.height;
    let sx = npc.frameIndex * sw;

    draw.save(); 

    // 2. If moving LEFT, flip the image (because the image faces right)
    if (npc.moveState.movingLeft) { 
        // Move to the position, then flip
        draw.translate(npc.x - camera.x + tileSize, 0); 
        draw.scale(-1, 1); 
        
        // Draw at 0 (the flipped coordinate)
        draw.drawImage(npc.image, sx, 0, sw, sh, 0, npc.y - camera.y, tileSize, tileSize);
    } 
    // 3. If moving RIGHT (or standing still), draw normally
    else {
        draw.drawImage(npc.image, sx, 0, sw, sh, npc.x - camera.x, npc.y - camera.y, tileSize, tileSize);
    }

    draw.restore(); 
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
    map3 = level3.map(row => [...row]);
    map4 = level2.map(row => [...row]);
    map5 = level3.map(row => [...row]);

    // Clear the existing enemies so they dont double up
    enemies = [];
    level1Music.play().catch(err => console.log(err));;
}
let frameCounter = 0;
let apeFrameSpeed = 30;
let apeTotalFrames = 16;
function dancingApeSprite(){
    let currentFrame = Math.floor(frameCounter / apeFrameSpeed) % apeTotalFrames;
    let frameX = currentFrame % 4; // 0,1,2,3
    let frameY = Math.floor(currentFrame / 4); // changes every 4 frames

    const apeWidth = 258, apeHeight = 256;

    // 3. Draw to screen 
    draw.drawImage( dancingApe, frameX * apeWidth, frameY * apeHeight, apeWidth, apeHeight, 2976 - camera.x, 466 - camera.y, tileSize*2, tileSize*2 );
}

function gameLoop(timestamp){  
    frameCounter++;
    if (document.hidden) {
        requestAnimationFrame(gameLoop);
        return; // Stop the rest of the code from running
    }
    
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
        onJumpPad = false;
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
    else if(screenActive.settings){
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
    
    else if(screenActive.died){
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
    else if(screenActive.level1Active){
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
        
        draw.drawImage(level1Background, 0, 0, 832, 640);
        // Draw tiles
        for(let row = 0; row < map1.length; row++){
            for(let col = 0; col < map1[row].length; col++){
                const tileIndex = map1[row][col]; // Get number from map1
                const tileImage = lvl1Tiles[tileIndex]; // Get the corresponding image from the images[]
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
                if(map1[row][col] == 1){
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
                if (map1[row][col] == 2) {
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
                if (map1[row][col] == 3) {
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
            if (player.x < npc.x + 37 && player.x + hitBoxWidth > npc.x + 13 && 
                player.y < npc.y + tileSize && player.y + hitBoxHeight > npc.y) {
                
                screenActive.died = true;
                screenActive.level1Active = false;
            }
        });

        //draw.fillRect(400, 200, 64, 64);
        draw.drawImage(level1Door, 6016-camera.x, 478-camera.y, 128, 128);
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
    else if(screenActive.level2Active){
        draw.clearRect(0, 0, canvas.width, canvas.height);
        if (!levelLoaded) {
            console.log("did i spawn enemies?");
            spawnEnemies(map2); 
            levelLoaded = true; 
        }
        onGround = false;
        let pOldX = player.x;
        let pOldY = player.y;
        velocityY += gravity;
        player.y += velocityY;
        hitboxY = player.y + offsetY;
    
        const worldWidth = map2[0].length * tileSize; // 6144
        if (keys.right && player.x + hitBoxWidth < worldWidth && canMove) {        
            player.x += player.speed;
        } else if (keys.left && player.x > 0 && canMove) { // Use player.x directly
            player.x -= player.speed;
        }
        hitboxX = player.x + offsetX;

        draw.drawImage(level1Background, 0, 0, 832, 640);
        // Draw tiles
        for(let row = 0; row < map2.length; row++){
            for(let col = 0; col < map2[row].length; col++){
                const tileIndex = map2[row][col]; // Get number from map1
                const tileImage = lvl1Tiles[tileIndex]; // Get the corresponding image from the images[]
                const screenX = col * tileSize - camera.x;
                const screenY = row * tileSize - camera.y;
                
                if (tileImage) {
                    draw.drawImage(tileImage, screenX, screenY, tileSize, tileSize);
                } else {
                    console.warn(`Tile image missing for index: ${tileIndex}`);
                }
            }   
        }
        
        // Check collisions with tiles
        for(let row = 0; row < map2.length; row++){
            for(let col = 0; col < map2[row].length; col++){
                let tileX = col * tileSize;
                let tileY = row * tileSize;
                //  Prevents player from falling through floor while gravity if constantly active
                if(map2[row][col] == 1){
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
                if (map2[row][col] == 2) {
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
                if (map2[row][col] == 3) {
                    if (player.x < tileX + tileSize && 
                        player.x + hitBoxWidth > tileX && 
                        player.y < tileY + tileSize && 
                        player.y + hitBoxHeight > tileY) {
                        
                        onJumpPad = true;
                        //console.log(onJumpPad);
                    }
                    
                }
            }
        }
     
        enemies.forEach(npc => {
            updateNPC(npc, npc.moveState, map2);
            updateAndDrawEnemy(npc); 
            if (player.x < npc.x + 37 && player.x + hitBoxWidth > npc.x + 13 && 
                player.y < npc.y + tileSize && player.y + hitBoxHeight > npc.y) {
                
                screenActive.died = true;
                screenActive.level2Active = false;
            }
        });
        draw.drawImage(level2Door, 6016-camera.x, 468-camera.y, 128, 128);

        animate(2);
        if(player.x >= worldWidth - 128){
            draw.fillStyle = "black";
            draw.fillRect(0, 0, canvas.width, canvas.height);

            draw.fillStyle = "green";
            draw.font = ("50px Arial");
            draw.fillText("You beat level 2!", 215, 300);

            screenActive.level2Active = false;
            setTimeout(changeLevel, 3000, 2);
        }
    }
    else if(screenActive.level3Active){ 
        draw.clearRect(0, 0, canvas.width, canvas.height);
        if (!levelLoaded) {
            console.log("did i spawn enemies?");
            spawnEnemies(map3); 
            levelLoaded = true;
        }
        onGround = false;

        let pOldX = player.x;
        let pOldY = player.y;
        velocityY += gravity;
        player.y += velocityY;
        hitboxY = player.y + offsetY;

        const worldWidth = map3[0].length * tileSize; // 6144
        if (keys.right && player.x + hitBoxWidth < worldWidth && canMove) {        
            player.x += player.speed;
        } else if (keys.left && player.x > 0 && canMove) {
            player.x -= player.speed;
        }
        hitboxX = player.x + offsetX;
        // shift + alt + A multiline comment and uncomment
        // used for tile editor
        /* for(let row = 0; row < level3.length; row++){
            for(let col = 0; col < level3[row].length; col++){
                // Calculate X position relative to the camera
                let tileX = col * tileSize - camera.x;
                let tileY = row * tileSize;

                // USE LEVEL 3 DATA HERE
                let tileID = level3[row][col]; 
                // Only draw if the tile is actually visible on the canvas
                if (tileX > -tileSize && tileX < canvas.width) {
                    if(tileID == 0){ // background
                        draw.fillStyle = "darkblue";
                        draw.fillRect(tileX, tileY, tileSize, tileSize);
                    }
                    else if(tileID == 4){ // cars to walk on
                        draw.fillStyle = "yellow";
                        draw.fillRect(tileX, tileY, tileSize, tileSize);
                    }
                    else if(tileID == 10){
                        draw.fillStyle = "orange"; // monster 1
                        draw.fillRect(tileX, tileY, tileSize, tileSize);
                    }
                    else if(tileID == 11){
                        draw.fillStyle = "green"; // monster 2
                        draw.fillRect(tileX, tileY, tileSize, tileSize);
                    }
                    else if(tileID == 5){
                        draw.fillStyle = "red"; // death fall
                        draw.fillRect(tileX, tileY, tileSize, tileSize);
                    }
                    else if(tileID == 6){
                        draw.fillStyle = "magenta"; // jumpad
                        draw.fillRect(tileX, tileY, tileSize, tileSize);
                    }
                    else if(tileID == 7){
                        draw.fillStyle = "darkred"; // random monster
                        draw.fillRect(tileX, tileY, tileSize, tileSize);
                    }
                }
            }
        } */
        draw.drawImage(level3Background, 0, 0, canvas.width, canvas.height);
        for(let row = 0; row < map3.length; row++){
            for(let col = 0; col < map3[row].length; col++){
                const tileIndex = map3[row][col]; // Get number from map1
                const tileImage = level3Tiles[tileIndex]; // Get the corresponding image from the images[]
                const screenX = col * tileSize - camera.x;
                const screenY = row * tileSize - camera.y;
                
                if (tileImage) {
                    draw.drawImage(tileImage, screenX, screenY, tileSize, tileSize);
                } else {
                    console.warn(`Tile image missing for index: ${tileIndex}`);
                }
            }   
        }
        
        // Check collisions with tiles
        for(let row = 0; row < map3.length; row++){
            for(let col = 0; col < map3[row].length; col++){
                let tileX = col * tileSize;
                let tileY = row * tileSize;
                //  Prevents player from falling through floor while gravity if constantly active
                if(map3[row][col] == 1){
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
                if (map3[row][col] == 2) {
                    // If the bottom of the hitbox is below the top of the pit tile
                    if (player.y + hitBoxHeight > tileY + 1) {
                        canMove = false;
                    } else {
                        canMove = true;
                    }

                    // Death trigger: If hitbox is fully inside/below the pit tile
                    if (player.x < tileX + tileSize && player.x + hitBoxWidth > tileX && player.y < tileY + tileSize && player.y + hitBoxHeight > tileY + tileSize) {      
                        screenActive.died = true;
                        screenActive.level3Active = false;
                    }
                }
                if (map3[row][col] == 3) {
                    if (player.x < tileX + tileSize && 
                        player.x + hitBoxWidth > tileX && 
                        player.y < tileY + tileSize && 
                        player.y + hitBoxHeight > tileY) {
                        
                        onJumpPad = true;
                        //console.log(onJumpPad);
                    }
                    
                }
            }
        }

        enemies.forEach(npc => {
            updateNPC(npc, npc.moveState, map3);
            updateAndDrawEnemy(npc); 
            if (player.x < npc.x + 37 && player.x + hitBoxWidth > npc.x + 13 && 
                player.y < npc.y + tileSize && player.y + hitBoxHeight > npc.y) {
                
                screenActive.died = true;
                screenActive.level3Active = false;
            }
        });
        draw.drawImage(level3Door, 6016-camera.x, 468-camera.y, 128, 128);
        dancingApeSprite();
        animate(3);
        
        if(player.x >= worldWidth-176){
            console.log("Beat level 3");
            draw.fillStyle = "black";
            draw.fillRect(0, 0, canvas.width, canvas.height);

            draw.fillStyle = "green";
            draw.font = ("50px Arial");
            draw.fillText("You beat level 3!", 215, 300);

            screenActive.level3Active = false;
            setTimeout(changeLevel, 3000, 3);
        }
    }
    else if(screenActive.level4Active){
        draw.clearRect(0, 0, canvas.width, canvas.height);
        if (!levelLoaded) {
            console.log("did i spawn enemies?");
            spawnEnemies(map4); 
            levelLoaded = true;
        }
        onGround = false;

        let pOldX = player.x;
        let pOldY = player.y;
        velocityY += gravity;
        player.y += velocityY;
        hitboxY = player.y + offsetY;

        const worldWidth = map4[0].length * tileSize; // 6144
        if (keys.right && player.x + hitBoxWidth < worldWidth && canMove) {        
            player.x += player.speed;
        } else if (keys.left && player.x > 0 && canMove) {
            player.x -= player.speed;
        }
        hitboxX = player.x + offsetX; 
 
        draw.drawImage(level4Background, 0, 0, 832, 640);
        for(let row = 0; row < map4.length; row++){
            for(let col = 0; col < map4[row].length; col++){
                const tileIndex = map4[row][col]; // Get number from map1
                const tileImage = level4Tiles[tileIndex]; // Get the corresponding image from the images[]
                const screenX = col * tileSize - camera.x;
                const screenY = row * tileSize - camera.y;
                
                if (tileImage) {
                    draw.drawImage(tileImage, screenX, screenY, tileSize, tileSize);
                } else {
                    console.warn(`Tile image missing for index: ${tileIndex}`);
                }
            }   
        }
        
        // Check collisions with tiles
        for(let row = 0; row < map4.length; row++){
            for(let col = 0; col < map4[row].length; col++){
                let tileX = col * tileSize;
                let tileY = row * tileSize;
                //  Prevents player from falling through floor while gravity if constantly active
                if(map4[row][col] == 1){
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
                if (map4[row][col] == 2) {
                    // If the bottom of the hitbox is below the top of the pit tile
                    if (player.y + hitBoxHeight > tileY + 1) {
                        canMove = false;
                    } else {
                        canMove = true;
                    }

                    // Death trigger: If hitbox is fully inside/below the pit tile
                    if (player.x < tileX + tileSize && player.x + hitBoxWidth > tileX && player.y < tileY + tileSize && player.y + hitBoxHeight > tileY + tileSize) {      
                        screenActive.died = true;
                        screenActive.level3Active = false;
                    }
                }
                if (map4[row][col] == 3) {
                    if (player.x < tileX + tileSize && 
                        player.x + hitBoxWidth > tileX && 
                        player.y < tileY + tileSize && 
                        player.y + hitBoxHeight > tileY) {
                        
                        onJumpPad = true;
                        //console.log(onJumpPad);
                    }
                    
                }
            }
        }
        
        enemies.forEach(npc => {
            updateNPC(npc, npc.moveState, map4);
            updateAndDrawEnemy(npc); 
            if (player.x < npc.x + 37 && player.x + hitBoxWidth > npc.x + 13 && 
                player.y < npc.y + tileSize && player.y + hitBoxHeight > npc.y) {
                
                screenActive.died = true;
                screenActive.level4Active = false;
            }
        });
        
        draw.drawImage(level4Door, 6016-camera.x, 468-camera.y, 128, 128);
        animate(4);
        
        if(player.x >= worldWidth-176){
            console.log("Beat level 4");
            draw.fillStyle = "black";
            draw.fillRect(0, 0, canvas.width, canvas.height);

            draw.fillStyle = "green";
            draw.font = ("50px Arial");
            draw.fillText("You beat level 4!", 215, 300);

            screenActive.level4Active = false;
            setTimeout(changeLevel, 3000, 4);
        }
      
    }
    else if(screenActive.level5Active){
        draw.clearRect(0, 0, canvas.width, canvas.height);
        if (!levelLoaded) {
            console.log("did i spawn enemies?");
            spawnEnemies(map5); 
            levelLoaded = true;
        }
        onGround = false;

        let pOldX = player.x;
        let pOldY = player.y;
        velocityY += gravity;
        player.y += velocityY;
        hitboxY = player.y + offsetY;

        const worldWidth = map5[0].length * tileSize; // 6144
        if (keys.right && player.x + hitBoxWidth < worldWidth && canMove) {        
            player.x += player.speed;
        } else if (keys.left && player.x > 0 && canMove) {
            player.x -= player.speed;
        }
        hitboxX = player.x + offsetX; 
 
        draw.drawImage(level5Background, 0, 0, 832, 640);
        for(let row = 0; row < map5.length; row++){
            for(let col = 0; col < map5[row].length; col++){
                const tileIndex = map5[row][col]; // Get number from map1
                const tileImage = level5Tiles[tileIndex]; // Get the corresponding image from the images[]
                const screenX = col * tileSize - camera.x;
                const screenY = row * tileSize - camera.y;
                
                if (tileImage) {
                    draw.drawImage(tileImage, screenX, screenY, tileSize, tileSize);
                } else {
                    console.warn(`Tile image missing for index: ${tileIndex}`);
                }
            }   
        }
        
        // Check collisions with tiles
        for(let row = 0; row < map5.length; row++){
            for(let col = 0; col < map5[row].length; col++){
                let tileX = col * tileSize;
                let tileY = row * tileSize;
                //  Prevents player from falling through floor while gravity if constantly active
                if(map5[row][col] == 1){
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
                if (map5[row][col] == 2) {
                    // If the bottom of the hitbox is below the top of the pit tile
                    if (player.y + hitBoxHeight > tileY + 1) {
                        canMove = false;
                    } else {
                        canMove = true;
                    }

                    // Death trigger: If hitbox is fully inside/below the pit tile
                    if (player.x < tileX + tileSize && player.x + hitBoxWidth > tileX && player.y < tileY + tileSize && player.y + hitBoxHeight > tileY + tileSize) {      
                        screenActive.died = true;
                        screenActive.level3Active = false;
                    }
                }
                if (map5[row][col] == 3) {
                    if (player.x < tileX + tileSize && 
                        player.x + hitBoxWidth > tileX && 
                        player.y < tileY + tileSize && 
                        player.y + hitBoxHeight > tileY) {
                        
                        onJumpPad = true;
                        //console.log(onJumpPad);
                    }
                    
                }
            }
        }
        
        enemies.forEach(npc => {
            updateNPC(npc, npc.moveState, map5);
            updateAndDrawEnemy(npc); 
            if (player.x < npc.x + 37 && player.x + hitBoxWidth > npc.x + 13 && 
                player.y < npc.y + tileSize && player.y + hitBoxHeight > npc.y) {
                
                screenActive.died = true;
                screenActive.level5Active = false;
            }
        });
        
        draw.drawImage(level5Door, 6016-camera.x, 468-camera.y, 128, 128);
       
        animate(5);
        
        if(player.x >= worldWidth-176){
            console.log("Beat level 5");
            draw.fillStyle = "black";
            draw.fillRect(0, 0, canvas.width, canvas.height);

            draw.fillStyle = "green";
            draw.font = ("50px Arial");
            draw.fillText("You beat level 5!", 215, 300);

            screenActive.level5Active = false;
            setTimeout(changeLevel, 3000, 5);
        }
    }
    // Redraw frames
    requestAnimationFrame(gameLoop);
}
gameLoop();