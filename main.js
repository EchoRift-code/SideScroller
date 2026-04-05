import {level1} from "./levels/level1.js";
import {level2} from "./levels/level2.js";
import {menuBackground, fPlayerImage, enemyImages, tiles} from "./loadImages.js";
let tileMap = level1, map2 = level2;
//console.log("hello");

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

let gravity = 1;
let velocityY = 0;
let canMove = true, onJumpPad = false, jumped = false, inAir = false;

let level1Complete = false;

let startMenuActive = true, diedScreenActive = false;

let startButton = { x: canvas.width/2-50, y: 200, width: 150, height: 50};
let settingButton = { x: canvas.width/2-50, y: 300, width: 150, height: 50};
let volumeButton = {x: canvas.width/2-50, y: 200, width: 150, height: 50}
let restartButton = { x: 205, y: 275, width: 170, height: 50};
let mainMenuButton = { x: 425, y: 275, width: 170, height: 50};

let camera = { x : 0, y : 0};

let screenActive = {mainMenu: true, settings: false, died: false, level1Active: false, level2Active: false, level3Active: false, level4Active: true, level5Active: false};

let player = { x: 50, y: 500, width: 50, height: 50 };
let ogre = { x: 600, y: 500};
let vampire = {x: 300, y: 500};

let keys = {};
document.addEventListener("keydown", (e)=>{keys[e.key]=true;});
document.addEventListener("keyup", (e)=>{keys[e.key]=false;
                            if(e.key == "ArrowUp"){
                                jumped = false; // Resets value when key is released
                            }});

canvas.addEventListener("click", (e) =>{
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left; // X relative to canvas
    const mouseY = e.clientY - rect.top; // Y relative to canvas
    //console.log("Mouse clicked at:", mouseX, mouseY);

    if(startMenuActive){
        if(mouseX >= startButton.x && mouseX <= startButton.x + startButton.width && mouseY >= startButton.y && mouseY <= startButton.y + startButton.height){
            player.x = 50;
            player.y = 500;
            screenActive.mainMenu = false;
            screenActive.level1Active = true;
            startMenuActive = false;     
        }
        if(mouseX >= settingButton.x && mouseX <= settingButton.x + settingButton.width && mouseY >= settingButton.y && mouseY <= settingButton.y + settingButton.height){
            screenActive.mainMenu = false;
            screenActive.settings = true;
            startMenuActive = false;
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

// Add keys for buttons so they can be clicked and touched with touchscreen
if(jumpBtn){
    jumpBtn.addEventListener("mousedown", e => {
        e.preventDefault();
        keys["ArrowUp"] = true;
    });
    jumpBtn.addEventListener("mouseup", e => {
        e.preventDefault();
        keys["ArrowUp"] = false;
    });
    jumpBtn.addEventListener("mouseleave", e => {
        e.preventDefault();
        keys["ArrowUp"] = false;
    });
    jumpBtn.addEventListener("touchstart", e => {
        e.preventDefault();
        keys["ArrowUp"] = true;
    });
    jumpBtn.addEventListener("touchend", e => {
        e.preventDefault();
        keys["ArrowUp"] = false;
    });
    jumpBtn.addEventListener("touchcancel", e => {
        e.preventDefault();
        keys["ArrowUp"] = false;
    });
}
if(leftBtn){
    leftBtn.addEventListener("mousedown", e => {
        e.preventDefault();
        keys["ArrowLeft"] = true;
    });
    leftBtn.addEventListener("mouseup", e => {
        e.preventDefault();
        keys["ArrowLeft"] = false;
    });
    leftBtn.addEventListener("mouseleave", e => {
        e.preventDefault();
        keys["ArrowLeft"] = false;
    });
    leftBtn.addEventListener("touchstart", e => {
        e.preventDefault();
        keys["ArrowLeft"] = true;
    });
    leftBtn.addEventListener("touchend", e => {
        e.preventDefault();
        keys["ArrowLeft"] = false;
    });
    leftBtn.addEventListener("touchcancel", e => {
        e.preventDefault();
        keys["ArrowLeft"] = false;
    });
}
if(rightBtn){
    rightBtn.addEventListener("mousedown", e => {
        e.preventDefault();
        keys["ArrowRight"] = true;
    });
    rightBtn.addEventListener("mouseup", e => {
        e.preventDefault();
        keys["ArrowRight"] = false;
    });
    rightBtn.addEventListener("mouseleave", e => {
        e.preventDefault();
        keys["ArrowRight"] = false;
    });
    rightBtn.addEventListener("touchstart", e => {
        e.preventDefault();
        keys["ArrowRight"] = true;
    });
    rightBtn.addEventListener("touchend", e => {
        e.preventDefault();
        keys["ArrowRight"] = false;
    });
    rightBtn.addEventListener("touchcancel", e => {
        e.preventDefault();
        keys["ArrowRight"] = false;
    });
}

function updateCamera(){
    
    const offsetX = 200;
    const offsetY = 200;

    camera.x = player.x - offsetX;
    camera.y = player.y - offsetY;

    camera.x = Math.max(0, Math.min(camera.x, tileMap[0].length * 50 - canvas.width));
    camera.y = Math.max(0, Math.min(camera.y, tileMap.length * 50 - canvas.height));

}

function changeState(){
    screenActive.died = false;
    screenActive.level1Active = true;
    player.x = 50;
    player.y = 500;
}

function changeLevel(previousLevel){
    if(previousLevel == 1){
        screenActive.level1Active = false;
        screenActive.level2Active = true;
    }else if(previousLevel == 2){
        screenActive.level2Active = false;
        screenActive.level3Active = true;
    }else if(previousLevel == 3){
        screenActive.level3Active = false;
        screenActive.level4Active = true;
    }else if(previousLevel == 4){
        screenActive.level4Active = false;
        screenActive.level5Active = true;
    }else if(previousLevel == 5){
        screenActive.level5Active = false;
        //screenActive.level2Active = false;
    }
    
    player.x = 50;
    player.y = 500;
}

function drawGrid(){
    for(let x = 0; x < 800; x ++){
        for(let y = 0; y < 600; y++){
            draw.fillRect(x*50,y*50, 50,2);
            draw.fillRect(x*50,y*50, 2,50);
        }
    }
}
//console.log("hello again");
function gameLoop(){
    //console.log("Gameloop started");
    let pOldX = player.x, pOldY = player.y;

    // Player movement
    if(canMove){
        if(keys["ArrowUp"] && !jumped){ 
            if(onJumpPad){
                velocityY = -25;
            }else{
                velocityY = -15;
            }
            onJumpPad = false;
            jumped = true;
            inAir = true; 
            
        }  
    }         
    
    // Bring the player back down
    velocityY += gravity; // with gravity the 
    player.y += velocityY;
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
        
        // Background color
        draw.fillStyle = "black";
        draw.fillRect(0,0,canvas.width, canvas.height);

        // Draw the rectangles for the button
        draw.fillStyle = "red";
        draw.fillRect(volumeButton.x, volumeButton.y, volumeButton.width, volumeButton.height);
        draw.fillRect(settingButton.x, settingButton.y, settingButton.width, settingButton.height);
        
        // Draw the writing inside the buttons
        draw.fillStyle = "white";
        draw.font = "35px Arial";
        draw.fillText("Volume", volumeButton.x+15, volumeButton.y+38);                 
        draw.fillText("Mute", settingButton.x+35, settingButton.y+38); 
    }
    
    if(screenActive.died){
        diedScreenActive = true;
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
        //console.log("Level 1 active");
        // Calculate the total width of the game world (not the screen)
        // tileMap[0].length = number of columns (tiles) in the map
        // Each tile is 50 pixels wide
        // So: total world width = number of tiles * tile size
        const worldWidth = tileMap[0].length * 50;

        // Check if the right arrow key is being pressed
        // AND make sure the player does NOT move past the right edge of the world
        // player.x + player.width = the player's RIGHT side
        // We compare that to worldWidth to prevent going off the map
        if (keys["ArrowRight"] && player.x + player.width < worldWidth && canMove) {
            // Move the player to the right by 2 pixels per frame
            player.x += 2;
        }else if(keys["ArrowLeft"] && player.x >= 0 && canMove) {
            player.x -=2;
        }else{
            player.x = pOldX;
        }              

        // Draw tiles
        for(let row = 0; row < tileMap.length; row++){
            for(let col = 0; col < tileMap[row].length; col++){
                const tileIndex = tileMap[row][col]; // Get number from tilemap
                const tileImage = tiles[tileIndex]; // Get the corresponding image from the images[]
                if(!tileImage.complete) continue;
                const screenX = col * 50 - camera.x;
                const screenY = row * 50 - camera.y;
                
                draw.drawImage(tileImage, screenX, screenY, 50, 50);
                
            }   
        }

        // Check collisions with tiles
        for(let row = 0; row < tileMap.length; row++){
            for(let col = 0; col < tileMap[row].length; col++){
                let tileX = col * 50;
                let tileY = row * 50;
                //  Prevents player from falling through floor while gravity if constantly active
                if(tileMap[row][col] == 4){
                    if(player.x < tileX + 50 &&
                    player.x + player.width > tileX &&
                    player.y < tileY + 50 &&
                    player.y + player.height > tileY){

                        // Landing on top
                        if(pOldY + player.height <= tileY){
                            player.y = tileY - player.height;
                            velocityY = 0;
                            inAir = false;
                        }

                        // Hitting head
                        else if(pOldY >= tileY + 50){
                            player.y = tileY + 50;
                            velocityY = 0;
                        }

                        // Side collisions
                        else if(pOldX + player.width <= tileX){
                            player.x = tileX - player.width;
                        }
                        else if(pOldX >= tileX + 50){
                            player.x = tileX + 50;
                        }
                    }
                }
                if(tileMap[row][col] == 5){
                    // Once the player starts falling they can no longer move
                    if(player.y+50 > tileY+1){
                        canMove = false;
                    }else{
                        canMove = true;
                    }
                    // Wont trigger until player character has gone down the hole
                    if(player.x < tileX + 50 && player.x + player.width > tileX && player.y < tileY + 50 && player.y + player.height > tileY + 50){                                     
                        screenActive.died = true;
                        screenActive.level1Active = false;                          
                    }
                }   
                if(tileMap[row][col] == 6){                    
                    if(player.x < tileX + 50 && player.x + player.width > tileX && player.y < tileY + 50 && player.y + player.height > tileY){
                        //console.log("On jump pad");
                        player.x = pOldX;      
                        onJumpPad = true;             
                    }
                }
                if(tileMap[row][col] == 7 || tileMap[row][col] == 8){
                    if(player.x < tileX + 50 && player.x + player.width > tileX && player.y < tileY + 50 && player.y + player.height > tileY){
                        level1Complete = true;                              
                    }
                }
            }
        }
        
        // The ogre inside the 50x50 tile is 13-37 wide
        if(player.x < ogre.x + 37 && player.x + player.width > ogre.x+13 && player.y < ogre.y + 50 && player.y + player.height > ogre.y){           
            screenActive.died = true;  
            screenActive.level1Active = false;                          
        }
        // Enemy
        draw.drawImage(enemyImages[0], ogre.x - camera.x, ogre.y - camera.y);
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
        draw.fillStyle = "yellow";
        draw.fillRect(0, 0, canvas.width, canvas.height);

        const worldWidth = map2[0].length * 50;

        // Check if the right arrow key is being pressed
        // AND make sure the player does NOT move past the right edge of the world
        // player.x + player.width = the player's RIGHT side
        // We compare that to worldWidth to prevent going off the map
        if (keys["ArrowRight"] && player.x + player.width < worldWidth && canMove) {
            // Move the player to the right by 2 pixels per frame
            player.x += 2;
        }else if(keys["ArrowLeft"] && player.x >= 0 && canMove) {
            player.x -=2;
        }else{
            player.x = pOldX;
        }

        for(let row = 0; row < map2.length; row++){
            for(let col = 0; col < map2[row].length; col++){
                const tileIndex = map2[row][col]; // Get number from tilemap
                const tileImage = tiles[tileIndex]; // Get the corresponding image from the images[]
                const screenX = col * 50 - camera.x;
                const screenY = row * 50 - camera.y;
                
                draw.drawImage(tileImage, screenX, screenY, 50, 50);
            }   
        }

        for(let row = 0; row < map2.length; row++){
            for(let col = 0; col < map2[row].length; col++){
                let tileX = col * 50;
                let tileY = row * 50;
                //  Prevents player from falling through floor while gravity if constantly active
                if(tileMap[row][col] == 4){
                    if(player.x < tileX + 50 &&
                    player.x + player.width > tileX &&
                    player.y < tileY + 50 &&
                    player.y + player.height > tileY){

                        // Landing on top
                        if(pOldY + player.height <= tileY){
                            player.y = tileY - player.height;
                            velocityY = 0;
                            inAir = false;
                        }

                        // Hitting head
                        else if(pOldY >= tileY + 50){
                            player.y = tileY + 50;
                            velocityY = 0;
                        }

                        // Side collisions
                        else if(pOldX + player.width <= tileX){
                            player.x = tileX - player.width;
                        }
                        else if(pOldX >= tileX + 50){
                            player.x = tileX + 50;
                        }
                    }
                }
                if(map2[row][col] == 5){
                    // Once the player starts falling they can no longer move
                    if(player.y+50 > tileY+1){
                        canMove = false;
                    }else{
                        canMove = true;
                    }
                    // Wont trigger until player character has gone down the hole
                    if(player.x < tileX + 50 && player.x + player.width > tileX && player.y < tileY + 50 && player.y + player.height > tileY + 50){                                     
                        screenActive.died = true;
                        screenActive.level1Active = false;                          
                    }
                }
                if(map2[row][col] == 6 ){
                    if(player.x < tileX + 50 && player.x + player.width > tileX && player.y < tileY + 50 && player.y + player.height > tileY){
                        //level1Complete = true;                              
                    }
                }
                if(map2[row][col] == 7){                    
                    if(player.x < tileX + 50 && player.x + player.width > tileX && player.y < tileY + 50 && player.y + player.height > tileY){
                        onJumpPad = true;             
                    }
                }
            }
        }
        // Draw the enemies
        ogre.x = 200;
        draw.drawImage(enemyImages[0], ogre.x - camera.x, ogre.y - camera.y);
        ogre.x = 600;
        draw.drawImage(enemyImages[1], ogre.x - camera.x, ogre.y - camera.y);
        ogre.x = 950;
        draw.drawImage(enemyImages[0], ogre.x - camera.x, ogre.y - camera.y);
        
        
        draw.drawImage(fPlayerImage, player.x - camera.x, player.y - camera.y);
    }
    //drawGrid();
    // Redraw frames
    requestAnimationFrame(gameLoop);
    
}
gameLoop();