import {level1} from "./levels/level1.js";
import {level2} from "./levels/level2.js";
import {menuBackground, fPlayerImage, enemyImages, tiles, settingsBackground} from "./loadImages.js";
let map1 = level1, map2 = level2;

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

const tileSize = 50;

let canMove = true, onJumpPad = false, onGround = false;

let level1Complete = false;

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

let screenActive = {mainMenu: true, settings: false, died: false, level1Active: false, level2Active: false, level3Active: false, level4Active: true, level5Active: false};

let player = { x: 50, y: 500, width: 50, height: 50, speed: 3, fromLeft: 14, fromRight: 14, fromTop: 8};
let ogre = { x: 600, y: 500};
let vampire = {x: 1350, y: 500};
let ogre2 = { x: 4000, y: 500};
let vampire2 = {x: 4500, y: 500};

let ogre3 = { x: 1800, y: 300};
let vampire3 = {x: 600, y: 500};
let ogre4 = { x: 2500, y: 500};
let vampire4 = {x: 1500, y: 500};
let jumped = false;

let npcInitialMove = {  ogre1MoveLeft: true, ogre1MoveRight: false, vampire1MoveLeft: true, vampire1MoveRight: false,
                        ogre2MoveLeft: true, ogre2MoveRight: false, vampire2MoveLeft: true, vampire2MoveRight: false,
                        ogre3MoveLeft: true, ogre3MoveRight: false, vampire3MoveLeft: true, vampire3MoveRight: false,
                        ogre4MoveLeft: true, ogre4MoveRight: false, vampire4MoveLeft: true, vampire4MoveRight: false,
};

let keys = {
    left: false,
    right: false,
    jump: false
};

// Keyboard input
document.addEventListener("keydown", (e) => {
    if(e.key == "ArrowLeft") keys.left = true;
    else if(e.key == "ArrowRight") keys.right = true;
    else if(e.key == "ArrowUp") keys.jump = true;
});

document.addEventListener("keyup", (e) => {
    if(e.key == "ArrowLeft") keys.left = false;
    else if(e.key == "ArrowRight") keys.right = false;
    else if(e.key == "ArrowUp") keys.jump = false; jumped = false; // jumped = player can only jump again if they let go of the key
});

// Mobile buttons
function setupButtons(btn, keyName){
    btn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        keys[keyName] = true;
    });
    btn.addEventListener("touchend", (e) => {
        e.preventDefault();
        keys[keyName] = false;
    });
    btn.addEventListener("mosuedown", (e) => {
        e.preventDefault();
        keys[keyName] = true;
    });
    btn.addEventListener("mouseup", (e) => {
        e.preventDefault();
        keys[keyName] = false;
    });
}

setupButtons(leftBtn, "left");
setupButtons(rightBtn, "right");
setupButtons(jumpBtn, "jump");

canvas.addEventListener("click", (e) =>{
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left; // X relative to canvas
    const mouseY = e.clientY - rect.top; // Y relative to canvas
    //console.log("Mouse clicked at:", mouseX, mouseY);
    
    if(startMenuActive){
        if(mouseX >= startButton.x && mouseX <= startButton.x + startButton.width && mouseY >= startButton.y && mouseY <= startButton.y + startButton.height){
            level1Music.play().catch(err => console.log(err)); // catch prevents errors if autoplay is blocked
            player.x = 50;
            player.y = 500;
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
            player.x = 50;
            player.y = 500;
            screenActive.died = false;
            diedScreenActive = false;
            screenActive.level1Active = true;
            player.x = 50;
            player.y = 500;
        }
        if(mouseX >= mainMenuButton.x && mouseX <= mainMenuButton.x + mainMenuButton.width && mouseY >= mainMenuButton.y && mouseY <= mainMenuButton.y + mainMenuButton.height){                
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

    camera.x = Math.max(0, Math.min(camera.x, map1[0].length * 50 - canvas.width));
    camera.y = Math.max(0, Math.min(camera.y, map1.length * 50 - canvas.height));

}

function changeLevel(previousLevel){
    player.x = 50;
    player.y = 500;
    if(previousLevel == 1){
        level1Music.pause();
        level2Music.play().catch(err => console.log(err));
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
            draw.fillRect(x*50,y*50, 50,2);
            draw.fillRect(x*50,y*50, 2,50);
        }
    }
}

function changeNPCDirection(level){
    if(level == 1){
        if(npcInitialMove.ogre1MoveLeft){
            ogre.x -= 1;
            if(ogre.x == 450){
                npcInitialMove.ogre1MoveRight = true;
                npcInitialMove.ogre1MoveLeft = false;
            }
            
        }else if(npcInitialMove.ogre1MoveRight){
            ogre.x += 1;
            if(ogre.x == 750){
                npcInitialMove.ogre1MoveLeft = true;
                npcInitialMove.ogre1MoveRight = false;
            }
        }

        if(npcInitialMove.ogre2MoveLeft){
            ogre2.x -= 1;
            if(ogre2.x == 3950){
                npcInitialMove.ogre2MoveRight = true;
                npcInitialMove.ogre2MoveLeft = false;
            }
            
        }else if(npcInitialMove.ogre2MoveRight){
            ogre2.x += 1;
            if(ogre2.x == 4100){
                npcInitialMove.ogre2MoveLeft = true;
                npcInitialMove.ogre2MoveRight = false;
            }
        }

        if(npcInitialMove.vampire1MoveLeft){
            vampire.x -= 1;
            if(vampire.x == 1250){
                npcInitialMove.vampire1MoveRight = true;
                npcInitialMove.vampire1MoveLeft = false;
            }
            
        }else if(npcInitialMove.vampire1MoveRight){
            vampire.x += 1;
            if(vampire.x == 1550){
                npcInitialMove.vampire1MoveLeft = true;
                npcInitialMove.vampire1MoveRight = false;
            }
        }
        if(npcInitialMove.vampire2MoveLeft){
            vampire2.x -= 1;
            if(vampire2.x == 4450){
                npcInitialMove.vampire2MoveRight = true;
                npcInitialMove.vampire2MoveLeft = false;
            }
            
        }else if(npcInitialMove.vampire2MoveRight){
            vampire2.x += 1;
            if(vampire2.x == 4550){
                npcInitialMove.vampire2MoveLeft = true;
                npcInitialMove.vampire2MoveRight = false;
            }
        }
    }else if(level == 2){
        if(npcInitialMove.ogre3MoveLeft){
            ogre3.x -= 1;
            if(ogre3.x == 1500){
                npcInitialMove.ogre3MoveRight = true;
                npcInitialMove.ogre3MoveLeft = false;
            }
            
        }else if(npcInitialMove.ogre3MoveRight){
            ogre3.x += 1;
            if(ogre3.x == 1900){
                npcInitialMove.ogre3MoveLeft = true;
                npcInitialMove.ogre3MoveRight = false;
            }
        }

        if(npcInitialMove.ogre4MoveLeft){
            ogre4.x -= 1;
            if(ogre4.x == 2450){
                npcInitialMove.ogre4MoveRight = true;
                npcInitialMove.ogre4MoveLeft = false;
            }
            
        }else if(npcInitialMove.ogre4MoveRight){
            ogre4.x += 1;
            if(ogre4.x == 2700){
                npcInitialMove.ogre4MoveLeft = true;
                npcInitialMove.ogre4MoveRight = false;
            }
        }

        if(npcInitialMove.vampire3MoveLeft){
            vampire3.x -= 1;
            if(vampire3.x == 500){
                npcInitialMove.vampire3MoveRight = true;
                npcInitialMove.vampire3MoveLeft = false;
            }
            
        }else if(npcInitialMove.vampire3MoveRight){
            vampire3.x += 1;
            if(vampire3.x == 750){
                npcInitialMove.vampire3MoveLeft = true;
                npcInitialMove.vampire3MoveRight = false;
            }
        }
        if(npcInitialMove.vampire4MoveLeft){
            vampire4.x -= 1;
            if(vampire4.x == 1300){
                npcInitialMove.vampire4MoveRight = true;
                npcInitialMove.vampire4MoveLeft = false;
            }
            
        }else if(npcInitialMove.vampire4MoveRight){
            vampire4.x += 1;
            if(vampire4.x == 1550){
                npcInitialMove.vampire4MoveLeft = true;
                npcInitialMove.vampire4MoveRight = false;
            }
        }
    }
}

//console.log("hello again");
function gameLoop(){
    //console.log("Gameloop started");
    let pOldX = player.x, pOldY = player.y;

    // Player movement
    if(canMove){
        if(keys.jump && onGround && !jumped){ 
            if(onJumpPad){
                velocityY = -20;
            }else{
                velocityY = -15;
            }
            jumped = true;
            onJumpPad = false;
            onGround = false;
        }  
    }        
    // Calculate the total width of the game world (not the screen)
    // map1[0].length = number of columns (tiles) in the map
    // Each tile is 50 pixels wide
    // So: total world width = number of tiles * tile size
    const worldWidth = map1[0].length * tileSize;

    // Check if the right arrow key is being pressed
    // AND make sure the player does NOT move past the right edge of the world
    // player.x + player.width = the player's RIGHT side
    // We compare that to worldWidth to prevent going off the map
    if (keys.right && player.x + player.width < worldWidth && canMove) {        
        player.x += player.speed;
    }else if(keys.left && player.x >= 0 && canMove) {
        player.x -= player.speed;
    }               
    updateCamera();

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
        velocityY += gravity; // The speed at which the player falls increases because of gravity constantly increasing the value of velocity
        player.y += velocityY; // apply the new speed each frame so the player gradually falls faster
        
        // Draw tiles
        for(let row = 0; row < map1.length; row++){
            for(let col = 0; col < map1[row].length; col++){
                const tileIndex = map1[row][col]; // Get number from map1
                const tileImage = tiles[tileIndex]; // Get the corresponding image from the images[]
                if(!tileImage.complete) continue;
                const screenX = col * tileSize - camera.x;
                const screenY = row * tileSize - camera.y;
                
                draw.drawImage(tileImage, screenX, screenY, tileSize, tileSize);
                
            }   
        }

        // Check collisions with tiles
        for(let row = 0; row < map1.length; row++){
            for(let col = 0; col < map1[row].length; col++){
                let tileX = col * 50;
                let tileY = row * 50;
                //  Prevents player from falling through floor while gravity if constantly active
                if(map1[row][col] == 4){
                    if(player.x + player.fromLeft < tileX + tileSize && player.x + player.width - player.fromRight > tileX && player.y < tileY + tileSize && player.y + player.height > tileY){
                        // Collision with top of tile
                        if(pOldY + player.height <= tileY  && player.y + player.height >= tileY){
                            player.y = tileY - player.height;
                            velocityY = 0;
                            onGround = true;     
                        }
                        // Hitting head
                        if(pOldY >= tileY + tileSize && player.y <= tileY + tileSize){
                            player.y = tileY + tileSize;
                            velocityY = 0;
                        }

                        // Side collisions
                        if(player.y + player.height > tileY && player.y < tileY + tileSize){
                            if(pOldX + player.width <= tileX && player.x + player.width > tileX){
                                player.x = tileX - player.width;
                            }
                            if(pOldX >= tileX + tileSize && player.x < tileX + tileSize){
                                player.x = tileX + tileSize;
                            }
                        }
                    }
                }
                if(map1[row][col] == 5){
                    // Once the player starts falling they can no longer move
                    if(player.y+50 > tileY+1){
                        canMove = false;
                    }else{
                        canMove = true;
                    }
                    // Wont trigger until player character has gone down the hole
                    if(player.x < tileX + tileSize && player.x + player.width > tileX && player.y < tileY + tileSize && player.y + player.height > tileY + tileSize){                                     
                        screenActive.died = true;
                        screenActive.level1Active = false;                          
                    }
                }   
                if(map1[row][col] == 6){                    
                    if(player.x < tileX + tileSize && player.x + player.width > tileX && player.y < tileY + tileSize && player.y + player.height > tileY){
                        //console.log("On jump pad");
                        //player.x = pOldX;      
                        onJumpPad = true;             
                    }
                }
                if(map1[row][col] == 7 || map1[row][col] == 8){
                    if(player.x < tileX + tileSize && player.x + player.width > tileX && player.y < tileY + tileSize && player.y + player.height > tileY){
                        level1Complete = true;                              
                    }
                }
            }
        }
        
        // The ogre inside the 50x50 tile is 13-37 wide
        if(player.x < ogre.x + 37 && player.x + player.width > ogre.x+13 && player.y < ogre.y + tileSize && player.y + player.height > ogre.y ||
            player.x < vampire.x + 37 && player.x + player.width > vampire.x+13 && player.y < vampire.y + tileSize && player.y + player.height > vampire.y){           
            screenActive.died = true;  
            screenActive.level1Active = false;                          
        }

        changeNPCDirection(1);

        // Enemy
        draw.drawImage(enemyImages[0], ogre.x - camera.x, ogre.y - camera.y);
        draw.drawImage(enemyImages[1], vampire.x - camera.x, vampire.y - camera.y);

        draw.drawImage(enemyImages[0], ogre2.x - camera.x, ogre.y - camera.y);
        draw.drawImage(enemyImages[1], vampire2.x - camera.x, vampire.y - camera.y);

        // Player
        //draw.fillStyle = "black";
        //draw.fillRect(player.x - camera.x, player.y - camera.y, player.width, player.height);  
        draw.drawImage(fPlayerImage, player.x - camera.x, player.y - camera.y);
        
        if(level1Complete){
            draw.fillStyle = "black";
            draw.fillRect(0, 0, canvas.width, canvas.height);

            draw.fillStyle = "green";
            draw.font = ("50px Arial");
            draw.fillText("You beat level 1!", 215, 300);

            setTimeout(changeLevel, 3000, 1);
        }
    }

    if(screenActive.level2Active){
        velocityY += gravity; // The speed at which the player falls increases because of gravity constantly increasing the value of velocity
        player.y += velocityY;

        onGround = false;
        
        // Tile collisions
        for(let row = 0; row < map2.length; row++){
            for(let col = 0; col < map2[row].length; col++){
                let tileX = col * tileSize;
                let tileY = row * tileSize;
                //  Prevents player from falling through floor while gravity if constantly active
                if(map2[row][col] == 4){
                    if(player.x + player.fromLeft < tileX + tileSize && player.x + player.width - player.fromRight > tileX && player.y < tileY + tileSize && player.y + player.height > tileY){
                        // Collision with top of tile
                        if(pOldY + player.height <= tileY  && player.y + player.height >= tileY){
                            player.y = tileY - player.height;
                            velocityY = 0;
                            onGround = true;     
                        }
                        // Hitting head
                        if(pOldY >= tileY + tileSize && player.y <= tileY + tileSize){
                            player.y = tileY + tileSize;
                            velocityY = 0;
                        }

                        // Side collisions
                        if(player.y + player.height > tileY && player.y < tileY + tileSize){
                            if(pOldX + player.width <= tileX && player.x + player.width > tileX){
                                player.x = tileX - player.width;
                            }
                            if(pOldX >= tileX + tileSize && player.x < tileX + tileSize){
                                player.x = tileX + tileSize;
                            }
                        }
                    }
                }
                if(map2[row][col] == 5){
                    // Once the player starts falling they can no longer move
                    if(player.y + tileSize > tileY+1){
                        canMove = false;
                    }else{
                        canMove = true;
                    }
                    // Wont trigger until player character has gone down the hole
                    if(player.x < tileX + tileSize && player.x + player.width > tileX && player.y < tileY + tileSize && player.y + player.height > tileY + tileSize){                                     
                        screenActive.died = true;
                        screenActive.level2Active = false;                          
                    }
                }
                if(map2[row][col] == 6){                    
                    if(player.x < tileX + tileSize && player.x + player.width > tileX && player.y < tileY + tileSize && player.y + player.height > tileY){
                        onJumpPad = true;   
                        //console.log("On jump pad");          
                    }
                }
            }
        }
        for(let row = 0; row < map2.length; row++){
            for(let col = 0; col < map2[row].length; col++){
                const tileIndex = map2[row][col]; // Get number from map1
                const tileImage = tiles[tileIndex]; // Get the corresponding image from the images[]
                const screenX = col * tileSize - camera.x;
                const screenY = row * tileSize - camera.y;
                
                draw.drawImage(tileImage, screenX, screenY, 50, 50);
            }   
        }
        
        if(player.x < ogre3.x + 37 && player.x + player.width > ogre3.x+13 && player.y < ogre3.y + tileSize && player.y + player.height > ogre3.y ||
            player.x < vampire3.x + 37 && player.x + player.width > vampire3.x+13 && player.y < vampire3.y + tileSize && player.y + player.height > vampire3.y ||
            player.x < ogre4.x + 37 && player.x + player.width > ogre4.x+13 && player.y < ogre4.y + tileSize && player.y + player.height > ogre4.y ||
            player.x < vampire4.x + 37 && player.x + player.width > vampire4.x+13 && player.y < vampire4.y + tileSize && player.y + player.height > vampire4.y){           
            
            screenActive.died = true;  
            screenActive.level2Active = false;                          
        }

        changeNPCDirection(2);

        // Draw the enemies
        draw.drawImage(enemyImages[0], ogre3.x - camera.x, ogre3.y - camera.y);
        draw.drawImage(enemyImages[1], vampire3.x - camera.x, vampire3.y - camera.y);
        draw.drawImage(enemyImages[0], ogre4.x - camera.x, ogre4.y - camera.y);
        draw.drawImage(enemyImages[1], vampire4.x - camera.x, vampire4.y - camera.y);
         
        draw.drawImage(fPlayerImage, player.x - camera.x, player.y - camera.y);
        //draw.fillRect(player.x - camera.x, player.y - camera.y, 40, 40);
        
    }
    //drawGrid();
    // Redraw frames
    requestAnimationFrame(gameLoop);
    
}
gameLoop();