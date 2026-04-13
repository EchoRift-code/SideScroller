export {menuBackground, settingsBackground, level1Door, level2Door};

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
let level2Door = new Image();
level2Door.src = "images/myImages/door2.png";
level2Door.onload = () => {
    console.log("Loaded level 2 door");
};