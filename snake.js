const board = document.getElementById("board");
const ctx = board.getContext("2d");
document.addEventListener("keydown", e => {
  move(e.keyCode);
});
const keycode = {
  left: 37,
  up: 38,
  right: 39,
  down: 40
};
let pixel = [];
let head = null;
let tail = [];
let food = null;

function game() {
  init();
}
function init() {
  head = null;
  tail = [];
  pixel = [];
  for (let y = 0; y < 30; y++) {
    pixel.push([]);
    for (let x = 0; x < 30; x++) {
      pixel[y].push({
        position: { x: x, y: y },
        type: "fill",
        state: false,
        color: "rgb(200, 0, 0)"
      });
    }
  }
  food = generateFoodPosition();
  setHead(15, 15);
  placeFood();
  refreshCanvas();
}
function setHead(x, y) {
  if (head !== null) {
    setPixel(head.x, head.y, false);
  }
  if (head && food && JSON.stringify(head) === JSON.stringify(food)) {
    tail.push({ x: head.x, y: head.y });
  }
  head = { x: x, y: y };
  setPixel(x, y, true);
}
function placeTail() {
  tail.forEach(pos => {
    setPixel(pos.x, pos.y, true);
  });
}
function adjustTail(x, y) {
  for (let i = 0; i < tail.length; i++) {
    tail[i].x = tail[i].x + x;
    tail[i].y = tail[i].y + y;
  }
  placeTail();
}
function clearUnsusedPixel() {
  loopThroughPixel(x => {
    let inTail = false;
    tail.forEach(e => {
      console.log(JSON.stringify(e));
      if (JSON.stringify(e) == JSON.stringify(x.position)) {
        console.log("Got one in Tail");
        inTail = true;
      }
    });
    if (!(JSON.stringify(x.position) == JSON.stringify(head)) && !inTail) {
      console.log("gonna take one down");
      x.state = false;
    }
  });
}
function loopThroughPixel(func) {
  pixel.forEach(y => {
    y.forEach(x => {
      func(x);
    });
  });
}
function placeFood() {
  food = generateFoodPosition();
  setPixel(food.x, food.y, true);
}
function generateFoodPosition() {
  y = Math.floor(Math.random() * 30);
  x = Math.floor(Math.random() * 30);
  return getPixel(x, y).state ? generateFoodPosition() : { x: x, y: y };
}

function move(keyCode) {
  switch (keyCode) {
    case keycode.left:
      setHead(head.x - 1, head.y);
      adjustTail(-1, 0);
      break;
    case keycode.up:
      setHead(head.x, head.y - 1);
      adjustTail(0, -1);
      break;
    case keycode.right:
      setHead(head.x + 1, head.y);
      adjustTail(1, 0);
      break;
    case keycode.down:
      setHead(head.x, head.y + 1);
      adjustTail(0, 1);
      break;
    case 84:
      console.log(JSON.stringify(getActivePixel()));
      console.log("head: " + JSON.stringify(head));
      console.log("tail: " + JSON.stringify(tail));
      clearUnsusedPixel();
    default:
      break;
  }
  refreshCanvas();
}
function getActivePixel() {
  let activePixel = [];
  pixel.forEach((y, yi) => {
    y.forEach((x, xi) => {
      if (x.state) activePixel.push(x);
    });
  });
  return activePixel;
}
function setPixel(x, y, state, type = "fill", color = "rgb(200, 0, 0)") {
  if (x < 0 || x > 29 || y < 0 || y > 29) {
    alert("Pixel out of Bound - End!");
    init();
    return;
  }
  pixel[x][y] = {
    position: { x: x, y: y },
    type: type,
    state: state,
    color: color
  };
}
function getPixel(x, y) {
  if (x < 0 || x > 29 || y < 0 || y > 29) {
    console.log("Pixel to get is out of Bounds");
    return null;
  }
  return pixel[x][y];
}
function refreshCanvas() {
  pixel.forEach((y, yi) => {
    y.forEach((x, xi) => {
      ctx.fillStyle = x.color;
      if (x.state) {
        ctx.fillRect(yi * 20, xi * 20, 20, 20);
      } else {
        ctx.clearRect(yi * 20, xi * 20, 20, 20);
      }
    });
  });
}
game();
