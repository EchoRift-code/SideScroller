export {tiles, level3Tiles, dancingApe, level3Background};
let tiles = [];
// Create image objects
let background = new Image(), cloud1 = new Image(), cloud2 = new Image(), cloud3 = new Image(), ground = new Image(), firePit = new Image();
let jumpPad = new Image();

background.src = "images/myImages/background1.png", cloud1.src = "images/myImages/cloud1.png", cloud2.src = "images/myImages/cloud2.png", cloud3.src = "images/myImages/cloud3.png";
ground.src = "images/OtherPeopleCreated/Dirt&Grass/2.png", firePit.src = "images/myImages/firePit.png", jumpPad.src = "images/myImages/jumpPad.png";

// Add the images to the array
tiles.push(background);
tiles.push(cloud1);
tiles.push(cloud2);
tiles.push(cloud3);
tiles.push(ground);
tiles.push(firePit);
tiles.push(jumpPad);

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

let level3Tiles = [];
let transparentTile = new Image();
transparentTile.src = "images/myImages/transparentTile.png";
transparentTile.onload = () => {
    console.log("Transparent tile is ready");
}
level3Tiles.push(transparentTile); // 0

let blackCarImg = new Image(), blueCarImg = new Image(), greenCarImg = new Image(), orangeCarImg = new Image();
let purpleCarImg = new Image(), redCarImg = new Image(), silverCarImg = new Image(), whiteCarImg = new Image();

blackCarImg.src = "images/AICreated/blackCarT.png";
blueCarImg.src = "images/AICreated/blueCarT.png";
greenCarImg.src = "images/AICreated/greenCarT.png";
orangeCarImg.src = "images/AICreated/orangeCarT.png";
purpleCarImg.src = "images/AICreated/purpleCarT.png";
redCarImg.src = "images/AICreated/redCarT.png";
silverCarImg.src = "images/AICreated/silverCarT.png";
whiteCarImg.src = "images/AICreated/whiteCarT.png";

let sawBladeT = new Image();
sawBladeT.src = "images/AICreated/sawBladesT.png";
sawBladeT.onload = () =>{
    console.log("Sawblades are loaded");
}
level3Tiles.push(whiteCarImg);// 1
level3Tiles.push(blackCarImg); 
level3Tiles.push(blueCarImg); 
level3Tiles.push(sawBladeT); // deathpit
level3Tiles.push(greenCarImg);
level3Tiles.push(orangeCarImg);
level3Tiles.push(purpleCarImg);
level3Tiles.push(redCarImg);
level3Tiles.push(silverCarImg);// 8
 

let carsLoaded = 0;
// Loop through every image in the images array
for (let i = 0; i < level3Tiles.length; i++) {

    // Assign an "onload" event to each image
    // This function runs ONLY when that specific image finishes loading
    level3Tiles[i].onload = () => {

        // Log which image finished loading
        // NOTE: Using images[i] here can be unreliable because when this runs,
        // the loop may have already finished and i may no longer point to the correct index
        //console.log(images[i], "has loaded.");

        // Increase the counter to track how many images have finished loading
        carsLoaded++;

        // Check if ALL images have finished loading
        // images.length = total number of images we are waiting on
        if (carsLoaded == level3Tiles.length) {

            // Once ALL images are loaded, start the game loop
            // This prevents the game from trying to draw images that aren't ready yet
            console.log("All cars are loaded");
        }
    };
}

let dancingApe = new Image();
dancingApe.src = "images/AICreated/dancingApe.png";
dancingApe.onload = () => {
    console.log("Ready for the ape");
}

let level3Background = new Image();
level3Background.src = "images/AICreated/futuristicBackground.png";
level3Background.onload = () => {
    console.log("Level 3 background is ready");
}