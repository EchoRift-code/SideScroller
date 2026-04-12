export {menuBackground, settingsBackground, level1Door, cars, loadingScreenImg};

let menuBackground = new Image();
menuBackground.src = "images/myImages/menuBackground.png";
menuBackground.onload = () => {
    console.log("Loaded menu Background");
};

let settingsBackground = new Image();
settingsBackground.src = "images/myImages/settingsBackground.png";
settingsBackground.onload = () => {
    console.log("Loaded setting background");
};
let level1Door = new Image();
level1Door.src = "images/myImages/door1.png";
level1Door.onload = () => {
    console.log("Loaded level 1 door");
};

// level 3 cars
let cars = [];
let blackCar = new Image;
blackCar.src = "images/AICreated/blackCar.png";

cars.push(blackCar);

let loadingScreenImg = new Image();
loadingScreenImg.src = "images/OtherPeopleCreated/Player/level2/Goldie portrait_with frame 02.png";
loadingScreenImg.onload = () => {
    console.log("Loading screen is ready");
};