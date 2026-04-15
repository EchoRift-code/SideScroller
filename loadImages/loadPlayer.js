export {playerIdleLvl1, playerWalkLvl1, playerJumpLvl1, playerLvl2, playerIdleLvl3, playerIdleLvl4, playerIdleLvl5, 
  playerJumpLvl3, playerJumpLvl4, playerJumpLvl5, playerWalkLvl3, playerWalkLvl4, playerWalkLvl5};

// Level 1 player
let playerWalkLvl1 = new Image(), playerJumpLvl1 = new Image(), playerIdleLvl1 = new Image();
playerWalkLvl1.src = "images/OtherPeopleCreated/Player/level1/WALK.png";
playerJumpLvl1.src = "images/OtherPeopleCreated/Player/level1/JUMP.png";
playerIdleLvl1.src = "images/OtherPeopleCreated/Player/level1/IDLE.png";

playerIdleLvl1.onload = () => {
  // asset is ready
  console.log("Knight idle");
};
playerJumpLvl1.onload = () => {
  // asset is ready
  console.log("Knight jump");
};
playerWalkLvl1.onload = () => {
  // asset is ready
  console.log("Knight walk");
};

// level 2 player skin
let playerLvl2 = new Image();
playerLvl2.src = "images/OtherPeopleCreated/Player/level2/Goldie_v02.png";
playerLvl2.onload = () => {
  // asset is ready
  console.log("Goldie is ready for adventure");
};

// level 3 player skin
let playerWalkLvl3 = new Image(), playerJumpLvl3 = new Image(), playerIdleLvl3 = new Image();
playerWalkLvl3.src = "images/OtherPeopleCreated/Player/level3/santaWalkSpriteSheet.png";
playerJumpLvl3.src = "images/OtherPeopleCreated/Player/level3/santaJumpSpriteSheet.png";
playerIdleLvl3.src = "images/OtherPeopleCreated/Player/level3/santaIdleSpriteSheet.png";

playerIdleLvl3.onload = () => {
  // asset is ready
  console.log("Santa idle");
};
playerJumpLvl3.onload = () => {
  // asset is ready
  console.log("Santa jump");
};
playerWalkLvl3.onload = () => {
  // asset is ready
  console.log("Santa walk");
};

// level 4 player skin
let playerWalkLvl4 = new Image(), playerJumpLvl4 = new Image(), playerIdleLvl4 = new Image();
playerWalkLvl4.src = "images/OtherPeopleCreated/Player/level4/dinoWalkSpriteSheet.png";
playerJumpLvl4.src = "images/OtherPeopleCreated/Player/level4/dinoJumpSpriteSheet.png";
playerIdleLvl4.src = "images/OtherPeopleCreated/Player/level4/dinoIdleSpriteSheet.png";

playerIdleLvl4.onload = () => {
  // asset is ready
  console.log("Dino idle");
};
playerJumpLvl4.onload = () => {
  // asset is ready
  console.log("Dino jump");
};
playerWalkLvl4.onload = () => {
  // asset is ready
  console.log("Dino walk");
};

// level 5 player skin
let playerWalkLvl5 = new Image(), playerJumpLvl5 = new Image(), playerIdleLvl5 = new Image();
playerWalkLvl5.src = "images/OtherPeopleCreated/Player/level5/ninjaBoyRunSpriteSheet.png";
playerJumpLvl5.src = "images/OtherPeopleCreated/Player/level5/ninjaBoyJumpSpriteSheet.png";
playerIdleLvl5.src = "images/OtherPeopleCreated/Player/level5/ninjaBoyIdleSpriteSheet.png";

playerIdleLvl5.onload = () => {
  // asset is ready
  console.log("Ninja idle");
};
playerJumpLvl5.onload = () => {
  // asset is ready
  console.log("Ninja jump");
};
playerWalkLvl5.onload = () => {
  // asset is ready
  console.log("Ninja walk");
};