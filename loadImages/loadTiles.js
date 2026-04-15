export {lvl1Tiles, level3Tiles, dancingApe, level3Background, level4Tiles, level5Tiles};
let lvl1Tiles = [];

let transparentTile = new Image();
transparentTile.src = "images/myImages/transparentTile.png";
transparentTile.onload = () => {
    console.log("Transparent tile is ready");
}

// Create image objects
let ground = new Image(), firePit = new Image(), jumpPad = new Image();
ground.src = "images/OtherPeopleCreated/Dirt&Grass/2.png", firePit.src = "images/AICreated/Bing/Tiles/firePit.png", jumpPad.src = "images/AICreated/Bing/Tiles/jumpPad.png";

// Add the images to the array
lvl1Tiles.push(transparentTile);
lvl1Tiles.push(ground);
lvl1Tiles.push(firePit);
lvl1Tiles.push(jumpPad);

let imagesLoaded = 0;
// Loop through every image in the images array
for (let i = 0; i < lvl1Tiles.length; i++) {

    // Assign an "onload" event to each image
    // This function runs ONLY when that specific image finishes loading
    lvl1Tiles[i].onload = () => {

        // Log which image finished loading
        // NOTE: Using images[i] here can be unreliable because when this runs,
        // the loop may have already finished and i may no longer point to the correct index
        //console.log(images[i], "has loaded.");

        // Increase the counter to track how many images have finished loading
        imagesLoaded++;

        // Check if ALL images have finished loading
        // images.length = total number of images we are waiting on
        if (imagesLoaded == lvl1Tiles.length) {

            // Once ALL images are loaded, start the game loop
            // This prevents the game from trying to draw images that aren't ready yet
            console.log("All images are loaded");
        }
    };
}

let level3Tiles = [];
level3Tiles.push(transparentTile); // 0

let blackCarImg = new Image(), blueCarImg = new Image(), greenCarImg = new Image(), orangeCarImg = new Image();
let purpleCarImg = new Image(), redCarImg = new Image(), silverCarImg = new Image(), whiteCarImg = new Image();

blackCarImg.src = "images/AICreated/Bing/Tiles/blackCarT.png";
blueCarImg.src = "images/AICreated/Bing/Tiles/blueCarT.png";
greenCarImg.src = "images/AICreated/Bing/Tiles/greenCarT.png";
orangeCarImg.src = "images/AICreated/Bing/Tiles/orangeCarT.png";
purpleCarImg.src = "images/AICreated/Bing/Tiles/purpleCarT.png";
redCarImg.src = "images/AICreated/Bing/Tiles/redCarT.png";
silverCarImg.src = "images/AICreated/Bing/Tiles/silverCarT.png";
whiteCarImg.src = "images/AICreated/Bing/Tiles/whiteCarT.png";

let sawBladeT = new Image();
sawBladeT.src = "images/AICreated/Bing/Tiles/sawBladesT.png";
sawBladeT.onload = () =>{
    console.log("Sawblades are loaded");
}
// 1
level3Tiles.push(greenCarImg);
level3Tiles.push(orangeCarImg);
level3Tiles.push(purpleCarImg);
level3Tiles.push(whiteCarImg);
level3Tiles.push(sawBladeT); // deathpit
level3Tiles.push(redCarImg);
level3Tiles.push(silverCarImg);// 8
level3Tiles.push(blackCarImg); // 2
level3Tiles.push(blueCarImg); // 3

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
dancingApe.src = "images/AICreated/Bing/dancingApe.png";
dancingApe.onload = () => {
    console.log("Ready for the ape");
}

let level3Background = new Image();
level3Background.src = "images/AICreated/Bing/Backgrounds/futuristicBackground.png";
level3Background.onload = () => {
    console.log("Level 3 background is ready");
}

let level4Tiles = [];
let redGround = new Image(), fireDeathFall = new Image();
redGround.src = "images/OtherPeopleCreated/FireTiles/Fire_4_16x16.png";
fireDeathFall.src = "images/OtherPeopleCreated/FireTiles/Fire_22_16x16.png";

level4Tiles.push(transparentTile);
level4Tiles.push(redGround);
level4Tiles.push(fireDeathFall);
level4Tiles.push(jumpPad);
level4Tiles.push(dancingApe);

let firesLoaded = 0;
for (let i = 0; i < level4Tiles.length; i++) {
    level4Tiles[i].onload = () => {
        firesLoaded++;
        if (firesLoaded == level4Tiles.length) {
            console.log("All fire images are loaded");
        }
    };
}

let level5Tiles = [];
let iceGround = new Image(), icePit = new Image();
iceGround.src = "images/OtherPeopleCreated/IceTiles/Ice_13_16x16.png";
icePit.src = "images/OtherPeopleCreated/IceTiles/Ice_20_16x16.png";

level5Tiles.push(transparentTile);
level5Tiles.push(iceGround);
level5Tiles.push(icePit);
level5Tiles.push(jumpPad);
level5Tiles.push(dancingApe);

let iceLoaded = 0;
for (let i = 0; i < level5Tiles.length; i++) {
    level5Tiles[i].onload = () => {
        iceLoaded++;
        if (iceLoaded == level5Tiles.length) {
            console.log("All ice images are loaded");
        }
    };
}