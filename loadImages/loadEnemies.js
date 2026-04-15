export {crabImage, mushroomImage, bearImage, robotImage};

// Create the object variables
let crabImage = new Image();
let mushroomImage = new Image();
let bearImage = new Image();
let robotImage = new Image();

// Set the source files to get the images
crabImage.src = "images/Bing/Enemies/crabEnemy.png";
mushroomImage.src = "images/Gemini/Enemies/mushroomEnemy.png";
bearImage.src = "images/Gemini/Enemies/bearEnemy.png";
robotImage.src = "images/Gemini/Enemies/robotEnemy.png";

// Onload them so they are loaded properly
crabImage.onload = () => {
    console.log("Loaded cyclops");
};
mushroomImage.onload = () => {
    console.log("Loaded mushroom");
};
bearImage.onload = () => {
    console.log("Loaded cyclops");
};
robotImage.onload = () => {
    console.log("Loaded mushroom");
};