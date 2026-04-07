export {fPlayerImage, enemyImages, tiles, menuBackground, settingsBackground};

let enemyImages = [];
let ogreImage = new Image(), vampireImage = new Image();
ogreImage.src = "images/ogreT.png", vampireImage.src = "images/vampireT.png";

enemyImages.push(ogreImage);
enemyImages.push(vampireImage);

let enemiesLoaded = 0;
// Loop through every image in the images array
for (let i = 0; i < enemyImages.length; i++) {
    enemyImages[i].onload = () => {
        //console.log(enemyImages[i], "has loaded.");
        enemiesLoaded++;

        if (enemiesLoaded == enemyImages.length) {
            console.log("Enemies are loaded");
        }
    };
}

let fPlayerImage = new Image();
fPlayerImage.src = "images/femalePlayerT.png";
fPlayerImage.onload = () => {
    console.log("Loaded player");
};

let menuBackground = new Image();
menuBackground.src = "images/menuBackground.png";
menuBackground.onload = () => {
    console.log("Loaded menu Background");
};

let settingsBackground = new Image();
settingsBackground.src = "images/settingsBackground.png";
settingsBackground.onload = () => {
    console.log("Loaded setting background");
};

let tiles = [];
// Create image objects
let background = new Image(), cloud1 = new Image(), cloud2 = new Image(), cloud3 = new Image(), ground = new Image(), firePit = new Image();
let jumpPad = new Image(), topLeftDoor = new Image(), bottomLeftDoor = new Image(), topRightDoor = new Image(), bottomRightDoor = new Image();

background.src = "images/background1.png", cloud1.src = "images/cloud1.png", cloud2.src = "images/cloud2.png", cloud3.src = "images/cloud3.png";
ground.src = "images/ground.png", firePit.src = "images/firePit.png", jumpPad.src = "images/jumpPad.png";
topLeftDoor.src = "images/doorTopLeft.png", bottomLeftDoor.src = "images/doorBottomLeft.png", topRightDoor.src = "images/doorTopRight.png", bottomRightDoor.src = "images/doorBottomRight.png";

// Add the images to the array
tiles.push(background);
tiles.push(cloud1);
tiles.push(cloud2);
tiles.push(cloud3);
tiles.push(ground);
tiles.push(firePit);
tiles.push(jumpPad);
tiles.push(topLeftDoor); // 7
tiles.push(bottomLeftDoor); // 8
tiles.push(topRightDoor); // 9
tiles.push(bottomRightDoor); // 10

let imagesLoaded = 0;
// Loop through every image in the images array
for (let i = 0; i < tiles.length; i++) {

    // Assign an "onload" event to each image
    // This function runs ONLY when that specific image finishes loading
    tiles[i].onload = () => {

        // Log which image finished loading
        // NOTE: Using images[i] here can be unreliable because when this runs,
        // the loop may have already finished and i may no longer point to the correct index
        //console.log(images[i], "has loaded.");

        // Increase the counter to track how many images have finished loading
        imagesLoaded++;

        // Check if ALL images have finished loading
        // images.length = total number of images we are waiting on
        if (imagesLoaded == tiles.length) {

            // Once ALL images are loaded, start the game loop
            // This prevents the game from trying to draw images that aren't ready yet
            console.log("All images are loaded");
        }
    };
}