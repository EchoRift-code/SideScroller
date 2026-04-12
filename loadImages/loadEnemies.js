export {cyclopsImage, mushroomImage};

// Create the object variables
let cyclopsImage = new Image();
let mushroomImage = new Image();


// Set the source files to get the images
cyclopsImage.src = "images/OtherPeopleCreated/Cyclops/SpriteSheet.png";
mushroomImage.src = "images/OtherPeopleCreated/Mushroom/mushroom.png";

// Onload them so they are loaded properly
cyclopsImage.onload = () => {
    console.log("Loaded cyclops");
};
mushroomImage.onload = () => {
    console.log("Loaded mushroom");
};