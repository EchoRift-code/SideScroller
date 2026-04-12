export {tiles};
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