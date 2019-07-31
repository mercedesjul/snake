const board = document.getElementById("board");
const ctx = board.getContext("2d");
document.addEventListener('keydown', (e) => {
  move(e.keyCode)
})
const keycode = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
}
let pixel = [];
let head = null;
let tail = []
let food = null;


function game() {
  init();
}
function init () {
  head = null;
  tail = [];
  pixel = [];
  for(let y = 0;y<30;y++){
    pixel.push([])
    for(let x=0;x<30;x++){
      pixel[y].push({
        type: "fill",
        state: false,
        color: "rgb(200, 0, 0)",
      });
    }
  }
  food = generateFoodPosition();
  setHead(15,15)
  placeFood();
  refreshCanvas();
}
function setHead(x, y) {
  if(head !== null) {
    setPixel(head.x, head.y, false);
  }
  if(head && food && JSON.stringify(head) === JSON.stringify(food)){
    tail.push(head);
    placeTail();
    placeFood();
  }
  head = {x:x, y:y};
  setPixel(x, y, true);
}
function placeTail(){
  tail.forEach(pos => {
    setPixel(pos.x, pos.y, true);
  })
}
function adjustTail(x, y) {
  tail.forEach(e => {
    e.x = e.x + x;
    e.y = e.y + y;
  });
  placeTail();
}
function placeFood(){
  food = generateFoodPosition();
  setPixel(food.x, food.y, true); 
}
function generateFoodPosition() {
  console.log("recursive????")
  y = Math.floor(Math.random() * 30);
  x = Math.floor(Math.random() * 30);
  return getPixel(x, y).state ? generateFoodPosition() : {x:x, y:y};
}

function move(keyCode){
  switch (keyCode) {
    case keycode.left:
      setHead(head.x - 1, head.y);
      adjustTail(-1,0);
      break;
    case keycode.up:
      setHead(head.x, head.y - 1);
      adjustTail(0,-1);
      break;
    case keycode.right:
      setHead(head.x + 1, head.y);
      adjustTail(1,0);
      break;
    case keycode.down:
      setHead(head.x, head.y + 1);
      adjustTail(0,1);
      break;
    default:
      break;
  }
  refreshCanvas();
}
function setPixel(x, y, state, type = "fill", color = "rgb(200, 0, 0)") {
  if(x < 0 || x > 29 || y < 0 || y > 29) {
    alert(
      "Pixel out of Bound - End!"
    )
    init()
    return;
  }
  pixel[x][y] = {
    type: type,
    state: state,
    color: color,
  }
  refreshCanvas();
}
function getPixel(x, y) {
  if(x < 0 || x > 29 || y < 0 || y > 29) {
    console.log(
      "Pixel to get is out of Bounds"
    )
    return null;
  }
  return pixel[x][y];
}
function refreshCanvas() {
  pixel.forEach((y, yi) => {
    y.forEach((x, xi) => {
      ctx.fillStyle = x.color;
      ctx.strokeRect((yi * 20), (xi * 20), 20, 20);
      if(x.state){
        ctx.fillRect((yi * 20), (xi * 20), 20, 20);
      } else {
        ctx.clearRect((yi * 20), (xi * 20), 20, 20);
      }
    });
  });
}
game();
